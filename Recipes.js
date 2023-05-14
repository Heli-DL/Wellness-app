import React, { useState, useEffect } from 'react';
import { Text, View, Image, FlatList, StyleSheet, TextInput, TouchableOpacity, Keyboard, SafeAreaView, Modal, Linking } from 'react-native';
import { EDAMAM_API_KEY, EDAMAM_API_ID } from '@env';
import { ActivityIndicator } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('salad');
  const [numberOfResults, setNumberOfResults] = useState('5');
  const [openDiet, setOpenDiet] = useState(false);
  const [diet, setDiet] = useState(null);
  const [dietLabels, setDietLabels] = useState([
    {label: 'Balanced', value: 'balanced'},
    {label: 'High-Fiber', value: 'high-fiber'},
    {label: 'High-Protein', value: 'high-protein'},
    {label: 'Low-Carb', value: 'low-carb'},
    {label: 'Low-Fat', value: 'low-fat'},
    {label: 'Low-Sugar', value: 'low-sugar'},
    {label: 'Low-Sodium', value: 'low-sodium'}
  ]);
  const [openHealth, setOpenHealth] = useState(false);
  const [health, setHealth] = useState(null);
  const [healthLabels, setHealthLabels] = useState([
    {label: 'Dairy-Free', value: 'dairy-free'},
    {label: 'Gluten-Free', value: 'gluten-free'},
    {label: 'Kosher', value: 'kosher'},
    {label: 'Paleo', value: 'paleo'},
    {label: 'Pescatarian', value: 'pecatarian'},
    {label: 'Pork-Free', value: 'pork-free'},
    {label: 'Vegan', value: 'vegan'},
    {label: 'Vegetarian', value: 'vegetarian'},
    {label: 'Keto', value: 'keto-friendly'},
  ]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState({});

  const api_ID = EDAMAM_API_ID;
  const api_KEY = EDAMAM_API_KEY;

  // Fetch recipes from Edamam API
  async function getRecipes() {
    setLoading(true);
    let query = searchQuery ? searchQuery : "salad"; // If no search query is entered, default to "salad"
    let api_URL = `https://api.edamam.com/search?q=${query}&app_id=${api_ID}&app_key=${api_KEY}&from=0&to=${numberOfResults}`;
    if (health == '' || health == null && diet == '' || diet == null) { // If no health or diet is selected
      api_URL = `https://api.edamam.com/search?q=${query}&app_id=${api_ID}&app_key=${api_KEY}&from=0&to=${numberOfResults}`;
    } else if (health == '' || health == null) { // If no health is selected
      api_URL = `https://api.edamam.com/search?q=${query}&app_id=${api_ID}&app_key=${api_KEY}&from=0&to=${numberOfResults}&diet=${diet}`;
    } else if (diet == '' || diet == null) { // If no diet is selected
      api_URL = `https://api.edamam.com/search?q=${query}&app_id=${api_ID}&app_key=${api_KEY}&from=0&to=${numberOfResults}&health=${health}`;
    } else { // If both health and diet are selected
      api_URL = `https://api.edamam.com/search?q=${query}&app_id=${api_ID}&app_key=${api_KEY}&from=0&to=${numberOfResults}&diet=${diet}&health=${health}`;
    }
    let response = await fetch(api_URL);
    let data = await response.json();
    setRecipes(data.hits);
    setSearchQuery('');
    Keyboard.dismiss();
    setLoading(false);
  }
  
  useEffect(() => {
    setLoading(true);
    getRecipes();
  }, []);

  // Render recipe details
  const showModal = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>
        Recipes
      </Text>
      <View style={{ flexDirection: 'row', display: 'flex', marginBottom: 1, width: '100%' }}>
        <TextInput
          style={[styles.inputField, { color: '#979BA0'}]}
          placeholder='Search Recipe...'
          placeholderTextColor="#afb5ba" 
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <TextInput
          style={[styles.inputField, {width: '20%', fontSize: 18, marginLeft: 15, color: '#afb5ba', fontWeight: 'bold'} ]}
          onChangeText={text => setNumberOfResults(text)}
          value={numberOfResults}
          keyboardType='numeric'
        />
      </View>
      <View style={{ flexDirection: 'row', display: 'flex', zIndex: 1000, marginTop: 18, position: 'relative' }}>
      <DropDownPicker
        theme="DARK"
        placeholder="Select diet..."
        open={openDiet}
        value={diet}
        items={dietLabels}
        setOpen={setOpenDiet}
        setValue={setDiet}
        setItems={setDietLabels}
        closeAfterSelecting={true}
        listMode="MODAL"
      />
      </View>
      <View style={{ flexDirection: 'row', display: 'flex', zIndex: 1000, marginTop: 5, position: 'relative' }}>
        <DropDownPicker
          theme="DARK"
          placeholder="Select health label..."
          open={openHealth}
          value={health}
          items={healthLabels}
          setOpen={setOpenHealth}
          setValue={setHealth}
          setItems={setHealthLabels}
          closeAfterSelecting={true}
          listMode="MODAL"
        />
      </View>
        <TouchableOpacity style={styles.button}
          onPress={getRecipes}
          title='Search'>
            <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        <SafeAreaView style={{ flex: 1, zIndex: 100 }}>
          {loading ? <ActivityIndicator size='large' color='#24242F' /> : 
          <FlatList
          style={styles.recipes}
          data={recipes}
          renderItem={({ item }) => (
            <View style={styles.recipe}>
              <Image style={styles.image} source={{ uri: `${item.recipe.image}` }} />
              <View style={{ padding: 20, flexDirection: 'row' }}>
                <Text style={styles.label}>{item.recipe.label}</Text>
                <TouchableOpacity onPress={() => {{
                  setSelectedRecipe(item.recipe);
                  showModal();
                  }}}>
                  <Text style={styles.detailsText}>Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()} />}
          <View >
            <Modal visible={modalVisible} onRequestClose={() => {
            setModalVisible(!modalVisible);
            }}
            swipeDirection={"up"}
            >
            {Object.keys(selectedRecipe).length > 0 &&
            <ScrollView style={{ width: '100%', height: '100%', zIndex: 100, backgroundColor: '#12131A'}}>
              <View style={styles.details}>
                <View style={styles.item}>
                  <Image style={styles.image} source={{ uri: `${selectedRecipe.image}` }} />
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>
                    Label: 
                  </Text>
                  <Text style={styles.ingredients}>
                    {` ${selectedRecipe.label}`}
                  </Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>
                    Description: 
                  </Text>
                  <View style={{ marginBottom: 10 }}>
                    {selectedRecipe.ingredientLines.map((ingredient, index) => (
                      <Text key={index} style={styles.ingredientItem}>{`\u2022 ${ingredient}`}</Text>
                    ))}
                  </View>
                </View>
                <View style={styles.item}>
                  <Text style={styles.link} onPress={() => Linking.openURL(`${selectedRecipe.url}`)}>
                    Instructions
                  </Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>
                    Meal Type:
                  </Text>
                  <Text style={styles.ingredients}>
                    {` ${selectedRecipe.mealType}`}
                  </Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>
                    Diet Label:
                  </Text>
                  <Text style={styles.ingredients}>
                    {` ${selectedRecipe.dietLabels}`}
                  </Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>
                    Cuisine Type:
                  </Text>
                  <Text style={styles.ingredients}>
                    {` ${selectedRecipe.cuisineType}`}
                  </Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>
                    Calories: 
                  </Text>
                  <Text style={styles.ingredients}>
                    {` ${selectedRecipe.calories.toFixed(0)} kcal`}
                  </Text>
                </View>
              </View>
            </ScrollView>
              }
            </Modal>      
          </View>
        </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12131A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  pageTitle: {
    fontSize: 24, 
    width: '90%', 
    color: '#7dc7fa', 
    marginTop: 30, 
    textAlign: 'center',
    fontFamily: 'RobotoCondensed_700Bold',
  },
  inputField: {
    height: '110%',
    width: '75%',
    backgroundColor: '#292D3E',
    borderRadius: 7,
    marginTop: 10,
    paddingLeft: 15,
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#4FB6FC',
    width: '40%',
    alignItems: 'center',
    margin: 15,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'RobotoCondensed_700Bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 20,
  },
  label: {
    fontSize: 18,
    width: '60%',
    color: '#4FB6FC',
    fontFamily: 'RobotoCondensed_700Bold',
  },
  recipe: {
    textShadowColor: 'black',
    shadowQuality: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 20,
    backgroundColor: '#292D3E',
    margin: 10,
    marginBottom: 15,
  },
  detailsText: {
    marginLeft:50, 
    fontSize: 16, 
    color: '#4FB6FC', 
    fontFamily: 'RobotoCondensed_400Regular'
  },
  details: {
    marginBottom: 30,
    padding: 5,
  },
  ingredients: {
    fontSize: 18,
    color: '#FEFEFF',
  },
  ingredientItem: {
    fontSize: 18,
    color: '#FEFEFF',
    marginVertical: 2,
    marginLeft: 10,
  },
  item: {
    textShadowColor: 'black',
    shadowQuality: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: '#292D3E',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemTitle:{
    fontSize: 20, 
    color: '#4FB6FC', 
    fontFamily: 'RobotoCondensed_700Bold',
  },
  dropDown: {
    zIndex: 1000,
  },
  link: {
    fontSize: 20, 
    color: '#0261FB', 
    fontFamily: 'RobotoCondensed_700Bold',
    textDecorationLine: 'underline'
  }
});

export default Recipes;