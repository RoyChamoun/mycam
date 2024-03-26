import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import GalleryScreen from './GalleryScreen';

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => [
    {
      id: '1',
      DateTaken: '2022-01-01',
      Path: 'http://example.com/photo.jpg',
      Location: null,
    },
  ],
} as Response);

describe('GalleryScreen Component', () => {
  it('renders without crashing', () => {
    render(<GalleryScreen />);
  });

  it('displays photos fetched from API', async () => {
    const {findByText} = render(<GalleryScreen />);
    const photoDateTaken = await findByText('Date Taken: 2022-01-01');
    expect(photoDateTaken).toBeDefined();
  });

  it('opens modal on photo press', async () => {
    const {findByText, getByTestId} = render(<GalleryScreen />);
    const photo = await findByText('Date Taken: 2022-01-01');
    fireEvent.press(photo);

    const modal = getByTestId('modal');
    expect(modal).toBeDefined();
  });

  it('displays photo data on long press', async () => {
    const {findByText, getByText} = render(<GalleryScreen />);
    const photo = await findByText('Date Taken: 2022-01-01');
    fireEvent(photo, 'longPress');

    const photoData = getByText('Photo Data');
    expect(photoData).toBeDefined();
  });

  it('deletes photo on delete button press in modal', async () => {
    const {findByText, getByText, queryByText} = render(<GalleryScreen />);
    const photo = await findByText('Date Taken: 2022-01-01');
    fireEvent.press(photo);

    const deleteButton = getByText('Delete Photo');
    fireEvent.press(deleteButton);

    await waitFor(() => {
      const deletedPhoto = queryByText('Date Taken: 2022-01-01');
      expect(deletedPhoto).toBeNull();
    });
  });
});
