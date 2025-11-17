import AsyncStorage from '@react-native-async-storage/async-storage';

// Define o "Tempo de Vida" do cache
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos

interface CacheItem<T> {
  timestamp: number;
  data: T;
}

/**
 * Salva um item no cache com timestamp.
 */
export async function setCache<T>(key: string, data: T): Promise<void> {
  const item: CacheItem<T> = {
    timestamp: Date.now(),
    data,
  };
  try {
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Falha ao salvar cache', error);
  }
}

/**
 * Busca um item do cache.
 * Retorna null se não existir ou se o TTL tiver expirado.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const jsonItem = await AsyncStorage.getItem(key);
    if (!jsonItem) return null;

    const item: CacheItem<T> = JSON.parse(jsonItem);

    // Validação do TTL
    if (Date.now() - item.timestamp > CACHE_TTL) {
      console.log(`Cache expirado para ${key}`);
      await AsyncStorage.removeItem(key); // Limpa cache expirado
      return null;
    }
    
    // Cache válido
    return item.data;
  } catch (error) {
    console.error('Falha ao obter cache', error);
    return null;
  }
}