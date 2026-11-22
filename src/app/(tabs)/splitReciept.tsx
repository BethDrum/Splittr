import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Draggable, Droppable, DropProvider } from "react-native-reanimated-dnd";

type ReceiptItem = {
  id: string;
  food: string;
  cost: string;
};

type People = {
  id: string;
  name: string;
}

export default function App() {
  //total for all passes - currently just for 4
  const total = useRef<number[]>([0, 0, 0, 0]);
  //index
  const [index, setIndex ]= useState(0);
  //for await to function
  const resolver = useRef<(() => void) | null>(null);
  //for card to display
  const [currentCard, setCurrentCard] = useState<number | null>(null);
  //for router to take to next page on end
  const router = useRouter();
  const [people, setPeople] = useState<People[]>([]);
  const defaultColours = ['#C0DFF7','#C8D3B7','#F7D6C0','#E7C8F7',];

  //recieve data
  const { recieptItems } = useLocalSearchParams();
  const items: ReceiptItem[] = JSON.parse(recieptItems as string);

  useEffect(() => {
    getPeople();
  }, [])

  const getPeople = async () => {
    try{
    const storedPeople = await AsyncStorage.getItem('people')
    setPeople(JSON.parse(storedPeople as string));
    console.log('People', people)
    } catch (error) {
      console.error('Error when gathering information: ', error)
    }
  }
  
  //for animated on hover of draggable
  const [isActive, setIsActive] = useState(false);
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    }));
    useEffect(() => {
      scale.value = withSpring(isActive ? 1.05 : 1);
  }, [isActive]);

  //add to cost to the total cost and initiate next card
  const assignDrop = (dropNumber: number, index: number) =>{
    console.log('dropping', index ,'in', dropNumber);
    //current cost + to total of that number
    total.current[dropNumber] = total.current[dropNumber] + parseFloat(items[index].cost.substring(1));
    console.log(items[index].cost)
    console.log(total)
    //log total
    // console.log(parseFloat(items[index].cost.substring(1)));
    setIndex(current => current + 1);
    // console.log(total[dropNumber]);
    
    //signal that the card has been dropped and the next can be generated
    if (resolver.current) {
      resolver.current();
      resolver.current = null;
    }

    setCurrentCard(null)
  };

  //alter number of drop spaces based off of number of people provided
  const numSections = people.length <= 2 ? 2: people.length <= 3 ? 3: 4;
  

  //display the correcrt card
  const dispCard = (index: number | null) => {
    setCurrentCard(index);
  };

  //function to fuflil resolver promise and comtinue running process
  const callNext = () => {
    return new Promise<void>((resolve) => {
      resolver.current = resolve;
    });
  } ;

  //go to the share page and send total values
  const goToShareScreen = () => {
    console.log('moving to share screen')
    router.push({pathname: '/shareReciept', params: {mode: 'new', totals: JSON.stringify(total.current)}})
  };

  //function that controls all the running
  const run = async () => {
    const totalLen = Math.ceil(items.length);
    for (let i=0; i<totalLen; i++){
      console.log('run', i)
      //display current card
      dispCard(i)
      //wait for the card to be dropped into the correct section
      await callNext();
      setCurrentCard(null);
      //small delay to render removal
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    //go to next page once all items are added
    goToShareScreen();
  };

  //to display the people cards in a way that can be changed depending on the number of people
  const dropSection = (i: number) => (
    <Droppable
    key={i}
    onDrop={() => assignDrop(i, index)} style={[styles.drop, {flex: 1, backgroundColor: defaultColours[i]}]}
    onActiveChange={(active) => setIsActive(active)}
    activeStyle={{
        backgroundColor: "rgba(88, 166, 255, 0.1)",
        borderColor: "#58a6ff",
        borderWidth: 2,
    }}
    >
    <Animated.View style={[styles.section, animatedStyle]}>
      <Text style={styles.text}>{people[i]?.name}</Text>
    </Animated.View>
  </Droppable>
  )

  useEffect(() => {
    run();
  }, []);


  return (
    <GestureHandlerRootView>
      <Text style={styles.primaryText}>Drag the item to the person to assign it too</Text>

      <DropProvider>
        <View style={{flex: 1}}>
        <View style={styles.wrap}>
          {/* changable number of sections for the draggable (reciept) section (based on number of people) */}

          {numSections === 2 && (
            <View style={styles.col}>
              {dropSection(0)}
              {dropSection(1)}
            </View>
          )}

          {numSections === 3 && (
            <View style={styles.col}>
              <View style={{flex: 1}}>
                {dropSection(0)}
              </View>
              <View style={styles.row}>
                {dropSection(1)}
                {dropSection(2)}
              </View>
            </View>
          )}

          {numSections === 4 && (
            <View style={styles.col}>
              <View style={styles.row}>
                {dropSection(0)}
                {dropSection(1)}
              </View>
              <View style={styles.row}>
                {dropSection(2)}
                {dropSection(3)}
              </View>
            </View>
          )}
          
          {/* draggable reciept date */}

          {currentCard !== null && (
            <View style={styles.centre}>
            <Draggable data={currentCard} style={styles.drag} collisionAlgorithm='center'>
              <Text style={styles.recieptText}>{items[currentCard].food}............ {items[currentCard].cost} </Text>
            </Draggable>
            </View>
          )}
          </View>
        </View>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    flexDirection: 'column',
  },

  section: {
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  centre: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    alignItems: 'center',
  },

  drag: {
    padding: 20,
    backgroundColor: '#FFFDF2',
    borderRadius: 9,
  },
  text: {
    color: '#4F4F4F',
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 30,
    padding: 5,
    alignSelf: 'center',
  },
  recieptText:{
    color: '#4F4F4F',
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 25,
    padding: 5,
    alignSelf: 'center',
  },
  primaryText: {
    color: '#4F4F4F',
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 30,
    padding: 5,
    alignSelf: 'center',
    zIndex: 9999,
  },
  drop: {
    flex: 1,
    margin: 5,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  col: {
    flex: 1
  }
});