import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

type Props = {
  value: string;
  data: string[];
  placeholder: string;
  onChangeText: (text: string) => void;
};

const AutocompleteInput: React.FC<Props> = ({ value, data, placeholder, onChangeText }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredData = data.filter(
    (item) => item.toLowerCase().indexOf(value.toLowerCase()) > -1
  );

  const handleSelectItem = (item: string) => {
    onChangeText(item);
    setShowSuggestions(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        onChangeText={(text) => {
          onChangeText(text);
          setShowSuggestions(true);
        }}
        onBlur={() => setShowSuggestions(false)}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && filteredData.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectItem(item)} style={styles.suggestionItem}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: Platform.OS === 'ios' ? 1 : 0, // Adjust zIndex for iOS and Android
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 45, // Adjust based on your input height
    left: 0,
    right: 0,
    maxHeight: 150,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: Platform.OS === 'ios' ? 2 : 0, // Adjust zIndex for iOS and Android
    elevation: 3, // For Android
  },
  suggestionItem: {
    padding: 8,
  },
});

export default AutocompleteInput;
