import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';

// Define os parâmetros que cada tela pode receber
export type RootStackParamList = {
  Home: undefined; // A tela Home não recebe parâmetros
  Detail: { pokemonName: string }; // A tela Detail recebe o nome do Pokémon
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Define a pilha de navegação principal do aplicativo.
 */
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f8f8f8',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Mini Pokédex' }} 
      />
      <Stack.Screen 
        name="Detail" 
        component={DetailScreen} 
        // Define o título da tela de detalhe dinamicamente
        options={({ route }) => ({ 
          title: route.params.pokemonName.charAt(0).toUpperCase() + route.params.pokemonName.slice(1) 
        })}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;