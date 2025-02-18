import React, { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ db, route, navigation, isConnected, storage }) => {

    // Get user ID & background color
    const { name, userID, backgroundColor } = route.params;

    // State to manage chat messages
    const [messages, setMessages] = useState([]);

    let unsubMessages;

    useEffect(() => {
        if (isConnected === true) {
            // unregister current onSnapshot() listener to avoid registering multiple listeners when
            // useEffect code is re-executed
            if (unsubMessages) unsubMessages();
            unsubMessages = null;
            navigation.setOptions({ title: name });
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, (docs) => {
                let newMessages = [];
                docs.forEach(doc => {
                    newMessages.push({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.createdAt?.toDate() || new Date()
                });
            });
            cacheMessages(newMessages);
            setMessages(newMessages);
            });
        } else loadCachedMessages();

        //Clean up code
        return () => {
          if (unsubMessages) unsubMessages();
        };
    }, [isConnected]);

    //Cache messages function
    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    };

    //Load cached messages when offline
    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
    };

    // Provides GiftedChat with messages from sender and info about them
    const onSend = (newMessages) => {
        const [message] = newMessages;
        addDoc(collection(db, "messages"), {
            _id: message._id,
            text: message.text || "",
            createdAt: serverTimestamp(),
            user: message.user,
            image: message.image || null,
            location: message.location || null,
          });
    };

    // Color for chat bubbles
    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#000'
                },
                left: {
                    backgroundColor: '#FFF'
                }
            }}
        />
    };

    //Does not show InputToolbar when offline, not allowing user to send messages when offline
    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    };

    //Creates the circle button allowing users to take actions in the chat
    const renderCustomActions  = (props) => {
        return <CustomActions userID={userID} name={name} storage={storage} onSend={(message) => onSend([message])} {...props} />;
    };

    //Checks if curerntMessage has location data and returns MapView
    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={styles.mapView}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                />
            );
        }
        return null;
    };

return (
    <View style={[styles.container, { backgroundColor: backgroundColor || "FFFFFF" }]}>
        <GiftedChat
            messages={messages}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            onSend={(messages) => onSend(messages)}
            renderActions={renderCustomActions}
            renderCustomView={renderCustomView}
            user={{
                _id: userID,
                name
            }}
        />
        {/* Ensures keyboard does not cover text input on devices with Android OS */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }

        {/* Ensures keyboard does not cover text input on devices with iOS */}
        { Platform.OS === 'ios' ? <KeyboardAvoidingView behavior="padding" /> : null }
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mapView: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
    },
});

export default Chat;