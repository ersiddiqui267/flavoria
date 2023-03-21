import icons from '../../img/icons.svg';

export class Views {
  _data;

  showSpinner() {
    const markup = `
     <div class="spinner">
        <svg>
            <use href="${icons}#icon-loader"></use>
        </svg>
     </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  render(data = undefined) {
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  update(data) {
    this._data = data;
    const markup = this._generateMarkup();

    const virtualDOM = document.createRange().createContextualFragment(markup);

    const virtualElements = Array.from(virtualDOM.querySelectorAll(`*`));
    const actualElements = Array.from(
      this._parentElement.querySelectorAll(`*`)
    );

    // console.log(virtualElements);
    // console.log(actualElements);

    virtualElements.forEach((vEl, i) => {
      if (!actualElements[i]) return;
      const aEl = actualElements[i];

      // console.log(vEl.nodeType); return 1 for element node & returns 3 for text node
      if (!vEl.isEqualNode(aEl) && vEl.firstChild?.nodeValue.trim() !== ``) {
        aEl.textContent = vEl.textContent;
      }

      if (!vEl.isEqualNode(aEl)) {
        Array.from(vEl.attributes).forEach(attr => {
          aEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
        <div>
            <svg>
                <use href="${icons}#icon-alert-triangle"></use>
            </svg>
        </div>
        <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
        <div>
            <svg>
                <use href="${icons}#icon-smile"></use>
            </svg>
        </div>
        <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  _clear() {
    this._parentElement.innerHTML = ``;
  }
}
