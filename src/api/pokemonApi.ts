import { robustFetch } from './apiClient';
import { PaginatedResponse, Pokemon, TypeDetails } from './apiTypes';

/**
 * Define os endpoints específicos da PokéAPI
 */
export const pokemonApi = {
  /**
   * Busca a lista paginada de Pokémon
   */
  getPokemonList: (limit: number, offset: number) => {
    return robustFetch<PaginatedResponse>(`/pokemon?limit=${limit}&offset=${offset}`);
  },

  /**
   * Busca os detalhes de um Pokémon específico
   * (Passa o 'init' para permitir cancelamento de requisição)
   */
  getPokemonDetails: (nameOrId: string | number, init?: RequestInit) => {
    return robustFetch<Pokemon>(`/pokemon/${String(nameOrId).toLowerCase()}`, { ...init });
  },
  
  /**
   * Busca a lista de Pokémon por tipo
   */
  getPokemonByType: (typeName: string) => {
    return robustFetch<TypeDetails>(`/type/${typeName.toLowerCase()}`);
  },

  /**
   * Busca a lista de todos os tipos disponíveis (para o modal de filtro)
   */
  getAllTypes: () => {
    // A API de tipos não é paginada por padrão, mas limitamos para os 18 tipos principais
    return robustFetch<PaginatedResponse>('/type?limit=18'); 
  }
};