import { StyleSheet } from 'react-native';

// Cores dos tipos de Pokémon
export const typeColors: { [key: string]: string } = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
  todos: '#4a4e69', // Cor customizada para o botão "todos"
};

// Estilos comuns usados em múltiplas telas
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  listContainer: {
    padding: 8,
  },
  headerContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  searchBar: {
    height: 44,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  searchResultContainer: {
    alignItems: 'center',
    padding: 20,
  },
  // Card
  card: {
    flex: 1,
    margin: 8,
    minWidth: '45%', // Garante 2 colunas
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#eee',
  },
  cardImage: {
    width: 120,
    height: 120,
  },
  cardText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  // Skeleton
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  skeletonCard: {
    flex: 1,
    minWidth: '45%',
    height: 180, 
    margin: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
  },
  // Erro
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d90429',
    textAlign: 'center',
    marginBottom: 20,
  },
  // Offline
  offlineBanner: {
    backgroundColor: '#ffb703',
    padding: 10,
    alignItems: 'center',
  },
  offlineText: {
    color: '#333',
    fontWeight: '600',
  },
  // Modal de Filtro
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    margin: 5,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  // Tela de Detalhes
  detailContainer: {
    flex: 1,
  },
  detailImageContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  detailImage: {
    width: 250,
    height: 250,
  },
  detailContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30, 
    paddingBottom: 40,
  },
  detailName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  detailSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    margin: 5,
  },
  typeBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textTransform: 'capitalize',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statName: {
    fontSize: 16,
    color: '#555',
    textTransform: 'capitalize',
    width: 120,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
    marginRight: 10,
  },
  statBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 5,
  },
});