import { StyleSheet } from "react-native";

export const Colors = {
  playing: "#A3DFA3",
  notPlaying: "#F8BEBE",
  exploded: "#F4F487",
  notExploded: "#A3DFA3",
  restart: "#6072FC",
  finish: "#FF7771",
  active: "#E61003",
  inactive: "#F8BEBE",
};

export const PlayerStyle = StyleSheet.create({
  playerContainer: {
    flex: 1,
    width: "100%",
    padding: 8,
    alignItems: "center",
  },
  playerRow: {
    marginBottom: 10,
    marginTop: 20,
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  playerColumn: {
    marginRight: 5,
    width: "48%",
  },
  playerTitle: {
    alignItems: "center",
    padding: 4,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
  },
  playerInfo: {
    padding: 8,
    marginBottom: 8,
    flexDirection: "column",
    borderWidth: 1,
    alignItems: "center",
  },
});

export const ButtonStyle = StyleSheet.create({
  btn: {
    width: "100%",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
  },
  finish: {
    color: "white",
  },
  restart: {
    color: "white",
    backgroundColor: Colors.restart,
  },
  active: {
    backgroundColor: Colors.active,
  },
  inactive: {
    backgroundColor: Colors.inactive,
  },
  points: {
    textAlign: "center",
    height: 50,
    backgroundColor: "white",
    fontSize: 25,
    minWidth: 50,
    margin: 10,
  },
});

export const ColorStyle = StyleSheet.create({
  hasExploded: {
    backgroundColor: Colors.exploded,
  },
  notExploded: {
    backgroundColor: Colors.notExploded,
  },
  isPlaying: {
    backgroundColor: Colors.playing,
  },
  notPlaying: {
    backgroundColor: Colors.notPlaying,
  },
  bgWhite: {
    backgroundColor: "white",
  },
});
