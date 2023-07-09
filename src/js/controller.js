// import icons from 'url:../img/icons.svg';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import { render } from 'sass';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// import { async } from 'regenerator-runtime';
// const recipeContainer = document.querySelector('.recipe');

// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

// https://forkify-api.herokuapp.com/v2
// console.log('TEST');
///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark searched results
    resultsView.update(model.getSearchResultsPage());

    //1) updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    console.log('Error above');

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(`${err} 🦭`);
  }
};

const controlSearchResults = async function () {
  try {
    // Render Spinner
    resultsView.renderSpinner();

    // 1) Get Search query
    const query = searchView.getQuery();

    if (!query) return;
    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // const results = model.state.search.results;
    const results = model.getSearchResultsPage();
    console.log('res', results);
    // console.log('ress', results);
    resultsView.render(results);

    // 4) render initial pagination buttons
    const pageResults = model.state.search;
    paginationView.render(pageResults);
  } catch (err) {
    console.error(`${err} 🦭`);
  }
};
const controlPagination = function (goToPage) {
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render before and after that page buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServe) {
  //Update the recipe servings (in state)
  model.updateServings(newServe);

  //Update the recipe view
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update Recipe view
  // console.log(model.state.bookmarks);
  recipeView.update(model.state.recipe);

  // 3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe
    await model.uploadRecipe(newRecipe);
    console.log('Receipe', model.state.recipe);

    //render the new recipe
    recipeView.render(model.state.recipe);

    //display the success message
    addRecipeView.successMessage();
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    //render bookmarks
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    console.error(`${err}, 🚴`);
    addRecipeView.renderError(err.message);
  }
};
const newMessage = function () {
  console.log('new Message');
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView._addClickHandler(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newMessage();
};

init();
// controlRecipes();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
