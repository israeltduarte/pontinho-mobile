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
import { ButtonStyle, ColorStyle, PlayerStyle } from "./styles/MainStyle";

const App = () => {
  const [players, setPlayers] = useState(data.players);
  const [canSubmit, setCanSubmit] = useState(false);
  const [scores, setScores] = useState({});

  const restartGame = () => {
    players.forEach((player) => {
      player.isPlaying = true;
      player.points = [];
      player.total = 0;
      player.scape = 99;
      player.hasExploded = false;
      player.hasExplodedWith = 0;
      player.isBackWith = 0;
    });

    setScores({});
  };

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
    scrollViewContent: {
      flexGrow: 1,
    },
  });

  return (
    <View style={PlayerStyle.playerContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        horizontal={true}
      >
        <View style={PlayerStyle.playersRow}>
          {players.map((player, index) => (
            <View key={"playerSection" + index}>
              <View
                key={"playerTitle" + index}
                style={[PlayerStyle.playerTitleBox]}
              >
                <Text style={PlayerStyle.playerTitle}>{player.name}</Text>
              </View>
              <View
                key={"playerInfo" + index}
                style={[
                  PlayerStyle.playerInfo,
                  player.isPlaying
                    ? ColorStyle.isPlaying
                      ? ColorStyle.notPlaying
                      : ColorStyle.notExploded
                    : ColorStyle.notPlaying,
                ]}
              >
                <Text>Total: {player.total}</Text>
                <Text>Escape: {player.scape}</Text>
                {player.points.map((point, index) => (
                  <Text key={"playerPoint" + index}>{point}</Text>
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
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[
          ButtonStyle.btn,
          canSubmit ? ColorStyle.activeBtn : ColorStyle.inactiveBtn,
        ]}
        onPress={submitScores}
        disabled={!canSubmit}
      >
        <Text style={ColorStyle.finishBtn}>Finalizar rodada</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[ButtonStyle.btn, ColorStyle.restartBtn]}
        onPress={restartGame}
      >
        <Text style={ColorStyle.restartBtn}>Novo Jogo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
