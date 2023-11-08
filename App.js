import * as Location from 'expo-location';
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Dimensions, Text, View, ActivityIndicator } from 'react-native';

const API_KEY = "b0f19f92cddff3a3762ecc76d0a4917c";
const { width : SCREEN_WIDTH} = Dimensions.get('window');

console.log(SCREEN_WIDTH);

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [time, setTime] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync(); 
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false});
    setCity(location[0].city);
    const response = await  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    //setDays(json.list);
    setDays(
      json.list.filter((weather) => {
        if (weather.dt_txt.includes("09:00:00") || weather.dt_txt.includes("18:00:00")) {
          return weather;
        }
      })
    );
  };
  useEffect(() => {
    getWeather(); 
  }, [])

  return (<View style={styles.container}>
      <View style={styles.city}>    
        <Text style={styles.cityName}>{city}</Text>
      </View>
       <ScrollView 
       pagingEnabled
       horizontal 
       showsHorizontalScrollIndicator={false}
       contentContainerStyle ={styles.weather}
       >
      {days.length === 0 ?(
        <View style={styles.day}>
          <ActivityIndicator 
            color="white" 
            style={{ marginTop:10 }}
            size="large"
          />
        </View>
      ):(
        days.map((day, index) => 
          <View key={index} style={styles.day}>
            <Text style={styles.today}>{(day.dt_txt).slice(5, 7)}월 {(day.dt_txt).slice(8, 10)}일 {(day.dt_txt).slice(11, 13)}시</Text>
            <View style={styles.tempView}>
              <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>
        )
      )}
      </ScrollView>
      <StatusBar style="black"/>
    </View>
  );
}


  const styles = StyleSheet.create({
    container: {
      flex:1,   
      backgroundColor: "skyblue"
    },
    city: {
      flex:1.1,
      justifyContent:"center",
      alignItems:"center",
    },
    cityName:{
      fontSize:58, 
      fontWeight:"700",
    },
    weather: { 
    },
    day: {
      width: SCREEN_WIDTH,
      alignItems: "center", 
    },
    temp: {
      fontSize: 158,
    },
    description: {
      marginTop: -30, 
      fontSize: 60,
    },   
    today: {
      marginBottom: -40,
      fontSize: 32,
    },
    tempView: {
      marginTop: 50, 
      flexDirection: "row",
    },
    celsius: {
      marginTop: 80,
      fontSize: 78,
      justifyContent: "center",
    },
    tinyText: {
      fontSize: 22 
    }
})
