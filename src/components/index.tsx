import React, { useContext, useEffect, useRef, memo } from 'react';
import { 
  View, 
  Text, 
  Button, 
  Animated, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Modal, 
  FlatList,
  StyleSheet,
  Dimensions
} from 'react-native';
import { NetworkContext } from '../hooks'; 
import { commonStyles, typeColors, pokemonThemeColors } from '../constants/theme';
import { NamedAPIResource, Pokemon } from '../api/apiTypes';

const { width } = Dimensions.get('window');

// --- OfflineBanner.tsx ---
export const OfflineBanner: React.FC = () => {
  const { isOffline } = useContext(NetworkContext);
  if (!isOffline) return null;

  return (
    <View style={commonStyles.offlineBanner}>
      <Text style={commonStyles.offlineText}>Você está offline. Exibindo dados em cache.</Text>
    </View>
  );
};

// --- ErrorRetry.tsx ---
interface ErrorRetryProps {
  message: string;
  onRetry: () => void;
}
export const ErrorRetry: React.FC<ErrorRetryProps> = ({ message, onRetry }) => (
  <View style={commonStyles.errorContainer}>
    <Text style={commonStyles.errorText}>Algo deu errado: {message}</Text>
    <Button title="Tentar Novamente" onPress={onRetry} color={pokemonThemeColors.accent} />
  </View>
);

// --- SkeletonLoader.tsx ---
export const SkeletonLoader: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.5, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={commonStyles.skeletonContainer}>
      {[...Array(6)].map((_, i) => (
        <Animated.View key={i} style={[commonStyles.skeletonCard, { opacity: pulseAnim }]} />
      ))}
    </View>
  );
};

// --- SearchBar.tsx ---
interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
}
export const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery }) => (
  <TextInput
    style={commonStyles.searchBar}
    placeholder="Buscar por nome ou número..."
    value={query}
    onChangeText={setQuery}
    autoCapitalize="none"
    autoCorrect={false}
    placeholderTextColor="#999"
  />
);

// --- PokemonCards.tsx ---

// 1. Card Simples (Para a Lista Infinita - MANTÉM O ESTILO DO TEMA)
interface PokemonCardProps {
  name: string;
  url: string; 
  onPress: () => void;
}
const PokemonCard: React.FC<PokemonCardProps> = ({ name, url, onPress }) => {
  const parts = url.split('/');
  const id = parts[parts.length - 2];
  const officialImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <TouchableOpacity style={commonStyles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: officialImageUrl }} style={commonStyles.cardImage} resizeMode="contain" />
      <Text style={commonStyles.cardText}>{name.split('-').join(' ')}</Text>
      <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>#{id.padStart(3, '0')}</Text>
    </TouchableOpacity>
  );
};
export const MemoPokemonCard = memo(PokemonCard);

// 2. Card Completo (Para Busca e Filtro - HÍBRIDO)
interface PokemonCardFullProps {
  pokemon: Pokemon;
  onPress: () => void;
  isSearch?: boolean; // Nova prop para diferenciar os modos
}
const PokemonCardFull: React.FC<PokemonCardFullProps> = ({ pokemon, onPress, isSearch = false }) => {
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
  const type = pokemon.types[0]?.type.name || 'normal';
  const rawName = pokemon.name || 'Desconhecido';
  const displayName = rawName.split('-').join(' ');

  // Define qual estilo usar baseado na prop isSearch
  const cardStyle = isSearch ? styles.searchCardMode : commonStyles.card;
  const imageStyle = isSearch ? styles.largeCardImage : commonStyles.cardImage;

  return (
    <TouchableOpacity 
      style={[
        cardStyle, 
        { borderColor: typeColors[type] || '#ccc' },
        // Se for modo busca, aplicamos estilos extras de layout
        isSearch ? {} : { borderColor: 'transparent', borderWidth: 0 } 
      ]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <Image source={{ uri: imageUrl }} style={imageStyle} resizeMode="contain" />
      
      <View style={styles.cardContent}>
        <Text style={[commonStyles.cardText, isSearch && styles.cardTitleLarge]}>{displayName}</Text>
        
        {/* Badge de tipo (Sempre visível) */}
        <View style={{ 
          backgroundColor: typeColors[type] || '#ccc', 
          paddingHorizontal: 8, 
          paddingVertical: 2, 
          borderRadius: 8,
          marginTop: 6
        }}>
          <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold', textTransform: 'capitalize' }}>
            {type}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export const MemoPokemonCardFull = memo(PokemonCardFull);


// --- TypeFilterModal.tsx ---
interface TypeFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: string | null) => void;
  types: NamedAPIResource[];
}
export const TypeFilterModal: React.FC<TypeFilterModalProps> = ({ visible, onClose, onSelectType, types }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={commonStyles.modalBackdrop}>
      <View style={commonStyles.modalContent}>
        <Text style={commonStyles.modalTitle}>Filtrar por Tipo</Text>
        <FlatList
          data={[{ name: 'todos', url: '' }, ...types]} 
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[commonStyles.typeButton, { backgroundColor: typeColors[item.name] || '#999' }]}
              onPress={() => {
                onSelectType(item.name === 'todos' ? null : item.name);
                onClose();
              }}
            >
              <Text style={commonStyles.typeButtonText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          numColumns={2}
        />
        <Button title="Fechar" onPress={onClose} color={pokemonThemeColors.accent} />
      </View>
    </View>
  </Modal>
);

// --- Estilos Locais ---
const styles = StyleSheet.create({
  // Estilo Exclusivo para o Modo Busca (Fixo e Grande)
  searchCardMode: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.7, // Fixo
    alignSelf: 'center', // Centralizado
    minHeight: 250, 
    shadowColor: "#2A75BB", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    marginTop: 10,
    marginBottom: 10
  },
  largeCardImage: {
    width: 150,
    height: 150,
    marginBottom: 10
  },
  cardContent: {
    alignItems: 'center',
    width: '100%',
  },
  cardTitleLarge: {
    fontSize: 24, // Nome maior na busca
    marginBottom: 5
  }
});