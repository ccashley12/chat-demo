import Chat from './components/Chat';
import Start from './components/Start';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { LogBox } from 'react-native';
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
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
