import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Home from './Home';
import Recipes from './Recipes';
import WaterTracker from './WaterTracker';
import WeightTracker from './WeightTracker';
import Fasting from './Fasting';
import * as SplashScreen from 'expo-splash-screen';

const Tab = createMaterialBottomTabNavigator();
SplashScreen.preventAutoHideAsync();

export default function MyTabs(props) {

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#2075FB"
      inactiveColor="grey"
      secondaryContainer= 'transparent'
      labelStyle={{ fontSize: 12 }}
      barStyle={{ backgroundColor: '#1C1C25',  }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Recipes"
        component={Recipes}
        options={{
          tabBarLabel: 'Recipes',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="food-variant" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Water"
        component={WaterTracker}
        options={{
          tabBarLabel: 'Water',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="water" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Weight"
        component={WeightTracker}
        options={{
          tabBarLabel: 'Weight',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="scale-bathroom" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Fasting"
        component={Fasting}
        options={{
          tabBarLabel: 'Fasting',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="timer" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

