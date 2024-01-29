import React, { useState, useRef, useContext, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import PagerView from "react-native-pager-view";
import { validateEmail, validateName } from "../utils";
import Constants from "expo-constants";

import { AuthContext } from "../contexts/AuthContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ProgressBar } from "react-native-paper";
import LLButton from "../components/LLButton";

const Onboarding = () => {
  const [firstName, onChangeFirstName] = useState("");
  const [lastName, onChangeLastName] = useState("");
  const [email, onChangeEmail] = useState("");
  const [progress, setProgress] = useState(0);

  const isEmailValid = validateEmail(email);
  const isFirstNameValid = validateName(firstName);
  const isLastNameValid = validateName(lastName);
  const viewPagerRef = useRef(PagerView);

  const { onboard } = useContext(AuthContext);

  // FONTS
  const [fontsLoaded] = useFonts({
    "Karla-Regular": require("../assets/fonts/Karla-Regular.ttf"),
    "Karla-Medium": require("../assets/fonts/Karla-Medium.ttf"),
    "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
    "Karla-ExtraBold": require("../assets/fonts/Karla-ExtraBold.ttf"),
    "MarkaziText-Regular": require("../assets/fonts/MarkaziText-Regular.ttf"),
    "MarkaziText-Medium": require("../assets/fonts/MarkaziText-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      onLayout={onLayoutRootView}
    >
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../img/littleLemonLogo.png")}
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />
      </View>
      <Text style={styles.welcomeText}>Let us get to know you</Text>
      <ProgressBar progress={(progress + 1) / 3} color={"#f4ce14"} />
      <PagerView
        style={styles.viewPager}
        scrollEnabled={false}
        initialPage={0}
        ref={viewPagerRef}
      >
        <View style={styles.page} key="1">
          <View style={styles.pageContainer}>
            <Text style={styles.text}>First Name</Text>
            <TextInput
              style={styles.inputBox}
              value={firstName}
              onChangeText={onChangeFirstName}
              placeholder={"First Name"}
            />
          </View>
          <View style={styles.buttons}>
            <LLButton
              onPress={() => {
                if (isFirstNameValid) {
                  viewPagerRef.current.setPage(1);
                  setProgress(1);
                } else
                  Alert.alert(
                    "The first name must contain alphabetic characters only."
                  );
              }}
            >
              Next
            </LLButton>
          </View>
        </View>
        <View style={styles.page} key="2">
          <View style={styles.pageContainer}>
            <Text style={styles.text}>Last Name</Text>
            <TextInput
              style={styles.inputBox}
              value={lastName}
              onChangeText={onChangeLastName}
              placeholder={"Last Name"}
            />
          </View>
          <View style={styles.buttons}>
            <LLButton
              onPress={() => {
                viewPagerRef.current.setPage(0);
                setProgress(0);
              }}
            >
              Back
            </LLButton>
            <LLButton
              onPress={() => {
                if (isLastNameValid) {
                  viewPagerRef.current.setPage(2);
                  setProgress(2);
                } else
                  Alert.alert(
                    "The last name must contain alphabetic characters only."
                  );
              }}
            >
              Next
            </LLButton>
          </View>
        </View>
        <View style={styles.page} key="3">
          <View style={styles.pageContainer}>
            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.inputBox}
              value={email}
              onChangeText={onChangeEmail}
              placeholder={"Email"}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.buttons}>
            <LLButton
              onPress={() => {
                viewPagerRef.current.setPage(1);
                setProgress(1);
              }}
            >
              Back
            </LLButton>
            <LLButton
              onPress={() => onboard({ firstName, lastName, email })}
              disabled={!isEmailValid}
            >
              Submit
            </LLButton>
          </View>
        </View>
      </PagerView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFAF5",
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#dfe3e9",
  },
  logo: {
    height: 75,
    width: 150,
    resizeMode: "contain",
  },
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
  },
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 40,
    paddingVertical: 60,
    fontFamily: "MarkaziText-Medium",
    color: "#495E57",
    textAlign: "center",
  },
  text: {
    fontSize: 24,
    fontFamily: "Karla-ExtraBold",
    color: "#495E57",
  },
  inputBox: {
    borderColor: "#EDEFEE",
    backgroundColor: "#EDEFEE",
    alignSelf: "stretch",
    height: 50,
    margin: 18,
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    borderRadius: 9,
    fontFamily: "Karla-Medium",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 60,
  },
});

export default Onboarding;
