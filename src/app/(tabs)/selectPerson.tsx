// import { StyleSheet, Text, View } from 'react-native';
// //import { Section } from '@/components/section';


// export default function SelectPerson() {
//     return(
//         <View style={styles.container}>
//             <Text style={styles.text}>Person</Text>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#25292e',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     text: {
//         color: '#fff'
//     }
// })

import { recognizeText } from '@dariyd/react-native-text-recognition';
import * as ImagePicker from 'expo-image-picker';
import { Button, ScrollView, View } from 'react-native';

export default function SelectPerson() {
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
        const result = await recognizeText(imageUri, {
        languages: ['en'],
        pdfDpi: 600,
        recognitionLevel: 'line',
        preprocessImages: true,
        });

        // console.log('OCR RESULT:', result);

        // if (result.success) {
        // console.log('FULL TEXT:');
        // console.log(result.fullText);

        alert(result.fullText);

        //results give all elements (in lines) and then the following prices
        //split the list in half then match 1 with 0.5 list 1
        // Access detailed results
        result.pages?.forEach((page) => {
          // console.log(`Page ${page.pageNumber}:`);
          page.elements.forEach((element) => {
            console.log(`  Text: ${element.text}`);
            console.log(`  Confidence: ${element.confidence}`);
            console.log(`  BoundingBox:`, element.boundingBox);
          });
        });
    } catch (error) {
        console.error('OCR Error:', error);
    }
    };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Test OCR" onPress={scanReceipt}/>

      <ScrollView style={{ marginTop: 20 }}>
        {/* <Text>{result}</Text> */}
      </ScrollView>
    </View>
  );
}