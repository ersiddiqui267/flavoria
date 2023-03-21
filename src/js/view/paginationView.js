import icons from '../../img/icons.svg';

class PaginationView {
  _parentElement = document.querySelector(`.pagination`);
  _page;

  showButtons(page) {
    this._page = page;
    if (this._page.maxPage === 1) return;
    const markup = this._createButtonsMarkup();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  updateButtons() {
    const markup = this._createButtonsMarkup();
    this.clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  _createButtonsMarkup() {
    if (this._page.currentPage === 1)
      return `
    <button class="btn--inline pagination__btn--next">
      <span>Page ${this._page.nextPage}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;

    if (this._page.currentPage === this._page.maxPage)
      return `
    <button class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${this._page.previousPage}</span>
    </button>
    `;

    return `
    <button class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${this._page.previousPage}</span>
    </button>
    <button class="btn--inline pagination__btn--next">
      <span>Page ${this._page.nextPage}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
  `;
  }

  clear() {
    this._parentElement.innerHTML = ``;
  }

  attachHandlerControlPage(handler) {
    this._parentElement.addEventListener(`click`, function (e) {
      const btn = e.target.closest(`.btn--inline`);
      if (!btn) return;
      handler(btn);
    });
  }
}

export default new PaginationView();
