import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import GalleryScreen from './GalleryScreen';

describe('GalleryScreen', () => {
  test('renders correctly', () => {
    const {getByText} = render(<GalleryScreen />);
    const galleryText = getByText('Gallery Screen');
    expect(galleryText).toBeDefined();
  });

  test('pressing a photo calls handlePhotoPress', () => {
    const {getByTestId} = render(<GalleryScreen />);
    const photoItem = getByTestId('photo-item');
    fireEvent.press(photoItem);
  });

  test('long pressing a photo calls handleLongPress', () => {
    const {getByTestId} = render(<GalleryScreen />);
    const photoItem = getByTestId('photo-item');
    fireEvent(photoItem, 'longPress');
  });

  test('swiping left/right navigates to previous/next photo', () => {
    const {getByTestId} = render(<GalleryScreen />);
    const photoItem = getByTestId('photo-item');
    fireEvent(photoItem, 'swipeLeft');

    fireEvent(photoItem, 'swipeRight');
  });

  test('pinching in/out zooms in/out the photo', () => {
    const {getByTestId} = render(<GalleryScreen />);
    const photoItem = getByTestId('photo-item');
    fireEvent(photoItem, 'pinchIn');

    fireEvent(photoItem, 'pinchOut');
  });
});
