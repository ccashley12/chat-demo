import React, { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ db, route, navigation, isConnected }) => {
    const { userID } = route.params;
    // Get user ID & background color
    const { name, backgroundColor } = route.params;
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
                    createdAt: new Date(doc.data().createdAt.toMillis())
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
    }

    // Provides GiftedChat with messages from sender and info about them
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
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
    }

    //Does not show InputToolbar when offline, not allowing user to send messages when offline
    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    }

return (
    <View style={[styles.container, { backgroundColor: backgroundColor || "FFFFFF" }]}>
        <GiftedChat
            messages={messages}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            onSend={messages => onSend(messages)}
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
    }
});

export default Chat;