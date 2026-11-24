import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Draggable, Droppable, DropProvider } from "react-native-reanimated-dnd";

//local imports
import Button from '@/components/button';
import { useTheme } from '../themes/themeSwitcher';
import { themes } from '../themes/themes';


type ReceiptItem = {
  id: string;
  food: string;
  cost: string;
};

type People = {
  id: string;
  name: string;
}

type DropHistory = {
  personNumb: number;
  cardNumb: number;
  cost: number;
}

export default function App() {
  //initialise all relavent inputs
  //for router
  const router = useRouter();
  //for changeable themes
  const { theme, themeName, toggleTheme } = useTheme();
  const styles = createStyles(theme);
  const icon = themeName === 'highContrast' ? require('../../assets/images/icons/darkToLight.png') : require('../../assets/images/icons/lightToDark.png');

  //total for all passes - max 4
  const total = useRef<number[]>([0, 0, 0, 0]);
  //index
  const [index, setIndex ]= useState(0);
  //promise for await to continue run
  const resolver = useRef<(() => void) | null>(null);
  //for card to display
  const [currentCard, setCurrentCard] = useState<number | null>(null);
  const [people, setPeople] = useState<People[]>([]);
  //default colours for sections
  const defaultColours = [theme.default1, theme.default2, theme.default3, theme.default4,];
  //recieve data
  const { recieptItems } = useLocalSearchParams();
  const items: ReceiptItem[] = JSON.parse(recieptItems as string);
  //go back functionality, state of history
  const dropHistory = useRef<DropHistory[]>([]);
  //for animated on hover of draggable
  const [isActive, setIsActive] = useState(false);
  const scale = useSharedValue(1);
  //alter number of drop spaces based off of number of people provided
  const numSections = people.length <= 2 ? 2: people.length <= 3 ? 3: 4;
  //values that assist in running/going back if back button selected
  const running = useRef(false)
  const cancelled = useRef(false)

  //get people names for each section
  const getPeople = async () => {
    try{
    const storedPeople = await AsyncStorage.getItem('people')
    setPeople(JSON.parse(storedPeople as string));
    console.log('People', people)
    } catch (error) {
      console.error('Error when gathering information: ', error)
    }
  }

  //for smoothly animated draggable
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    }));
    useEffect(() => {
      scale.value = withSpring(isActive ? 1.05 : 1);
  }, [isActive]);

  //add to cost to the total cost and initiate next card
  const assignDrop = (dropNumber: number, index: number) =>{
    //haptic on drop
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )

    //current cost + total of that droppable number to keep continuous total
    total.current[dropNumber] = total.current[dropNumber] + parseFloat(items[index].cost.substring(1));
    //update index
    setIndex(current => current + 1);

    //update history (for go back button)
    dropHistory.current.push({
      cardNumb: index,
      personNumb: dropNumber,
      cost: total.current[dropNumber],
    });
    
    //signal that the card has been dropped and the next can be generated
    if (resolver.current) {
      resolver.current();
      resolver.current = null;
    }

    //update current draggable card to null
    setCurrentCard(null)
  };
  

  //display the correct card using given index
  const dispCard = (index: number | null) => {
    setCurrentCard(index);
  };

  //function to fufill resolver promise and comtinue running process
  const callNext = () => {
    return new Promise<void>((resolve) => {
      resolver.current = resolve;
    });
  } ;

  //back button
  const goBack = () => {
    //haptic feedback
    Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
    )
    
    //get last card
    const lastCard = dropHistory.current.pop()

    //ensure not at start
    if (!lastCard) return;

    //remove amount from total of card dropped in
    total.current[lastCard.personNumb] -= lastCard.cost;
    //stop current run loop
    cancelled.current = true;

    //trip the promise to allow the run to continue
    if (resolver.current){
      resolver.current();
      resolver.current = null;
    }

    //reset relevent values
    setCurrentCard(lastCard.cardNumb)
    setIndex(lastCard.cardNumb);

    //finally, restart run from the last card to complete undo
    setTimeout(() => {
      run(lastCard.cardNumb)
    }, 100);
    
  }

  //function that controls all the running
  const run = async (startIndex = 0) => {
    if (running.current) return;

    running.current = true;
    const totalLen = Math.ceil(items.length);

    //for all items in the reciept/from where gone back to
    for (let i=startIndex; i<totalLen; i++){
      //stop if going back
      if (cancelled.current) {
        cancelled.current = false;
        running.current = false;
        return;
      }

      //display current card
      setIndex(i)
      dispCard(i)

      //wait for the card to be dropped into the correct section
      await callNext();
      setCurrentCard(null);
      //small delay to render removal
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    //go to next page once all items are added
    running.current = false;
    goToShareScreen();
  };

  //to display the people cards in a way that can be changed depending on the number of people - droppable so the card can be put in
  const dropSection = (i: number) => (
    <Droppable
    key={i}
    onDrop={() => assignDrop(i, index)} style={[styles.drop, {flex: 1, backgroundColor: defaultColours[i]}]}
    onActiveChange={(active) => setIsActive(active)}
    activeStyle={{
        backgroundColor: "rgba(88, 166, 255, 0.1)",
        borderColor: theme.dropColour,
        borderWidth: 2,
    }}
    >
    <Animated.View style={[styles.section, animatedStyle]}>
      <Text style={styles.text}>{people[i]?.name}</Text>
    </Animated.View>
  </Droppable>
  )

  //go to the share page and send total values
  const goToShareScreen = () => {
    //haptic feedback
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
    router.push({pathname: '/shareReciept', params: {mode: 'new', totals: JSON.stringify(total.current)}})
  };

  //run and get people on start of every page run
  useEffect(() => {
    run();
    getPeople();
  }, []);

  return (
    <GestureHandlerRootView>
      {/* alter theme switch */}
      <Pressable onPress={toggleTheme} style={styles.imageSec}>
        <Image style={styles.image} source={icon} />
      </Pressable>
      <Text style={styles.primaryText}>Drag the item to the person to assign it too</Text>
      <View style={styles.backButton}>
        <Button buttonTheme='backButton' label='go back' onPress={goBack} />
      </View>
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

const createStyles = (theme: typeof themes.default) => StyleSheet.create({
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
    top: '45%',
    alignItems: 'center',
    zIndex: 9999,
  },
  drag: {
    padding: 20,
    backgroundColor: theme.mainBackground,
    borderRadius: 9,
  },
  text: {
    color: theme.primaryTextColor,
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 30,
    padding: 5,
    alignSelf: 'center',
  },
  recieptText:{
    color: theme.primaryTextColor,
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 25,
    padding: 5,
    alignSelf: 'center',
  },
  primaryText: {
    color: theme.primaryTextColor,
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 30,
    padding: 15,
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
  },
  backButton: {
    position: 'absolute',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: '57%',
    alignItems: 'center',
    zIndex: 9998,
  },
  imageSec: {
    position: 'absolute',
    left: 15,
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
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