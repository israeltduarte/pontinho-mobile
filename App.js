import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import data from "./api/data.json";

const App = () => {
  const [players, setPlayers] = useState(data.players);
  const [canSubmit, setCanSubmit] = useState(false);
  const [scores, setScores] = useState({});

  const submitScores = () => {
    if (checkIfRoundCanBeFinished()) {
      updatePlayersInfo();
      startNewRound();
    }
  };

  const checkIfRoundCanBeFinished = () => {
    return canSubmit && checkIfAllInputsAreFulfilled();
  };

  const checkIfAllInputsAreFulfilled = () => {
    const validInputValues = players
      .filter((player) => player.isPlaying)
      .every((player) => {
        return isInputValueValid(scores[player.id]);
      });

    return validInputValues;
  };

  const isInputValueValid = (inputValue) => {
    return inputValue !== "" && inputValue !== null && !isNaN(inputValue);
  };

  const startNewRound = () => {
    setScores({});
    setCanSubmit(false);
  };

  const updatePlayersInfo = () => {
    players
      .filter((player) => player.isPlaying)
      .forEach((player) => {
        updatePoints(player);
        updateTotal(player);
        updateScape(player);
      });

    updatePlayersThatExploded();
    updatePlayersThatWereEliminated();
  };

  const updatePoints = (player) => {
    player.points.push(scores[player.id]);
  };

  const updateTotal = (player) => {
    player.total = player.total + Number(scores[player.id]);
    if (player.total > 99) {
      !player.hasExploded ? explodePlayer(player) : eliminatePlayer(player);
    }
  };

  const updateScape = (player) => {
    player.scape = 99 - player.total;
  };

  const explodePlayer = (player) => {
    player.hasExploded = true;
  };

  const eliminatePlayer = (player) => {
    player.isPlaying = false;
    player.scape = "-";
  };

  const updatePlayersThatExploded = () => {
    const playingPlayers = players.filter((player) => player.isPlaying);

    const explodedPlayers = players
      .filter((player) => player.isPlaying)
      .filter((player) => player.total > 99);

    if (explodedPlayers.length === playingPlayers.length - 1) {
      explodedPlayers
        .filter((player) => player.isPlaying)
        .forEach((player) => eliminatePlayer(player));
    }

    players
      .filter((player) => player.isPlaying)
      .filter((player) => player.total > 99)
      .forEach((player) => updateExplodedPlayerInfo(player));
  };

  const updatePlayersThatWereEliminated = () => {
    players
      .filter((player) => !player.isPlaying)
      .forEach((player) => eliminatePlayer(player));
  };

  const updateExplodedPlayerInfo = (player) => {
    player.hasExplodedWith = player.total;
    player.total = getBiggestTotalThatScaped();
    player.isBackWith = player.total;
    updateScape(player);
  };

  const getBiggestTotalThatScaped = () => {
    return players
      .filter((player) => player.total <= 99)
      .reduce((biggestTotal, currentPlayer) => {
        return Math.max(biggestTotal, currentPlayer.total);
      }, 0);
  };

  const handleScoreChange = (playerId, score) => {
    setScores((prevScores) => ({
      ...prevScores,
      [playerId]: score,
    }));
  };

  const enableSubmitButton = () => {
    const allInputsFilled = players
      .filter((player) => player.isPlaying)
      .every((player) => {
        const inputValue = scores[player.id];
        return inputValue !== "" && inputValue !== null && !isNaN(inputValue);
      });

    setCanSubmit(allInputsFilled);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    scrollViewContent: {
      flexGrow: 1,
    },
    playersRow: {
      flexDirection: "row",
      marginBottom: 16,
    },
    playerContainer: {
      flex: 1,
      borderWidth: 1,
      padding: 8,
      marginRight: 8,
      alignItems: "center",
    },
    finishButton: {
      padding: 6,
      alignItems: "center",
      color: "white",
    },
    activeBtn: {
      backgroundColor: "#E61003",
    },
    inactiveBtn: {
      backgroundColor: "#FF7771",
    },
    playerInfo: {
      padding: 8,
      marginBottom: 8,
      marginRight: 8,
      flexDirection: "column",
      borderWidth: 1,
      alignItems: "center",
    },
    hasExploded: {
      backgroundColor: "yellow",
    },
    notExploded: {
      backgroundColor: "green",
    },
    isPlaying: {
      backgroundColor: "yellow",
    },
    notPlaying: {
      backgroundColor: "red",
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        horizontal={true}
      >
        <View style={styles.playersRow}>
          {players.map((player, index) => (
            <View
              key={index}
              style={[
                styles.playerInfo,
                player.isPlaying
                  ? player.hasExploded
                    ? styles.hasExploded
                    : styles.notExploded
                  : styles.notPlaying,
              ]}
            >
              <Text>{player.name}</Text>
              {/* <Text>{player.isPlaying ? "Jogando" : "Eliminado"}</Text> */}
              {/* <Text>{player.hasExploded ? "Estourou" : "Não estourou"}</Text> */}
              {/* {player.hasExploded && (
                <View>
                  <Text>Estourou com: {player.hasExplodedWith}</Text>
                  <Text>Voltou com: {player.isBackWith}</Text>
                </View>
              )} */}
              <Text>Total: {player.total}</Text>
              <Text>Escape: {player.scape}</Text>
              {player.points.map((point, index) => (
                <Text key={index}>{point}</Text>
              ))}
              <TextInput
                keyboardType="numeric"
                placeholder="Enter score"
                onChangeText={(text) => handleScoreChange(player.id, text)}
                onKeyPress={enableSubmitButton}
                value={scores[player.id] || ""}
                editable={player.isPlaying}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.finishButton,
          canSubmit ? styles.activeBtn : styles.inactiveBtn,
        ]}
        onPress={submitScores}
        disabled={!canSubmit}
      >
        <Text style={styles.finishButton}>Finalizar rodada</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
