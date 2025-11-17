import { useState, useEffect, useCallback, useRef, createContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { pokemonApi } from '../api/pokemonApi';
import { NamedAPIResource, Pokemon } from '../api/apiTypes';

// --- Constantes dos Hooks ---
const POKEMON_PAGE_LIMIT = 20;
const MAX_CONCURRENT_REQUESTS = 5; // Para filtro de tipo
const DEBOUNCE_DELAY = 500; // 500ms

// --- hook: useDebounce ---
/**
 * Atraso na atualização de um valor (para barras de busca)
 */
export function useDebounce(value: string, delay: number = DEBOUNCE_DELAY): string {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// --- hook: useNetworkStatus ---
export const NetworkContext = createContext<{ isOffline: boolean }>({ isOffline: false });
/**
 * Monitora o status da conexão de rede
 */
export function useNetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setIsOffline(offline);
    });
    return () => unsubscribe();
  }, []);

  return { isOffline };
}

// --- hook: usePokemonList ---
/**
 * Gerencia a lógica de paginação (infinite scroll) da lista principal
 */
export function usePokemonList() {
  const [pokemonList, setPokemonList] = useState<NamedAPIResource[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  const loadMore = useCallback(async () => {
    // Evita buscas duplicadas
    if (isLoading || !hasNextPage) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await pokemonApi.getPokemonList(POKEMON_PAGE_LIMIT, offset);
      
      // Evita duplicatas na lista
      setPokemonList(prev => {
        const newNames = new Set(prev.map(p => p.name));
        const newList = data.results.filter(p => !newNames.has(p.name));
        return [...prev, ...newList];
      });
      
      setOffset(prevOffset => prevOffset + POKEMON_PAGE_LIMIT);
      setHasNextPage(!!data.next);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasNextPage, offset]);
  
  const retry = () => {
    setError(null);
    loadMore();
  }

  useEffect(() => {
    loadMore(); // Carga inicial
  }, []);

  return { pokemonList, loadMore, isLoading, error, hasNextPage, retry };
}

// --- hook: usePokemonSearch ---
/**
 * Gerencia a lógica de busca com debounce e cancelamento
 */
export function usePokemonSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

  useEffect(() => {
    if (!debouncedQuery) {
      setResult(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    // AbortController para cancelar requisições anteriores
    const controller = new AbortController();

    const search = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await pokemonApi.getPokemonDetails(
          debouncedQuery,
          { signal: controller.signal } // Passa o sinal de cancelamento
        );
        setResult(data);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Busca abortada'); // O usuário digitou de novo
        } else {
          setError(err);
          setResult(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    search();

    // Função de limpeza do useEffect: aborta a requisição se o hook for desmontado
    return () => {
      controller.abort();
    };
  }, [debouncedQuery]); // Dispara a busca apenas no valor "atrasado"

  return { query, setQuery, result, isLoading, error, clearSearch: () => setQuery('') };
}

// --- hook: usePokemonTypeFilter ---
/**
 * Gerencia a lógica de filtro por tipo, com controle de concorrência.
 */
export function usePokemonTypeFilter() {
  const [filteredList, setFilteredList] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [allTypes, setAllTypes] = useState<NamedAPIResource[]>([]);

  // Busca a lista de tipos (para o Modal)
  const fetchAllTypes = async () => {
    try {
      const data = await pokemonApi.getAllTypes();
      setAllTypes(data.results);
    } catch (err) {
      console.error("Falha ao buscar tipos", err);
    }
  };

  // Lógica do Worker Pool
  const fetchPokemonDetailsInParallel = async (pokemonResources: NamedAPIResource[]) => {
    const queue = [...pokemonResources];
    
    // "Worker" que pega um item da fila, busca, e se chama de novo
    const worker = async () => {
      while (queue.length > 0) {
        const resource = queue.shift();
        if (!resource) continue;
        
        try {
          // Usamos 'noCache: true' para não poluir o cache com dezenas de pokémons
          // que o usuário pode não clicar
          const details = await pokemonApi.getPokemonDetails(resource.name, { noCache: true });
          setFilteredList(prev => [...prev, details]); // Carga incremental
        } catch (err) {
          console.warn(`Falha ao buscar detalhes de ${resource.name}`, err);
        }
      }
    };

    // Cria o pool de workers
    const workers = Array(MAX_CONCURRENT_REQUESTS)
      .fill(null)
      .map(() => worker());
      
    await Promise.all(workers); // Espera todos os workers terminarem
  };

  const applyFilter = async (typeName: string | null) => {
    if (!typeName) {
      setFilteredList([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setFilteredList([]); // Limpa resultados

    try {
      // 1. Busca a lista de nomes por tipo
      const typeData = await pokemonApi.getPokemonByType(typeName);
      const pokemonResources = typeData.pokemon.map(p => p.pokemon);
      
      // 2. Busca os detalhes com concorrência limitada
      await fetchPokemonDetailsInParallel(pokemonResources);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { applyFilter, filteredList, isLoading, error, fetchAllTypes, allTypes };
}