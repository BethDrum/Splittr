import { recognizeText } from '@dariyd/react-native-text-recognition';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, } from 'react-native';
import { SwipeableMethods } from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';

//imports from local files
import SwipeGesture from '@/animationControl/swipeGesture';
import Button from '@/components/button';
import ModalReciept from '@/components/modalAddNewReciept';
import RecieptSection from '@/components/recieptSection';
import { useTheme } from '../themes/themeSwitcher';
import { themes } from '../themes/themes';


export default function viewReciept() {
  //setup all relevent values
  //router for navigation
  const router = useRouter();
  //for changable themes
  const { theme, themeName, toggleTheme } = useTheme();
  const styles = createStyles(theme);
  const icon = themeName === 'highContrast' ? require('../../assets/images/icons/darkToLight.png') : require('../../assets/images/icons/lightToDark.png');

  //for receiving image for scanning
  const [image, setImage] = useState<string | null>(null);
  const [imageReceived, setImageReceived] = useState(false)
  //setting receipt items
  const [recieptItems, setRecieptItems] = useState<{ id: string; food: string; cost: string }[]>([]);
  //edit modal & values for editing recieptItems
  const [modalVisible, setModalVisible] = useState(false)
  const [cost, setCost] = useState('')
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null);

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

  //get in image to scan
  const getReceiptImage = () => {
    //haptic feedback
    Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
    )

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
    //ensure image has been selected
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

      //set receipt items to the result
      setRecieptItems(items);

    } catch (error) {
        console.error('OCR Error:', error);
    }
  };

  //swipe functionality, open for delete/edit
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

  //delete function
  const handleDelete = (id: string) => {
    //haptic feedback
    Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
    )

    //haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )

    setRecieptItems((current) =>
      current.filter(item => item.id !== id)
    );
  };

  //edit function
  const handleEdit = (id: string) => {
    //haptic feedback
    Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
    )
    
    //haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )

    if (modalVisible) return;
    //find stored item using given id
    const item=recieptItems.find(i => i.id === id);

    //if item not found return error
    if (!item) return;

    setEditingId(id);

    //prefill input
    setText(item.food);
    setCost(item.cost);

    //display modal asking what the new values are
    setModalVisible(true)
  };

  //edit data on return of modal
  const submitEdit = () =>{
    //haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )

    //find selected item and update food & cost to new
    setRecieptItems(current => current.map(item => item.id === editingId ? {
      ...item,
      food: text,
      cost: `£${cost}`,
    }: item));

    //set relevent values to be ready for another edit
    setModalVisible(false);
    setEditingId(null);
    setText('');
    setCost('');
  }

  //add a new block
  const addNew = (newName: string, newCost: number) => {
    //ensure cost is formatted
    const alteredCost = String(`£${newCost}`)
    //take in information
    const info = {id: Math.random().toString(), food: newName, cost: alteredCost}

    //add to reciept items
    setRecieptItems(prev => [...prev, info])
  }

  //navigate to split reciept screen with information
  const goToSplitScreen = () => {
    //haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )

    router.push({pathname: '/splitReciept', params: {recieptItems: JSON.stringify(recieptItems)}})
  };

  //navigate to home (index.tsx)
  const goToHome = () => {
    //haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )

    Alert.alert('All data entered will be lost')
    router.push({pathname: '/'})
  };

  //ensure reciept updates when recieptItem is altered
  useEffect(() => {
    console.log('reciept updated')
  }, [recieptItems]);

  return (
    <View style={styles.main}>
      {/* alter theme switch */}
      <Pressable onPress={toggleTheme} style={styles.imageSec}>
        <Image style={styles.image} source={icon} />
        <Text style={styles.note}>   Change theme</Text>
      </Pressable> 

      <View style={{marginTop: '5%'}}></View>
      <Text style={styles.textPrimary}>PLEASE CONFIRM SELECTION</Text>

      <Button buttonTheme='action' label={imageReceived ? 'ADD DIFFERENT IMAGE' : 'ADD IMAGE'} onPress={getReceiptImage}/>
      <View style={styles.slideSec}>
          <Text style={styles.slideNote}>← To edit, swipe right</Text>
          <View style={styles.gap}></View>
          <Text style={styles.slideNote}>To delete, swipe left →</Text>
      </View>
      <ScrollView style={{ marginTop: 20 }}>
          <View style={[styles.recieptOutput]}>
            {recieptItems.map((item, index) => (
            <SwipeGesture key={item.id} onRemove={() => handleDelete(item.id)} onEdit={() => handleEdit(item.id)} onOpen={registerOpen}>
              <RecieptSection food={item.food} cost={item.cost} />
            </SwipeGesture>
            ))}
          </View>
      </ScrollView>

      <View style={styles.buttonSec}>
        <Button buttonTheme="confirm" label="CONFIRM" onPress={goToSplitScreen}/>
        <ModalReciept onSubmitObject={(newName, newCost) => addNew(newName, newCost)}/>
        <Button buttonTheme="back" label="RETURN TO HOME" onPress={goToHome}/>
      </View>
      <View style={styles.end}>
        
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}>
        
        {/* to ensure the modal closed when pressed outside of it */}
        <Pressable style={styles.centeredView} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalView} onPress={() => {}}>
        {/* modal content */}
            <Text style={styles.textPrimary}>Edit Item</Text>
            <Text style={styles.textSecondary}>Please enter the following information: </Text>
            
            <View style={styles.inputSection}>
                <View style={styles.row}>
                  <Text style={styles.textSecondary}>Name: </Text>
                  <TextInput style={styles.input} 
                  onChangeText={(newValue) => setText(newValue)} 
                  value={text}
                  placeholder= 'Enter name of item...' /> 
                </View>
                
                <View style={styles.row}>
                  <Text style={styles.textSecondary}>Cost: £ </Text>
                  <TextInput style={styles.inputC} 
                  value={cost}
                  onChangeText={setCost} 
                  placeholder='0.00'
                  keyboardType='numeric'/> 
                </View>
                <View>
                    <Button buttonTheme='submit' label=' Submit' onPress={submitEdit}/>
                </View>
            </View>
          </Pressable>
        </Pressable>
        </Modal>
      </View>
    </View>
  );
}


const createStyles = (theme: typeof themes.default) => StyleSheet.create({
  main: {
    backgroundColor: theme.secondaryBackground,
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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: theme.mainBackground,
    borderColor: theme.borderColour,
    borderWidth: 5,
    minHeight: '40%',
    minWidth: '50%',
    borderRadius: 15,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textSecondary: {
    color: theme.primaryTextColor,
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    width: 300,
  },
  inputC: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    width: 210,
  },
  inputSection: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    height: '40%',
    width: '40%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
  },
  imageSec: {
    position: 'absolute',
    left: 15,
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    zIndex: 999,
  },
  note: {
    color: theme.primaryTextColor,
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 15,
  },
  gap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: '5%',
  },
  slideNote: {
    color: theme.primaryTextColor,
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: '1%',
    paddingHorizontal: '5%',
  },
  slideSec: {
    flexDirection: 'row',
  },

});
