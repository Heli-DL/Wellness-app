import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import MyTabs from './MyTabs';
import AppStateProvider from './AppStateContext';
import {DefaultTheme} from 'react-native-paper';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Roboto_400Regular,
  Roboto_700Bold
} from '@expo-google-fonts/roboto';
import {
  RobotoCondensed_400Regular,
  RobotoCondensed_700Bold,
} from '@expo-google-fonts/roboto-condensed';

export default function App() {
  // Loading custom fonts
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    RobotoCondensed_400Regular,
    RobotoCondensed_700Bold,
  });

  // Preventing the splash screen from hiding before the fonts are loaded
  useEffect(() => {
    async function prepare() {  
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  // If the fonts are not yet loaded, return undefined
  if (!fontsLoaded) {
    return undefined;
  } else {
    // Otherwise, hide the splash screen
    SplashScreen.hideAsync();
  }

  return (
    <AppStateProvider>
      <NavigationContainer theme={theme}>
        <StatusBar style="auto" />
        <MyTabs />
      </NavigationContainer>
    </AppStateProvider>
  );
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    secondaryContainer: 'transparent', // Using transparent to disable the little highlighting oval from tab bar
  },
};
