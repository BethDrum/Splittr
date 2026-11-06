//import { StyleSheet, Text, View } from 'react-native';

// export default function AboutScreen() {
//     return(
//         <View style={styles.container}>
//             <Text style={styles.text}>About screen</Text>
//         </View>
//     );
// }


//TEST FOR IMAGE

import TextRecognition from '@dariyd/react-native-text-recognition';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';

export default function OCRTest() {
  const [result, setResult] = useState('');

  const scanReceipt = async () => {
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (image.canceled) return;

    try {
        const textBlocks = await TextRecognition.recognizeText(
            image.assets[0].uri
        );

        console.log(textBlocks);
        setResult(JSON.stringify(textBlocks, null, 2));
        } catch (err) {
        console.error(err);
        setResult('OCR failed');
        }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Choose Receipt" onPress={scanReceipt} />

      <ScrollView style={{ marginTop: 20 }}>
        <Text>{result}</Text>
      </ScrollView>
    </View>
  );
}

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