import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CustomActions = ({ name, wrapperStyle, iconTextStyle, onSend, userID, storage }) => {
    const actionSheet = useActionSheet();

    const onActionPress = () => {
        const options = ['Choose from albums', 'Take a Photo', 'Share Your Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;

        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        console.log('User want to pick an image');
                        return;
                    case 1:
                        takePhoto();
                        console.log('User want to take a photo');
                        return;
                    case 2:
                        getLocation();
                        console.log('User wants to share their location');
                    default:
                }
            },
        );
    };

    //Allow access to users' device photo library
    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions?.granted) {
          let result = await ImagePicker.launchImageLibraryAsync();
          if (!result.canceled) {
            await uploadAndSendImage(result.assets[0].uri);
          }
        } else {
            Alert.alert('Permissions have not been granted!');
        }
    };
    
    //Allow access to users' device camera
    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions haven't been granted.");
        }
    };
    
    //Allow acces to get users' location
    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
          const location = await Location.getCurrentPositionAsync({});
          if (location) {
                onSend({
                    _id: `${new Date().getTime()}-${userID}`,
                    user: { _id: userID, name },
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else { Alert.alert("Error occurred while fetching location");
            }
        } else { Alert.alert("Permissions haven't been granted.");
        }
    };

    // Generate a unique reference for the uploaded image
    const generateReference = (uri) => {
        const timeStamp = new Date().getTime();
        const imageName = uri.split("/").pop();
        return `${userID}-${timeStamp}-${imageName}`;
    };

    // Upload the image to Firebase Storage and send it
    const uploadAndSendImage = async (imageURI) => {
        try {
            const uniqueRefString = generateReference(imageURI);
            const newUploadRef = ref(storage, uniqueRefString);
            const response = await fetch(imageURI);
            const blob = await response.blob();
            await uploadBytes(newUploadRef, blob);
            const imageURL = await getDownloadURL(newUploadRef);
            onSend({
              _id: `${new Date().getTime()}-${userID}`,
              user: { _id: userID, name }, // Dynamically use the user's actual name
              image: imageURL,
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            Alert.alert("Error uploading image. Please try again.");
          }
    };

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={onActionPress}
        >
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 16,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

export default CustomActions;