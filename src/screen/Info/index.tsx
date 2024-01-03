import { StyleSheet, Text, View, Dimensions, ScrollView, ImageBackground, Image } from 'react-native'
import React, {useState, useEffect} from 'react'
import { FIRESTORE_DB } from '../../../Firebase';
import { doc, getDocs, collection, getDoc, query, orderBy } from 'firebase/firestore';
import theme from '../../../font';
import { Linking } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
const Info = () => {
  const [dataList, setDataList] = useState([]);
  const firestore = FIRESTORE_DB;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ImageSize = windowWidth*0.3;
  const [backGround, setBackGround] = useState([]);
  const [dataContact, setDataContact] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(
        query(collection(firestore, 'Team'))
      );
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    
      // Mengurutkan data berdasarkan properti 'number' secara ascending ('asc')
      data.sort((a, b) => a.number - b.number);
    
      setDataList(data);
      console.log(data);
    };
    
  
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'Contact'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDataContact(data);
      console.log('Contact',data);
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(firestore, 'About Us', 'Latar Belakang');
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        console.log(data);
        setBackGround(data);
      } else {
        console.log('Dokumen tidak ditemukan');
      }
    };

    fetchData();
  }, []);
  return (
    <ImageBackground source={require('../../asset/PAGE_BG/HOME.png')} resizeMode='cover' style={styles.container}>
      <ScrollView>
        <Text style={[styles.title, styles.textBold]}>About Us</Text>
        <View style={[styles.card, styles.shadowProp, {width:windowWidth*0.94, borderRadius: 10,} ]}>
          <View>
            <Text style={[styles.textBold, styles.itemText]}>Apa Latar belakang dari DECOBO?</Text>
            <Text style={[styles.textRegular, styles.text]}>{backGround.text}</Text>
          </View>
          <Text style={[styles.textBold, styles.itemText]}>Siapa perancang dari DECOBO?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' , alignItems: 'center'}}>
            {dataList.map(item => (
              <View key={item.id} style={{ width: '50%' , alignItems: 'center', marginTop: 5, justifyContent:'center'}}>
                <Image source={{ uri: item.image }} style={{width:ImageSize, height:ImageSize}} borderRadius={ImageSize}/>
                <Text style={[styles.textBold, styles.text]}>{item.as}</Text>
                <Text style={[styles.text2, styles.textRegular, {marginTop: 10,}]}>{item.id}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={[styles.card2, styles.shadowProp, {width:windowWidth*0.94, borderRadius: 10, marginBottom: 20} ]}>
          <View style={{borderBottomWidth: 2}}><Text style={[styles.textBold, styles.text]}>Hubungi Kami Pada</Text></View>
          <View style={{marginTop: 5}}>
          {dataContact.map(item => (
              <View key={item.id} style={{ width: '100%' }}>
                <Text style={[styles.textRegular]}
                  onPress={() => {
                    // Handler saat teks diklik
                    // Tempatkan logika navigasi atau tindakan yang sesuai di sini
                    Linking.openURL(item.link);
                  }}
                >
                  <Icon size={22} name={item.icon} /> : <Text style={{color:'blue', fontFamily:theme.font2.bold}}>{item.to}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>

  )
}

export default Info

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#D6F8FF',
    padding: 5,
  },
  title:{
    textAlign: 'center',
    fontSize: 25,
  },
  itemText:{
    fontSize: 20,
  },
  text:{
    fontSize: 15,
  },
  text2:{
    fontSize: 13,
  },
  textBold:{
    color: 'black',
    fontFamily:theme.font2.bold,
  },
  textRegular:{
    color: 'black',
    fontFamily: theme.font2.regular,
  },
  card:{
    alignSelf: 'center',
    backgroundColor: '#9DE7F8',
    padding: 10,
    marginTop: 10,
  },
  card2:{
    alignSelf: 'center',
    backgroundColor: '#9DE7F8',
    padding: 10,
    marginTop: 10,
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
})