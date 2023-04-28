import React, { useState, useEffect } from 'react';
import { Text, View, Image, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { EDAMAM_API_KEY, EDAMAM_API_ID } from '@env';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('all');
  const [selectedMealType, setSelectedMealType] = useState('all');

  const handleSearchKeywordChange = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleDietChange = (itemValue) => {
    setSelectedDiet(itemValue);
  };

  const handleMealTypeChange = (itemValue) => {
    setSelectedMealType(itemValue);
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
  };
  
  useEffect(() => {
    const App_ID = EDAMAM_API_ID;
    const Api_KEY = EDAMAM_API_KEY;
    let API_URL = `https://api.edamam.com/search?app_id=${App_ID}&app_key=${Api_KEY}`;
    if (searchKeyword) {
      API_URL += `&q=${searchKeyword}`;
    }
    if (selectedDiet !== 'all') {
      API_URL += `&diet=${selectedDiet}`;
    }
    if (selectedMealType !== 'all') {
      API_URL += `&mealType=${selectedMealType}`;
    }

    const fetchRecipes = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setRecipes(data.hits);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecipes();
  }, [searchKeyword, selectedDiet, selectedMealType]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleRecipeSelect(item.recipe)}>
      <View style={{ padding: 10 }}>
        <Image
        source={{ uri: item.recipe.image }}
        style={{ width: '100%', height: 200 }}
        />
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {item.recipe.label}
        </Text>
        <Text>Calories: {Math.round(item.recipe.calories)}</Text>
        <Text>Servings: {item.recipe.yield}</Text>
      </View>
    </TouchableOpacity>
  );

  const RecipeDetail = ({ recipe }) => (
    <View style={{ padding: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
        {recipe.label}
      </Text>
      <Text>Calories: {Math.round(recipe.calories)}</Text>
      <Text>Servings: {recipe.yield}</Text>
      <Text>Ingredients:</Text>
      <FlatList
        data={recipe.ingredients}
        keyExtractor={(item) => item.foodId}
        renderItem={({ item }) => <Text>- {item.text}</Text>}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Search for Recipes
      </Text>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
          padding: 10,
        }}
        onChangeText={handleSearchKeywordChange}
        value={searchKeyword}
        placeholder="Enter keyword to search for recipes"
      />
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <Text style={{ marginRight: 10 }}>Diet:</Text>
        <Picker
          selectedValue={selectedDiet}
          style={{ width: 150 }}
          onValueChange={handleDietChange}>
          <Picker.Item label="Balanced" value="balanced" />
          <Picker.Item label="High-Protein" value="high-protein" />
          <Picker.Item label="Low-Carb" value="low-carb" />
          <Picker.Item label="Low-Fat" value="low-fat" />
          <Picker.Item label="Vegetarian" value="vegetarian" />
          <Picker.Item label="Vegan" value="vegan" />
        </Picker>
        <Text style={{ marginRight: 10, marginLeft: 10 }}>Meal Type:</Text>
        <Picker
          selectedValue={selectedMealType}
          style={{ width: 150 }}
          onValueChange={handleMealTypeChange}>
          <Picker.Item label="Breakfast" value="breakfast" />
          <Picker.Item label="Lunch" value="lunch" />
          <Picker.Item label="Dinner" value="dinner" />
          <Picker.Item label="Snack" value="snack" />
        </Picker>
      </View>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.recipe.uri}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});