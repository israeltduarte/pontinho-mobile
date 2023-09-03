export const Colors = {
  playing: "green",
  notPlaying: "red",
  exploded: "yellow",
  notExploded: "green",
  restartBtn: "blue",
  finishBtn: "lightred",
  activeBtn: "#E61003",
  inactiveBtn: "#FF7771",
};

import { StyleSheet } from "react-native";

export const PlayerStyle = StyleSheet.create({
  playersRow: {
    flexDirection: "row",
    marginBottom: 16,
    marginTop: 20,
  },
  playerContainer: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
    alignItems: "center",
  },
  playerInfo: {
    padding: 8,
    marginBottom: 8,
    marginRight: 8,
    flexDirection: "column",
    borderWidth: 1,
    alignItems: "center",
  },
  playerTitleBox: {
    alignItems: "center",
    // padding: 4,
    borderColor: "red",
    borderWidth: 2,
  },
  playerTitle: {
    fontSize: 20,
  },
});

export const ButtonStyle = StyleSheet.create({
  btn: {
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
  },
});

export const ColorStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  finishBtn: {
    color: "white",
  },
  restartBtn: {
    color: "white",
    backgroundColor: Colors.restartBtn,
  },
  activeBtn: {
    backgroundColor: Colors.activeBtn,
  },
  inactiveBtn: {
    backgroundColor: "#FF7771",
  },
  hasExploded: {
    backgroundColor: Colors.exploded,
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
