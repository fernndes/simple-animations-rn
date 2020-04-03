import React, { useRef, useState } from "react";
import { Animated, Text, View, StyleSheet, Button, ScrollView, Dimensions, TouchableOpacity, PanResponder } from "react-native";

const { height, width } = Dimensions.get("window");

export default function App() {

  const moveAnim = useRef(new Animated.ValueXY({ x: 50, y: 0 })).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const moveUp = () => {
    Animated.sequence([
      Animated.spring(moveAnim, {
        toValue: { x: 50, y: 200 }, // return to start
      }),
      Animated.timing(
        rotate,
        {
          toValue: 1,
          duration: 3000,
        }
      ),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 2000,
        }),
        Animated.timing(moveAnim, {
          toValue: { x: 200, y: 200 }, // return to start
          duration: 2000,
        })
      ])

    ], {useNativeDriver: true}).start()
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        { dx: 0, dy: pan.y }, // { dx: pan.x, dy: pan.y } -> Move para qualquer direção e volta ao centro

      ]),
      onPanResponderRelease: () => {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 15, tension: 9, useNativeDriver: true }).start();
      }
    })
  ).current;

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })
  return (
    <Animated.View style={{ marginTop: 50 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, padding: 20 }}>
        <Animated.View style={[{ width: 60, height: 60, backgroundColor: 'blue' }, moveAnim.getLayout(), { transform: [{ rotate: spin }] }, {opacity: fadeAnim}]}>
          <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={moveUp}><Text style={{color: 'white'}}>Click</Text></TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={{
            transform: [{ translateY: pan.y.interpolate({ inputRange: [0, 300], outputRange: [0, 300], extrapolate: 'clamp' }) }] // { translateX: pan.x }, 
          }}
          {...panResponder.panHandlers}
        >          
          <View style={styles.box}><Text style={{color: 'white'}}>Push</Text></View>
        </Animated.View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold"
  },
  box: {
    height: 50,
    width: 50,
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
