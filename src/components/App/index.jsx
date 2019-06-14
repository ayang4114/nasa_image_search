import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './style.css';
import Search from '../Search/index'
import SearchModal from '../SearchModal'

const apiRoot = "https://images-api.nasa.gov";

class App extends Component {

  constructor(props) {
    super(props)
    this.updateSearchQuery = this.updateSearchQuery.bind(this)
    this.setSearchModalVisibility = this.setSearchModalVisibility.bind(this)
    this.renderSearchModal = this.renderSearchModal.bind(this)
    // The fields of input are the search criteria a user may wish to modify.
    this.state = {
      quote: this.props.quote,
      input: {
        q: "",
        media_type: "image",
        location: "", // String
        photographer: "", // String
        title: "", // String
        year_start: 1, // Number
        year_end: new Date().getFullYear(), // Number
      },
      showSearchModal: false,
      jsonReady: false,
      json: null
    }
  }

  /**
   * parseParam() parses parameters such that it can be appropriately used
   * for a URL. For instance, parameters with whitespaces in the front or in
   * the back of the string are trimmed. In addition, whitespaces that
   * separate words in parameters are replaced by "%20".
   */
  parseParam(param) {
    var words = param.split(" ");
    words = words.filter(w => w !== "");
    let newWords = words.map(w => w + "%20");
    var newParams = "";
    let max = words.length;
    var i;
    for (i = 0; i < max - 1; i++) {
      newParams += newWords[i];
    }
    if (max - 1 >= 0) {
      newParams += words[max - 1];
    }
    return newParams;
  }

  /**
   * searchURL() produces the URL used to connect to the server based on the
   * search criteria that have been provided by the user. If none have been 
   * provided, searchURL() produces a URL such that year_start = 1 and 
   * year_end = the current year.
   */
  searchURL() {
    var url = apiRoot + "/search";
    var parameters = "";
    var field;
    let fields = this.state.input
    for (field in fields) {
      var value = fields[field].toString();
      if (value === null || value === "") { continue; }
      if (parameters === "") {
        parameters += "?" + field + "=";
      } else {
        parameters += "&" + field + "=";
      }
      parameters += this.parseParam(value.trim());
    }
    return url + parameters;
  }

  /**
   * Given the URL, searchServer() connects to the server to GET the JSON 
   * response based on that URL. The resolved JSON is added as a state field.
   * The search page and the table in that page get re-rendered as a result.
   */
  searchServer(url) {
    fetch(url)
      .then(response => response.json())
      .then(j => {
        this.setState({
          jsonReady: true,
          json: j,
        })
      })
      .then(() => {
        ReactDOM.render(
          <Search
            inputs={this.state.input}
            json={this.state.json}
            prev_json={null}
            next_json={null}
          />
          , document.getElementById('root'))
        // window.open("search.html")
      })
      .catch(error => {
        alert("An error was encountered while attempting to connect to the server.")
      })
  }

  /**
   * pressedSearch() returns the JSON response of the URL based on the search
   * criteria in {@code this.state.input}. If the search bar is empty and no
   * other specific search criteria are provided, then the default search URL 
   * is based on the year_start = 1 and year_end = the current year.
   */
  pressedSearch() {
    this.searchServer(this.searchURL())
  }

  setSearchModalVisibility(value) {
    console.log('change', value)
    this.setState({
      showSearchModal: value
    })
  }

  renderSearchModal() {
    if (!this.state.showSearchModal) return;
    else {
      return (
        <SearchModal
          input={this.state.input}
          visibility={this.state.showSearchModal}
          update={this.updateSearchQuery}
          setVisibility={this.setSearchModalVisibility}
          goSearch={this.pressedSearch} />
      )
    }
  }

  // The following update[Param]() functions are called whenever the
  // input field associated to the paramters are changed.
  // This can occur in the regular search bar field, or in the specific
  // search screen.
  updateSearchQuery(field, value) {
    console.log('Fired', field)
    const copy = Object.assign({}, this.state.input)
    const this_year = new Date().getFullYear
    if (field === 'year_end' || field === 'year_start') {
      value = Math.min(this_year, value)
    }
    copy[field] = value;
    this.setState({
      input: copy
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <section id="main-page">
            <a href="index.html" id="name"> NASA Image Archive </a>
            <h3 style={{ color: "#0070ff" }}> {this.state.quote} </h3>
            <div>
              <input
                type='text'
                value={this.state.input.q}
                onChange={event => this.updateSearchQuery('q', event.target.value)}
                id="app-search-bar"></input> <br />
              <button className="main-submit"
                onClick={() => this.pressedSearch}>Search</button>
              <button className="main-submit"
                onClick={() => this.setSearchModalVisibility(true)}>Specify My Search
              </button>
              {this.renderSearchModal()}
            </div>
          </section>
        </header>
      </div>
    );
  }
}

export default App;
