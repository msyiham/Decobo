import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Image, ImageBackground } from 'react-native';
import { FIRESTORE_DB } from '../../../Firebase';
import Icon from "react-native-vector-icons/FontAwesome6";
import theme from '../../../font';
import Sound from 'react-native-sound';
import { useFocusEffect } from '@react-navigation/native';
import { getDoc, doc } from 'firebase/firestore';
const Home = ({navigation}) => {
  const [dataList, setDataList] = useState([]);
  const [dataPDF, setDataPDF] = useState([]);
  const firestore = FIRESTORE_DB;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const sliderWidth = windowWidth;
  const itemWidth = windowWidth * 0.9;
  const carouselRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sound, setSound] = useState();

  const fetchSoundUrlFromFirestore = async () => {
    try {
      const soundDoc = doc(firestore, 'Background Sound', 'Sound');
      const soundDocSnap = await getDoc(soundDoc);
      if (soundDocSnap.exists) {
        const soundData = soundDocSnap.data();
        const soundUrl = soundData.url; // Asumsi field yang menyimpan URL adalah 'url'
        console.log("Sound Url:",soundUrl);
        return soundUrl;
      } else {
        console.log('Dokumen suara tidak ditemukan');
        return null;
      }
    } catch (error) {
      console.error('Gagal mengambil URL suara dari Firestore', error);
      return null;
    }
  };

  const stopSound = () => {
    if (sound) {
      sound.stop();
      sound.release();
    }
  };
  const isSoundPlaying = useRef(false);
  const soundRef = useRef(null);
  // Ganti kode useEffect dengan useFocusEffect
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const soundUrl = await fetchSoundUrlFromFirestore();
        if (soundUrl) {
          // Gunakan URL suara untuk memainkan suara
          const audio = new Sound(soundUrl, null, (error) => {
            if (error) {
              console.log('Error loading sound: ', error);
              return;
            }

            audio.setNumberOfLoops(-1);
            audio.play(() => {
              console.log('Suara selesai');
            });

            soundRef.current = audio;
            isSoundPlaying.current = true;
          });
        }
      };

      fetchData();

      return () => {
        if (isSoundPlaying.current) {
          if (soundRef.current) {
            soundRef.current.stop();
            soundRef.current.release();
          }
          isSoundPlaying.current = false;
        }
      };
    }, [])
  );
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      stopSound();
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <ImageBackground source={require('../../asset/PAGE_BG/HOME.png')} resizeMode='cover' style={{flex:1, backgroundColor: '#D6F8FF',}}>
      <ScrollView style={[styles.container, {paddingTop: windowHeight*0.05,}]}>
        <View style={[styles.card, styles.shadowProp, {width:windowWidth*0.9, height: windowHeight*0.17, borderRadius: windowWidth*0.05}]}>
          <Text style={[styles.title, styles.textBold]}>Hai Pengguna{'\n'}DECOBO..</Text>
          <Text style={[styles.textBold,{fontSize: 15, marginTop: 5}]}>Selamat datang dalam aplikasi DECOBOOK</Text>
        </View>
        <View style={{flexDirection:'row', marginTop: 50, width: windowWidth}}>
          <View style={{width:windowWidth*0.5, alignItems: 'center'}}>
            <TouchableOpacity onPress={()=>navigation.navigate('Introduction')} style={[styles.card2, styles.shadowProp,{width:windowWidth*0.4, height:windowWidth*0.4, borderRadius: windowWidth*0.05}]}>
              <Image style={{width:windowWidth*0.2, height:windowWidth*0.2}} source={require('../../asset/pengantar.png')} />
            </TouchableOpacity>
            <Text style={[styles.textBold,styles.titleItem]}>Pengantar</Text>
          </View>
          <View style={{width:windowWidth*0.5, alignItems: 'center'}}>
          <TouchableOpacity
            style={[styles.card2, styles.shadowProp, { width: windowWidth * 0.4, height: windowWidth * 0.4, borderRadius: windowWidth * 0.05 }]}
            onPress={()=>navigation.navigate('ListLevel')}
          >
            <Image style={{ width: windowWidth * 0.2, height: windowWidth * 0.2 }} source={require('../../asset/daftar-buku.png')} />
          </TouchableOpacity>
            <Text style={[styles.textBold,styles.titleItem]}>Daftar Buku</Text>
          </View>
        </View>
        <View style={{flexDirection:'row', marginTop: 20, width: windowWidth}}>
          <View style={{width:windowWidth*0.5, alignItems: 'center'}}>
            <TouchableOpacity style={[styles.card2, styles.shadowProp, {width:windowWidth*0.4, height:windowWidth*0.4, borderRadius: windowWidth*0.05}]} onPress={()=>navigation.navigate('Guide')}>
              <Image style={{width:windowWidth*0.2, height:windowWidth*0.2}} source={require('../../asset/panduan.png')} />
            </TouchableOpacity>
            <Text style={[styles.textBold,styles.titleItem]}>Panduan</Text>
          </View>
          <View style={{width:windowWidth*0.5, alignItems: 'center'}}>
            <TouchableOpacity style={[styles.card2, styles.shadowProp, {width:windowWidth*0.4, height:windowWidth*0.4, borderRadius: windowWidth*0.05}]} onPress={()=>navigation.navigate('Info')}>
              <Image style={{width:windowWidth*0.2, height:windowWidth*0.2}} source={require('../../asset/pengembang.png')} />
            </TouchableOpacity>
            <Text style={[styles.textBold,styles.titleItem]}>Pengembang</Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container:{
    padding: 5,
  },
  title:{
    fontSize: 25,
  },
  levelText:{
    fontSize: 14,
  },
  buttonText:{
    fontSize: 16,
    color: 'black',
    fontFamily: theme.font2.regular,
  },
  textBold:{
    color: 'black',
    fontFamily: theme.font2.bold,
  },
  titleItem:{
    fontSize: 15,
    marginTop: 10,
    marginStart: 5,
    textAlign:'center'
  },
  card:{
    backgroundColor: '#7ED2BD',
    alignSelf: 'center',
    padding: 10,
  },
  card2:{
    backgroundColor: '#fff',
    alignSelf: 'center',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowProp: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.7,
    shadowRadius: 9.51,
    elevation: 15,
  },
  button:{
    backgroundColor: '#9DE7F8',
    marginVertical: 30,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingStart: 10,
  }
});
export default Home;