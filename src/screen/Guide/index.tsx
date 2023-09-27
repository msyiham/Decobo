import { StyleSheet, Text, View, Dimensions, ScrollView, Button, ImageBackground} from 'react-native'
import React, {useCallback, useState} from 'react'
import theme from '../../../font'
import YoutubePlayer from "react-native-youtube-iframe";
import { useFocusEffect } from '@react-navigation/native';
import { getDoc, doc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../Firebase';
import RenderHtml from 'react-native-render-html';

const Guide = () => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [dataList, setDataList] = useState([]);
    const [description, setDescription] = useState([]);
    const firestore = FIRESTORE_DB;
    useFocusEffect(
      useCallback(() => {
        // Mengambil semua dokumen dari koleksi "DataBook"
        const fetchData = async () => {
          try {
            const documentRef = doc(firestore, 'Guide', 'Video'); // Specify the path separately
            const documentSnapshot = await getDoc(documentRef);
            if (documentSnapshot.exists()) {
              const data = documentSnapshot.data(); // Retrieve the data from the document
              console.log(data);
              setDataList(data); // Update your state with the retrieved data
            } else {
              console.log('Document does not exist');
            }
          } catch (error) {
            console.error('error', error);
          }
        };
    
        fetchData();
      }, [])
    );
    useFocusEffect(
      useCallback(() => {
        // Mengambil semua dokumen dari koleksi "DataBook"
        const fetchData = async () => {
          try {
            const documentRef = doc(firestore, 'Guide', 'Description'); // Specify the path separately
            const documentSnapshot = await getDoc(documentRef);
            if (documentSnapshot.exists()) {
              const data = documentSnapshot.data(); // Retrieve the data from the document
              console.log(data);
              setDescription(data); // Update your state with the retrieved data
            } else {
              console.log('Document does not exist');
            }
          } catch (error) {
            console.error('error', error);
          }
        };
    
        fetchData();
      }, [])
    );
  return (
    <ImageBackground source={require('../../asset/PAGE_BG/HOME.png')} resizeMode='cover' style={styles.container}>
      <ScrollView style={{padding:10}}>
        <Text style={styles.title}>Panduan Pengguna</Text>
        <View style={[styles.card2, styles.shadowProp, {width:windowWidth*0.9, height: windowHeight*0.3, marginBottom: 20, marginTop: 20, borderRadius: 10}]}>
          {dataList ? (
            <YoutubePlayer
              height={windowHeight*0.25}
              width={windowWidth*0.75}
              videoId={dataList.id}
            />
          ) : (
            <Text style={{color: 'black'}}>Loading...</Text>
          )}
        </View>
        <View style={[styles.card,{borderRadius: 10, marginHorizontal: 5, width:windowWidth*0.9, marginBottom:20}]}>
          {description ? (
            <RenderHtml
              contentWidth={windowWidth*0.8}
              source={{ html: description.text }}
              baseStyle={styles.description}
            />
          ) : (
            <Text style={{color: 'black'}}>Loading...</Text>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

export default Guide

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    title:{
        fontFamily: theme.font2.bold,
        color: 'black',
        fontSize: 20,
        alignSelf: 'center'
    },
    card:{
        backgroundColor: '#9DE7F8',
        alignSelf: 'center',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card2:{
        backgroundColor: '#9DE7F8',
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
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 15,
    },
    description:{
      color:'black',
      fontSize: 17,
      textAlign:'left',
      fontFamily: theme.font2.regular,
    }
    
})