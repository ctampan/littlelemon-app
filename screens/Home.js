import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  Alert,
  Image,
  Pressable,
} from "react-native";
import { Searchbar } from "react-native-paper";
import debounce from "lodash.debounce";
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from "../database";
import Filters from "../components/Filters";
import { getSectionListData, useUpdateEffect } from "../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import LLAvatar from "../components/LLAvatar";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const sections = ["starters", "mains", "desserts"];

const Item = ({ name, price, description, image }) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemBody}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>${price}</Text>
    </View>
    <Image
      style={styles.itemImage}
      source={{
        uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`,
      }}
    />
  </View>
);

const Home = ({ navigation }) => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
    image: "",
  });
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      const menu = json.menu.map((item, index) => ({
        id: index + 1,
        name: item.name,
        price: item.price.toString(),
        description: item.description,
        image: item.image,
        category: item.category,
      }));
      return menu;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      let menuItems = [];
      try {
        await createTable();
        menuItems = await getMenuItems();
        if (!menuItems.length) {
          menuItems = await fetchData();
          saveMenuItems(menuItems);
        }
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
        const getProfile = await AsyncStorage.getItem("profile");
        setProfile(JSON.parse(getProfile));
      } catch (e) {
        Alert.alert(e.message);
      }
    })();

    const unsubscribe = navigation.addListener("focus", async () => {
      const getProfile = await AsyncStorage.getItem("profile");
      if (getProfile) setProfile(JSON.parse(getProfile));
    });

    return unsubscribe;
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

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
    <View style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../img/littleLemonLogo.png")}
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />
        <Pressable
          style={styles.avatarContainer}
          onPress={() => navigation.navigate("Profile")}
        >
          <LLAvatar profile={profile} />
        </Pressable>
      </View>
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Little Lemon</Text>
        <Text style={styles.heroSubTitle}>Chicago</Text>
        <View style={styles.heroBody}>
          <View style={styles.heroContent}>
            <Text style={styles.heroText}>
              We are a family owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image
            style={styles.heroImage}
            source={require("../img/restauranfood.png")}
            accessible={true}
            accessibilityLabel={"Little Lemon Food"}
          />
        </View>
        <Searchbar
          placeholder="Search"
          placeholderTextColor="#333333"
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={styles.searchBar}
          iconColor="#333333"
          inputStyle={{ color: "#333333" }}
          elevation={0}
        />
      </View>
      <Text style={styles.delivery}>ORDER FOR DELIVERY!</Text>
      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />
      <SectionList
        style={styles.sectionList}
        sections={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item
            name={item.name}
            price={item.price}
            description={item.description}
            image={item.image}
          />
        )}
        renderSectionHeader={({ section: { name } }) => (
          <Text style={styles.itemHeader}>{name}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#FBFAF5",
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  searchBar: {
    marginTop: 15,
    backgroundColor: "#e4e4e4",
    shadowRadius: 0,
    shadowOpacity: 0,
    borderRadius: 6,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingVertical: 10,
    gap: 10,
  },
  itemBody: {
    flex: 1,
  },
  itemHeader: {
    fontSize: 24,
    paddingVertical: 8,
    color: "#495e57",
    backgroundColor: "#fff",
    fontFamily: "Karla-ExtraBold",
  },
  name: {
    fontSize: 20,
    color: "#000000",
    paddingBottom: 5,
    fontFamily: "Karla-Bold",
  },
  description: {
    color: "#495e57",
    paddingRight: 5,
    fontFamily: "Karla-Medium",
  },
  price: {
    fontSize: 18,
    color: "#5f6e68",
    paddingTop: 10,
    fontFamily: "Karla-Medium",
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  avatarContainer: {
    flex: 1,
    position: "absolute",
    right: 10,
    top: 10,
  },
  heroSection: {
    backgroundColor: "#4c5d57",
    padding: 15,
  },
  heroTitle: {
    color: "#f4ce14",
    fontSize: 54,
    fontFamily: "MarkaziText-Medium",
    marginBottom: -15,
  },
  heroSubTitle: {
    color: "#fff",
    fontSize: 30,
    fontFamily: "MarkaziText-Medium",
  },
  heroText: {
    color: "#fff",
    fontFamily: "Karla-Medium",
    fontSize: 15,
  },
  heroBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 10,
  },
  heroContent: {
    flex: 1,
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginTop: -30,
  },
  delivery: {
    fontSize: 18,
    padding: 15,
    fontFamily: "Karla-ExtraBold",
  },
});

export default Home;
