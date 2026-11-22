//import { DatePicker, Host } from '@expo/ui/swift-ui';
import { useCallback, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import SwipeGesture from '@/animationControl/swipeGesture';
import Button from '@/components/button';
import NameDateModal from '@/components/nameDateModal';
import NewPersonModal from '@/components/newPersonModal';
import PersonCard from '@/components/personCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { SwipeableMethods } from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';

//guest that has a name and optional image
type Person = {
    id: string;
    name: string;
    image?: string;
};

export default function Setup() {
  //people states - one setup for two inital people
  const [person, setPerson] = useState<({id: string, name: string}[])>([]);
  const [name, setName] = useState('');
  //const [date, changeDate] = useState(new Date());
  const [date, setDate] = useState('');


   //delete function
    const handleDelete = (id: string) => {
        if (person.length <= 2){
            alert('There must be a minimum of 2 people to split between');
            return;
        }
        setPerson((current) =>
            current.filter(item => item.id !== id)
        );
    };
  
    //open for delete
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

    //add all new information from initial modals
    const addInfo = (newName: string, newDate: string, p1: string, p2: string) => {
        setName(newName);
        setDate(newDate);
        setPerson(prev => [
            ...prev,
            { id: Math.random().toString(), name: p1 },
            { id: Math.random().toString(), name: p2 },
        ]);
        console.log(person)
    }

    //when adding a new person
    const newPerson = (newName: string) => {
        setPerson(prev => [
            ...prev,
            { id: Math.random().toString(), name: newName },
        ]);
    }

    //store data and go to viewReciept.tsx
    const goToReciept = async () => {
      // store data
        try{
            await AsyncStorage.setItem('people', JSON.stringify(person));
            await AsyncStorage.setItem('name', JSON.stringify(name)); 
            await AsyncStorage.setItem('date', JSON.stringify(date)); 
            console.log('saved')
        }catch (error){
            console.error('Error saving data: ', error)
        }

      router.push({pathname: '/(tabs)/viewReciept'});
    };

    const goToHome = () => {
        Alert.alert('All data entered will be lost')
        router.push({pathname: '/(tabs)'})
    };

  return (
    <View style={styles.container}>
      <Text style={styles.textHeading}>PLEASE ENTER NAME, DATE AND PEOPLE TO SPLIT BETWEEN</Text>
        <NameDateModal onSubmitObject={(newName, newDate, p1, p2) => addInfo(newName, newDate, p1, p2)}/>

        <View style={styles.nameDate}>
          <Text style={styles.textPrimary}>Name:     {name}</Text>
          <Text style={styles.textPrimary}>Date:       {date}</Text>
        </View>

        <View style={styles.listOfPeople}>
             <ScrollView style={{ marginTop: 20 }}>
                   <View>
                     {person.map(item => (
                    <SwipeGesture key={item.id} onRemove={() => handleDelete(item.id)} onOpen={registerOpen}>
                        <PersonCard name={item.name} />
                    </SwipeGesture>
                    ))}
                </View>
            </ScrollView>
        </View>
        <View style={styles.buttonSec}>
            {person.length < 4 && person.length >= 2 && (<NewPersonModal onSubmitObject={(newName) => newPerson(newName)}/>)}
            <Button theme='submit' label='CONTINUE' onPress={goToReciept}/>
            
            <Button theme="back" label="RETURN TO HOME" onPress={goToHome}/>
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4E0F3',
    height: '100%',
    width: '100%',
    padding: '5%'
  },
  listOfCards: {
    flex: 2,
    width: '50%',
    marginTop: '5%',
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
  header: {
    height: '30%',
    padding: '5%'
  },
  listOfPeople: {
    height: '60%',
  },
  buttonSec: {
    height: '10%',
    marginBottom: '10%',  
  },
  textHeading: {
    color: '#4F4F4F',
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 35,
    textAlign: 'center',
  },
  nameDate: {
    backgroundColor: '#FFFDF2',
    borderRadius: 15,
    padding: '3%',
    marginTop: '5%',
  }
});
