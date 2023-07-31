import { API_KEY, API_URL, RES_PER_PAGE, API_KEY } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    results: [],
    query: '',
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    let data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
    console.log('sr', state.recipe);
  } catch (err) {
    console.error(`${err} 💥💥`);
    throw err;
  }
};

//Search functionality
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥`);
    throw err;
  }
};
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (serve) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * serve) / state.recipe.servings;
  });
  state.recipe.servings = serve;
};
export const clickServe = function () {
  const currentServe = state.recipe.servings;
};
const storeBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(state.recipe);
  console.log(state.bookmarks);
  console.log('hello', state.recipe);
  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
    storeBookmarks();
  }
};

export const deleteBookmark = function (id) {
  //Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark current recipe as not bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
    storeBookmarks();
  }
};
const init = function () {
  // 1) parse json from local storage
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  // console.log(Object.entries(newRecipe));
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].includes('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error('Enter a valid input format!');
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    console.log(recipe.cooking_time, recipe.source_url);
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    console.log('pop', state.recipe);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
// console.log(state.bookmarks);
