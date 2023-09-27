import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import theme from '../../../font'
import { useFocusEffect } from '@react-navigation/native'
import { FIRESTORE_DB } from '../../../Firebase'
import { collection, getDocs } from 'firebase/firestore'
import RNFetchBlob from 'rn-fetch-blob'
const DownloadPage = () => {
  const [dataList, setDataList] = useState([]);
  const firestore = FIRESTORE_DB;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [isLoading, setIsLoading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const querySnapshot = await getDocs(collection(firestore, 'PDF'));
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setDataList(data);
          console.log('Data fetched successfully:', data);
        } catch (error) {
          console.error("Error", error);
          // Di sini Anda dapat menangani kesalahan, misalnya dengan menampilkan pesan kesalahan kepada pengguna.
        } finally{
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, [])
  );
  const handleDownloadPress = async (itemName, itemUrl) => {
    try {
      const pdfUrl = itemUrl; // Gunakan URL PDF yang diberikan sebagai parameter
      const outputPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${itemName}.pdf`;
  
      const response = await RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: itemName,
          description: 'Please wait while the PDF is downloaded...',
          mime: 'application/pdf',
          path: outputPath,
        },
      }).fetch('GET', pdfUrl);
  
      console.log('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
  
  return (
    <ImageBackground source={require('../../asset/PAGE_BG/HOME.png')} style={styles.container}>
      <Text style={styles.title}>Halaman Download</Text>
      <ScrollView style={{paddingStart: 10,}}>
      {dataList.map(item => (
        <View key={item.id} style={{flexDirection:'row', width:windowWidth, marginStart: 10, height: windowHeight*0.15, marginBottom:10, }}>
          <Image source={{uri: item.cover}} style={{width:windowWidth*0.2, height:windowHeight*0.15, borderWidth: 2, borderColor: 'white' }} resizeMode="stretch" />
          <View style={{backgroundColor:'white', width:windowWidth*0.7, paddingStart: 10, borderTopRightRadius: windowWidth*0.1, borderBottomRightRadius:windowWidth*0.1}}>
            <Text style={[{color:"black", fontFamily:theme.font2.bold, fontSize:17}]}>{item.id}</Text>
            <Text style={[{color:"black", fontFamily:theme.font2.regular, fontSize:14}]}>Anda bisa mendownload disini</Text>
            <TouchableOpacity style={[{ alignItems:'flex-end', marginEnd: windowWidth*0.1, marginTop: 20,}]} onPress={()=>handleDownloadPress(item.id, item.link)}>
              <Text style={{color:'blue'}}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      </ScrollView>
    </ImageBackground>
  )
}

export default DownloadPage

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#D6F8FF',},
  title:{
    fontFamily: theme.font2.bold,
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  }
})