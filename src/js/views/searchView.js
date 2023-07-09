class searchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const item = this._parentEl.querySelector('.search__field').value;
    this._clear();
    return item;
  }
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
  _clear() {
    this._parentEl.querySelector('.search__field').value = '';
  }
}
export default new searchView();
