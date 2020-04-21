import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
  TextInput,
  ScrollView,
  AsyncStorage,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import uuid from "./uuid";
import ToDo from "./ToDo";

const { height, width } = Dimensions.get("window");

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newToDo: "",
      toDos: props.toDos,
    };
  }

  render() {
    const { newToDo, toDos } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          animated={true}
          translucent={true}
          barStyle={"light-content"}
          backgroundColor={"rgba(0,0,0,0.0)"}
        />
        <LinearGradient
          style={styles.container}
          colors={["#E684AE", "#CF8BF3", "#A770EF"]}
        >
          <Text style={styles.title}>ToDo</Text>
          <View style={styles.box}>
            <TextInput
              style={styles.input}
              placeholder="New ToDo!"
              placeholderTextColor="#AAA"
              value={newToDo}
              onChangeText={this._crontollNewToDo}
              returnKeyType={"done"}
              autoCorrect={false}
              onEndEditing={this._onEndEditToDo}
              onBlur={this._onEndEditToDo}
            />
            <ScrollView contentContainerStyle={styles.toDos}>
              {Array(...toDos).reverse().map((toDo) => (
                <ToDo
                  key={toDo.id}
                  deleteToDo={this._deleteToDo}
                  toggleCompleteToDo={this._toggleCompleteToDo}
                  updateToDo={this._updateToDo}
                  {...toDo}
                />
              ))}
            </ScrollView>
          </View>
        </LinearGradient>
      </View>
    );
  }

  _crontollNewToDo = (value) => {
    this.setState(() => {
      return {
        newToDo: value,
      };
    });
  };

  _onEndEditToDo = () => {
    if (this.state.newToDo !== "") {
      const ID = uuid();
      const todo = {
        id: ID,
        value: this.state.newToDo,
        createdAt: new Date(),
        isCompleted: false,
      };
      this.setState((prevState) => {
        const newState = {
          toDos: prevState.toDos.concat(todo),
          newToDo: "",
        };
        this._saveToDos(newState.toDos);
        return { ...newState };
      });
    }
  };

  _deleteToDo = (id) => {
    this.setState((prevState) => {
      const toDos = prevState.toDos;
      const index = toDos.findIndex((i) => i.id === id);
      toDos.splice(index, 1);
      const newState = {
        ...prevState,
        toDos,
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _toggleCompleteToDo = (id) => {
    this.setState((prevState) => {
      const toDos = prevState.toDos;
      const index = toDos.findIndex((i) => i.id === id);
      const newToDo = {
        ...prevState.toDos[index],
        isCompleted: !prevState.toDos[index].isCompleted,
      };
      toDos.splice(index, 1, newToDo);
      const newState = {
        ...prevState,
        toDos: toDos,
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _updateToDo = (id, value) => {
    this.setState((prevState) => {
      const toDos = prevState.toDos;
      const index = toDos.findIndex((i) => i.id === id);
      const newToDo = {
        ...prevState.toDos[index],
        value: value,
      };
      toDos.splice(index, 1, newToDo);
      const newState = {
        ...prevState,
        toDos: toDos,
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _saveToDos = (newTodos) => {
    const toDos = JSON.stringify(newTodos);
    AsyncStorage.setItem("toDos", toDos);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "NanumBarunGothic",
    alignSelf: "baseline",
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 20,
    fontSize: 50,
    color: "white",
    textShadowOffset: { width: 0, height: 1 },
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowRadius: 5,
  },
  box: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 20,
    width: width - 25,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0,
        },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  input: {
    fontFamily: 'NanumBarunGothic',
    color: "#6f6f6f",
    fontSize: 30,
    width: width - 30,
    padding: 15,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#BBB",
  },
  toDos: {
    alignItems: "center",
  },
});
