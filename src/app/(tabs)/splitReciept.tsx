import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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

  const assignDrop = (dropNumber: number, index: number) =>{
    //log

    //remove pound sign

    //current cost + to total of that number
    total[dropNumber] = total[dropNumber] + parseFloat(items[index].cost.substring(1));

    //log total
    console.log(parseFloat(items[index].cost.substring(1)));
    setIndex(current => current + 1);
    console.log(total[dropNumber])
  }


  return (
    <GestureHandlerRootView>
      <DropProvider>
        <View style={{flex: 1}}>
        <View style={styles.wrap}>
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
          </View>
            {items.map((item,) => (
              <Draggable data={index} style={styles.drag}>
                <Text style={styles.recieptText}>{item.food}............ {item.cost} </Text>
              </Draggable>
            ))};
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
    padding: 20, 
    backgroundColor: "#FFFDF2", 
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: 100,
    marginLeft: -100,
    marginTop: -50,   
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 10,
    alignSelf: 'center',
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
    fontSize: 20,
    padding: 5,
    alignSelf: 'center',
  }
});