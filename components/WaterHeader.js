import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cups } from '../utils/cups';
import { styles } from '../styles/styles';
import { theme } from "../styles/theme";
import { useContext } from "react";
import { AppStateContext } from "../AppStateContext";

export function WaterHeader(props) {
  const { ml } = props;
  const { percentage } = useContext(AppStateContext);

  // Renders the header of the water tracker
  return (
    <View style={styles.header}>
      <Text style={styles.label}>
          Water tracker
      </Text>
      <View>
        <Text style={styles.ml}>
          {(ml / 1000).toFixed(2) } liters
        </Text>
      </View>
      <View style={styles.cups}>
        {
          cups.map(value => (
            <MaterialCommunityIcons
              key={String(value)}
              name="cup"
              size={32}
              color={percentage > value ? theme.colors.blue90 : theme.colors.gray80}
            />
          ))
        }
      </View>
      <Text style={styles.percentage}>
        {percentage}%
      </Text>
    </View>
  );
}