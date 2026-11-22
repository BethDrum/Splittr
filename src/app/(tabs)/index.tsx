import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import Button from '@/components/button';
import Card from '@/components/card';
import ReceiptCard from '@/components/recieptCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

interface Person {
  id: string;
  name: string;
}

interface Item {
  id: string;
  food: string;
  cost: string;
}

interface Receipt {
  id: string;
  name: string;
  date: string;
  people: Person[];
  modifiedItems: Item[];
}

export default function Index() {
  const router = useRouter();
  //for any names & dates recieved

  const goToSetUp = () => {
    router.push({pathname: '/setup'});
  }

  //get data in for viewing saved places
  const [allReciepts, setAllReciepts] = useState<Receipt[]>([])
  const gatherReciepts = async () => {
    try{
      //get existing events from local storage and split into its seperate events
      const tempAllReciepts = await AsyncStorage.getItem('allReciepts');
      const allRecieptsVal: Receipt[] = tempAllReciepts ? JSON.parse(tempAllReciepts) : [];
      setAllReciepts(allRecieptsVal)
      //this is now ready to split
    }catch (error){
      console.error('Error on gathering reciept data from storage: ', error)
    }
  }
  
  const display = (id: string) => {
    router.push({pathname: '/shareReciept', params: {mode: 'saved', receiptId: id}})
  }

  const viewDate = (receipt: Receipt) => {
    //send this specific receipt to share to view

  }

  useEffect(() => {
    gatherReciepts();
  }, [])

  return (
    <View style={styles.container}>
      <View style={{marginTop: '5%'}}></View>
      <View style={styles.imageContainer} collapsable={false}>
        <Card theme="primary" onPress={goToSetUp}/>
      </View>

      <View style={styles.dottedLine}>
          {Array.from({ length: 50 }).map((_, i) => (
              <View key={i} style={styles.singleDot}/>
          ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
        <View style={styles.listOfCards}>
          {allReciepts.map(receipt => (
            <ReceiptCard key={receipt.id} onPress={() => display(receipt.id)} name={receipt.name} date={receipt.date}/>
          ))}
        </View>
      </ScrollView>
      <View style={{margin: '5%'}}>
          <Button theme='confirm' label='ADD NEW RECEIPT +' onPress={goToSetUp}/>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFDF2',
    alignItems: "center",
    height: '100%'
  },
  listOfCards: {
    width: '95%',
    marginTop: '0%',
    paddingTop: '0%',
    alignSelf: 'center',
  },
  imageContainer: {
    width: '90%',
    height: '30%',
  },
  dottedLine: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: '5%',
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: '0.2%',
  },
  singleDot:{
    width: 6,
    height: 2,
    backgroundColor: '#4F4F4F',
    borderRadius: 1,
  },
  scroll: {
    width: '100%',
    height: '65%',
    alignSelf: 'center'
  }
});
