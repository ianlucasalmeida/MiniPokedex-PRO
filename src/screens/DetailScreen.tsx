import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { pokemonApi } from '../api/pokemonApi';
import { Pokemon } from '../api/apiTypes';
import { ErrorRetry } from '../components';
import { commonStyles, typeColors } from '../constants/theme';

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;

const DetailScreen: React.FC<DetailScreenProps> = ({ route }) => {
  const { pokemonName } = route.params;
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Usamos a API diretamente, pois esta tela tem uma lógica simples
      const data = await pokemonApi.getPokemonDetails(pokemonName);
      setPokemon(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [pokemonName]); // Recarrega se o nome do Pokémon mudar

  if (isLoading) {
    return <ActivityIndicator size="large" color="#007aff" style={commonStyles.centered} />;
  }
  if (error) {
    return <ErrorRetry message={error.message} onRetry={loadDetails} />;
  }
  if (!pokemon) {
    return <Text style={commonStyles.centeredText}>Pokémon não encontrado.</Text>;
  }

  // Define a cor de fundo com base no tipo principal
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
  const mainType = pokemon.types[0]?.type.name || 'normal';
  const typeColor = typeColors[mainType] || '#CCC';

  return (
    <ScrollView style={commonStyles.detailContainer} contentContainerStyle={{ backgroundColor: typeColor }}>
      {/* Imagem com fundo colorido */}
      <View style={commonStyles.detailImageContainer}>
        <Image source={{ uri: imageUrl }} style={commonStyles.detailImage} resizeMode="contain" />
      </View>
      
      {/* Conteúdo com fundo branco */}
      <View style={commonStyles.detailContent}>
        <Text style={commonStyles.detailName}>{pokemon.name.split('-').join(' ')}</Text>
        
        <Text style={commonStyles.detailSectionTitle}>Tipos</Text>
        <View style={commonStyles.typesContainer}>
          {pokemon.types.map(({ type }) => (
            <View key={type.name} style={[commonStyles.typeBadge, { backgroundColor: typeColors[type.name] || '#999' }]}>
              <Text style={commonStyles.typeBadgeText}>{type.name}</Text>
            </View>
          ))}
        </View>

        <Text style={commonStyles.detailSectionTitle}>Habilidades</Text>
        {pokemon.abilities.map(({ ability }) => (
          <Text key={ability.name} style={commonStyles.detailText}>- {ability.name.split('-').join(' ')}</Text>
        ))}

        <Text style={commonStyles.detailSectionTitle}>Status Base</Text>
        {pokemon.stats.map(({ stat, base_stat }) => (
          <View key={stat.name} style={commonStyles.statRow}>
            <Text style={commonStyles.statName}>{stat.name.split('-').join(' ')}</Text>
            <Text style={commonStyles.statValue}>{base_stat}</Text>
            <View style={commonStyles.statBar}>
              <View style={[commonStyles.statBarFill, { width: `${Math.min(base_stat / 1.5, 100)}%`, backgroundColor: typeColor }]} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default DetailScreen;