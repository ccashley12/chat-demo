import React, { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
    const { name, backgroundColor } = route.params;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Set navigation bar title to user's name
        navigation.setOptions({ title: name })
        setMessages([
            {
                _id: 1,
                text: "Hello Developer",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: "https://placeimg.com/140/10/any",
                },
            },
            {
                _id: 2,
                text: 'This is a system message',
                createdAt: new Date(),
                system: true,
            },
        ]);
    }, []);

    // Provides GiftedChat with messages from sender and info about them
    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
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
                _id: 1,
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
        flex: 1,
    },
});

export default Chat;