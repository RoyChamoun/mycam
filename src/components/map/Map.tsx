import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Dimensions, PixelRatio} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, LatLng} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;

const Map: React.FC = () => {
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

  return (
    <View style={styles.mapcontainer}>
      {currentLocation && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}>
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
          />
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapcontainer: {
    height: height - PixelRatio.getPixelSizeForLayoutSize(100),
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
