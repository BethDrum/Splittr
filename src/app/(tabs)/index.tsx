import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import Card from '@/components/card';


const PlaceholderImage = require('@/assets/images/background-image.jpg');

export default function Index() {
  const router = useRouter();

  const goToViewReciept = () => {
    router.push({pathname: '/(tabs)/viewReciept'});
  }

  return (
    // <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.imageContainer} collapsable={false}>
          <Card theme="primary" onPress={goToViewReciept}/>
          {/* <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} /> */}
          {/* {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />} */}
        </View>
        <View style={styles.listOfCards}>
          <Card onPress={() => console.log('pressed')}/>
          <Card onPress={() => console.log('pressed')}/>
          <Card onPress={() => console.log('pressed')}/>
        </View>
        {/* {showAppOptions ? (
          //options for adding emoji - has reset and save with according icons
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset}/>
              <CircleButton onPress={onAddSticker} />
              <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
            </View>
          </View>
        ) : (  
          <View style={styles.footerContainer}>
            <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
            <Button theme="primary" label="Use this photo" onPress={() => setShowAppOptions(true)}/>
          </View>
        )}
 */}
      </View>
    // </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF2',
    alignItems: "center",
  },
  listOfCards: {
    flex: 2,
    width: '90%',
    marginTop: '5%',
  },
  imageContainer: {
    flex: 1,
    width: '90%',
  },
  
  // text: {
  //   color: '#fff'
  // },
  // footerContainer: {
  //   flex: 1/3,
  //   alignItems: 'center',
  // },
  // optionsContainer: {
  //   position: 'absolute',
  //   bottom: 80,
  // },
  // optionsRow: {
  //   alignItems: 'center',
  //   flexDirection: 'row',
  // },
});
