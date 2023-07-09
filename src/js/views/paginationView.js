import icons from 'url:../../img/icons.svg';
import View from './View';
class paginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _addClickHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }
  _generateMarkup() {
    // this._data = model.state.results;
    const pages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currentPage = this._data.page;
    // page 1 there are other pages
    if (currentPage === 1 && pages > 1) {
      return `
      <button data-goto="${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page ${currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;
    }
    //page 2 there are previous page and other pages too
    if (currentPage > 1 && currentPage < pages)
      return `
      <button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
    </button>
    <button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    //last page no pages after that
    if (currentPage === pages && pages > 1)
      return `
    <button data-goto="${
      currentPage - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${currentPage - 1}</span>
  </button>`;
    //results are less than the results per page
    return ' ';
  }
}

export default new paginationView();
