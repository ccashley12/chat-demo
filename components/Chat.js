import React, { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';

const Chat = ({ db, route, navigation }) => {
    const { userID } = route.params;
    // Get user ID & background color
    const { name, backgroundColor } = route.params;
    // State to manage chat messages
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        navigation.setOptions({ title: name });
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(q, (docs) => {
            let newMessages = [];
            docs.forEach(doc => {
                newMessages.push({
                id: doc.id,
                ...doc.data(),
                createdAt: new Date(doc.data().createdAt.toMillis())
            })
          })
          setMessages(newMessages);
        })
        //Clean up code
        return () => {
          if (unsubMessages) unsubMessages();
        }
       }, []);

    // Provides GiftedChat with messages from sender and info about them
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
      }

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

return (
    <View style={[styles.container, { backgroundColor: backgroundColor || "FFFFFF" }]}>
        <GiftedChat
            messages={messages}
            renderBubble={renderBubble}
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