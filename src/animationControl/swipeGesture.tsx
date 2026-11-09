import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface SwipeGestureProps {
  children: React.ReactNode;
  onRemove: () => void;
  onOpen: (row: SwipeableMethods | null) => void;
}

//row that swipes
function DeleteAction({
  drag, onPress,
  }: {
    drag: SharedValue<number>;
    onPress: () => void;
  }) {
    //drag is negative as going left
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: drag.value + 80 }],
    }));

    return (
      <Reanimated.View style={[styles.actionWrap, animatedStyle]}>
        <Pressable style={styles.action} onPress={onPress}>
          <Text style={styles.actionText}>Delete</Text>
        </Pressable>
      </Reanimated.View>
    );
  }

  export default function SwipeGesture({ children, onRemove, onOpen }: SwipeGestureProps) {
    const rowRef = useRef<SwipeableMethods | null>(null);

    return (
    <Swipeable
      friction={2}
      rightThreshold={40} //how far before delete
      overshootRight={false} //no rubber band past the action
      onSwipeableWillOpen={() => {
        onOpen(rowRef.current);
      }}
      renderRightActions={(_progress, drag) => (
        <DeleteAction
          drag={drag}    
          onPress={onRemove}
        />
      )}
    >
    <View style={styles.swipeCard}>
      {children}
    </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  actionWrap: {
    width: 80,
  },
  action: {
    flex: 1,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  swipeCard: {
    backgroundColor: '#D4E0F3'
  }
});