// components/SoundButton.js
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

const SoundButton = ({ soundUri, label, onStop }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

  async function playSound() {
    // Unload any previously loaded sound first
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(soundUri);
    setSound(newSound);
    await newSound.playAsync();
  }

  useEffect(() => {
    // Cleanup and unload the sound when the component is unmounted
    return sound
      ? () => {
          console.log(`Unloading Sound: ${label}`);
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    // Stop the sound if the onStop prop is true
    if (onStop) {
      console.log(`Stopping Sound: ${label}`);
      sound?.stopAsync();
    }
  }, [onStop]);

  return (
    <TouchableOpacity style={styles.button} onPress={playSound}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default SoundButton;
