// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SoundboardScreen from './screens/SoundboardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Soundboard" component={SoundboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
