//Importing API_URL and getJSON helper function
import { API_URL, KEY, REC_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

const state = {
  recipe: {},
  search: {
    query: ``,
    results: [],
  },
  page: {
    previousPage: 0,
    currentPage: 1,
    nextPage: 2,
    maxPage: 1,
  },
  resultsOnPage: [],
  bookmarks: [],
};

const searchRecipes = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    if (!data.results)
      throw new Error(
        `Cannot find any recipes! Please try searching something else.`
      );
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
  } catch (err) {
    throw err;
  }
};

const recipesOnPage = function () {
  const start = (state.page.currentPage - 1) * REC_PER_PAGE;
  const end = state.page.currentPage * REC_PER_PAGE;
  state.resultsOnPage = state.search.results.slice(start, end);
};

const calcMaxPage = function () {
  state.page.maxPage = Math.ceil(state.search.results.length / REC_PER_PAGE);
};

const resetPageState = function () {
  state.recipe = {};
  state.search.query = ``;
  state.search.results = [];
  state.page.previousPage = 0;
  state.page.currentPage = 1;
  state.page.nextPage = 2;
  state.page.maxPage = 1;
  state.resultsOnPage = [];
};

const moveToNextPage = function () {
  state.page.previousPage++;
  state.page.currentPage++;
  state.page.nextPage++;
};

const moveToPreviousPage = function () {
  state.page.previousPage--;
  state.page.currentPage--;
  state.page.nextPage--;
};

const getBookmarks = function () {
  const data = JSON.parse(localStorage.getItem(`bookmarks`));
  if (!data) return;
  state.bookmarks = data;
};

const pushBookmark = function () {
  // if (state.bookmarks.some(recipe => recipe.id === state.recipe.id)) return;
  state.bookmarks.push(state.recipe);
  localStorage.setItem(`bookmarks`, JSON.stringify(state.bookmarks));
};

const removeBookmark = function () {
  const index = state.bookmarks.findIndex(
    recipe => recipe.id === state.recipe.id
  );
  state.bookmarks.splice(index, 1);
  localStorage.setItem(`bookmarks`, JSON.stringify(state.bookmarks));
};

const uploadRecipe = async function (data) {
  try {
    const ingredients = Object.entries(data)
      .filter(entry => entry[0].startsWith(`ingredient`) && entry[1] !== ``)
      .map(ing => {
        const ingInfo = ing[1].split(`,`).map(el => el.trim());
        if (ingInfo.length !== 3)
          throw new Error(`Please write in proper format!`);
        const [quantity, unit, description] = ingInfo;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      cooking_time: +data.cookingTime,
      image_url: data.image,
      ingredients,
      publisher: data.publisher,
      servings: +data.servings,
      source_url: data.sourceUrl,
      title: data.title,
    };

    const res = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(res);
    pushBookmark();
  } catch (err) {
    throw err;
  }
};

export {
  searchRecipes,
  state,
  loadRecipe,
  recipesOnPage,
  resetPageState,
  calcMaxPage,
  moveToNextPage,
  moveToPreviousPage,
  pushBookmark,
  getBookmarks,
  removeBookmark,
  uploadRecipe,
};
