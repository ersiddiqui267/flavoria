import { Views } from './views.js';
import icons from '../../img/icons.svg';

class ResultsView extends Views {
  _parentElement = document.querySelector(`.results`);
  _errorMessage = `No search results! Try searching something else.`;

  _generateMarkup() {
    return this._data
      .map(recipe => {
        const id = window.location.hash.slice(1);

        return `
        <li class="preview ${recipe.id === id ? `preview__link--active` : ``}">
        <a class="preview__link" href="#${recipe.id}">
          <figure class="preview__fig">
            <img src="${recipe.image}" alt="${recipe.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${recipe.title}</h4>
            <p class="preview__publisher">${recipe.publisher}</p>
            <div class="preview__user-generated ${recipe.key ? `` : `hidden`}">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
            </div>
          </div>
        </a>
      </li>
        `;
      })
      .join(``);
  }
}

export default new ResultsView();
