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
              {Object.values(toDos)
                .reverse()
                .map((toDo) => (
                  <ToDo
                    key={toDo.id}
                    deleteToDo={this._deleteToDo}
                    uncompleteToDo={this._unCompleteToDo}
                    completeToDo={this._completeToDo}
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
        [ID]: {
          id: ID,
          value: this.state.newToDo,
          createdAt: new Date(),
          isCompleted: false,
        },
      };
      this.setState((prevState) => {
        const newState = {
          toDos: {
            ...prevState.toDos,
            ...todo,
          },
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
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos,
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _completeToDo = (id) => {
    this.setState((prevState) => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true,
          },
        },
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _unCompleteToDo = (id) => {
    this.setState((prevState) => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false,
          },
        },
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _updateToDo = (id, value) => {
    this.setState((prevState) => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            value: value,
          },
        },
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
    alignSelf: "baseline",
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 50,
    color: "white",
  },
  box: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 10,
    width: width - 25,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50, 50, 50)",
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
    color: "#6f6f6f",
    fontSize: 30,
    width: width - 30,
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#BBB",
  },
  toDos: {
    alignItems: "center",
  },
});
