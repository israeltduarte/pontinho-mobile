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
    return (
      inputValue !== "" &&
      inputValue !== null &&
      !isNaN(inputValue) &&
      inputValue >= 0
    );
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

    players
      .filter((player) => !player.isPlaying)
      .forEach((player) => {
        fillPointsWithDash(player);
      });

    updatePlayersThatExploded();
    updatePlayersThatWereEliminated();
  };

  const fillPointsWithDash = (player) => {
    let pointsLength = players.filter((player) => player.isPlaying)[0].points
      .length;

    if (pointsLength > player.points.length) {
      player.points.push("-");
    }
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
    checkIfSomeoneWonTheGame();
    players
      .filter((player) => player.isPlaying)
      .filter((player) => player.total > 99)
      .forEach((player) => updateExplodedPlayerInfo(player));
  };

  const checkIfSomeoneWonTheGame = () => {
    const playingPlayers = players
      .filter((player) => player.isPlaying)
      .filter((player) => !player.hasExploded);

    if (playingPlayers.length === 1) {
      players
        .filter((player) => player.hasExploded)
        .forEach((player) => eliminatePlayer(player));
    }
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
        <View style={PlayerStyle.playerRow}>
          {players.map((player, index) => (
            <View
              key={"playerSection" + index}
              style={[PlayerStyle.playerColumn]}
            >
              <View
                key={"playerTitle" + index}
                style={[PlayerStyle.playerTitle]}
              >
                <Text>{player.name}</Text>
              </View>
              <View
                key={"playerInfo" + index}
                style={[
                  PlayerStyle.playerInfo,
                  player.isPlaying
                    ? player.hasExploded
                      ? ColorStyle.hasExploded
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
                  style={[
                    ButtonStyle.points,
                    player.isPlaying
                      ? ColorStyle.bgWhite
                      : ButtonStyle.inactive,
                  ]}
                  keyboardType="numeric"
                  placeholder="0"
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
          canSubmit ? ButtonStyle.active : ButtonStyle.inactive,
        ]}
        onPress={submitScores}
        disabled={!canSubmit}
      >
        <Text style={ButtonStyle.finish}>Finalizar rodada</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[ButtonStyle.btn, ButtonStyle.restart]}
        onPress={restartGame}
      >
        <Text style={ButtonStyle.restart}>Novo Jogo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
