import { useRef, useState } from "react";
import { Animated, PanResponder } from "react-native";


//for the reciept card that holds one data after another
export default function splitReciept(){
    //ref to store position of card
    const position = useRef(new Animated.ValueXY()).current;

    //track the card if its dragged
    const [dragging, setDragging] = useState(false);

    //create a pan responder to handle touch events
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                //when touch gesture starts, dragging = true
                setDragging(true);
            },
            onPanResponderMove: Animated.event(
                [
                    null,
                    {
                        dx: position.x,
                        dy: position.y,
                    }
                ],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                //when touch gesture released, dragging = false
                setDragging(false);
            },
        })
    ).current;

    return(
        <Animated.View
            // style={[styles.card, {transform:position.getTranslateTransform(), opacity: dragging ? 0.8 : 1,},
            // ]}
            {...panResponder.panHandlers}
        >
            {/* <Text style={styles.mainText}>{content}</Text> */}
        </Animated.View>
    );
};

// const App = () => {
//     return{
//         <DragAndDropCard
//         heading="test"
//         paragraph="test"
//         />
//     }
// }

// const styles = StyleSheet.create({
//     card: {
//         width: '90%',
//         height: 100,
//         backgroundColor: '#FFF',
//         justifyContent: 'center',
//         alignItems: 'flex-start',
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         borderRadius: 10,
//         marginBottom: 10,
//         elevation: 5,
//     },
//     heading: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         color: "green",
//         marginBottom: 6,
//     },
// });