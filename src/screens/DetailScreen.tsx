import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { pokemonApi } from '../api/pokemonApi';
import { Pokemon } from '../api/apiTypes';
import { ErrorRetry } from '../components';
import { commonStyles, typeColors, pokemonThemeColors } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient'; // <--- Importamos o gradiente

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;

const DetailScreen: React.FC<DetailScreenProps> = ({ route, navigation }) => {
  const { pokemonName } = route.params;
  
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDetails = async (nameOrId: string | number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await pokemonApi.getPokemonDetails(nameOrId);
      setPokemon(data);
      
      // Atualiza título (opcional, já que temos o header customizado)
      navigation.setOptions({ 
        headerTitle: '', // Limpa o título padrão para ficar mais clean
        headerTransparent: true, // Deixa o header transparente para ver o gradiente
        headerTintColor: '#FFF', // Botão de voltar branco
        headerStyle: { backgroundColor: 'transparent' }
      });
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDetails(pokemonName);
  }, [pokemonName]);

  const handlePrevious = () => {
    if (pokemon && pokemon.id > 1) {
      navigation.push('Detail', { pokemonName: String(pokemon.id - 1) });
    }
  };

  const handleNext = () => {
    if (pokemon) {
      navigation.push('Detail', { pokemonName: String(pokemon.id + 1) });
    }
  };

  if (isLoading) {
    return (
      <View style={[commonStyles.container, commonStyles.centered]}>
        <ActivityIndicator size="large" color={pokemonThemeColors.logoBlue} />
      </View>
    );
  }

  if (error) {
    return <ErrorRetry message={error.message} onRetry={() => loadDetails(pokemonName)} />;
  }

  if (!pokemon) {
    return <Text style={commonStyles.centeredText}>Pokémon não encontrado.</Text>;
  }

  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
  const mainType = pokemon.types[0]?.type.name || 'normal';
  const typeColor = typeColors[mainType] || '#CCC';
  
  // Criar uma cor secundária para o gradiente (um pouco mais escura ou saturada)
  // Como simplificação, usamos a cor do tipo e uma cor fixa ou calculada
  const gradientColors = [typeColor, '#FFFFFF']; 

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      
      {/* ScrollView principal */}
      <ScrollView contentContainerStyle={{ paddingBottom: 0 }} showsVerticalScrollIndicator={false}>
        
        {/* GRADIENTE DE FUNDO: Substitui a View com cor sólida */}
        <LinearGradient
          // Cores: Do Tipo -> para Branco (transição suave para o card de baixo)
          colors={[typeColor, typeColor, '#FFFFFF']} 
          locations={[0, 0.6, 1]} // Onde cada cor começa
          style={{ width: '100%', minHeight: 350 }} // Altura suficiente para cobrir a imagem
        >
          {/* Cabeçalho com Imagem e ID */}
          <View style={commonStyles.detailImageContainer}>
             {/* Badge do ID com estilo mais "tech" */}
            <View style={styles.idBadge}>
              <Text style={styles.idText}>#{String(pokemon.id).padStart(3, '0')}</Text>
            </View>

            <Image 
              source={{ uri: imageUrl }} 
              style={commonStyles.detailImage} 
              resizeMode="contain" 
            />
          </View>
        </LinearGradient>
        
        {/* Conteúdo (Card Branco Curvado) */}
        <View style={commonStyles.detailContent}>
          <Text style={commonStyles.detailName}>{pokemon.name.split('-').join(' ')}</Text>
          
          <View style={commonStyles.typesContainer}>
            {pokemon.types.map(({ type }) => (
              <View key={type.name} style={[commonStyles.typeBadge, { backgroundColor: typeColors[type.name] || '#999' }]}>
                <Text style={commonStyles.typeBadgeText}>{type.name}</Text>
              </View>
            ))}
          </View>

          <Text style={commonStyles.detailSectionTitle}>Habilidades</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {pokemon.abilities.map(({ ability }) => (
              <View key={ability.name} style={styles.abilityTag}>
                 <Text style={styles.abilityText}>{ability.name.split('-').join(' ')}</Text>
              </View>
            ))}
          </View>

          <Text style={commonStyles.detailSectionTitle}>Status Base</Text>
          {pokemon.stats.map(({ stat, base_stat }) => (
            <View key={stat.name} style={commonStyles.statRow}>
              <Text style={commonStyles.statName}>{stat.name.split('-').join(' ')}</Text>
              <Text style={commonStyles.statValue}>{base_stat}</Text>
              <View style={commonStyles.statBar}>
                {/* A barra agora usa a cor do tipo do pokemon para preenchimento */}
                <View style={[commonStyles.statBarFill, { width: `${Math.min(base_stat / 1.5, 100)}%`, backgroundColor: typeColor }]} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Barra de Navegação Flutuante */}
      <View style={styles.navigationBar}>
        <TouchableOpacity 
          style={[styles.navButton, pokemon.id <= 1 && styles.disabledButton]} 
          onPress={handlePrevious}
          disabled={pokemon.id <= 1}
        >
          <Text style={styles.navButtonText}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, { borderColor: pokemonThemeColors.logoBlue, borderWidth: 2 }]} 
          onPress={handleNext}
        >
          <Text style={[styles.navButtonText, { color: pokemonThemeColors.logoBlue }]}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Estilos locais extras para a DetailScreen
const styles = StyleSheet.create({
  idBadge: {
    position: 'absolute',
    top: 50, // Ajustado para não bater no header
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  idText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900', // Extra bold
    fontStyle: 'italic',
  },
  abilityTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  abilityText: {
    color: '#555',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  navigationBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.95)', // Levemente transparente
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 20,
  },
  navButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.3,
    elevation: 0,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default DetailScreen;