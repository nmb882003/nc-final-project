import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { fetchDictionaryEntry } from "../dictionary/dictionaryFunctions";
const IndividualDeck = () => {
  const navigate = useNavigate();
  const [deck, setDeck] = useState([]);
  useEffect(() => {
    getDoc(doc(db, "decks", "Sxoxw7XSYRNljsOahdD5")).then((querySnapshot) => {
      setDeck(querySnapshot.data());
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.deckInfo}>
        <Text style={styles.textName}>{deck.list_name}</Text>
        <Text style={styles.textLang}>German</Text>
      </View>
      <View style={styles.wordContainer}>
        <View style={styles.firstLangWords}>
          <Text style={styles.lang}>English</Text>
          {deck.words.map((word) => {
            return <Text style={styles.word}> {word.definition}</Text>;
          })}
        </View>
        <View style={styles.foreignLangWords}>
          <Text style={styles.lang}>German</Text>
          {deck.words.map((word, index) => {
            return (
              <>
                <View style={styles.singleWordContainer}>
                  <Text style={styles.word}> {word.word}</Text>
                  <TouchableOpacity
                    style={[styles.buttonX, styles.buttonOutlineX]}
                    onPress={() => {
                      fetchDictionaryEntry();
                    }}
                  >
                    <Text style={styles.buttonOutlineTextX}>x</Text>
                  </TouchableOpacity>
                </View>
              </>
            );
          })}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => {
            navigate("/enterwords");
          }}
        >
          <Text style={styles.buttonOutlineText}>Add a new word</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => {
            navigate("/viewdecks");
          }}
        >
          <Text style={styles.buttonOutlineText}>Return to decks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IndividualDeck;
const styles = StyleSheet.create({
  deckInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textName: {
    marginRight: "25%",
    fontSize: 20,
  },
  textLang: {
    marginLeft: "25%",
    fontSize: 20,
  },
  singleWordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
    marginLeft: "15%",
  },
  button: {
    backgroundColor: "#5C6784",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    minWidth: "65%",
  },
  wordContainer: {},
  buttonX: {
    backgroundColor: "#5C6784",
    width: "20%",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 5,
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
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#5C6784",
    borderWidth: 2,
  },
  buttonOutlineX: {
    backgroundColor: "red",
    marginTop: 5,
    borderColor: "#5C6784",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "#5C6784",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineTextX: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  wordContainer: {
    borderWidth: 2,
    height: "65%",
    marginTop: "10%",
    borderRadius: 10,
    flexDirection: "row",
  },
  container: {
    width: "90%",
  },
  firstLangWords: {
    borderRightWidth: 1,
    width: "50%",
    height: "100%",
  },
  foreignLangWords: {
    width: "50%",
    height: "100%",
  },
  lang: {
    fontSize: 20,
    textAlign: "center",
    padding: 25,
    textDecorationLine: "underline",
  },
  word: {
    padding: 10,
    marginLeft: 5,
    fontSize: 20,
  },
});
