import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Song {
  id: string;
  title: string;
  artist: string;
}

interface FavoritesState {
  list: Song[];
}

const initialState: FavoritesState = {
  list: [],
};

const persistFavorites = async (favorites: Song[]) => {
  try {
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error persisting favorites:', error);
  }
};

const loadFavorites = async (): Promise<Song[]> => {
  try {
    const savedFavorites = await AsyncStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites(state, action: PayloadAction<Song[]>) {
      state.list = action.payload;
    },
    addFavorites(state, action: PayloadAction<Song[]>) {
      const newFavorites = action.payload.filter(
        (song) => !state.list.some((existingSong) => existingSong.id === song.id)
      );
      state.list.push(...newFavorites);
      persistFavorites(state.list);
    },
    removeFavorites(state, action: PayloadAction<string | string[]>) {
      const idsToRemove = Array.isArray(action.payload) ? action.payload : [action.payload];
      state.list = state.list.filter((song) => !idsToRemove.includes(song.id));
      persistFavorites(state.list);
    },
    clearFavorites(state) {
      state.list = [];
      persistFavorites(state.list);
    },
  },
});

export const { addFavorites, removeFavorites, setFavorites, clearFavorites } = favoritesSlice.actions;

// Initialize favorites from AsyncStorage
export const initializeFavorites = () => async (dispatch: any) => {
  const favorites = await loadFavorites();
  dispatch(setFavorites(favorites));
};

export default favoritesSlice.reducer;
