import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  RefreshControl,
  Alert,
  Animated,
  Easing,
  Dimensions,
  PixelRatio,
} from 'react-native';
import styles from './GalleryScreenStyles';

interface PhotoData {
  id: string;
  DateTaken: string;
  Path: string;
  Location: {latitude: number; longitude: number} | null;
}

const GalleryScreen: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const springAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(
        'https://66016c2b87c91a11641acda4.mockapi.io/MyPhotos/MyPhotos',
      );
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      const data: PhotoData[] = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
      Alert.alert('Error', 'Failed to fetch photos.');
    } finally {
      setRefreshing(false);
    }
  };

  const handlePhotoPress = (photo: PhotoData) => {
    setSelectedPhoto(photo);
  };

  const handleLongPress = (photo: PhotoData) => {
    if (photo) {
      let message = `Date Taken: ${photo.DateTaken}`;
      if (photo.Location) {
        message += `\nLatitude: ${photo.Location.latitude}, Longitude: ${photo.Location.longitude}`;
      }
      Alert.alert('Photo Data', message);
    }
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  const handleDeletePhoto = async () => {
    if (selectedPhoto) {
      try {
        const response = await fetch(
          `https://66016c2b87c91a11641acda4.mockapi.io/MyPhotos/MyPhotos/${selectedPhoto.id}`,
          {
            method: 'DELETE',
          },
        );
        if (!response.ok) {
          throw new Error('Failed to delete photo from API');
        }
        setPhotos(prevPhotos =>
          prevPhotos.filter(photo => photo.id !== selectedPhoto.id),
        );
        closeModal();
      } catch (error) {
        console.error('Error deleting photo:', error);
        Alert.alert('Error', 'Failed to delete photo.');
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPhotos();
  };

  const screenWidth = Dimensions.get('window').width;
  const responsiveWidth = screenWidth / 2 - 10 * PixelRatio.get();

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handlePhotoPress(item)}
            onLongPress={() => handleLongPress(item)}>
            <View style={[styles.item, {width: responsiveWidth}]}>
              <Animated.Image
                source={{
                  uri: item.Path.startsWith('http')
                    ? item.Path
                    : `file://${item.Path}`,
                }}
                style={[
                  styles.image,
                  {opacity: fadeAnim, transform: [{scale: springAnim}]},
                ]}
                onLoad={() => {
                  Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.linear,
                    useNativeDriver: true,
                  }).start();
                  Animated.spring(springAnim, {
                    toValue: 1,
                    friction: 2,
                    useNativeDriver: true,
                  }).start();
                }}
                onError={() =>
                  console.log(`Failed to load image: ${item.Path}`)
                }
              />
              <Text>{item.DateTaken}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {selectedPhoto && (
        <Modal
          animationType="slide"
          visible={selectedPhoto !== null}
          onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <Animated.Image
              source={{
                uri: selectedPhoto.Path.startsWith('http')
                  ? selectedPhoto.Path
                  : `file://${selectedPhoto.Path}`,
              }}
              style={[
                styles.modalImage,
                {opacity: fadeAnim, transform: [{scale: springAnim}]},
              ]}
              onLoad={() => {
                Animated.timing(fadeAnim, {
                  toValue: 1,
                  duration: 300,
                  easing: Easing.linear,
                  useNativeDriver: true,
                }).start();
                Animated.spring(springAnim, {
                  toValue: 1,
                  friction: 2,
                  useNativeDriver: true,
                }).start();
              }}
              onError={() =>
                console.log(`Failed to load image: ${selectedPhoto.Path}`)
              }
            />
            <TouchableOpacity onPress={handleDeletePhoto}>
              <Text style={styles.deleteButton}>Delete Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default GalleryScreen;
