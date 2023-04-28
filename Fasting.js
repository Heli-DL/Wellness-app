import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue } from 'firebase/database';
import { API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

ref(database,'fasting/')

const INTERVALS = {
  '16:8': { fasting: 16  , eating: 8  },
  '18:6': { fasting: 18 * 60 * 60, eating: 6 * 60 * 60 },
  '20:4': { fasting: 20 * 60 * 60, eating: 4 * 60 * 60 },
};

export default function Fasting() {
  const [interval, setInterval] = useState('16:8');
  const [isFasting, setIsFasting] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [fastingTimes, setFastingTimes] = useState({});
  const [remainingTime, setRemainingTime] = useState(0);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  useEffect(() => {
    const fastingRef = ref(database, 'fasting/');
    onValue(fastingRef, snapshot => {
      setFastingTimes(snapshot.val() || {});
    });

    return () => {
      ref.off('value');
    };
  }, []);

  const renderTime = (remainingTime) => {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;
    return (
      <Text>
        {hours.toString().padStart(2, '0')}:
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </Text>
    );
  };

  const handleIntervalPress = (selectedInterval) => {
    setInterval(selectedInterval);
    setIsFasting(true);
    setIsRunning(false);
  };

  const { fasting, eating } = INTERVALS[interval];
  const duration = isFasting ? fasting : eating;
  const onComplete = isFasting ? () => setIsFasting(false) : stopTimer;
  const colors = isFasting ? ['#FFA500'] : ['#008000'];

  const handleFastingComplete = () => {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    const totalFastedTime = isFasting ? fasting - remainingTime : eating - remainingTime;
  
    database().ref(`fasting/${dateString}`).set(totalFastedTime);
    isFasting ? () => setIsFasting(false) : stopTimer;
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Intermittent Fasting Timer</Text>
      <View style={{ flexDirection: 'row', marginVertical: 20 }}>
        {Object.keys(INTERVALS).map((key) => (
          <TouchableOpacity
            key={key}
            style={{
              marginHorizontal: 10,
              padding: 10,
              backgroundColor: interval === key ? 'blue' : 'gray',
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
        onComplete={handleFastingComplete}
      >
        {({ remainingTime }) => renderTime(remainingTime)}
      </CountdownCircleTimer>
      <Text style={{ marginVertical: 20 }}>{isFasting ? 'Fasting Time' : 'Eating Time'}</Text>
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: isRunning ? 'red' : 'green',
          borderRadius: 10,
        }}
        onPress={isRunning ? stopTimer : startTimer}
      >
    <Text style={{ color: 'white' }}>{isRunning ? 'Stop' : 'Start'}</Text>
  </TouchableOpacity>
  <View>
      {Object.entries(fastingTimes).map(([date, fastedTime]) => (
        <View key={date}>
          <Text>{date}</Text>
          <Text>{fastedTime / 3600} hours</Text>
        </View>
      ))}
    </View>
  </View>
)};