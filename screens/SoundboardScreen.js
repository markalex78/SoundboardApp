import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const soundUris = {
    beat1: require('../assets/sounds/beat1.mp3'),
    beat2: require('../assets/sounds/beat2.mp3'),
    beat3: require('../assets/sounds/beat3.mp3'),
    beat4: require('../assets/sounds/beat4.mp3'),
    beat5: require('../assets/sounds/beat5.mp3'),
    beat6: require('../assets/sounds/beat6.mp3'),
};

export default function SoundboardScreen() {
    const [currentSound, setCurrentSound] = useState(null);
    const [recording, setRecording] = useState(null);
    const [recordedUris, setRecordedUris] = useState([]);
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    useEffect(() => {
        (async () => {
            await requestPermission();
        })();
    }, []);

    const playSound = async (soundUri) => {
        if (currentSound) {
            await currentSound.unloadAsync();
        }
        const { sound } = await Audio.Sound.createAsync(soundUri);
        setCurrentSound(sound);
        await sound.playAsync();
    };

    const handleStopPlaying = async () => {
        if (currentSound) {
            await currentSound.stopAsync();
            await currentSound.unloadAsync();
            setCurrentSound(null);
        }
    };

    const startRecording = async () => {
        if (permissionResponse.status !== 'granted') {
            await requestPermission();
        }
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });
        const { recording: newRecording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(newRecording);
    };

    const stopRecording = async () => {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setRecordedUris(oldUris => [...oldUris, uri].slice(-3)); // Keep the latest three recordings
    };

    const handleRecordPress = async () => {
        if (recording) {
            await stopRecording();
        } else {
            await startRecording();
        }
    };

    const playRecordedSound = async (index) => {
        if (recordedUris[index]) {
            if (currentSound) {
                await currentSound.unloadAsync();
            }
            const { sound } = await Audio.Sound.createAsync({ uri: recordedUris[index] });
            setCurrentSound(sound);
            await sound.playAsync();
        }
    };

    const deleteSound = (index) => {
        setRecordedUris(currentUris => currentUris.filter((_, i) => i !== index));
    };

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.row}>
                    {Object.keys(soundUris).slice(0, 3).map((key, index) => (
                        <TouchableOpacity key={index} style={styles.playButton} onPress={() => playSound(soundUris[key])}>
                            <Ionicons name="play-circle" size={50} color="black" />
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.row}>
                    {Object.keys(soundUris).slice(3, 6).map((key, index) => (
                        <TouchableOpacity key={index} style={styles.playButton} onPress={() => playSound(soundUris[key])}>
                            <Ionicons name="play-circle" size={50} color="black" />
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity style={styles.stopButton} onPress={handleStopPlaying}>
                    <Text style={styles.stopButtonText}>Stop Playing</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.recordButton} onPress={handleRecordPress}>
                <Text style={styles.recordButtonText}>{recording ? 'Stop Recording' : 'Record Sound'}</Text>
            </TouchableOpacity>

            <View style={styles.bottomContainer}>
                {recordedUris.map((uri, index) => (
                    <View key={index} style={styles.soundButtonContainer}>
                        <TouchableOpacity
                            style={styles.soundButton}
                            onPress={() => playRecordedSound(index)}
                            disabled={!uri}
                        >
                            <Text>Sound {index + 1}</Text>
                        </TouchableOpacity>
                        <Text style={styles.deleteText} onPress={() => deleteSound(index)}>Delete</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    topContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 10,
    },
    playButton: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        borderRadius: 40,
    },
    stopButton: {
        width: 150,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: 25,
        marginTop: 20,
    },
    stopButtonText: {
        color: 'white',
        fontSize: 20,
    },
    recordButton: {
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: 25,
        marginVertical: 20,
    },
    recordButtonText: {
        color: 'white',
        fontSize: 20,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    soundButtonContainer: {
        alignItems: 'center',
    },
    soundButton: {
        width: 100,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        borderRadius: 10,
    },
    deleteText: {
        fontSize: 20,
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 10,
    },
});
