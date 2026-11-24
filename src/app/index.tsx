import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/button';
import Card from '@/components/card';
import ReceiptCard from '@/components/recieptCard';
import { useTheme } from '../themes/themeSwitcher';
import { themes } from '../themes/themes';


//setup objects
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
  //setup router
  const router = useRouter();
  //for changable themes
  const { theme, themeName, toggleTheme } = useTheme();
  const styles = createStyles(theme);
  const icon = themeName === 'highContrast' ? require('../../assets/images/icons/darkToLight.png') : require('../../assets/images/icons/lightToDark.png');
  //for displaying all receipts
  const [allReciepts, setAllReciepts] = useState<Receipt[]>([])

  //get in all saved reciept data to display as a list (can be selected to view all info)
  const gatherReciepts = async () => {
    try{
      //get existing events from local storage and split into its seperate events
      const tempAllReciepts = await AsyncStorage.getItem('allReciepts');
      const allRecieptsVal: Receipt[] = tempAllReciepts ? JSON.parse(tempAllReciepts) : [];
      //set all receipts
      setAllReciepts(allRecieptsVal)
      //this is now ready to split
    }catch (error){
      console.error('Error on gathering reciept data from storage: ', error)
    }
  }
  
  //move to shareReciept.tsx with id to display selected item
  const display = (id: string) => {
    //haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )

    router.push({pathname: '/shareReciept', params: {mode: 'saved', receiptId: id}})
  }

  //move to setUp.tsx page
  const goToSetUp = () => {
    //haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )

    router.push({pathname: '/setup'});
  }

  //run gather receipts whenever the page is ran
  useEffect(() => {
    gatherReciepts();
  }, [])

  return (
    <View style={styles.container}>
      {/* alter theme switch */}
      <Pressable onPress={toggleTheme} style={styles.imageSec}>
        <Image style={styles.image} source={icon} />
        <Text style={styles.note}>   Change theme</Text>
      </Pressable> 

      <View style={{marginTop: '7%'}}></View>
      <View style={styles.imageContainer} collapsable={false}>
        <Card onPress={goToSetUp}/>
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
          <Button buttonTheme='confirm' label='ADD NEW RECEIPT +' onPress={goToSetUp}/>
      </View>
    </View>
  );
}


const createStyles = (theme: typeof themes.default) => StyleSheet.create({
  container: {
    backgroundColor: theme.mainBackground,
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
    backgroundColor: theme.secondaryTextColor,
    borderRadius: 1,
  },
  scroll: {
    width: '100%',
    height: '65%',
    alignSelf: 'center'
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
  }
});
