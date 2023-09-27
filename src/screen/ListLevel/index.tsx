import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Image, ImageBackground } from 'react-native'
import React, {useState, useCallback} from 'react'
import { FIRESTORE_DB } from '../../../Firebase';
import { useFocusEffect } from '@react-navigation/native';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import theme from '../../../font';
import Icon from "react-native-vector-icons/FontAwesome6";
const ListLevel = ({navigation}) => {
    const [dataList, setDataList] = useState([]);
    const [dataPDF, setDataPDF] = useState([]);
    const firestore = FIRESTORE_DB;
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [isLoading, setIsLoading] = useState(true);
        useFocusEffect(
            useCallback(() => {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                const querySnapshot = await getDocs(collection(firestore, 'DataBook'));
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
        
        const handleItemPress = (level) => {
            try {
            navigation.navigate('LevelPage', { level });
            } catch (error) {
            console.error('Error navigating to Level Page:', error);
            }
        };
    return (
        <ImageBackground source={require('../../asset/PAGE_BG/HOME.png')} resizeMode='cover' style={{flex:1, backgroundColor: '#D6F8FF',}}>
            <ScrollView>
                <Text>ListLevel</Text>
                    {isLoading ? (
                        <Text style={[styles.textBold, {alignSelf:'center', marginTop: 50}]}>Loading..</Text>
                    ) : (
                        <View>
                        {dataList.map(item => (
                            <View style={{marginBottom:30, alignItems:'center'}}>
                                <View style={[styles.flatListItem,styles.shadowProp, {width:windowWidth*0.5, height:windowHeight*0.3, borderRadius: windowWidth*0.05}]} >
                                    <Image source={{uri: item.image}} style={{width:windowWidth*0.3, height:windowHeight*0.2}} resizeMode="stretch" />
                                    <Text style={{color: 'black', textAlign:'center', fontFamily: theme.font.bold, fontSize: 15}}>{'\n'}Jilid 1 & Jilid 2</Text>
                                </View>
                                <TouchableOpacity key={item.id} style={[styles.buttonLevel, {width:windowWidth*0.4, height:windowWidth*0.1, borderRadius:windowWidth*0.05}]} onPress={() => handleItemPress(item.id)}>
                                    <Text><Text style={[styles.textBold, styles.levelText, {textAlign:'center'}]}>{item.id}</Text></Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    )}
                <View style={[styles.bookCard,styles.shadowProp, {width:windowWidth*0.9, height:windowHeight*0.3, borderRadius: windowWidth*0.05, marginBottom:windowHeight*0.1, alignSelf:'center'}]}>
                    <Text style={[styles.textBold, {fontSize: 15,}]}>Apakah anda ingin mendownload semua buku kami?</Text>
                    <Text style={{fontSize: 15, fontFamily:theme.font2.regular, color: 'black', textAlign:'justify'}}>Ya, anda bisa melalukannya, karena kami sudah menyediakan halaman download nya</Text>
                    <TouchableOpacity style={[styles.button, {borderRadius: windowWidth*0.05, width:windowWidth*0.6, height:windowHeight*0.065}]} onPress={()=>navigation.navigate('DownloadPage')} >
                        <Text style={[styles.buttonText, {width:windowWidth*0.45}]}>Download PDF</Text>
                        <View style={{borderStartWidth:1, width:windowWidth*0.1, height:windowHeight*0.032, alignItems:'center'}}>
                            <Icon name="download" color="black" size={20}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
    )
}

export default ListLevel

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
        color: 'black',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 10,
        marginStart: 5,
    },
    flatListItem:{
        backgroundColor: '#ffff',
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookCard:{
        backgroundColor: '#ffff',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginTop: 20,
    },
    card:{
        backgroundColor: '#7ED2BD',
        alignSelf: 'center',
        padding: 10,
        borderWidth: 2,
        borderColor: '#F4D160',
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
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 15,
    },
    button:{
        backgroundColor: '#9DE7F8',
        marginVertical: 30,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingStart: 10,
    },
    buttonLevel:{
        backgroundColor: '#A0EDFF',
        opacity: 0.8,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});