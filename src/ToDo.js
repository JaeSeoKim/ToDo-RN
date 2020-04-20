import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import propTypes from "prop-types";

const { width, height } = Dimensions.get("window");

export default class ToDo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      value: props.value,
    };
  }

  static propTypes = {
    value: propTypes.string.isRequired,
    isCompleted: propTypes.bool.isRequired,
    id: propTypes.string.isRequired,
    deleteToDo: propTypes.func.isRequired,
    completeToDo: propTypes.func.isRequired,
    uncompleteToDo: propTypes.func.isRequired,
    isCompleted: propTypes.bool.isRequired,
    updateToDo: propTypes.func.isRequired,
  };

  render() {
    const { isEditing, value } = this.state;
    const {
      isCompleted,
      id,
      deleteToDo,
      completeToDo,
      uncompleteToDo,
    } = this.props;
    return (
      <View>
        {isEditing ? (
          <View style={Styles.container}>
            <TextInput
              style={Styles.input}
              multiline={true}
              value={value}
              onChangeText={this._onChangeTodo}
              onBlur={this._finishEditing}
            />
            <TouchableOpacity
              style={Styles.action}
              onPress={this._finishEditing}
              returnKeyType={"done"}
            >
              <Feather name="check" color="#90CAF9" size={30} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={Styles.container}>
            <View style={Styles.betweenContainer}>
              {isCompleted ? (
                <TouchableOpacity
                  onPress={(event) => {
                    event.stopPropagation();
                    uncompleteToDo(id);
                  }}
                  style={Styles.action}
                >
                  <Ionicons
                    name="md-checkmark-circle"
                    color="#E684AE"
                    size={35}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={(event) => {
                    event.stopPropagation();
                    completeToDo(id);
                  }}
                  style={Styles.action}
                >
                  <Ionicons
                    name="md-checkmark-circle-outline"
                    color="#A770EF"
                    size={35}
                  />
                </TouchableOpacity>
              )}
              <Text
                style={[
                  Styles.text,
                  isCompleted ? Styles.completedText : Styles.notCompletedText,
                ]}
              >
                {value}
              </Text>
            </View>
            <View style={Styles.betweenContainer}>
              <TouchableOpacity
                style={Styles.action}
                onPress={this._startEditing}
              >
                <Feather name="edit" color="#7986CB" size={30} />
              </TouchableOpacity>
              <TouchableOpacity
                style={Styles.action}
                onPress={(event) => {
                  event.stopPropagation();
                  deleteToDo(id);
                }}
              >
                <Feather name="delete" color="#F06292" size={30} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }

  _startEditing = (event) => {
    event.stopPropagation();
    this.setState((preState) => {
      return {
        isEditing: true,
      };
    });
  };

  _finishEditing = (event) => {
    event.stopPropagation();
    const { value } = this.state;
    const { id, updateToDo } = this.props;
    updateToDo(id, value);
    this.setState((preState) => {
      return {
        isEditing: false,
      };
    });
  };

  _onChangeTodo = (value) => {
    this.setState((preState) => {
      return {
        value,
      };
    });
  };
}

const Styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#BBB",
    width: width - 50,
    justifyContent: "space-between",
  },
  input: {
    fontFamily: "NanumSquareR",
    color: "#6f6f6f",
    fontSize: 25,
    padding: 10,
    width: (width / 4) * 3,
  },
  text: {
    fontFamily: "NanumSquareR",
    fontSize: 25,
    padding: 10,
    width: width / 2,
  },
  completedText: {
    color: "#9f9f9f",
    textDecorationLine: "line-through",
  },
  notCompletedText: {
    color: "#6f6f6f",
  },
  betweenContainer: {
    flexDirection: "row",
  },
  action: {
    marginHorizontal: 5,
    alignSelf: "center",
  },
});
