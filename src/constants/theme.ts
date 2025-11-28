import { StyleSheet } from 'react-native';

// Cores dos tipos de Pokémon (Mantemos igual, pois são padrão da franquia)
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
  todos: '#2A75BB', // Azul do logo para o botão "todos"
};

// --- Cores Temáticas "Anime / Logo" ---
export const pokemonThemeColors = {
  logoYellow: '#FFCB05', // Amarelo principal do Logo
  logoBlue: '#2A75BB',   // Azul da borda do Logo
  primary: '#FFCB05',    // Usaremos o amarelo como primária
  secondary: '#2A75BB',  // Azul como secundária
  accent: '#FF3333',     // Vermelho (botões de ação/pokebola)
  background: '#F2F2F2', // Cinza muito claro para o fundo geral
  cardBackground: '#FFFFFF',
  textPrimary: '#2A75BB', // Texto principal em Azul (fica ótimo no amarelo ou branco)
  textSecondary: '#555555',
  border: '#3C5AA6',      // Um azul mais escuro para bordas
  offlineWarning: '#FFD700',
};

// Estilos comuns atualizados
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: pokemonThemeColors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredText: {
    textAlign: 'center',
    fontSize: 16,
    color: pokemonThemeColors.textSecondary,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  listContainer: {
    padding: 10,
  },
  // Header agora é Amarelo com borda Azul (Estilo Logo)
  headerContainer: {
    padding: 16,
    backgroundColor: pokemonThemeColors.logoYellow,
    borderBottomWidth: 4, // Borda grossa estilo anime
    borderBottomColor: pokemonThemeColors.logoBlue,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  searchBar: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25, // Bem arredondado
    paddingHorizontal: 20,
    fontSize: 16,
    color: pokemonThemeColors.textSecondary,
    borderWidth: 2,
    borderColor: pokemonThemeColors.logoBlue, // Borda azul na busca
  },
  searchResultContainer: {
    alignItems: 'center',
    padding: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    minWidth: '45%',
    backgroundColor: pokemonThemeColors.cardBackground,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent', // Será sobrescrito pela cor do tipo ou azul
  },
  cardImage: {
    width: 110,
    height: 110,
  },
  cardText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  skeletonCard: {
    flex: 1,
    minWidth: '45%',
    height: 160, 
    margin: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: pokemonThemeColors.accent,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  offlineBanner: {
    backgroundColor: pokemonThemeColors.offlineWarning,
    padding: 10,
    alignItems: 'center',
  },
  offlineText: {
    color: '#333',
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(42, 117, 187, 0.6)', // Azul translúcido
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    maxHeight: '75%',
    borderTopWidth: 5,
    borderTopColor: pokemonThemeColors.logoYellow,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: pokemonThemeColors.logoBlue,
  },
  typeButton: {
    flex: 1,
    margin: 6,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  typeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: 14,
  },
  // --- Detalhes ---
  detailContainer: {
    flex: 1,
  },
  // A imagem agora terá um container transparente pois usaremos gradiente no fundo
  detailImageContainer: {
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
    zIndex: 1, // Ficar acima do card branco
  },
  detailImage: {
    width: 280,
    height: 280,
  },
  detailContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50, // Espaço para a imagem sobrepor
    paddingHorizontal: 25,
    paddingBottom: 120, // Espaço para a barra de navegação
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40, // Efeito de sobreposição
    minHeight: 500, // Garante que o branco vá até o fundo
  },
  detailName: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    textTransform: 'capitalize',
    color: pokemonThemeColors.logoBlue,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
    color: '#333',
    borderLeftWidth: 4,
    borderLeftColor: pokemonThemeColors.logoYellow,
    paddingLeft: 10,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  typeBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: 16,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 28,
    textTransform: 'capitalize',
    marginLeft: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statName: {
    fontSize: 15,
    color: '#777',
    textTransform: 'capitalize',
    width: 110,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
    marginRight: 10,
    color: '#333',
  },
  statBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 6,
  },
});