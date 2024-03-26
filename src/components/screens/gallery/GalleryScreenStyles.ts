import {StyleSheet, Dimensions} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  item: {
    width: screenWidth / 2 - 15,
    height: (screenWidth / 2 - 15) * (3 / 4),
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  columnWrapper: {
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalImage: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.9,
    resizeMode: 'contain',
  },
  closeButton: {
    color: 'black',
    fontSize: 18,
    marginTop: 50,
    height: '20%',
  },
  deleteButton: {
    color: 'red',
    fontSize: 18,
    marginTop: 20,
  },
});

export default styles;
