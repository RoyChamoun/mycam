import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import CameraScreen from '../screens/camera/CameraScreen';
import GalleryScreen from '../screens/gallery/GalleryScreen';
import Map from '../map/Map';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="GalleryScreen" component={GalleryScreen} />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
