import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

//local imports
import { useTheme } from '../themes/themeSwitcher';
import { themes } from '../themes/themes';
import Button from './button';


type Props = {
    modalTheme?: 'service' | 'discount';
    onSubmit: (value: number) => void;
};

export default function modal({modalTheme, onSubmit}: Props){
  //initialise relavent variables
  const [modalVisible, setModalVisible] = useState(false);
  const [cost, onChangeCost] = useState('');
  //changable theme
  const { theme, themeName, toggleTheme } = useTheme();
  const styles = createStyles(theme);



  //clean up cost & add £ symbol
  const cleanCost = (text: string) => {
    const clean = text.replace(/£/g, '');
    onChangeCost(`£${clean}`);
  };

  //set value to return and make the modal invisible, ready for use again
  const submit = () => {
    //haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
    if (!cost.trim()) {
        Alert.alert('Please enter information in all fields.');
        return;
    }
    onSubmit(parseFloat(cost.replace('£', '')) || 0);
    setModalVisible(false);
    onChangeCost('');
  };

  //create modals with input for cost - used in adding service charge
  if (modalTheme === 'service'){
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
  
  
              <Text style={styles.textPrimary}>Service Charge</Text>
              <Text style={styles.textSecondary}>Please enter the total service charge: </Text>
              
              <View style={styles.inputSection}>
                <View style={styles.wrapper}>
                  <Text style={styles.textPrimary}>Cost: £ </Text>
                  <TextInput style={styles.input} 
                  value={cost}
                  onChangeText={onChangeCost} 
                  placeholder='0.00'
                  keyboardType='numeric'/> 
                </View>
                <View>
                  <Button buttonTheme='submit' label=' Submit' onPress={submit}/>
                </View>
              </View>
              </Pressable>
          </Pressable>
          </Modal>
  
          <Button buttonTheme='service' label='ADD SERVICE CHARGE' onPress={() => setModalVisible(true)}/>
          </SafeAreaView>
      </SafeAreaProvider>
      );
  }


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          
          {/* modal content */}
          <View style={styles.centeredView}>
            <View style={styles.modalView}>


              <Text style={styles.textPrimary}>Empty Modal</Text>

              
              <Button buttonTheme='submit' label='Submit' onPress={() => setModalVisible(false)}/>

            </View>
          </View>
        </Modal>

        <Button buttonTheme='action' label='Activate Modal' onPress={() => setModalVisible(true)}/>
        </SafeAreaView>
      </SafeAreaProvider>
  );
};


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
  inputSection: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    height: '35%',
    width: '40%',
    justifyContent: 'space-evenly',
  },
  wrapper: {
    flexDirection: 'row',
  }

});