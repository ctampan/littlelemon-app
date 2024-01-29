import { Image, StyleSheet, Text, View } from "react-native";

const LLAvatar = ({ profile, size }) => {
  return profile.image ? (
    <Image
      source={{ uri: profile.image }}
      style={[
        styles.avatarImage,
        size ? { width: size, height: size, borderRadius: size } : {},
      ]}
    />
  ) : (
    <View
      style={[
        styles.avatarInitial,
        size ? { width: size, height: size, borderRadius: size } : {},
      ]}
    >
      <Text style={styles.avatarInitialText}>
        {profile.firstName && Array.from(profile.firstName)[0].toUpperCase()}
        {profile.lastName && Array.from(profile.lastName)[0].toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarInitial: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#7bd3c5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitialText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default LLAvatar;
