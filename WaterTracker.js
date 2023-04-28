import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LineChart } from 'react-native-svg-charts';

export default function WaterTracker() {
    const [waterIntake, setWaterIntake] = useState(0);
    const [waterIntakeHistory, setWaterIntakeHistory] = useState([0, 0, 0, 0, 0, 0, 0]);
  
    const handleDrinkWater = (amount) => {
      setWaterIntake(waterIntake + amount);
      setWaterIntakeHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory[6] += amount;
        return newHistory;
      });
    };
  
    const waterIntakeLitres = (waterIntake / 1000).toFixed(2); 

    const chartData = waterIntakeHistory.map((amount, index) => ({ x: index, y: amount }));
  
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Water Tracker</Text>
          <Text style={styles.text}>Current water intake: {waterIntakeLitres} L</Text>
          <View style={styles.chartContainer}>
            <LineChart
              style={{ height: 200 }}
              data={chartData}
              svg={{ stroke: '#2196F3' }}
              contentInset={{ top: 40, bottom: 40 }}
              yMin={0}
              yMax={Math.max(...waterIntakeHistory) + 100}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Drink 250 mL from a glass"
              onPress={() => handleDrinkWater(250)}
              icon={() => <Icon name="glass" size={20} color="#fff" />}
              style={styles.button}
            />
            <Button
              title="Drink 500 mL from a bottle"
              onPress={() => handleDrinkWater(500)}
              icon={() => <Icon name="bottle" size={20} color="#fff" />}
              style={styles.button}
            />
          </View>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      text: {
        fontSize: 18,
      marginBottom: 20,
    },
    chartContainer: {
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2196F3',
      borderRadius: 5,
      padding: 10,
      width: '45%',
    },
});