import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Sound from "react-native-sound";
import { FIRESTORE_DB } from '../../../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import Icon from "react-native-vector-icons/FontAwesome5";
import theme from '../../../font';
import { CommonActions } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const BookPage = ({route, navigation}) => {
  const backgroundImages = [
    require('../../asset/BOOK_BG/BG1.png'),
    require('../../asset/BOOK_BG/BG2.png'),
    require('../../asset/BOOK_BG/BG3.png'),
    require('../../asset/BOOK_BG/BG4.png'),
    require('../../asset/BOOK_BG/BG5.png'),
    require('../../asset/BOOK_BG/BG6.png'),
  ];
  const [audioDuration, setAudioDuration] = useState(0);
  const [textColor, setTextColor] = useState('black');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const firestore = FIRESTORE_DB;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [textData, setTextData] = useState([]);
  const [sound, setSound] = useState();
  const {book, level} = route.params;
  const textRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "DataBook", level, 'child', book, 'child'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        data.sort((a, b) => a.id - b.id);
        console.log('data', data);
        setTextData(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  const textAnimation = isAudioPlaying ? 'pulse' : ''; // Gantilah 'pulse' dengan animasi yang Anda inginkan

  // Memantau perubahan isAudioPlaying
  useEffect(() => {
    if (isAudioPlaying) {
      // Setel isAudioPlaying menjadi false setelah audio selesai
      const audioDuration = 5000; // Gantilah dengan durasi audio sebenarnya
      setTimeout(() => {
        setIsAudioPlaying(false);
      }, audioDuration);
    }
  }, [isAudioPlaying]);
  const playSound = (url) => {
    const audio = new Sound(url, null, (error) => {
      if (error) {
        console.log("Error loading sound: ", error);
        return;
      }
      // Setel durasi audio ke state audioDuration
      setAudioDuration(audio.getDuration());
      
      audio.play(() => {
        audio.release();
      });
    });
    setSound(audio);
  };
  
  useEffect(() => {
    if (isAudioPlaying) {
      setTimeout(() => {
        setIsAudioPlaying(false);
      }, (audioDuration + 1)*1000); // Konversi durasi audio dari detik ke milidetik
    }
  }, [isAudioPlaying, audioDuration]);

  const resetAnimatedWords = () => {
    setAnimatedWords([]);
  };
  const handleBack = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      resetAnimatedWords(); // Reset animatedWords when going back
    }
  };
  const handleNext = () => {
    if (currentPageIndex < textData.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      resetAnimatedWords(); // Reset animatedWords when going to the next page
    }
  };

  const currentPage = textData[currentPageIndex];
  const currentBackgroundImage = backgroundImages[currentPageIndex % backgroundImages.length];
  useEffect(() => {
    return () => {
      if (sound) {
        sound.stop();
        sound.release();
      }
    };
  }, [sound]);
  const handleGoHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0, // Set index ke 0
        routes: [{ name: 'Home' }], // Nama halaman utama
      })
    );
  };
  const [animatedWords, setAnimatedWords] = useState([]);
  useEffect(() => {
    if (isAudioPlaying && currentPage.text) {
      const words = currentPage.text.split(' ');

      const animateWords = async () => {
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          setAnimatedWords((prevWords) => [...prevWords, word]);
          await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust the duration as needed
        }
      };

      setAnimatedWords([]); // Clear previous animated words
      animateWords();
    }
  }, [isAudioPlaying]);
  return (
    <ImageBackground source={currentBackgroundImage} style={styles.container}>
      <Text style={styles.title}>{book}</Text>
      {currentPage ? (
        <>
          <View style={[styles.card, styles.shadowProp, { width: windowWidth * 0.9, height: windowHeight * 0.7, borderRadius: windowWidth * 0.1 }]}>
            {currentPage.image ? (
              <Image
                source={{ uri: currentPage.image }}
                style={{ width: windowWidth * 0.8, height: windowHeight * 0.55 }}
                resizeMode="stretch"
              />
            ) : (
              <Text style={{ fontFamily: theme.font.semibold, color: 'black', fontSize: 12 }}>Loading..</Text>
            )}
            {currentPage.text ? (
              <View style={{ flexDirection: 'row', bottom: 25, alignItems: 'center', justifyContent: 'center', width: windowWidth * 0.85, flexWrap: 'wrap', paddingHorizontal: 10 }}>
                {animatedWords.map((word, index) => (
                  <Animatable.Text
                    key={index}
                    animation={isAudioPlaying ? 'pulse' : undefined}
                    duration={3000}
                    style={{
                      fontFamily: theme.bookFont.regular,
                      fontSize: 25,
                      color: isAudioPlaying ? 'black' : 'black',
                      textAlign: 'center',
                    }}
                  >
                    {word}{' '}
                  </Animatable.Text>
                ))}
              </View>
            ) : (
              <Text></Text>
            )}
          </View>
          <Text style={styles.pageText}>
            Halaman <Text style={{ fontFamily: theme.font2.bold, fontSize: 15, color:'black' }}>{currentPageIndex + 1}</Text>/ <Text style={{ fontWeight: 'bold' }}>{textData.length}</Text>
          </Text>
          <View style={{ width: windowWidth * 0.8, position: 'absolute', bottom: windowHeight * 0.13 }}>
            {/* ... tombol lainnya ... */}
            {currentPageIndex > 0 && (
              <TouchableOpacity
                style={[styles.button, styles.shadowProp, { width: windowWidth * 0.16, borderRadius: windowWidth * 0.05, height: windowHeight * 0.09, alignSelf: 'flex-start', position: 'absolute' }]}
                onPress={handleBack}
              >
                <Text style={styles.buttonText}><Icon size={25} name="chevron-left" /></Text>
              </TouchableOpacity>
            )}
            {currentPage.audio && (
              <TouchableOpacity
                style={[styles.button, styles.shadowProp, { width: windowWidth * 0.16, borderRadius: windowWidth * 0.05, height: windowHeight * 0.09, position: 'absolute', alignSelf: 'center' }]}
                onPress={() => {
                  playSound(currentPage.audio);
                  setIsAudioPlaying(true); // Setel isAudioPlaying menjadi true saat audio diputar
                }}
              >
                <Text style={styles.buttonText}><Icon size={25} name="volume-up" /></Text>
              </TouchableOpacity>
            )}
            {currentPageIndex < textData.length - 1 ? (
              <TouchableOpacity
                style={[styles.button, styles.shadowProp, { width: windowWidth * 0.16, borderRadius: windowWidth * 0.05, height: windowHeight * 0.09, position: 'absolute', alignSelf: 'flex-end' }]}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}><Icon size={25} name="chevron-right" /></Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.shadowProp, { width: windowWidth * 0.16, borderRadius: windowWidth * 0.05, height: windowHeight * 0.09, position: 'absolute', alignSelf: 'center' }]}
                onPress={handleGoHome} // Fungsi untuk kembali ke halaman utama
              >
                <Text style={styles.buttonText}><Icon size={25} name="home" /></Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.pageText}>Loading...</Text>
      )}

  </ImageBackground>
  )
}

export default BookPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#D6F8FF',
    alignItems: 'center',
  },
  pageText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: 'black'
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: "#B9EFFB",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "black",
  },
  title: {
    fontSize: 20,
    color: "black",
    fontFamily: theme.font.bold,
    marginBottom: 10,
  },
  absoluteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  shadowProp: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  card:{
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  }
})