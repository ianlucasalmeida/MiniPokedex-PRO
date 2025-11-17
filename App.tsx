import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { NetworkContext, useNetworkStatus } from './src/hooks';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Ponto de entrada principal do App.
 * É ESSENCIAL que o <NavigationContainer> esteja aqui,
 * envolvendo o <AppNavigator>.
 */
export default function App() {
  const { isOffline } = useNetworkStatus();

  return (
    <NetworkContext.Provider value={{ isOffline }}>
      {/* O <NavigationContainer> DEVE estar aqui */}
      <NavigationContainer>
        <ExpoStatusBar style="dark" />
        {/* O AppNavigator (nosso Stack) DEVE estar DENTRO do container */}
        <AppNavigator />
      </NavigationContainer>
    </NetworkContext.Provider>
  );
}