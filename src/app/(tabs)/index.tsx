import { StyleSheet, View } from "react-native";

import Button from '@/components/button';
import ImageViewer from '@/components/image-viewer';

const PlaceholderImage = require('@/assets/images/background-image.jpg');

export default function Index() {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Home screen</Text>
      <Link href="/about" style={styles.button}>
        Go to About Screen
      </Link> */}
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage}/>
      </View>
      <View>
        <Button theme="primary" label="Choose"/>
        <Button label="Use this photo"/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: "center",
  },
  text: {
    color: '#fff'
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff'
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1/3,
    alignItems: 'center',
  },
});
