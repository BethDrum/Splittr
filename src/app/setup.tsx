import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SwipeableMethods } from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';

//imports from local files
import SwipeGesture from '@/animationControl/swipeGesture';
import Button from '@/components/button';
import NameDateModal from '@/components/nameDateModal';
import NewPersonModal from '@/components/newPersonModal';
import PersonCard from '@/components/personCard';
import { useTheme } from '../themes/themeSwitcher';
import { themes } from '../themes/themes';

export default function Setup() {
  //for changable themes
  const { theme, themeName, toggleTheme } = useTheme();
  const styles = createStyles(theme);
  const icon = themeName === 'highContrast' ? require('../../assets/images/icons/darkToLight.png') : require('../../assets/images/icons/lightToDark.png');

  //state values 
  const [person, setPerson] = useState<({id: string, name: string}[])>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  //open reference for swiping functionality (used in edit and delete)
  const openRef = useRef<SwipeableMethods | null>(null);

  //for the edit modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPersonAdd, setNewPersonAdd] = useState('');

  //swipe open functionality 
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
    //ensure that there are at least 2 people (person limit is 2-4)
    if (person.length <= 2){
        alert('There must be a minimum of 2 people to split between');
        return;
    }
    //use filter to find and delete using the id
    setPerson((current) =>
        current.filter(item => item.id !== id)
    );
  };

  //setup edit
  const handleEdit = (id: string) => {
    //haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
    if (modalVisible) return;

    //find person through the passed id
    const item=person.find(i => i.id === id);
    //if item not found return error
    if (!item) return;

    //update values & prefill input for the modal
    setEditingId(id);
    setNewPersonAdd(item.name);

    //display modal asking what the new values are
    setModalVisible(true)
  };

  //submit edit - assign relevent values
  const submitEdit = () =>{
    //find selected item and update person name to new values
    const updatedPeople = person.map(item => item.id === editingId ? {
      ...item,
      name: newPersonAdd,
    }: item);

    //set relevevent information & clear for re-run
    setPerson(updatedPeople)
    setModalVisible(false);
    setEditingId(null);
    setNewPersonAdd('');

    //haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
  }

  //add all new information from initial modals - this includes the name, date and first 2 people
  const addInfo = (newName: string, newDate: string, p1: string, p2: string) => {
    setTitle(newName);
    setDate(newDate);
    setPerson(prev => [
        ...prev,
        { id: Math.random().toString(), name: p1 },
        { id: Math.random().toString(), name: p2 },
    ]);
  }

  //to add a new person
  const newPerson = (newName: string) => {
      setPerson(prev => [
          ...prev,
          { id: Math.random().toString(), name: newName },
      ]);
  }

    

  //store data and go to viewReciept.tsx
  const goToReciept = async () => {
    //haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )

    // store data
      try{
          await AsyncStorage.setItem('people', JSON.stringify(person));
          await AsyncStorage.setItem('name', JSON.stringify(title)); 
          await AsyncStorage.setItem('date', JSON.stringify(date)); 
          console.log('saved')
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          )
      }catch (error){
          console.error('Error saving data: ', error)
      }
    //navigate to viewReciept.tsx
    router.push({pathname: '/viewReciept'});
  };

  //navigate to the home page
  const goToHome = () => {
    //haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )

    //alert to let the user know that all data is lost
    Alert.alert('All data entered will be lost')
    //haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    )
    //navigate to index.tsx
    router.push({pathname: '/'})
  };

  return (
    <View style={styles.container}>
      {/* alter theme switch */}
      <Pressable onPress={toggleTheme} style={styles.imageSec}>
        <Image style={styles.image} source={icon} />
        <Text style={styles.note}>   Change theme</Text>
      </Pressable> 

      <View style={{marginTop: '5%'}}></View>

      <Text style={styles.textHeading}>PLEASE ENTER NAME, DATE AND PEOPLE TO SPLIT BETWEEN</Text>
        <NameDateModal onSubmitObject={(newName, newDate, p1, p2) => addInfo(newName, newDate, p1, p2)}/>

        <View style={styles.nameDate}>
          <Text style={styles.textPrimary}>Name:     {title}</Text>
          <Text style={styles.textPrimary}>Date:       {date}</Text>
        </View>

        <View style={styles.listOfPeople}>
          <View style={styles.slideSec}>
            <Text style={styles.slideNote}>← To edit, swipe right</Text>
            <View style={styles.gap}></View>
             <Text style={styles.slideNote}>To delete, swipe left →</Text>
          </View>
             <ScrollView style={{ marginTop: 20 }}>
                   <View>
                     {person.map(item => (
                    <SwipeGesture key={item.id} onRemove={() => handleDelete(item.id)} onEdit={() => handleEdit(item.id)} onOpen={registerOpen}>
                        <PersonCard name={item.name} />
                    </SwipeGesture>
                    ))}
                </View>
            </ScrollView>
        </View>
        <View style={styles.buttonSec}>
            <View style={{marginBottom: '6%'}}>
            {person.length < 4 && person.length >= 2 && (<NewPersonModal onSubmitObject={(newName) => newPerson(newName)}/>)}
            </View>
            <Button theme='next' label='CONTINUE' onPress={goToReciept}/>
            
            <Button theme="back" label="RETURN TO HOME" onPress={goToHome}/>
        </View>


      {/* modal for editing - must be in here so it can alter values correctly/easiest  */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}>
      <Pressable style={styles.centeredView} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalView} onPress={() => {}}>
        {/* modal content */}
            <Text style={styles.textPrimary}>Edit Item</Text>
            <Text style={styles.textSecondary}>Please enter the following information: </Text>
            
            <View style={styles.inputSection}>
                <View style={styles.row}>
                  <Text style={styles.textSecondary}>Name: </Text>
                  <TextInput style={styles.input} 
                  onChangeText={(newValue) => setNewPersonAdd(newValue)} 
                  value={newPersonAdd}
                  placeholder= 'Enter name of person...' /> 
                </View>

                <View>
                    <Button theme='submit' label=' Submit' onPress={submitEdit}/>
                </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const createStyles = (theme: typeof themes.default) => StyleSheet.create({
  container: {
    backgroundColor: theme.secondaryBackground,
    height: '100%',
    width: '100%',
    padding: '5%'
  },
  header: {
    height: '30%',
    padding: '5%'
  },
  listOfPeople: {
    height: '55%',
  },
  buttonSec: {
    height: '10%',
    marginBottom: '15%',  
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
  textHeading: {
    color: theme.primaryTextColor,
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 35,
    textAlign: 'center',
  },
  nameDate: {
    backgroundColor: theme.mainBackground,
    borderRadius: 15,
    padding: '3%',
    marginTop: '5%',
  },

  // for the modal
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
  slideNote: {
    color: theme.primaryTextColor,
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: '1%',
  },
  slideSec: {
    flexDirection: 'row',
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
});
