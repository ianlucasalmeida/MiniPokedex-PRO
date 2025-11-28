import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/AppNavigator';

// Hooks
import { 
  usePokemonList, 
  usePokemonSearch, 
  usePokemonTypeFilter 
} from '../hooks';

// Componentes
import { 
  OfflineBanner,
  ErrorRetry,
  SkeletonLoader,
  SearchBar,
  MemoPokemonCard,
  MemoPokemonCardFull,
  TypeFilterModal
} from '../components';

// Tema
import { commonStyles, pokemonThemeColors } from '../constants/theme';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const list = usePokemonList();
  const search = usePokemonSearch();
  const filter = usePokemonTypeFilter();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    filter.fetchAllTypes();
    navigation.setOptions({ headerShown: false });
  }, []);
  
  const navigateToDetail = (pokemonName: string) => {
    navigation.navigate('Detail', { pokemonName });
  };
  
  const handleApplyFilter = (typeName: string | null) => {
    filter.applyFilter(typeName);
    setActiveFilter(typeName);
    search.clearSearch();
  }
  
  const handleClearAll = () => {
    search.clearSearch();
    filter.applyFilter(null);
    setActiveFilter(null);
  }

  // --- Header Customizado ---
  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      <Text style={styles.headerTitle}>Pokédex</Text>
      <Text style={styles.headerSubtitle}>
        {activeFilter ? `Filtrando por: ${activeFilter}` : 'Busque seu Pokémon favorito'}
      </Text>

      <View style={styles.searchContainer}>
        <SearchBar query={search.query} setQuery={search.setQuery} />
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity 
          style={[styles.glassButton, activeFilter ? styles.activeGlassButton : null]} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.glassButtonText, activeFilter ? styles.activeGlassText : null]}>
             ⚡ Filtrar por Tipo
          </Text>
        </TouchableOpacity>

        {(search.query.length > 0 || activeFilter) && (
          <TouchableOpacity 
            style={[styles.glassButton, { backgroundColor: pokemonThemeColors.accent }]} 
            onPress={handleClearAll}
          >
            <Text style={[styles.glassButtonText, { color: 'white' }]}>✕ Limpar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // --- Conteúdo Principal ---
  const renderContent = () => {
    // 1. Loading Busca
    if (search.isLoading) {
      return (
        <View style={commonStyles.centered}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={{ color: 'white', marginTop: 10 }}>Procurando...</Text>
        </View>
      );
    }
    
    // 2. Erro Busca
    if (search.error) {
      return (
        <View style={styles.whiteCardContainer}>
           <ErrorRetry message={search.error.message} onRetry={search.clearSearch} />
        </View>
      );
    }

    // 3. Resultado Busca (ATIVAMOS O MODO SEARCH AQUI)
    if (search.query.length > 0 && search.result) {
      return (
        <View style={commonStyles.searchResultContainer}>
          <MemoPokemonCardFull
            pokemon={search.result}
            onPress={() => navigateToDetail(search.result.name)}
            isSearch={true} // <--- AQUI ESTÁ A CORREÇÃO
          />
        </View>
      );
    }

    // 4. Filtro Ativo (MODO GRADE PADRÃO)
    if (activeFilter && filter.filteredList.length > 0) {
      return (
        <FlatList
          data={filter.filteredList}
          renderItem={({ item }) => (
            <MemoPokemonCardFull
              pokemon={item}
              onPress={() => navigateToDetail(item.name)}
              isSearch={false} // Padrão
            />
          )}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={commonStyles.listContainer}
        />
      );
    }

    // 5. Lista Infinita
    if (list.isLoading && list.pokemonList.length === 0) return <SkeletonLoader />;
    
    return (
      <FlatList
        data={list.pokemonList}
        renderItem={({ item }) => (
          <MemoPokemonCard 
            url={item.url} 
            name={item.name}
            onPress={() => navigateToDetail(item.name)} 
          />
        )}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={[commonStyles.listContainer, { paddingBottom: 100 }]}
        onEndReached={list.loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          list.isLoading ? 
            <ActivityIndicator size="large" color={pokemonThemeColors.logoBlue} style={{ marginVertical: 20 }} /> 
            : <View style={{ height: 50 }} />
        )}
      />
    );
  };

  return (
    <LinearGradient
      colors={[pokemonThemeColors.logoBlue, '#89C4F4', '#F0F0F0']}
      locations={[0, 0.4, 0.9]}
      style={styles.mainContainer}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <OfflineBanner />

        <View style={styles.decorativePokeball}>
           <View style={styles.pokeballLine} />
           <View style={styles.pokeballCircle} />
        </View>

        {renderHeader()}
        
        <View style={styles.contentWrapper}>
          {renderContent()}
        </View>

        <TypeFilterModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectType={handleApplyFilter}
          types={filter.allTypes}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  decorativePokeball: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  pokeballLine: {
    position: 'absolute',
    width: '100%',
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  pokeballCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 20,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'transparent',
  },
  headerWrapper: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  glassButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  activeGlassButton: {
    backgroundColor: pokemonThemeColors.logoYellow,
    borderColor: '#FFF',
  },
  glassButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
  activeGlassText: {
    color: pokemonThemeColors.logoBlue,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.6)', 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    marginHorizontal: 0,
    overflow: 'hidden', 
  },
  whiteCardContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 2
  }
});

export default HomeScreen;