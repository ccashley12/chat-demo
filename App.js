import React, { useEffect, useState } from 'react';
import Chat from './components/Chat';
import Start from './components/Start';
import { LogBox, Alert } from 'react-native';

//Import navigator
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

//Import Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

//Import Async Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//Import NetInfo for internet connection
import { useNetInfo } from '@react-native-community/netinfo';

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCdgp7XE2Cw547f64uHmRFSCvhnUKWhPHU",
    authDomain: "chat-app-c062c.firebaseapp.com",
    projectId: "chat-app-c062c",
    storageBucket: "chat-app-c062c.firebasestorage.app",
    messagingSenderId: "770387458409",
    appId: "1:770387458409:web:f5764e4ff5f2236eef65f8"
};

  // Initilize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  // Initialize Firebase Storage handler
  const storage = getStorage(app);

  //Defines network connectivity status
  const connectionStatus = useNetInfo();

  const[isConnected, setIsConnected] = useState(connectionStatus.isConnected ?? false);

  //Alert if network connection is lost and regulate attempts to reconnect to Firebase db
  useEffect(() => {
    if (connectionStatus.isConnected !== null && connectionStatus.isConnected !== isConnected) {
      setIsConnected(connectionStatus.isConnected);

      const updateFirestoneConnection = async () => {
          try {
                if (connectionStatus.isConnected === false) {
                  Alert.alert('You are offline. You can read messages, but cannot send messages.');
                  await disableNetwork(db);
                } else {
                  await enableNetwork(db);
                }
          } catch (error) {
            console.error('Error managing Firestone network:', error);
          }
      };
      updateFirestoneConnection();
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen name="Chat">
          {props => 
            <Chat 
              isConnected={connectionStatus.isConnected} 
              db={db} 
              storage={storage}
              {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
