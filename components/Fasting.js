import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue } from 'firebase/database';
import { firebaseConfig } from '../utils/firebaseConfig';
import { BarChart } from "react-native-chart-kit";
import moment from 'moment';
import { useContext } from 'react';
import { AppStateContext } from '../AppStateContext';

// Initialize Firebase app and database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

ref(database,'fasting/')

// Define an object that contains fasting intervals in seconds
const INTERVALS = {
  '16:8': { fasting: 16 * 60 * 60 , eating: 8  * 60 * 60},
  '18:6': { fasting: 18 * 60 * 60, eating: 6 * 60 * 60 },
  '20:4': { fasting: 20 * 60 * 60, eating: 4 * 60 * 60 },
};

export default function Fasting() {
  const [interval, setInterval] = useState('16:8');
  const [isFasting, setIsFasting] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [fastingTimes, setFastingTimes] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const { totalTime, setTotalTime } = useContext(AppStateContext);
  

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  // Fetch fasting data from the database and update the state
  useEffect(() => {
    const fastingRef = ref(database, 'fasting');
    onValue(fastingRef, (snapshot) => {
      const data = snapshot.val();
      let fastingData = data
        ? Object.keys(data).map((key) => {
            const date = moment(key).format('MMM D, YYYY'); // Use the object name as the date
            const fasting = data[key];
            return Object.keys(fasting).map((key) => { // Map over the data to create an array of objects with date and fasted time
              const fastedTime = fasting[key].totalFastedTime;
              return {
                date: date,
                fastedTime: fastedTime,
              };
            });
          }).flat() // Use .flat() to flatten the nested arrays
        : [];
  
      // Group the data by date
      const groupedData = {};
      fastingData.forEach((fasting) => {
        const { date, fastedTime } = fasting;
        if (!groupedData[date]) {
          groupedData[date] = 0; // Initialize the total to 0
        }
        groupedData[date] += fastedTime; // Add the fasted time to the total
      });
  
      const fastingTime = Object.keys(groupedData).map((date) => ({
        date,
        fastedTime: groupedData[date],
      }));
  
      setFastingTimes(fastingTime);
      console.log(fastingTime);
      setTotalTime(fastingTime.reduce((total, time) => total + time.fastedTime, 0));
    });
  }, []);

  
  // a function to render the remaining time
  const renderTime = (remainingTime) => {
    // Calculate the number of hours, minutes, and seconds lef
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    // Return a JSX element that displays the remaining time in the format hh:mm:ss
    return (
      <Text style={{color: '#4FB6FC', fontSize: 20}}>
        {hours.toString().padStart(2, '0')}:
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </Text>
    );
  };

  // a function to handle the interval press
  const handleIntervalPress = (selectedInterval) => {
    setInterval(selectedInterval);
    setIsFasting(true);
    setIsRunning(false);
  };

  // Get the fasting and eating intervals from the INTERVALS object
  const { fasting, eating } = INTERVALS[interval];
  // Set the duration and onComplete callback based on the isFasting state
  const duration = isFasting ? fasting : eating;
  const onComplete = isFasting ? () => setIsFasting(false) : stopTimer;
  // Set the colors based on the isFasting state
  const colors = isFasting ? [ '#ffa726', '#FF974B', '#FFA500', '#FF553D' ] : ['#008000', '#00FF00', '#32CD32', '#90EE90'];

  // a function to handle the fasting complete
  const handleFastingComplete = () => {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    const totalFastedTime = isFasting ? fasting - remainingTime : eating - remainingTime;
    
    if (isFasting) {
      push(
        ref(database, `fasting/${dateString}`),{
          totalFastedTime
        }
      );
    }
    onComplete();
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <Text style={styles.title}>Intermittent Fasting Timer</Text>
        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
          {Object.keys(INTERVALS).map((key) => (
            <TouchableOpacity
              key={key}
              style={{
                marginHorizontal: 10,
                padding: 10,
                backgroundColor: interval === key ? '#2075FB' : 'gray',
                borderRadius: 10,
              }}
              onPress={() => handleIntervalPress(key)}
            >
              <Text style={{ color: 'white' }}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <CountdownCircleTimer
          key={interval + isFasting}
          isPlaying={isRunning}
          duration={duration}
          colors={colors}
          colorsTime={[20, 12, 6, 0]}
          size={Dimensions.get('window').width / 2}
          strokeWidth={26}
          onComplete={handleFastingComplete}
        >
          {({ remainingTime }) => renderTime(remainingTime)}
        </CountdownCircleTimer>
        <Text style={{ marginVertical: 10, color: '#4FB6FC', fontSize: 16 }}>{isFasting ? 'Fasting' : 'Eating'}</Text>
        <TouchableOpacity
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: isRunning ? 'red' : 'green',
            borderRadius: 10,
          }}
          onPress={isRunning ? stopTimer : startTimer}
        >
          <Text style={{ color: '#fff', fontFamily: 'RobotoCondensed_700Bold', fontSize: 18 }}>{isRunning ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 400, flex: 1, marginTop: 40 }}>
        <ScrollView horizontal>
          <BarChart
            data={{
              labels: fastingTimes.map((fasting) => fasting.date),
              datasets: [
                {
                  data: fastingTimes.map((fasting) => fasting.fastedTime),
                },
              ],
            }}
            width={Dimensions.get('window').width}
            height={220}
            yAxisSuffix={'h'}
            fromNumber={24}
            fromZero={true}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#f8781c",
              backgroundGradientTo: "#ffa726",
              backgroundGradientFromOpacity: 1,
              backgroundGradientToOpacity: 0.6,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            style={{
              marginTop: 8,
              borderRadius: 16,
              fontSize: 16,
            }}
          />
        </ScrollView>
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'flex-start' }}>
         <Text style={styles.fastedTime}>
            Total fasted time:{' '}
            {fastingTimes.reduce((sum, fasting) => sum + fasting.fastedTime, 0)} hours
          </Text>
        </View>
      </View>
  </View>
)};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#12131A'
  },
  title: {
    fontSize: 24, 
    color: '#4FB6FC',
    fontFamily: 'RobotoCondensed_700Bold',
    marginBottom: 10
  },
  upperContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 80
  },
  fastedTime: {
    textAlign: 'center', 
    color: '#4FB6FC',
    fontSize: 18,
    fontFamily: 'RobotoCondensed_400Regular',
  }
  
});
  
