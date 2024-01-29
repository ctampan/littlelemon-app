import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onChange(index);
          }}
          style={[
            styles.filtersButton,
            {
              flex: 1 / sections.length,
              backgroundColor: selections[index] ? "#495e57" : "#edefee",
            },
          ]}
        >
          <View>
            <Text
              style={{
                fontFamily: "Karla-ExtraBold",
                fontSize: 16,
                color: selections[index] ? "#edefee" : "#495e57",
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
    gap: 20,
  },
  filtersButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
  },
});

export default Filters;
