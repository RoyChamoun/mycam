import React, {useState, useEffect, useRef} from 'react';
import {View, Alert, Pressable, Linking} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Geolocation from '@react-native-community/geolocation';
import {LatLng} from 'react-native-maps';

import {cameraScreenStyles as styles} from './CameraScreenStyles';

const CameraScreen: React.FC = () => {
  const {requestPermission, hasPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);

  useEffect(() => {
    const fetchLocation = () => {
      Geolocation.getCurrentPosition(
        (position: {coords: {latitude: any; longitude: any}}) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error: {message: any}) => {
          console.error('Error getting location:', error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    const checkAndOpenCamera = async () => {
      if (hasPermission) {
        setIsCameraVisible(true);
      } else {
        const isAccessGranted = await requestPermission();
        if (!isAccessGranted) {
          Alert.alert(
            'Permission required',
            'Open settings to grant permission',
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Open settings',
                style: 'default',
                onPress: async () => {
                  await Linking.openSettings();
                },
              },
            ],
          );
        } else {
          setIsCameraVisible(true);
        }
      }
    };

    checkAndOpenCamera();
  }, [hasPermission, requestPermission]);

  const takePhotoAndSave = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto();
        await CameraRoll.saveAsset(photo.path);
        await postImageToAPI(photo.path, currentLocation);
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Error', 'Failed to take and save photo.');
      }
    }
  };

  const postImageToAPI = async (photoPath: string, location: LatLng | null) => {
    try {
      const response = await fetch(
        'https://66016c2b87c91a11641acda4.mockapi.io/MyPhotos/MyPhotos',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            DateTaken: new Date(),
            Path: photoPath,
            Location: location
              ? {latitude: location.latitude, longitude: location.longitude}
              : null,
          }),
        },
      );
      if (!response.ok) {
        throw new Error('Failed to save photo to API');
      }
    } catch (error) {
      console.error('Error posting image to API:', error);
      throw new Error('Failed to save photo to API');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isCameraVisible && device && (
        <View style={styles.cameraContainer}>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
          />
          <Pressable onPress={takePhotoAndSave} style={styles.captureButton} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default CameraScreen;
