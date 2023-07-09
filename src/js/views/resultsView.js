import icons from 'url:../../img/icons.svg';
import View from './View';
import previewView from './previewView.js';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `We couldn't find the recipe for the given query :(`;
  _generateMarkup() {
    return this._data
      .map(results => previewView.render(results, false))
      .join('');
  }
}
export default new ResultsView();
