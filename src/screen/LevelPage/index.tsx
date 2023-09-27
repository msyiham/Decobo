import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions, ImageBackground } from 'react-native';
import React, { useCallback, useState, useRef} from 'react';
import { FIRESTORE_DB } from '../../../Firebase';
import { query, getDocs, collection } from 'firebase/firestore';
import theme from '../../../font';
import { useFocusEffect } from '@react-navigation/native';
import Carousel, { Pagination } from 'react-native-snap-carousel-v4';

const LevelPage = ({ route, navigation }) => {
  const { level } = route.params;
  const [dataList, setDataList] = useState([]);
  const [documentData, setDocumentData] = useState({});
  const firestore = FIRESTORE_DB;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const sliderWidth = windowWidth;
  const itemWidth = windowWidth * 0.9;
  const carouselRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const querySnapshot = await getDocs(collection(firestore, 'DataBook', level, 'child'));
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            level: level,
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

  const handleItemPress = (book, level) => {
    navigation.navigate('BookPage', { book, level });
  };

  

  const renderItem = ({ item }) => (
    <View style={{width:windowWidth*0.9}}>
      <TouchableOpacity activeOpacity={0.6} onPress={() => handleItemPress(item.id, item.level)} style={[styles.itemFlatList, styles.shadowProp, {width:windowWidth*0.87, height:windowHeight*0.6, borderRadius: windowWidth*0.1}]}>
          <Image source={{ uri: item.image }} style={{ width: windowWidth*0.6, height:windowHeight*0.4 }} resizeMode='cover' />
          <Text style={[styles.bookText]}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  return (
    <ImageBackground source={require('../../asset/PAGE_BG/LEVEL.png')} style={styles.container}>
      <Text style={[styles.title, styles.textBold]}>{level}</Text>
      {isLoading ? (
          <Text style={[styles.textBold, {alignSelf:'center', marginTop: 50}]}>Loading..</Text>
        ) : (
        <View>
          <Carousel
            data={dataList}
            ref={carouselRef}
            renderItem={renderItem}
            sliderWidth={sliderWidth}
            layout={'tinder'} layoutCardOffset={`20`}
            itemWidth={itemWidth}
            containerCustomStyle={styles.carouselContainer}
            contentContainerStyle={{ alignItems: 'center' }}
            onSnapToItem={(index) => setActiveSlideIndex(index)}
          />
          <View>
              <Pagination
                dotsLength={dataList.length}
                activeDotIndex={activeSlideIndex}
                dotStyle={styles.dot}
                inactiveDotStyle={styles.dot2}
                inactiveDotOpacity={0.9}
                inactiveDotScale={0.8}
              />
          </View>
        </View>
      )}

    </ImageBackground>
  );
}

export default LevelPage;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding: 5,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#D6F8FF',
  },
  title:{
    fontSize: 25,
  },
  bookText:{
    color: 'black',
    fontSize: 20,
    fontFamily: theme.font.bold,
  },
  textBold:{
    color: 'black',
    fontFamily:theme.font2.bold,
  },
  itemFlatList:{
    backgroundColor:'#FFFFFF',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
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
  dot:{
    bottom: 110,
    backgroundColor: 'blue',
    width: 10,
    height: 10,
    borderRadius: 10,
  },
  dot2:{
    bottom: 110,
    backgroundColor: 'gray',
    width: 10,
    height: 10,
    borderRadius: 10,
  },
  carouselContainer:{
    marginTop: 20,
    marginBottom: 0,
  }
});