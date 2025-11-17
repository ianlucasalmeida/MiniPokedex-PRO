// Recurso básico da API (ex: "bulbasaur")
export interface NamedAPIResource {
  name: string;
  url: string;
}

// Resposta padrão de listas paginadas (ex: /pokemon)
export interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

// --- Detalhes do Pokémon (ex: /pokemon/{name}) ---

export interface PokemonSprites {
  front_default: string;
  other: {
    'official-artwork': {
      front_default: string;
    };
  };
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonAbility {
  ability: NamedAPIResource;
  is_hidden: boolean;
}

export interface PokemonStat {
  base_stat: number;
  stat: NamedAPIResource;
}

// A interface principal do Pokémon
export interface Pokemon {
  id: number;
  name: string;
  sprites: PokemonSprites;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
}

// --- Detalhes do Tipo (ex: /type/{name}) ---

export interface TypePokemon {
  pokemon: NamedAPIResource;
  slot: number;
}

export interface TypeDetails {
  id: number;
  name: string;
  pokemon: TypePokemon[];
}