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

export default function App() {
  //setup empty varaibles for all people
  const total: number[] = Array(4)
  //index
  const [index, setIndex ]= useState(0);
  //for await to function
  const resolver = useRef<(() => void) | null>(null);
  //for card to display
  const [currentCard, setCurrentCard] = useState<number | null>(null);
  //for router to take to next page on end
  const router = useRouter();

  //recieve data
  const { recieptItems } = useLocalSearchParams();
  const items: ReceiptItem[] = JSON.parse(recieptItems as string);
  
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
    total[dropNumber] = total[dropNumber] + parseFloat(items[index].cost.substring(1));

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
    router.push({pathname: '/(tabs)/shareReciept', params: {totals: JSON.stringify(total)}})
  };

  //function that controls all the running
  const run = async () => {
    const totalLen = Math.ceil(items.length)
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


  useEffect(() => {
      run();
    }, []);


  return (
    <GestureHandlerRootView>
      <DropProvider>
        <View style={{flex: 1}}>
        <View style={styles.wrap}>
          {/* 4 sections for the draggable (reciept) section */}
          <Droppable
            onDrop={() => assignDrop(1, index)} style={{flex: 1, backgroundColor: '#C0DFF7'}}
            onActiveChange={(active) => setIsActive(active)}
            activeStyle={{
                backgroundColor: "rgba(88, 166, 255, 0.1)",
                borderColor: "#58a6ff",
                borderWidth: 2,
            }}
            >
            <Animated.View style={[styles.section, animatedStyle]}>
              <Text style={styles.text}>Person 1</Text>
            </Animated.View>
          </Droppable>
          <Droppable
            onDrop={() => assignDrop(2, index)} style={{flex: 1, backgroundColor: '#C8D3B7'}}
            onActiveChange={(active) => setIsActive(active)}
            activeStyle={{
                backgroundColor: "rgba(88, 166, 255, 0.1)",
                borderColor: "#58a6ff",
                borderWidth: 2,
            }}
            >
            <Animated.View style={[styles.section, animatedStyle]}>
              <Text style={styles.text}>Person 2</Text>
            </Animated.View>
          </Droppable>
        </View>
        <View style={styles.wrap}>

          <Droppable
            onDrop={() => assignDrop(3, index)} style={{flex: 1, backgroundColor: '#EBBCDD'}}
            onActiveChange={(active) => setIsActive(active)}
            activeStyle={{
                backgroundColor: "rgba(88, 166, 255, 0.1)",
                borderColor: "#58a6ff",
                borderWidth: 2,
            }}
            >
            <Animated.View style={[styles.section, animatedStyle]}>
              <Text style={styles.text}>Person 3</Text>
            </Animated.View>
          </Droppable>

          <Droppable
          onDrop={() => assignDrop(4, index)} style={{flex: 1, backgroundColor: '#EBE3B1'}}
          onActiveChange={(active) => setIsActive(active)}
          activeStyle={{
              backgroundColor: "rgba(88, 166, 255, 0.1)",
              borderColor: "#58a6ff",
              borderWidth: 2,
          }}
          >
          <Animated.View style={[styles.section, animatedStyle]}>
              <Text style={styles.text}>Person 4</Text>
          </Animated.View>
            </Droppable>
          
          {/* draggable reciept date */}

          {currentCard !== null && (
            <Draggable data={currentCard} style={styles.drag}>
              <Text style={styles.recieptText}>{items[index].food}............ {items[index].cost} </Text>
            </Draggable>
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
    flexDirection: 'row',
  },

  section: {
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  drag: {
    //general styling
    padding: 20, 
    backgroundColor: "#FFFDF2", 
    position: 'absolute',
    borderRadius: 9,
    // position
    // justifyContent: 'center',
    // alignItems: 'center',
     transform: [
      { translateX: -150 }, // half width
      { translateY: -100 }, // half height
    ],
    zIndex: 1000,
    marginHorizontal: '20%',
    marginVertical: '-5%',
    // elevation: 1000,
    // alignSelf: 'center',
    // marginTop: '50%'
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
  }
});