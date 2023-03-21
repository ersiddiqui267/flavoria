import { Views } from './views.js';
import icons from '../../img/icons.svg';

class BookmarksView extends Views {
  _parentElement = document.querySelector(`.bookmarks__list`);

  _generateMarkup() {
    if (this._data.length === 0)
      return `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
             <p>
                 No bookmarks yet. Find a nice recipe and bookmark it :)
             </p>
        </div>
    `;
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

export default new BookmarksView();
