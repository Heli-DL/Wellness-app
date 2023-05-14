import React, { useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { WaterHeader } from "./WaterHeader";
import { Fontisto } from "@expo/vector-icons";
import { styles } from "./styles";
import { theme } from "./styles/theme";
import Svg, { Circle, Path } from "react-native-svg";
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  createAnimatedPropAdapter,
  processColor,
} from "react-native-reanimated";
import { useContext } from "react";
import { AppStateContext } from "./AppStateContext";

const { width } = Dimensions.get("screen");
// Creates animated version of components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function WaterTracker() {
  // Animated values
  const heightAnimated = useSharedValue(100);
  const waveAnimated = useSharedValue(5);
  const buttonStrokeAnimated = useSharedValue(0);

  const [milliliters, setMilliliters] = useState(0);
  const { setPercentage } = useContext(AppStateContext);
  
  const buttonProps = useAnimatedProps(() => {
    // Define the animated properties for the button
    return {
      cx: 60, // Center x-coordinate of the button circle
      cy: 60, // Center y-coordinate of the button circle
      r: 40, // Radius of the button circle
      fill: theme.colors.blue100,
      strokeWidth: interpolate( // Width of the button circle stroke
        buttonStrokeAnimated.value,
        [0, 0.5, 1],
        [17, 40, 17]
      ),
      stroke: theme.colors.blue90,
      strokeOpacity: 0.5,
    };
  }
  , [], createAnimatedPropAdapter(
   (props) => {
     if (Object.keys(props).includes('fill')) {
       props.fill = {type: 0, payload: processColor(props.fill)}
     }
     if (Object.keys(props).includes('stroke')) {
       props.stroke = {type: 0, payload: processColor(props.stroke)}
     }
   },
   ['fill', 'stroke']));

  // Animated props for first wave
  const firstWaveProps = useAnimatedProps(() => {
    return {
      d: `
        M 0 0
        Q 35 ${waveAnimated.value} 70 0
        T 140 0
        T 210 0
        T 280 0
        T 350 0
        T 420 0
        V ${heightAnimated.value}
        H 0
        Z
    `,
    };
  });
 // Animated props for second wave
  const secondWaveProps = useAnimatedProps(() => {
    return {
      d: `
        M 0 0
        Q 45 ${waveAnimated.value + 5} 90 0
        T 180 0
        T 270 0
        T 360 0
        T 900 0
        T 540 0
        V ${heightAnimated.value}
        H 0
        Z
    `,
    };
  });

  const SVGProps = useAnimatedProps(() => {
    return {
      height: heightAnimated.value,
      viewBox: `0 0 ${width} ${heightAnimated.value}`,
    };
  });

  // Updates the percentage and milliliters
  function handleDrink() {
    buttonStrokeAnimated.value = 0;
    waveAnimated.value = 5;
  
    buttonStrokeAnimated.value = withTiming(1, {
      duration: 500,
      easing: Easing.ease,
    });
    waveAnimated.value = withRepeat(
      withTiming(17, {
        duration: 500,
        easing: Easing.ease,
      }),
      2,
      true
    );
    // Updates the height of the waves
    heightAnimated.value = withTiming(heightAnimated.value + 100, {
      duration: 1000,
      easing: Easing.ease,
    });
    // Updates the percentage
    const newPercentage = Math.round(heightAnimated.value * 0.1);
    setPercentage(newPercentage);
    // Updates the milliliters
    if (newPercentage !== 0) {
      const newMilliliters = (heightAnimated.value * 2.4).toFixed(0);
      setMilliliters(newMilliliters);
  }
}

  return (
    <View style={styles.container}>
      <WaterHeader ml={milliliters} />
      <AnimatedSvg width={width} animatedProps={SVGProps}>
        <AnimatedPath
          animatedProps={firstWaveProps}
          fill={theme.colors.blue100}
          transform="translate(0,10)"
        />

        <AnimatedPath
          animatedProps={secondWaveProps}
          fill={theme.colors.blue70}
          transform="translate(0,15)"
        />
      </AnimatedSvg>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleDrink}
          activeOpacity={0.7}
        >
          <Svg width="120" height="120">
            <AnimatedCircle animatedProps={buttonProps} />
          </Svg>
          <Fontisto
            name="blood-drop"
            size={32}
            color={theme.colors.blue90}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}