import { recognizeText } from '@dariyd/react-native-text-recognition';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SwipeableMethods } from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';


import Button from '@/components/button';
import RecieptSection from '@/components/recieptSection';

import SwipeGesture from '@/animationControl/swipeGesture';

export default function viewReciept() {
    const [recieptItems, setRecieptItems] = useState<{ id: string; food: string; cost: string }[]>([]);
    
    const scanReceipt = async () => {
    try {
      //get image from library
        const image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        });

        if (image.canceled) {
        console.log('No image selected');
        return;
        }

        const imageUri = image.assets[0].uri;

        console.log('Selected image:', imageUri);

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

    //open
    const openRef = useRef<SwipeableMethods | null>(null);

    const registertOpen = useCallback(
      (row: SwipeableMethods | null) => {
        if (openRef.current && openRef.current !== row){
          openRef.current.close()
        }
        openRef.current = row;
      },
      []
    );

  

  return (
    <View style={styles.main}>
      <Text style={styles.textPrimary}>PLEASE CONFIRM SELECTION</Text>

      <ScrollView style={{ marginTop: 20 }}>
          <View style={[styles.recieptOutput]}>
            {recieptItems.map((item, index) => (
            <SwipeGesture key={item.id} onRemove={() => handleDelete(item.id)} onOpen={registertOpen}>
              <RecieptSection food={item.food} cost={item.cost} />
            </SwipeGesture>
            ))}
          </View>
      </ScrollView>

      <Button theme="confirm" label="CONFIRM" onPress={scanReceipt}/>
      <Button theme="edit" label="EDIT" onPress={scanReceipt}/>
      <Button theme="back" label="RETURN TO HOME" onPress={scanReceipt}/>
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
});
