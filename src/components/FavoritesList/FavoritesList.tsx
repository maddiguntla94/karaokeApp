import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { addFavorites, removeFavorites, clearFavorites } from '../../redux/slices/favoritesSlice';
import { SAMPLE_SONGS } from '../../utils/constants';
import styles from './styles';

const FavoritesList: React.FC = ({ navigation }) => {
  const favorites = useSelector((state: RootState) => state.favorites.list);
  const dispatch = useDispatch();

  const areAllSampleSongsFavorited = SAMPLE_SONGS.every((sampleSong) =>
    favorites.some((favoriteSong) => favoriteSong.id === sampleSong.id)
  );

  const handleAddOrRemoveFavorites = () => {
    if (areAllSampleSongsFavorited) {
      dispatch(clearFavorites());
    } else {
      dispatch(addFavorites(SAMPLE_SONGS));
    }
  };

  const handleRemoveFavorite = (songId: string) => {
    dispatch(removeFavorites([songId]));
  };

  const handlePlaySong = (song: { id: string; title: string; artist: string; audioFile: any }) => {
    navigation.navigate('AudioProcessor', { song });
  };

  return (
    <View style={styles.container}>
      <Button
        title={areAllSampleSongsFavorited ? 'Remove All from Favorites' : 'Add All to Favorites'}
        onPress={handleAddOrRemoveFavorites}
      />
      <Text style={styles.title}>Favorites:</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.row}>
              <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">
                {item.title} - {item.artist}
              </Text>
              <View style={styles.buttonGroup}>
                <Button
                  title="Play"
                  onPress={() => handlePlaySong(item)}
                />
                <Button
                  title="Remove"
                  onPress={() => handleRemoveFavorite(item.id)}
                  color="red"
                />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default FavoritesList;
