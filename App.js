import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import data from "./api/data.json";

const App = () => {
  const [players, setPlayers] = useState(data.players);
  const [roundNumber, setRoundNumber] = useState(1);
  const [round, setRound] = useState(new Map());
  const [canSubmit, setCanSubmit] = useState(false);
  const [highestTotal, setHighestTotal] = useState(0);
  const [roundWinner, setRoundWinner] = useState(null);

  const submitScores = () => {
    if (canSubmit) {
      updateRoundScores();
      updateScores();
    }
  };

  const updateRoundScores = () => {
    players
      .filter((player) => player.isPlaying)
      .forEach((player) => {
        const score = parseInt(getInputValue(player.id));
        if (score === 0) {
          setRoundWinner(player);
        }
        round.set(player.id, score);
      });
  };

  const getInputValue = (playerId) => {
    // Implement your logic to get input value using useRef or other React Native approach
    return "";
  };

  const updateScores = () => {
    players
      .filter((player) => player.isPlaying)
      .forEach((player) => {
        addScore(player, round.get(player.id));
        clearNewScoreField(player);
      });

    setHighestTotal(getHighestValidTotal());
    updatePlayersThatExploded();
  };

  const addScore = (player, score) => {
    addPoints(player, score);
    updateTotal(player, score);
    updateScape(player);
  };

  const addPoints = (player, newScore) => {
    player.points.push(newScore);
  };

  const updateTotal = (player, newScore) => {
    player.total = player.total + newScore;
    if (player.total > 99) {
      if (player.hasExploded) {
        eliminatePlayer(player);
        player.isPlaying = false;
      }
      player.hasExploded = true;
    }
  };

  const updateScape = (player) => {
    if (player.isPlaying) {
      player.scape = 99 - player.total;
    }
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
      .forEach((player) => explodePlayer(player));
  };

  const explodePlayer = (player) => {
    player.hasExplodedWith = player.total;
    player.total = highestTotal;
    player.isBackWith = player.total;
    updateScape(player);
  };

  const eliminatePlayer = (player) => {
    player.isPlaying = false;
  };

  const getHighestValidTotal = () => {
    return players
      .filter((player) => player.total <= 99)
      .reduce((highestTotal, currentPlayer) => {
        return Math.max(highestTotal, currentPlayer.total);
      }, 0);
  };

  const enableSubmitButton = () => {
    setCanSubmit(
      players
        .filter((player) => player.isPlaying)
        .every((player) => {
          const inputValue = getInputValue(player.id);
          return inputValue !== "" && inputValue !== null;
        })
    );
  };

  const clearNewScoreField = (player) => {
    // Implement your logic to clear input field
    enableSubmitButton();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {players.map((player, index) => (
        <View
          key={index}
          style={{
            borderWidth: 1,
            borderColor: player.hasExploded ? "red" : "green",
            padding: 8,
            marginBottom: 8,
          }}
        >
          <Text>{player.name}</Text>
          <Text>{player.isPlaying ? "Jogando" : "Eliminado"}</Text>
          <Text>{player.hasExploded ? "Estourou" : "Não estourou"}</Text>
          {player.hasExploded && (
            <View>
              <Text>Estourou com: {player.hasExplodedWith}</Text>
              <Text>Voltou com: {player.isBackWith}</Text>
            </View>
          )}
          <Text>Total: {player.total}</Text>
          <Text>Escape: {player.scape}</Text>
          {player.points.map((point, index) => (
            <Text key={index}>{point}</Text>
          ))}
          <TextInput
            keyboardType="numeric"
            placeholder="Enter score"
            onChangeText={enableSubmitButton}
            editable={player.isPlaying}
          />
        </View>
      ))}
      <Button
        title="Finalizar rodada"
        onPress={submitScores}
        disabled={!canSubmit}
      />
    </View>
  );
};

export default App;
