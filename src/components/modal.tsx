import { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Button from './button';

type Props = {
    theme?: 'service' | 'discount';
    onSubmit: (value: number) => void;
};

export default function modal({theme, onSubmit}: Props){
  const [modalVisible, setModalVisible] = useState(false);
  const [number, onChangeNumber] = useState('');
  const [text, onChangeText] = useState("");
  const [cost, onChangeCost] = useState('');

  //clean up cost & add £ symbol
  const cleanCost = (text: string) => {
    const clean = text.replace(/£/g, '');
    onChangeCost(`£${clean}`);
  };

  //set value to return and make the modal invisible
  const submit = () => {
    cleanCost(cost)
    if (!number.trim()) {
        Alert.alert('Please enter information in all fields.');
        return;
    }
    onSubmit(parseFloat(number) || 0);
    setModalVisible(false);

  };

  if (theme === 'service'){
    return(
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


              <Text style={styles.textPrimary}>Service Charge</Text>
              <Text style={styles.textSecondary}>Please enter the total service charge to split: </Text>
              
              <View style={styles.inputSection}>
                <Text style={styles.textPrimary}>£</Text>
                <TextInput style={styles.input} 
                  onChangeText={cleanCost} 
                  value={number}
                  placeholder= '0.00'
                  keyboardType='numeric'/>
              </View>

              <Button theme='addOption' label=' Submit' onPress={submit}/>

            </View>
          </View>
        </Modal>

        <Button theme='addOption' label='ADD SERVICE CHARGE' onPress={() => setModalVisible(true)}/>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  if (theme === 'discount'){
    return(
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


              <Text style={styles.textPrimary}>Add Discount</Text>
              <Text style={styles.textSecondary}>Please enter the total discount percentage: </Text>
              
              <View style={styles.inputSection}>
                <TextInput style={styles.input} 
                  onChangeText={onChangeNumber} 
                  value={number}
                  placeholder= '0'
                  keyboardType='numeric'/> 
                  <Text style={styles.textPrimary}>£</Text>
              </View>

              <Button theme='addOption' label=' Submit' onPress={submit}/>

            </View>
          </View>
        </Modal>

        <Button theme='addOption' label='Add Service Charge' onPress={() => setModalVisible(true)}/>
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

              
              <Button theme='addOption' label='Submit' onPress={() => setModalVisible(false)}/>

            </View>
          </View>
        </Modal>

        <Button theme='addOption' label='Activate Modal' onPress={() => setModalVisible(true)}/>
        </SafeAreaView>
      </SafeAreaProvider>
  );
};


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FFFDF2',
    borderColor: '#E3E1D5',
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
    color: '#4F4F4F',
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
    width: '100%',
  },
  inputSection: {
    paddingHorizontal: 10,
    margin: '5%',
    flexDirection: 'row',
    width: 100,
    height: 40,
    marginLeft: '-1%',
  }

});