import React, { useContext, useEffect, useRef, memo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Button, 
  Animated, 
  Easing, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Modal, 
  FlatList 
} from 'react-native';
import { NetworkContext } from '../hooks/index';
import { commonStyles, typeColors } from '../constants/theme';
import { NamedAPIResource, Pokemon } from '../api/apiTypes';

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
    <Button title="Tentar Novamente" onPress={onRetry} color="#e63946" />
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
    placeholder="Buscar Pokémon por nome..."
    value={query}
    onChangeText={setQuery}
    autoCapitalize="none"
    autoCorrect={false}
    placeholderTextColor="#777"
  />
);

// --- PokemonCards.tsx ---
// Card para a lista paginada (só precisa da URL)
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
    </TouchableOpacity>
  );
};
export const MemoPokemonCard = memo(PokemonCard);

// Card para Busca/Filtro (recebe o objeto Pokémon completo)
interface PokemonCardFullProps {
  pokemon: Pokemon;
  onPress: () => void;
}
const PokemonCardFull: React.FC<PokemonCardFullProps> = ({ pokemon, onPress }) => {
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
  const type = pokemon.types[0]?.type.name || 'normal';
  
  return (
    <TouchableOpacity style={[commonStyles.card, { borderColor: typeColors[type] || '#ccc' }]} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: imageUrl }} style={commonStyles.cardImage} resizeMode="contain" />
      <Text style={commonStyles.cardText}>{pokemon.name.split('-').join(' ')}</Text>
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
          data={[{ name: 'todos', url: '' }, ...types]} // Adiciona a opção "todos"
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
        <Button title="Fechar" onPress={onClose} color="#e63946" />
      </View>
    </View>
  </Modal>
);