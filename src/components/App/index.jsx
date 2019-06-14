import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './index.css';
import Search from '../Search/index'

const apiRoot = "https://images-api.nasa.gov";

class App extends Component {

  constructor(props) {
    super(props);

    // The fields of input are the search criteria a user may wish to modify.
    this.state = {
      quote: this.props.quote,
      input: {
        q: "",
        media_type: "image",
        location: "", // String
        photographer: "", // String
        title: "", // String
        year_start: "1", // Number
        year_end: new Date().getFullYear(), // Number
      },
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


  openSpecifics() {
    document.getElementById('specific_search').style.height = "100%"
  }
  closeSpecifics() {
    document.getElementById("specific_search").style.height = "0%"
  }

  // The following update[Param]() functions are called whenever the
  // input field associated to the paramters are changed.
  // This can occur in the regular search bar field, or in the specific
  // search screen.
  updateQuery(event) {
    let copy = Object.assign({}, this.state.input); //creating copy of object
    this.setState({
      input: {
        ...copy,
        q: event.target.value
      }
    })
  }
  updateTitle(event) {
    let copy = Object.assign({}, this.state.input); //creating copy of object
    this.setState({
      input: {
        ...copy,
        title: event.target.value
      }
    })
  }
  updateMedia(event) {
    let copy = Object.assign({}, this.state.input); //creating copy of object
    this.setState({
      input: {
        ...copy,
        media_type: event.target.value
      }
    })
  }
  updatePhotographer(event) {
    let copy = Object.assign({}, this.state.input); //creating copy of object
    this.setState({
      input: {
        ...copy,
        photographer: event.target.value
      }
    })
  }
  updateLocation(event) {
    let copy = Object.assign({}, this.state.input); //creating copy of object
    this.setState({
      input: {
        ...copy,
        location: event.target.value
      }
    })
  }
  updateStart(event) {
    let copy = Object.assign({}, this.state.input); //creating copy of object
    var newVal = event.target.value
    let this_year = new Date().getFullYear
    if (newVal > this_year) {
      newVal = this_year
    }
    this.setState({
      input: {
        ...copy,
        year_start: newVal
      }
    })
  }
  updateEnd(event) {
    let copy = Object.assign({}, this.state.input); //creating copy of object
    var newVal = event.target.value
    let this_year = new Date().getFullYear
    if (newVal > this_year) {
      newVal = this_year
    }
    this.setState({
      input: {
        ...copy,
        year_end: newVal
      }
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
              <input value={this.state.input.q}
                onChange={this.updateQuery.bind(this)}
                id="app-search-bar"></input> <br />
              <button className="main-submit"
                onClick={this.pressedSearch.bind(this)}>Search</button>
              <button className="main-submit"
                onClick={this.openSpecifics.bind(this)}>Specify My Search
              </button>

              {/* Specific Search Screen. This is hidden by the default
              by setting the height = "0". */}
              <div id="specific_search" className="overlay">
                <a href="javascript:void(0)" className="closebutton"
                  onClick={this.closeSpecifics.bind(this)}>
                  &times;</a>
                <div className="overlay-content">
                  {/* Query */}
                  <a href="#">Regular Search Terms</a>
                  <input value={this.state.input.q}
                    onChange={this.updateQuery.bind(this)}
                    className="specify" />
                  {/* Search by Title */}
                  <a href="# " id="t">Title</a>
                  <input value={this.state.input.title}
                    onChange={this.updateTitle.bind(this)}
                    className="specify" />
                  {/* Search by Photographer */}
                  <a href="#" id="d">Photographer</a>
                  <input value={this.state.input.photographer}
                    onChange={this.updatePhotographer.bind(this)}
                    className="specify" />
                  {/* Search by Location */}
                  <a href="#" id="l">Location</a>
                  <input value={this.state.input.location}
                    onChange={this.updateLocation.bind(this)}
                    className="specify" />
                  <div className="year-slider">
                    {/* Search by Date Range */}
                    <a href="#" id="date">
                      Start Year: {this.state.input.year_start}
                    </a>
                    <input value={this.state.input.year_start}
                      min="1" max={new Date().getFullYear()}
                      step="2" type="range"
                      onChange={this.updateStart.bind(this)} />
                    <a href="#" id="date">
                      Year End: {this.state.input.year_end}
                    </a>
                    <input value={this.state.input.year_end}
                      min="1" max={new Date().getFullYear()}
                      step="2" type="range"
                      onChange={this.updateEnd.bind(this)} />
                    <br />
                    <button onClick={this.pressedSearch.bind(this)}
                      id="specify-button">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </header>
      </div>
    );
  }
}

export default App;
