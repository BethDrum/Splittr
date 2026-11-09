import { useState } from "react";
import { Dimensions, LayoutChangeEvent, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector, GestureStateChangeEvent, GestureUpdateEvent, PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming, } from "react-native-reanimated";

interface SwipeGestureProps {
  children: React.ReactNode;
  onRemove: () => void;
}

export default function SwipeGesture({children, onRemove}: SwipeGestureProps) {
    //initialise nessesary values
    const initialTranslateX = useSharedValue(0);
    const currentTranslateX = useSharedValue(0);
    const deleteCardTranslateX = useSharedValue(0);
    const itemHeight = useSharedValue(0)
    const itemWidth = useSharedValue(0)
    const itemOpacity = useSharedValue(1);
    const deleteButtonWidth = useSharedValue(0);
    const screenWidth = Dimensions.get("window").width;

    //align delete button to given layout
    const DELETE_BUTTON_THRESHOLD = 0.15;
    const DELETE_THRESHOLD = 0.5;   
    const [isLayoutInitialised, setIsLayoutInitialised] = useState(false);

    const handleLayout = (e: LayoutChangeEvent) => { 
        if (!isLayoutInitialised) {
            const { width, height } = e.nativeEvent.layout;
            itemHeight.value = height;
            itemWidth.value = width;
            deleteButtonWidth.value = width * DELETE_BUTTON_THRESHOLD;
            setIsLayoutInitialised(true);
        }
    };

    //saves where the swipe starts to calculate movement
    const handleOnStart = () => {
        initialTranslateX.value = currentTranslateX.value;
    };

    //only allow swiping left
    const handleOnUpdate = (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
        const isSwipingLeft = event.translationX + initialTranslateX.value <= 0;
        if (isSwipingLeft) {
            currentTranslateX.value = event.translationX + initialTranslateX.value;
        }
    };

    //show delete button and delete item
    const handleOnEnd = (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
    ) => {
    'worklet';

    const translate =
        event.translationX + initialTranslateX.value;

    const deleteButtonPosition =
        -itemWidth.value * DELETE_BUTTON_THRESHOLD;

    const deleteThreshold =
        -itemWidth.value * DELETE_THRESHOLD;

    if (translate > deleteButtonPosition / 2) {
        currentTranslateX.value = withTiming(0, {
        easing: Easing.inOut(Easing.ease),
        });
    } else if (translate > deleteThreshold) {
        currentTranslateX.value = withTiming(deleteButtonPosition, {
        easing: Easing.inOut(Easing.ease),
        });
        initialTranslateX.value = deleteButtonPosition;
    } else {
        deleteItem();
    }
};

    //define functions to delete the item/set its position
    // const resetPosition = () => {
    //     currentTranslateX.value = withTiming(0, {
    //         easing: Easing.inOut(Easing.ease),
    //     });
    // };

    // const snapToDeleteButton = (deleteButtonThreshold: number) => {
    //     currentTranslateX.value = withTiming(deleteButtonThreshold, {
    //         easing: Easing.inOut(Easing.ease),
    //     });
    //     initialTranslateX.value = deleteButtonThreshold;
    // };

    const deleteItem = () => {
    'worklet';

    currentTranslateX.value = withTiming(
        -screenWidth,
        { easing: Easing.inOut(Easing.ease) }
    );

    deleteCardTranslateX.value = withTiming(
        -screenWidth,
        {
        easing: Easing.inOut(Easing.ease),
        duration: 600,
        },
        () => {
        itemHeight.value = withTiming(
            0,
            { easing: Easing.inOut(Easing.ease) },
            (finished) => {
            if (finished) {
                runOnJS(onRemove)();
            }
            }
        );
        }
    );
    };

    const onDeleteButtonPress = () => {
        deleteItem();
    };

        //setup swipe gesture
    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .activeOffsetY([-20, 20])
        .onStart(handleOnStart)
        .onUpdate(handleOnUpdate)
        .onEnd(handleOnEnd);


    //ensure animations are smooth
    const animatedCardStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: currentTranslateX.value }],
    }));

    const animatedDeleteCardStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: deleteCardTranslateX.value }],
    }));

    const animatedOnDeleteStyle = useAnimatedStyle(() => ({
        height: itemHeight.value,
        opacity: itemOpacity.value,
    }));

    //render
    return(
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[isLayoutInitialised ? animatedOnDeleteStyle : { height: 'auto' }]}>
                <Animated.View style={animatedCardStyle}>
                    <TouchableOpacity style={{ width: deleteButtonWidth.value }} onPress={onDeleteButtonPress}>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={animatedCardStyle} onLayout={handleLayout}>
                    {children}
                </Animated.View>
            </Animated.View>
        </GestureDetector>
    )
    }