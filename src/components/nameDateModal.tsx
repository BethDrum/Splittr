import { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import DateTimePicker from '@react-native-community/datetimepicker';

import Button from './button';


//TODO: update date to save as date value, add optional image

type Props = {
    onSubmitObject: (name: string, date: string, p1name: string, p2name: string) => void;
};

export default function NameDateModal({onSubmitObject}: Props){
  const [modalVisible, setModalVisible] = useState(true);
  const [modalTwoVisible, setModalTwoVisible] = useState(false);
  //general info
  const [name, onSetName] = useState("");
  const [date, onSetDate] = useState(new Date());

  const [showDate, setShowDate] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);

  //person 1 and person 2, name and colour info
  const [p1name, onSetP1Name] = useState("");
  const [p1colour, onSetP1Colour] = useState("");
  const [p2name, onSetP2Name] = useState("");
  const [p2colour, onSetP2Colour] = useState("");

  //first page, ask for name and date
  //next button to set up person 1 then person 2
  //option seperatly to add 1 person

  const submit = () => {
    if (!p1name.trim() || !p2name.trim()) {
        Alert.alert('Please enter information in all fields.');
        return;
    }
    //convert date to string
    const stringifyDate = date.toLocaleDateString('en-GB');

    onSubmitObject(name, stringifyDate, p1name, p2name);
    setModalTwoVisible(false);
    onSetName('');
    onSetDate(new Date());
  };

  const next = () => {
    //check data is present
    if (!name.trim()) {
        Alert.alert('Please enter information in all fields.');
        return;
    }
    setModalVisible(false);
    setModalTwoVisible(true);
  }
  
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
        
        {/* modal content */}
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
    

            <Text style={styles.textPrimary}>Please enter the following information to start:</Text>
            
            <View style={styles.inputSection}>
                <View style={styles.row}>
                <Text style={styles.textSecondary}>Name of Split: </Text>
                <TextInput style={styles.input} 
                onChangeText={(newValue) => onSetName(newValue)} 
                value={name}
                placeholder= 'Enter the name of this split...' /> 
                </View>
                
                <View style={styles.row}>
                <Text style={styles.textSecondary}>Date:</Text>
                <TouchableOpacity onPress={() => setShowDate(true)}>
                    <View style={styles.dateText}>
                        <Text style={[styles.textInput, {color: dateSelected ? '#000': '#999'}]}>{dateSelected ? date.toLocaleDateString('en-GB') : 'Click to enter date'}</Text>
                    </View>
                </TouchableOpacity>

                {showDate && (
                <DateTimePicker 
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {setShowDate(false); if (selectedDate) {onSetDate(selectedDate); setDateSelected(true)}}}
                /> 
                )}
                </View>
                <View>
                    <Button theme='submit' label='NEXT STEP ->' onPress={next}/>
                </View>
            </View>
            </View>
            </View>
        </Modal>
        </SafeAreaView>

        <SafeAreaView style={styles.centeredView}>
            <Modal
            animationType="none"
            transparent={true}
            visible={modalTwoVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            
            {/* modal content */}
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
        

                <Text style={styles.textPrimary}>{name}</Text>
                <Text style={styles.textPrimary}>{date.toLocaleDateString('en-GB')}</Text>
                <Text style={styles.textPrimary}>Please enter the information for the initial two people to split the bill between: </Text>
            
                <View style={styles.inputSection}>
                    <Text style={styles.textSecondary}>Person 1</Text>
                    <View style={styles.row}>
                    <Text style={styles.textSecondary}>Name: </Text>
                    <TextInput style={styles.input} 
                    onChangeText={(newValue) => onSetP1Name(newValue)} 
                    value={p1name}
                    placeholder= 'Enter the name of person one...' /> 
                    </View>

                    <Text style={styles.textSecondary}>Person 2</Text>
                    <View style={styles.row}>
                    <Text style={styles.textSecondary}>Name: </Text>
                    <TextInput style={styles.input} 
                    onChangeText={(newValue) => onSetP2Name(newValue)} 
                    value={p2name}
                    placeholder= 'Enter the name of person two...' /> 
                    </View>
                    
                    <View>
                        <Button theme='submit' label='SUBMIT' onPress={submit}/>
                    </View>
                </View>
                </View>
                </View>
            </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

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
  dateText: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    width: 250,
    height: '80%',
    justifyContent: 'center'
  },
  textInput: {
    color: '#9D9D9D',
    fontSize: 13,
  }
});