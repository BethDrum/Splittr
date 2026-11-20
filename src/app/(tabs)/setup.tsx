//import { DatePicker, Host } from '@expo/ui/swift-ui';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import SwipeGesture from '@/animationControl/swipeGesture';
import NameDateModal from '@/components/nameDateModal';
import NewPersonModal from '@/components/newPersonModal';
import GuestSection from '@/components/personCard';
import { SwipeableMethods } from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';

//guest that has a name and optional image
type Person = {
    id: string;
    name: string;
    image?: string;
};

export default function Setup() {
//   const router = useRouter(); 
  //people states - one setup for two inital people
  const [person, setPerson] = useState<({id: string, name: string}[])>([]);
  const [name, setName] = useState('');
  //const [date, changeDate] = useState(new Date());
  const [date, setDate] = useState('');

  //add guest
   //add a new block
    // const addNewTemp = (newName: string, newImage?: string) => {
    //   //take in information to array
    //   const info = {id: Math.random().toString(), name: newName, ...(newImage && {image: newImage}), };

    //   console.log(info)
    //   //add to people array
    //   setPerson(prev => [...prev, info])
    //   console.log("running")
    // }
    //clear inputs
    

//     const addNew = () => {
//         setPerson(prev => [
//             ...prev, {id: Math.random().toString(), name: '', image: '', editing: true}
//         ])
//     }

//     //when a person is added back
//     const finishEdit = (id: string) => {
//         setPerson(prev => prev.map(p => p.id === id ? {...p,editing: false}:p))
//     }

//   //delete function
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

//     //ensure person updates
//     useEffect(() => {
//         console.log('person updated')
//     }, [person]);

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

    const newPerson = (newName: string) => {
        setPerson(prev => [
            ...prev,
            { id: Math.random().toString(), name: newName },
        ]);
    }

  return (
    <View style={styles.container}>
        <NameDateModal onSubmitObject={(newName, newDate, p1, p2) => addInfo(newName, newDate, p1, p2)}/>

        <Text style={styles.textPrimary}>{name}</Text>
        <Text style={styles.textPrimary}>{date}</Text>

        <View style={styles.listOfPeople}>
             <ScrollView style={{ marginTop: 20 }}>
                   <View>
                     {person.map(item => (
                    <SwipeGesture key={item.id} onRemove={() => handleDelete(item.id)} onOpen={registerOpen}>
                        <GuestSection name={item.name} />
                    </SwipeGesture>
                    ))}
                </View>
            </ScrollView>
        </View>
        
        {person.length < 4 && (<NewPersonModal onSubmitObject={(newName) => newPerson(newName)}/>)}

    </View>



    // <View style={styles.container}>
    //     <View style={styles.header}>
    //         <View>
    //             <Text style={styles.textSecondary}>Name: </Text>
    //             <TextInput style={styles.input} 
    //             value={name}
    //             onChangeText={changeName} 
    //             placeholder= 'Enter name for this split...' /> 
    //         </View>

    //         <View>
    //             <Text style={styles.textSecondary}>Date: </Text>
    //             <TextInput style={styles.input} 
    //             value={date}
    //             onChangeText={changeDate} 
    //             placeholder= 'Enter date of split...' /> 
    //         </View>
    //     </View>


    //     <View style={styles.listOfPeople}>
    //         <ScrollView style={{ marginTop: 20 }}>
    //             <View>
    //                 {person.map(item => (
    //                 <SwipeGesture key={item.id} onRemove={() => handleDelete(item.id)} onOpen={registerOpen}>
    //                     <GuestSection name={item.name} image={item.image} editing={item.editing} nameChange={(text) => {setPerson(prev => prev.map(p=> p.id === item.id ? {...p, name: text}:p))}} onSubmit={() => finishEdit(item.id)}/>
    //                 </SwipeGesture>
    //                 ))}
    //             </View>
    //         </ScrollView>
    //     </View>

    //     <Button theme='submit' label='temp add' onPress={addNew}/>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF2',
    height: '100%',
    width: '100%',
  },
  listOfCards: {
    flex: 2,
    width: '90%',
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
  }
});
