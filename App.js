import React, { useState, useEffect } from "react";
import Main from "./src/Main";
import { AppLoading } from "expo";
import { View, AsyncStorage } from "react-native";
import * as Font from "expo-font";

export default function App() {
  const [isLoding, setIsloading] = useState(true);
  const [toDos, setToDos] = useState({});

  const _loadToDos = async () => {
    try {
      await Font.loadAsync({
        NanumSquareR: require("./assets/fonts/NanumSquareR.otf"),
      });
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos);
      setToDos(parsedToDos || {});
      setIsloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    _loadToDos();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isLoding ? <AppLoading /> : <Main toDos={toDos} />}
    </View>
  );
}
