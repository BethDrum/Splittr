import { recognizeText } from '@dariyd/react-native-text-recognition';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, } from 'react-native';
import { SwipeableMethods } from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';

import Button from '@/components/button';
import RecieptSection from '@/components/recieptSection';

import SwipeGesture from '@/animationControl/swipeGesture';
import ModalReciept from '@/components/modalAddNewReciept';

export default function viewReciept() {
  const [image, setImage] = useState<string | null>(null);
  const [imageReceived, setImageReceived] = useState(false)
  const [recieptItems, setRecieptItems] = useState<{ id: string; food: string; cost: string }[]>([]);
  const router = useRouter();

  //immediatly run when page is loaded
    // useEffect(() => {
    //   console.log('running');
    //   scanReceipt();
    // }, []);

    //get receipt from camera or image library and crop
    const getPhoto = async () => {
      //ensure permission granted
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required. Please allow access to the media library')
        return;
      }

      //get in image from library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      //set the image
      if (!result.canceled){
        setImage(result.assets[0].uri);
      }

      //set the imageUri to be the uri of the image and set image to it ready for scan reciept
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setImage(imageUri);
        scanReceipt(imageUri);
        setImageReceived(true);
      }
    }

    const takePhoto = async () => {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted){
        Alert.alert('Permission required to access camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      })

      //set the imageUri to be the uri of the image and set image to it ready for scan reciept
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setImage(imageUri);
        scanReceipt(imageUri);
        setImageReceived(true);
      }
    }

    const getReceiptImage = () => {
      Alert.alert(
        'Select a image of a reciept, choose from the following options',
        'Crop it to ONLY the size of the information (items with cost next to)',
        [
          {text: 'Camera', onPress: takePhoto},
          {text: 'Gallery', onPress: getPhoto},
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }

    //scan the reciept and translate
    const scanReceipt = async (image: string) => {
      console.log(image)
    try {
      if (!image){
        Alert.alert('Enter a image first.')
        return;
      }

      //get image from library
      const imageUri = image

        //detect text
        //results give all elements (in lines) and then the following prices
        const result = await recognizeText(imageUri, {
        languages: ['en'],
        pdfDpi: 600,
        recognitionLevel: 'line',
        preprocessImages: true,
        });

        //put the result into a array
        const array = new Array()

        result.pages?.forEach((page) => {
          page.elements.forEach((element) => {
            array.push(element.text)
          })
        })

        //get half of the given length of all the scanned in text
        const lengthOfText = Math.ceil(array.length / 2);

        //assign halfs to correct sides
        const food = array.slice(0, lengthOfText);
        const money = array.slice(lengthOfText);

        //add array food & cost to items list and set recieptItems to that
        const items = food.map((item, index) => ({
          id: Math.random().toString(),
          food: item,
          cost: money[index],
        }));

        setRecieptItems(items);

    } catch (error) {
        console.error('OCR Error:', error);
    }
  };

    //delete function
    const handleDelete = (id: string) => {
      setRecieptItems((current) =>
        current.filter(item => item.id !== id)
      );
    };

    //open for delete
    const openRef = useRef<SwipeableMethods | null>(null);

    const registerOpen = useCallback(
      (row: SwipeableMethods | null) => {
        if (openRef.current && openRef.current !== row){
          openRef.current.close()
        }
        openRef.current = row;
      },
      []
    );

    //add a new block
    const addNew = (newName: string, newCost: number) => {
      const alteredCost = String(`£${newCost}`)
      //take in information
      const info = {id: Math.random().toString(), food: newName, cost: alteredCost}

      console.log(info)
      //add to reciept items
      setRecieptItems(prev => [...prev, info])
      console.log("running")
    }

    //go to split reciept screen with information
    const goToSplitScreen = () => {
      console.log(recieptItems)
      // navigation.navigate('splitReciept', {recieptItems: recieptItems });
      console.log('trying to nav')
      router.push({pathname: '/(tabs)/splitReciept', params: {recieptItems: JSON.stringify(recieptItems)}})
    };

    //ensure reciept updates
    useEffect(() => {
      console.log('reciept updated')
    }, [recieptItems]);

  return (
    <View style={styles.main}>
      <View style={{marginTop: '5%'}}></View>
      <Text style={styles.textPrimary}>PLEASE CONFIRM SELECTION</Text>

      <Button theme='action' label={imageReceived ? 'ADD DIFFERENT IMAGE' : 'ADD IMAGE'} onPress={getReceiptImage}/>
      <ScrollView style={{ marginTop: 20 }}>
          <View style={[styles.recieptOutput]}>
            {recieptItems.map((item, index) => (
            <SwipeGesture key={item.id} onRemove={() => handleDelete(item.id)} onOpen={registerOpen}>
              <RecieptSection food={item.food} cost={item.cost} />
            </SwipeGesture>
            ))}
          </View>
      </ScrollView>

      <View style={styles.buttonSec}>
        <Button theme="confirm" label="CONFIRM" onPress={goToSplitScreen}/>
        <ModalReciept onSubmitObject={(newName, newCost) => addNew(newName, newCost)}/>
        <Button theme="back" label="RETURN TO HOME" onPress={goToSplitScreen}/>
      </View>
      <View style={styles.end}>

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  main: {
    backgroundColor: '#D4E0F3',
    height: '100%',
  },
  recieptOutput: {
    marginHorizontal: '5%',
  },
  end: {
    marginBottom: 1,
  },
  textPrimary: {
    color: '#4F4F4F',
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 30,
    padding: '5%',
    alignSelf: 'center',
  },
  buttonSec: {
    minHeight: '25%',
  }
});
