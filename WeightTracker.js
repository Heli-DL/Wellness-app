import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
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

ref(database,'weights/')

export default function WeightTracker() {
  const [weight, setWeight] = useState('');
  const [weights, setWeights] = useState([]);

  useEffect(() => {
    const weightsRef = ref(database, 'weights/');
    onValue(weightsRef, snapshot => {
    const data = snapshot.val();
    const weights = data ? Object.keys(data).map(key => ({ key, ...data[key]}))
    : [];
    setWeights(weights);
    })
  }, []);

  const handleSaveWeight = () => {
    const timestamp = Date.now();

    push(
      ref(database, 'weights/'),{
      weight: weight,
      timestamp: timestamp,
    });
    setWeight('');
  }

  return (
    <View style={styles.container}>
      <Text>Enter your weight:</Text>
      <TextInput
        value={weight}
        onChangeText={setWeight}
        keyboardType='numeric'
      />
      <Button
        title='Save Weight'
        onPress={handleSaveWeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
  
