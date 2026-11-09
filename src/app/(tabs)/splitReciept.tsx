import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Draggable, Droppable, DropProvider } from "react-native-reanimated-dnd";

export default function App() {
  return (
    <GestureHandlerRootView>
      <DropProvider>
        <View style={{flex: 1}}>
        <View style={styles.wrap}>
          <Droppable onDrop={(data) => console.log("Dropped:", data)} style={{flex: 1}}>
            <View
              style={[styles.section, {backgroundColor: "#C0DFF7"}, ]}
            >
              <Text style={styles.text}>Person 1</Text>
            </View>
          </Droppable>
          <Droppable onDrop={(data) => console.log("Dropped:", data)} style={{flex: 1}}>
            <View
              style={[styles.section, {backgroundColor: "#C8D3B7"}, ]}
            >
              <Text style={styles.text}>Person 2</Text>
            </View>
          </Droppable>
        </View>
        <View style={styles.wrap}>
          <Droppable onDrop={(data) => console.log("Dropped:", data)} style={{flex: 1}}>
            <View
              style={[styles.section, {backgroundColor: "#EBBCDD"}, ]}
            >
              <Text style={styles.text}>Person 3</Text>
            </View>
          </Droppable>
          <Droppable onDrop={(data) => console.log("Dropped:", data)} style={{flex: 1}}>
            <View
              style={[styles.section, {backgroundColor: "#EBE3B1"}, ]}
            >
              <Text style={styles.text}>Person 4</Text>
            </View>
          </Droppable>
          </View>
          </View>

          <Draggable data={{ id: "1", name: "Task 1" }} style={styles.drag}>
            <View>
              <Text style={styles.text}>Information</Text>
            </View>
          </Draggable>
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
    backgroundColor: "#e3f2fd", 
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: 100,
    marginLeft: -100,
    marginTop: -50,   
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 10,
  },
  text: {
    color: '#4F4F4F',
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 30,
    padding: 5,
    alignSelf: 'center',
  }
});