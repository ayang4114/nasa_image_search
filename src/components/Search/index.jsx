import React, { Component } from 'react';
import SearchTable from "../SearchTable/index";
import './style.css';

class Search extends Component {

  constructor(props) {
    super(props)
    this.row = 20
    this.col = 5
    this.updateSearchQuery = this.props.updateSearchQuery
    this.pressedSearch = this.props.pressedSearch
    this.pressedNavigation = this.props.pressedNavigation
    this.openSearchModal = this.props.openSearchModal
  }

  /** 
    * parsePrevAndNext() processes the JSONs of the next page and the previous
    * page, if any of them exist. If they do not exist, prev_json and next_json
    * are null. 
    * Following the processing of the previous and next page JSONs, the 
    * navigation buttons are rendered.
    */
  renderPrevAndNext() {
    function proto(name, url, callback) {
      return (url === undefined) ?
        null : <div>
          <button
            onClick={() => callback(url)}>
            {name}
          </button>
        </div>
    }
    var result = []
    result[0] = proto('Previous', this.props.links['Previous'], this.pressedNavigation)
    result[1] = proto('Next', this.props.links['Next'], this.pressedNavigation)
    return result
  }


  render() {
    const nav = this.renderPrevAndNext()
    return (
      <header id="search-header">
        <section id='search-tools'>
          <a href="index.html" id="search-name"> NASA Image Archive </a>
          <input value={this.props.inputs.q}
            onChange={this.updateSearchQuery}
            id="search-bar"></input>
          <button className="search-submit"
            onClick={this.pressedSearch}>Search</button>
          <button className="search-submit"
            onClick={this.openSearchModal}>Specify My Search</button>
        </section>
        <section id='search-results'>
          {nav}
          <SearchTable
            items={this.props.items}
            row={this.row}
            col={this.col}
          />
          {nav}
        </section>
      </header>
    );
  }
}

export default Search;