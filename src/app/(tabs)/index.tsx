import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library/legacy';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import Card from '@/components/card';


const PlaceholderImage = require('@/assets/images/background-image.jpg');

export default function Index() {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType | undefined>(undefined)
  const [permissionResponse, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const imageRef = useRef<any>(null);

  /*Image picker code */
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      /*Let user crop image on selection */
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled){
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else { 
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef.current as any, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert('Saved!');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!permissionResponse?.granted){
      requestPermission();
    }
  }, []);

  return (
    // <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <View ref={imageRef} style={styles.imageContainer} collapsable={false}>
          <Card theme="primary" onPress={() => router.navigate('/(tabs)/viewReciept')}/>
          {/* <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} /> */}
          {/* {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />} */}
        </View>
        <View style={styles.listOfCards}>
          <Card onPress={pickImageAsync}/>
          <Card onPress={pickImageAsync}/>
          <Card onPress={pickImageAsync}/>
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
        <EmojiPicker isVisable={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker> */}
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
