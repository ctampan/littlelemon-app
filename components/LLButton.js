import { Pressable, StyleSheet, Text } from "react-native";

const LLButton = ({
  children,
  disabled,
  onPress,
  theme,
  buttonStyle,
  textStyle,
}) => {
  let themeStyleButton = buttonTheme.yellowButton;
  let themeStyleText = buttonTheme.yellowText;

  switch (theme) {
    case "white":
      themeStyleButton = buttonTheme.whiteButton;
      themeStyleText = buttonTheme.whiteText;
      break;
    case "green":
      themeStyleButton = buttonTheme.greenButton;
      themeStyleText = buttonTheme.greenText;
      break;
    default:
      themeStyleButton = buttonTheme.yellowButton;
      themeStyleText = buttonTheme.yellowText;
  }

  if (!!disabled) {
    themeStyleButton = buttonTheme.disabledButton;
    themeStyleText = buttonTheme.disabledText;
  }

  return (
    <Pressable
      style={[styles.button, themeStyleButton, buttonStyle]}
      disabled={!!disabled}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, themeStyleText, textStyle]}>
        {children}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexGrow: 1,
    borderRadius: 9,
    alignSelf: "stretch",
    marginHorizontal: 18,
    padding: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 22,
    fontFamily: "Karla-Bold",
    alignSelf: "center",
  },
});

const buttonTheme = StyleSheet.create({
  yellowButton: {
    backgroundColor: "#f4ce14",
    borderColor: "#f4ce14",
  },
  yellowText: { color: "#333" },

  greenButton: { backgroundColor: "#495e57", borderColor: "#3f554d" },
  greenText: { color: "#fff" },

  whiteButton: { backgroundColor: "#fff", borderColor: "#3f554d" },
  whiteText: { color: "#3f554d" },

  disabledButton: {
    backgroundColor: "lightgray",
    borderColor: "lightgray",
  },
  disabledText: { color: "#fff" },
});

export default LLButton;
