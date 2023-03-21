class SearchView {
  _parentElement = document.querySelector(`.search`);

  getQuery() {
    return this._parentElement.querySelector(`.search__field`).value;
  }

  clear() {
    this._parentElement.querySelector(`.search__field`).value = ``;
  }

  attachHandlerControlSearchView(handler) {
    this._parentElement
      .querySelector(`.search__btn`)
      .addEventListener(`click`, handler);
  }
}

export default new SearchView();
