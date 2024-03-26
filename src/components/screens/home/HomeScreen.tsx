import React from 'react';
import {View, Button, ImageBackground} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './Home';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const navigateToCameraScreen = () => {
    navigation.navigate('CameraScreen');
  };

  const navigateToGalleryScreen = () => {
    navigation.navigate('GalleryScreen');
  };

  const navigateToMap = () => {
    navigation.navigate('Map');
  };

  return (
    <ImageBackground
      source={require('../assets/image.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button title="Camera" onPress={navigateToCameraScreen} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Gallery" onPress={navigateToGalleryScreen} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Map" onPress={navigateToMap} />
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;
