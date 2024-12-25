import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { mediaDevices, MediaStream, RTCPeerConnection } from 'react-native-webrtc';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import { styles } from './styles';  // Import the styles from the styles.ts

interface AudioProcessorProps {
  navigation: any;
  route: any;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({ route }) => {
  const { song } = route.params;
  const [backgroundTrack, setBackgroundTrack] = useState<Sound | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [userAudioStream, setUserAudioStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [recordedFile, setRecordedFile] = useState<string | null>(null);

  useEffect(() => {
    const initializeAudio = async () => {
      const track = new Sound(song?.audioFile, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Error loading background music', error);
        } else {
          setBackgroundTrack(track);
        }
      });

      const peer = new RTCPeerConnection();
      setPeerConnection(peer);

      AudioRecord.init({
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        audioSource: 6,
        wavFile: 'test.wav',
      });

      return () => {
        track?.release();
        peer?.close();
      };
    };

    initializeAudio();
  }, [song?.audioFile]);

  const playBackgroundMusic = () => {
    backgroundTrack?.play(() => {
      backgroundTrack?.setNumberOfLoops(-1);
    });
    setIsMusicPlaying(true);
  };

  const stopBackgroundMusic = () => {
    backgroundTrack?.stop(() => {
      console.log('Background music stopped');
    });
    setIsMusicPlaying(false);
  };

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await mediaDevices.getUserMedia({ audio: true });
    setUserAudioStream(stream);

    const audioTrack = stream.getAudioTracks()[0];
    peerConnection?.addTrack(audioTrack);

    AudioRecord.start();
    playBackgroundMusic();
  };

  const stopRecording = () => {
    setIsRecording(false);

    userAudioStream?.getTracks().forEach(track => track.stop());
    peerConnection?.close();

    AudioRecord.stop().then((audioFilePath) => {
      console.log('Audio file recorded at:', audioFilePath);
      setRecordedFile(audioFilePath);
    });
  };

  const playRecordedAudio = () => {
    if (recordedFile) {
      const filePath = `file://${recordedFile}`;
      const track = new Sound(filePath, '', (error) => {
        if (error) {
          console.log('Error loading recorded audio:', error);
          return;
        }
        track.play(() => {
          console.log('Recorded audio played');
          track.release();
        });
      });
    } else {
      console.log('No audio file recorded');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{song?.title}</Text>
      <Text style={styles.artist}>{song?.artist}</Text>

      <TouchableOpacity
        style={[styles.button, isRecording && styles.buttonActive]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isMusicPlaying && styles.buttonActive]}
        onPress={isMusicPlaying ? stopBackgroundMusic : playBackgroundMusic}
      >
        <Text style={styles.buttonText}>
          {isMusicPlaying ? 'Stop Background Music' : 'Play Background Music'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={playRecordedAudio}
      >
        <Text style={styles.buttonText}>Play Recorded Audio</Text>
      </TouchableOpacity>

      <Text style={styles.statusText}>
        {`Recording ${isRecording ? 'In Progress' : 'Stopped'}`}
      </Text>
    </View>
  );
};

export default AudioProcessor;
