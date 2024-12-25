import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from './redux/store';
import { initializeFavorites } from './redux/slices/favoritesSlice';
import FavoritesList from './components/FavoritesList';
import AudioProcessor from './components/AudioProcessor';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  useEffect(() => {
    store.dispatch(initializeFavorites());
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="FavoritesList">
          <Stack.Screen
            name="FavoritesList"
            component={FavoritesList}
            options={{ title: 'Favorites' }}
          />
          <Stack.Screen
            name="AudioProcessor"
            component={AudioProcessor}
            options={{ title: 'Audio Processor' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
