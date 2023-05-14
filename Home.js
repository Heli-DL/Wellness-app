import { StyleSheet, Text, View, Image } from 'react-native';
import { useContext } from "react";
import { AppStateContext } from "./AppStateContext";

export default function Home() {
  const { percentage, totalTime } = useContext(AppStateContext);

  return (
    <View style={styles.container}>
      <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
        <Text style={styles.title}>MyFitLife</Text>
        <Image
          source={require('./assets/logo.png')}
          style={{ width: 200, height: 200, marginTop: 20 }}
        />
      </View>
      <View style={{flex: 1.3 }}>
        <Text style={styles.text}>Daily water intake:</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
        <Text style={styles.text}>Total fasted time:</Text>
        <Text style={styles.percentage}>{totalTime ?? 0} h</Text>
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
    fontSize : 70,
    color: '#7dc7fa',
    fontFamily: 'RobotoCondensed_700Bold'
  },
  text: {
    fontSize: 20,
    color: '#7dc7fa',
    fontFamily: 'Roboto_400Regular',
  },
  percentage: {
    fontSize: 40,
    color: '#e66202',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'RobotoCondensed_400Regular',
  },
});