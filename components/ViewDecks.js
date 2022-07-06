import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { React, useState, useEffect, useContext } from "react";
import RadioButtonRN from "radio-buttons-react-native";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  query,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { UserContext } from "./UserContext";

import CreateDeck from "./CreateDeck";
const ViewDecks = () => {
  const [defaultLanguage, setdefaultLanguage] = useState("French");
  const [sortBy, setSortBy] = useState("French");
  const [defaultDecks, setDefaultDecks] = useState([]);
  const [customDecks, setCustomDecks] = useState([]);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [radioState, setRadioState] = useState("default");
  const [modalVisible, setModalVisible] = useState(false);

  // Add collection in db with a id thats going to be generated by firebase
  // const dataf=
  //   {
  //     list_name: "Travel",
  //     language: "DE_GB",
  //     words: [
  //       { word: "Wagen", definition: "Car" },
  //       { word: "Boot", definition: "Boat" },
  //       { word: "Flugzeug", definition: "Plane" },
  //       { word: "Bus", definition: "Bus" },
  //       { word: "Zug", definition: "Train" },
  //     ],

  //   }
  // {
  //   list_name: "School",
  //   language: "DE_GB",
  //   words: [
  //     { word: "Kunst", definition: "Art" },
  //     { word: "Erdkunde", definition: "Geography" },
  //     { word: "Geschichte", definition: "History" },
  //     { word: "Mathematik", definition: "Mathematics" },
  //     { word: "Naturwissenschaft", definition: "Science" },
  //   ],
  // }

  // addDoc(collection(db, "decks"), dataf).then(() => {
  // //  console.log("saved")
  // });
  const data = [
    {
      label: "Default Decks",
    },
    {
      label: "Custom Decks",
    },
  ];
  useEffect(() => {
    getDocs(collection(db, "decks")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const newDeck = {
          id: doc.id,
          data: doc.data(),
        };

        setDefaultDecks((current) => [newDeck, ...current]);
      });
    });
  }, []);

  const customRef = doc(db, "custom_decks", "OMZM1YJ8L6RDHnDKSCSbzyDYTJG3");
  useEffect(() => {
    getDoc(customRef).then((querySnapshot) => {
      const queryWords = querySnapshot.data();
      setCustomDecks([...customDecks, queryWords]);
    });
  }, []);

  console.log(customDecks);
  if (defaultDecks.length !== 0 || customDecks.length !== 0) {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.containerOption}>
            <Text style={styles.containerText}>Language :</Text>
            <View style={styles.editPicker}>
              {user ? (
                <Text style={styles.language}>{user.defaultLanguage}</Text>
              ) : null}
            </View>
          </View>
          <View style={styles.containerOption}></View>
          <View style={styles.containerRadio}>
            <Text style={styles.viewText}>View: </Text>
            <RadioButtonRN
              initial={1}
              data={data}
              style={styles.radio}
              selectedBtn={(e) => setRadioState(e.label)}
            />
          </View>
          <ScrollView style={styles.scrollContainer}>
            {radioState === "Default Decks" && defaultDecks.length !== 0
              ? defaultDecks.map((deck) => {
                  return (
                    <View
                      style={styles.deckContainer}
                      key={deck.id + "_default"}
                    >
                      <Text style={styles.decks}> {deck.data.list_name}</Text>
                      <View style={styles.btnContainer}>
                        <TouchableOpacity
                          style={[styles.buttonTest, styles.buttonOutlineTest]}
                          onPress={() => {
                            navigate(`/testing/${deck.id}`);
                          }}
                        >
                          <Text style={styles.buttonOutlineTextTest}>Test</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.buttonTest, styles.buttonOutlineTest]}
                          onPress={() => {
                            navigate(`/individualdeck/${deck.id}`);
                          }}
                        >
                          <Text style={styles.buttonOutlineTextTest}>View</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              : customDecks.map((deck) => {
                  return (
                    <View style={styles.deckContainer} key={deck.id}>
                      <Text style={styles.decks}> {deck.list_name}</Text>
                      <View style={styles.btnContainer}>
                        <TouchableOpacity
                          style={[styles.buttonTest, styles.buttonOutlineTest]}
                          onPress={() => {
                            navigate(`/testing/${deck.id}`);
                          }}
                        >
                          <Text style={styles.buttonOutlineTextTest}>Test</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.buttonTest, styles.buttonOutlineTest]}
                          onPress={() => {
                            navigate(`/individualdeck/${deck.id}`);
                          }}
                        >
                          <Text style={styles.buttonOutlineTextTest}>View</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
            <View style={styles.centeredView}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <CreateDeck setModalVisible={setModalVisible} />
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            </View>
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonOutlineText}>Create a new deck</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  } else {
    return <Text>Loading...</Text>;
  }
};
export default ViewDecks;
const styles = StyleSheet.create({
  container: {
    width: "95%",

    marginTop: "30%",
    backgroundColor: "#ECEAF6",
    borderRadius: 10,
    height: "80%",
  },
  buttonContainer: {
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#5C6784",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    minWidth: "65%",
  },
  buttonTest: {
    backgroundColor: "#5C6784",
    width: "30%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    margin: 3,
  },
  buttonWord: {
    backgroundColor: "#5C6784",
    width: "35%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    minWidth: "35%",
    margin: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#DCDEDF",
    borderWidth: 1,
  },
  buttonOutlineTest: {
    backgroundColor: "white",
    borderColor: "#DCDEDF",
    borderWidth: 1,
  },
  buttonOutlineText: {
    color: "#484848",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineTextTest: {
    color: "#5C6784",
    fontWeight: "700",
    fontSize: 16,
  },
  inputPicker: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "100%",
    justifyContent: "flex-start",
  },
  language: {
    fontSize: 18,
  },
  editPicker: {
    width: "50%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 5,
  },
  containerOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: "4%",
    marginRight: 15,
  },
  viewText: {
    fontSize: 18,
    marginTop: 25,
    marginLeft: "4%",
  },
  containerText: {
    fontSize: 18,
    alignSelf: "center",
  },
  radio: {
    width: "48%",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  containerRadio: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: " 30%",
    marginRight: "4%",
  },
  scrollContainer: {
    height: "50%",
  },
  decks: {
    fontSize: 24,
    marginTop: 7,
  },
  deckContainer: {
    backgroundColor: "white",
    marginBottom: 3,
    width: "95%",
    padding: 3,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: "2.5%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
