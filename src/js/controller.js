// Importing Pollyfilling Libraries
import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

//Importing MVC Modules
import searchView from './view/searchView.js';
import * as model from './model.js';
import resultsView from './view/resultsView.js';
import recipeView from './view/recipeView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

const controlSearchView = async function (e) {
  try {
    e.preventDefault();
    const query = searchView.getQuery();
    if (!query) return;
    searchView.clear();
    model.resetPageState();
    paginationView.clear();
    resultsView.showSpinner();
    await model.searchRecipes(query);
    model.calcMaxPage();
    model.recipesOnPage();
    resultsView.render(model.state.resultsOnPage);
    // render buttons
    paginationView.showButtons(model.state.page);
  } catch (err) {
    resultsView.renderError(err.message);
  }
};

const controlRecipeView = async function () {
  try {
    const id = recipeView.getHash();
    if (!id) return;
    resultsView.update(model.state.resultsOnPage);
    bookmarksView.update(model.state.bookmarks);
    recipeView.showSpinner();
    await model.loadRecipe(id);
    recipeView.render(model.state);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlPagination = function (btn) {
  btn.classList.contains(`pagination__btn--next`)
    ? model.moveToNextPage()
    : model.moveToPreviousPage();

  paginationView.updateButtons();
  model.recipesOnPage();
  resultsView.render(model.state.resultsOnPage);
};

const controlServings = function (newServings) {
  model.state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity / model.state.recipe.servings) * newServings;
  });

  model.state.recipe.servings = newServings;

  recipeView.update(model.state);
};

const controlBookmarksView = function (btn) {
  btn.querySelector(`.bookmarked`)
    ? model.removeBookmark()
    : model.pushBookmark();
  bookmarksView.render(model.state.bookmarks);
  recipeView.update(model.state);
};

const controlAddRecipe = async function (data) {
  try {
    addRecipeView.showSpinner();
    await model.uploadRecipe(data);

    //history API
    window.history.pushState(null, ``, `#${model.state.recipe.id}`);

    bookmarksView.render(model.state.bookmarks);
    recipeView.render(model.state);
    addRecipeView.renderMessage();

    setTimeout(
      addRecipeView.closeModal.bind(addRecipeView),
      MODAL_CLOSE_SEC * 1000
    );
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  model.getBookmarks();
  bookmarksView.render(model.state.bookmarks);
  searchView.attachHandlerControlSearchView(controlSearchView);
  recipeView.attachHandlerControlRecipeView(controlRecipeView);
  recipeView.attachHandlerControlServings(controlServings);
  recipeView.attachHandlerControlBookmarksView(controlBookmarksView);
  paginationView.attachHandlerControlPage(controlPagination);
  addRecipeView.addHandlerAddRecipe(controlAddRecipe);
};
init();
