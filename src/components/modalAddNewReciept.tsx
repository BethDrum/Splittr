import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

//local imports
import { useTheme } from '../themes/themeSwitcher';
import { themes } from '../themes/themes';
import Button from './button';


type Props = {
    onSubmitObject: (text: string, cost: number) => void;
};

export default function ModalReciept({onSubmitObject}: Props){
    //create relavent variables
  const [modalVisible, setModalVisible] = useState(false);
  const [text, onChangeText] = useState("");
  const [cost, onChangeCost] = useState('');
    //for changable themes
    const { theme, themeName, toggleTheme } = useTheme();
    const styles = createStyles(theme);

    //submit function to send data back & clear fields for next open
  const submitText = () => {
    //haptic feedback
    Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success
    )

    if (!text.trim() || !cost.trim()) {
        Alert.alert('Please enter information in all fields.');
        return;
    }
    onSubmitObject(text, parseFloat(cost.replace('£', '')) || 0);
    setModalVisible(false);
    onChangeCost('');
    onChangeText('');
  };

    //used when adding a new item
    return(
    <SafeAreaProvider>
    <SafeAreaView style={styles.centeredView}>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}>
        
        {/* to ensure the modal closed when pressed outside of it */}
        <Pressable
            style={styles.centeredView}
            onPress={() => setModalVisible(false)}
        >

        <Pressable
            style={styles.modalView}
            onPress={() => {}}
        >
        
        {/* modal content */}


            <Text style={styles.textPrimary}>Add new item</Text>
            <Text style={styles.textSecondary}>Please enter the following information: </Text>
            
            <View style={styles.inputSection}>
                <View style={styles.row}>
                <Text style={styles.textSecondary}>Name: </Text>
                <TextInput style={styles.input} 
                onChangeText={(newValue) => onChangeText(newValue)} 
                value={text}
                placeholder= 'Enter name of item...' /> 
                </View>
                
                <View style={styles.row}>
                <Text style={styles.textPrimary}>Cost: £ </Text>
                <TextInput style={styles.inputC} 
                value={cost}
                onChangeText={onChangeCost} 
                placeholder='0.00'
                keyboardType='numeric'/> 
                </View>
                <View>
                    <Button buttonTheme='submit' label=' Submit' onPress={submitText}/>
                </View>
            </View>
            </Pressable>
        </Pressable>
        </Modal>

        <Button buttonTheme='action' label='ADD NEW ITEM' onPress={() => setModalVisible(true)}/>
        </SafeAreaView>
    </SafeAreaProvider>
    );
}

const createStyles = (theme: typeof themes.default) => StyleSheet.create({
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
    minHeight: '30%',
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
  textPrimary: {
    color: theme.primaryTextColor,
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 30,
  },
  textSecondary: {
    color: '#4F4F4F',
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
    height: '35%',
    width: '40%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
  },

});

