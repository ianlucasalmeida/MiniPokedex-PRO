import AsyncStorage from '@react-native-async-storage/async-storage';

// Define o "Tempo de Vida" do cache
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos

interface CacheItem<T> {
  timestamp: number;
  data: T;
}

/**
 * Salva um item no cache com timestamp.
 * Agora com proteção contra "Disco Cheio".
 */
export async function setCache<T>(key: string, data: T): Promise<void> {
  const item: CacheItem<T> = {
    timestamp: Date.now(),
    data,
  };
  try {
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error: any) {
    // Se o erro for de armazenamento cheio, nós apenas logamos e continuamos
    if (error.message && error.message.includes('database or disk is full')) {
      console.warn('⚠️ Cache cheio! O item não foi salvo, mas o app continua funcionando.');
      // Opcional: Aqui poderíamos implementar uma limpeza de cache antigo (LRU)
      // mas para este MVP, apenas ignorar é seguro.
    } else {
      console.error('Falha ao salvar cache', error);
    }
  }
}

/**
 * Busca um item do cache.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const jsonItem = await AsyncStorage.getItem(key);
    if (!jsonItem) return null;

    const item: CacheItem<T> = JSON.parse(jsonItem);

    // Validação do TTL
    if (Date.now() - item.timestamp > CACHE_TTL) {
      // console.log(`Cache expirado para ${key}`); // Comentado para poluir menos o log
      await AsyncStorage.removeItem(key).catch(() => {}); // Tenta limpar sem travar
      return null;
    }
    
    // Cache válido
    return item.data;
  } catch (error) {
    // Se falhar ao ler, apenas retorna null e busca da rede
    return null;
  }
}

/**
 * Função utilitária para limpar tudo (útil para debug)
 */
export async function clearAllCache() {
  try {
    await AsyncStorage.clear();
    console.log('Cache limpo com sucesso!');
  } catch (e) {
    console.error('Erro ao limpar cache', e);
  }
}