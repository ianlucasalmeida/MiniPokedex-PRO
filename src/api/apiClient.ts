import { getCache, setCache } from '../store/cache';

const BASE_URL = 'https://pokeapi.co/api/v2';
const DEFAULT_TIMEOUT = 8000; // 8 segundos
const MAX_RETRIES = 3;

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  noCache?: boolean; // Flag para forçar uma busca na rede
}

// Função helper para esperar
function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Cliente Fetch robusto com:
 * 1. Cache (Cache-then-Background-Refresh)
 * 2. Timeout
 * 3. Retry com Backoff Exponencial + Jitter
 */
export async function robustFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = MAX_RETRIES,
    noCache = false,
    ...init
  } = options;
  
  const url = `${BASE_URL}${endpoint}`;
  const cacheKey = url;

  // --- 1. Lógica de Cache ---
  if (!noCache) {
    const cachedData = await getCache<T>(cacheKey);
    if (cachedData) {
      console.log(`[Cache Hit] Servindo: ${cacheKey}`);
      
      // Dispara um "refresh" em background para atualizar o cache
      robustFetch<T>(endpoint, { ...options, noCache: true }).catch(err => {
        console.warn(`[Cache Refresh] Falha no refresh de ${cacheKey}:`, err.message);
      });
      
      // Retorna o dado do cache imediatamente
      return cachedData;
    }
  }
  
  console.log(`[Network Fetch] Buscando: ${url}`);

  // --- 2. Lógica de Retry com Backoff ---
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn(`[Timeout] Requisição abortada: ${url}`);
      controller.abort();
    }, timeout);

    try {
      const res = await fetch(url, {
        ...init,
        signal: controller.signal, // Passa o AbortSignal para o fetch
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        // Se for 5xx (erro de servidor), podemos tentar de novo
        if (res.status >= 500 && attempt < retries) {
          throw new Error(`Server error: ${res.status}`); // Força o re-try
        }
        // Se for 4xx (ex: Not Found), não adianta tentar de novo
        throw new Error(`Erro HTTP: ${res.status} ${res.statusText}`);
      }

      const data = (await res.json()) as T;
      
      // 3. Salvar no Cache
      await setCache(cacheKey, data);
      
      return data; // Sucesso!

    } catch (error: any) {
      clearTimeout(timeoutId);

      // Verifica se o erro permite retry (Timeout ou Falha de Rede)
      const isRetryable = (error.name === 'AbortError' || error.message.includes('Network request failed'));
      
      if (isRetryable && attempt < retries) {
        // Cálculo do Backoff: (2^tentativa * 1000ms) + jitter (aleatoriedade)
        const jitter = Math.random() * 500; 
        const delay = Math.pow(2, attempt) * 1000 + jitter;
        
        console.warn(`[Retry] Tentativa ${attempt + 1} falhou para ${url}. Tentando novamente em ${delay.toFixed(0)}ms...`);
        await wait(delay);
      } else {
        // Se for o último retry ou um erro que não permite retry (ex: 404)
        throw error;
      }
    }
  }

  // Se o loop terminar sem sucesso
  throw new Error(`Falha ao buscar ${url} após ${retries} tentativas.`);
}