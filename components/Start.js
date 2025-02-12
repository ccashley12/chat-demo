import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const Start = ({ navigation }) => {
    // State to store users input name
    const [name, setName] = useState('');
    // State to store selected background color, with default value
    const [backgroundColor, setBackgroundColor] = useState("");
    // Colors for users to select for background 
    const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

    return (
        <KeyboardAvoidingView
            style={{ flex:1 }}
            // Ensures keyboard does not cover text input on device
             behavior={ Platform.OS === 'ios' ? "padding" : "height" }
        >
            <View style={styles.container}>
                <ImageBackground
                    source={require('../assets/Background.png')}
                    style={styles.background}
                >
                    <View style={styles.contentContainer}>
                        <View style={styles.inputContainer}>

                            {/* Name Input */}
                            <TextInput
                                style={styles.textInput}
                                value={name}
                                onChangeText={setName}
                                placeholder='Your name'
                                placeholderTextColor='#757083'
                            />

                            {/* Color selection */}
                            <Text style={styles.colorText}>Choose Background Color:</Text>
                            <View style={styles.colorContainer}>
                                {colors.map((color) => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[
                                            styles.colorOption,
                                            { backgroundColor: color },
                                            backgroundColor === color && styles.selectedColor,
                                        ]}
                                        onPress={() => setBackgroundColor(color)}
                                    />
                                ))}
                            </View>

                            {/* Start chatting button */}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() =>
                                    navigation.navigate("Chat", {
                                    name: name || "User",
                                    backgroundColor: backgroundColor,
                                    })
                                }
                            >
                                <Text style={styles.buttonText}>Start Chatting</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
                <Text>Hello Screen2!</Text>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
      resizeMode: "cover",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      paddingBottom: "30%", // This pushes the content up, effectively moving the white box down
    },
    inputContainer: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      width: "88%",
      alignItems: "center",
    },
    textInput: {
      width: "100%",
      padding: 15,
      borderWidth: 1,
      borderColor: "#757083",
      marginBottom: 20,
      fontSize: 16,
      fontWeight: "300",
      color: "#171717",
      opacity: 0.5,
    },
    colorText: {
      fontSize: 16,
      fontWeight: "300",
      color: "#171717",
      marginBottom: 10,
    },
    colorContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%",
      marginBottom: 20,
    },
    colorOption: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    selectedColor: {
      borderWidth: 2,
      borderColor: "#757083",
    },
    button: {
      backgroundColor: "#757083",
      padding: 15,
      borderRadius: 10,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
});

export default Start;