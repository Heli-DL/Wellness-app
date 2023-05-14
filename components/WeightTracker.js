import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue } from 'firebase/database';
import { firebaseConfig } from '../utils/firebaseConfig';
import { LineChart } from "react-native-chart-kit";
import moment from 'moment';

// Initialize Firebase app and database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

ref(database,'weights/');

export default function WeightTracker() {
  const [weight, setWeight] = useState('');
  const [weights, setWeights] = useState([]);
  const [timeframe, setTimeframe] = useState('week');

  // Load weight data from the database on component mount and when timeframe changes
  useEffect(() => {
    const weightsRef = ref(database, 'weights');
    onValue(weightsRef, (snapshot) => {
      const data = snapshot.val();
      let weightData = data
      ? Object.keys(data).map((key) => ({
          date: moment(data[key].timestamp).format('MMM D, YYYY'),
          weight: data[key].weight,
        }))
      : [];
      setWeights(weightData);
    });
  }, [timeframe]);

  // Save weight to database when 'Save Weight' button is pressed
  const handleSaveWeight = () => {
    const timestamp = Date.now();
    push(
      ref(database, 'weights/'),{
      weight: weight,
      timestamp: timestamp,
    });
    setWeight('');
  };

  // Group weight data by date and format it for the chart
  const groupedByDate = weights.map((weight) => ({
    date: weight.date,
    weight: parseInt(weight.weight),
  }));

  // Define chart data
  const data = {
    labels: groupedByDate.map((dataPoint) => dataPoint.date),
    datasets: [
      {
        data: groupedByDate.map((dataPoint) => dataPoint.weight),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Weight Tracker</Text>
      </View>
      <View style={{ flex: 2, justifyContent: 'center', height: 400 }}>
        <ScrollView horizontal>
          {weights.length > 0 ? (
          <LineChart
            data={data}
            width={Dimensions.get("window").width} // from react-native
            height={300}
            yAxisSuffix="kg"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#f86a03",
              backgroundGradientTo: "#ffa726",
              backgroundGradientFromOpacity: 1,
              backgroundGradientToOpacity: 0.6,
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={{
              borderRadius: 16
            }}
          />
          ) : null}
        </ScrollView>
      </View>
      <View style={{ flex: 1, justifyContent: 'center',  alignItems: 'center' }}>
      <TextInput
        style={styles.textInput}
        placeholder='Enter your weight...'
        placeholderTextColor="#979BA0" 
        value={weight}
        onChangeText={setWeight}
        keyboardType='numeric'
      />
      <TouchableOpacity style={styles.button}
          onPress={handleSaveWeight}
          title='Save Weight'>
            <Text style={styles.buttonText}>Save Weight</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12131A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    marginTop: 20,
    color: '#4FB6FC',
    fontFamily: 'RobotoCondensed_700Bold'
  },
  textInput: {
    height: 50, 
    width: 150, 
    marginBottom: 10, 
    borderRadius: 10, 
    backgroundColor: '#292D3E', 
    paddingLeft: 10, 
    color: '#fff'
  },
  buttonGroup: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#4FB6FC',
    alignItems: 'center',
    margin: 15,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'RobotoCondensed_700Bold'
  },
});
  
