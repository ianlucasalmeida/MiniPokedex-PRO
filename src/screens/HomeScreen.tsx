import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, SafeAreaView, Button, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Hooks de lógica - CAMINHO CORRIGIDO
import { 
  usePokemonList, 
  usePokemonSearch, 
  usePokemonTypeFilter 
} from '../hooks';

// Componentes de UI - CAMINHO CORRIGIDO
import { 
  OfflineBanner,
  ErrorRetry,
  SkeletonLoader,
  SearchBar,
  MemoPokemonCard,
  MemoPokemonCardFull,
  TypeFilterModal
} from '../components';

// Estilos e constantes
import { commonStyles } from '../constants/theme';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const list = usePokemonList();
  const search = usePokemonSearch();
  const filter = usePokemonTypeFilter();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    // Carrega a lista de tipos para o modal
    filter.fetchAllTypes();
  }, []);
  
  const navigateToDetail = (pokemonName: string) => {
    navigation.navigate('Detail', { pokemonName });
  };
  
  const handleApplyFilter = (typeName: string | null) => {
    filter.applyFilter(typeName);
    setActiveFilter(typeName);
    search.clearSearch(); // Limpa a busca ao aplicar filtro
  }
  
  const handleClearAll = () => {
    search.clearSearch();
    filter.applyFilter(null);
    setActiveFilter(null);
  }

  // Renderiza o cabeçalho com a barra de busca e botões
  const renderHeader = () => (
    <View style={commonStyles.headerContainer}>
      <SearchBar query={search.query} setQuery={search.setQuery} />
      <View style={commonStyles.buttonRow}>
        <Button 
          title={activeFilter ? `Filtro: ${activeFilter}` : "Filtrar por Tipo"} 
          onPress={() => setModalVisible(true)} 
          color="#007aff" 
        />
        {(search.query.length > 0 || activeFilter) && (
          <Button title="Limpar" onPress={handleClearAll} color="#e63946" />
        )}
      </View>
    </View>
  );

  // Decide qual conteúdo exibir com base no estado (Busca, Filtro ou Lista)
  const renderContent = () => {
    // 1. Estado de Busca (Prioridade)
    if (search.isLoading) {
      return <ActivityIndicator size="large" color="#007aff" style={commonStyles.centered} />;
    }
    if (search.error) {
      return <ErrorRetry message={search.error.message} onRetry={search.clearSearch} />;
    }
    if (search.query.length > 0 && search.result) {
      return (
        <View style={commonStyles.searchResultContainer}>
          <MemoPokemonCardFull
            pokemon={search.result}
            onPress={() => navigateToDetail(search.result.name)}
          />
        </View>
      );
    }
    if (search.query.length > 0 && !search.result && !search.isLoading) {
       return <Text style={commonStyles.centeredText}>Nenhum Pokémon encontrado para "{search.query}".</Text>;
    }
    
    // 2. Estado de Filtro (Se não houver busca ativa)
    if (filter.isLoading) {
      return <ActivityIndicator size="large" color="#007aff" style={commonStyles.centered} />;
    }
    if (filter.error) {
      return <ErrorRetry message={filter.error.message} onRetry={() => handleApplyFilter(null)} />;
    }
    if (activeFilter && filter.filteredList.length > 0) {
      return (
        <FlatList
          data={filter.filteredList}
          renderItem={({ item }) => (
            <MemoPokemonCardFull
              pokemon={item}
              onPress={() => navigateToDetail(item.name)}
            />
          )}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={commonStyles.listContainer}
        />
      );
    }
    if (activeFilter && filter.filteredList.length === 0 && !filter.isLoading) {
       return <Text style={commonStyles.centeredText}>Nenhum Pokémon do tipo "{activeFilter}" encontrado.</Text>;
    }

    // 3. Estado de Lista Paginada (Padrão)
    if (list.isLoading && list.pokemonList.length === 0) {
      return <SkeletonLoader />;
    }
    if (list.error && list.pokemonList.length === 0) {
      return <ErrorRetry message={list.error.message} onRetry={list.retry} />;
    }
    
    return (
      <FlatList
        data={list.pokemonList}
        renderItem={({ item }) => (
          <MemoPokemonCard 
            url={item.url} // Passamos a URL para extrair o ID
            name={item.name}
            onPress={() => navigateToDetail(item.name)} 
          />
        )}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={commonStyles.listContainer}
        onEndReached={list.loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          list.isLoading ? <ActivityIndicator size="large" color="#007aff" style={{ marginVertical: 20 }} /> : null
        )}
        ListEmptyComponent={() => (
          !list.isLoading ? <Text style={commonStyles.centeredText}>Nenhum Pokémon encontrado.</Text> : null
        )}
      />
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <OfflineBanner />
      {renderHeader()}
      {renderContent()}
      <TypeFilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectType={handleApplyFilter}
        types={filter.allTypes}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;