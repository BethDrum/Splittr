import { recognizeText } from '@dariyd/react-native-text-recognition';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Button, ScrollView, View } from 'react-native';

import RecieptSection from '@/components/recieptSection';


export default function viewReciept() {
    const [recieptItems, setRecieptItems] = useState<{ food: string; cost: string }[]>([]);
    
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

        //print food with money next to
        //for each in length of array halved, print food[i] and money[i]
        for (let i=0; i< lengthOfText; i++){
          console.log(food[i], money[i]);
        }

        const items = food.map((item, index) => ({
          food: item,
          cost: money[index],
        }));

        setRecieptItems(items);

        alert("done")

    } catch (error) {
        console.error('OCR Error:', error);
    }
    };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Add a new recipt" onPress={scanReceipt}/>

      <ScrollView style={{ marginTop: 20 }}>
          <View>
            {recieptItems.map((item, index) => (
            <RecieptSection key={index} food={item.food} cost={item.cost} />
            ))}
          </View>
      </ScrollView>
    </View>
  );
}

