import React, { Component } from 'react';
import Table from './Gallery.js'
import './Search.css';
const apiRoot = "https://images-api.nasa.gov";

class Search extends Component {

  constructor(props) {
    super(props)
    this.state = {
      row: 5,
      col: 5,
      input: this.props.inputs,
      prev_json: this.props.prev_json,
      json: this.props.json,
      next_json: this.props.next_json,
      current_page: 1,
      true_page: 1,
      end: <div></div>
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
          json: j,
          prev_json: null,
          next_json: null,
          current_page: 1,
          true_page: 1,
        }, function () {
          this.parsePrevAndNext()
        })
      })
      .catch(() => {
        alert("An error was encountered while attempting to connect to the server.")
      });
  }

  /**
   * pressedSearch() returns the JSON response of the URL based on the search
   * criteria in {@code this.state.input}. If the search bar is empty and no
   * other specific search criteria are provided, then the default search URL 
   * is based on the year_start = 1 and year_end = the current year.
   */
  pressedSearch() {
    this.closeSpecifics()
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
    let newVal = event.target.value
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
    let newVal = event.target.value
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

  /** 
    * parsePrevAndNext() processes the JSONs of the next page and the previous
    * page, if any of them exist. If they do not exist, prev_json and next_json
    * are null. 
    * Following the processing of the previous and next page JSONs, the 
    * navigation buttons are rendered.
    */
  async parsePrevAndNext() {
    var prev = null;
    var next = null;

    let links = this.state.json.collection.links
    if (links !== undefined) {
      switch (links.length) {
        case 0:
          return
        case 1:
          if (this.state.true_page === 1) {
            next = links[0].href
          } else {
            prev = links[0].href
          }
          break;
        case 2:
          prev = links[0].href
          next = links[1].href
          break;
        default:
          break;
      }
    }
    if (prev !== null && next !== null) {
      var updated_prev = Promise.resolve(fetch(prev)
        .then(response => response.json())
        .catch(() => {
          alert("An error was encountered while attempting to connect to the server.")
        }))
      var updated_next = Promise.resolve(fetch(next)
        .then(response => response.json())
        .catch(() => {
          alert("An error was encountered while attempting to connect to the server.")
        })
      )
      updated_next.then(next_value => {
        updated_prev.then(prev_value => {
          this.setState({
            prev_json: prev_value,
            next_json: next_value
          }, function () {
            this.renderTransitionButtons()
          })
        })
      })
    }
    else if (prev !== null) {
      fetch(prev)
        .then(response => response.json())
        .then(prev => {
          this.setState({
            prev_json: prev
          }, function () {
            this.renderTransitionButtons()
          })
        })
        .catch(() => {
          alert("An error was encountered while attempting to connect to the server.")
        })
    }
    else if (next !== null) {
      fetch(next)
        .then(response => response.json())
        .then(next => {
          this.setState({
            next_json: next
          }, function () {
            this.renderTransitionButtons()
          })
        })
        .catch(() => {
          alert("An error was encountered while attempting to connect to the server.")
        })
    }
    else {
      this.setState({
        next_json: null,
        prev_json: null,
      }, function () {
        this.renderTransitionButtons()
      })
    }
  }

  componentDidMount() {
    this.parsePrevAndNext()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.inputs !== this.props.inputs) {
      this.setState({
        input: this.props.inputs
      })
    }
    if (prevProps.prev_json !== this.props.prev_json) {
      this.setState({
        prev_json: this.props.prev_json
      })
    }
    if (prevProps.json !== this.props.json) {
      this.setState({
        json: this.props.json
      })
    }
    if (prevProps.next_json !== this.props.next_json) {
      this.setState({
        next_json: this.props.next_json
      })
    }
  }

  /**
   * goNext() is the action when the Next button is clicked.
   * This function is never called in a page unless the next button exists.
   */
  goNext() {
    if (this.state.true_page * 4 === this.state.current_page) {
      this.setState({
        json: this.state.next_json,
        prev_json: null,
        next_json: null,
        current_page: this.state.current_page + 1,
        true_page: this.state.true_page + 1
      }, function () {
        this.parsePrevAndNext()
      })
    } else {
      this.setState({
        current_page: this.state.current_page + 1,
      }, function () {
        this.parsePrevAndNext()
      })
    }
  }

  /**
   * goPrev() is the action when the Previous button is clicked.
   * This function is never called in a page unless the previous button exists.
   */
  goPrev() {
    if ((this.state.true_page * 4) - 3 === this.state.current_page) {
      this.setState({
        json: this.state.prev_json,
        prev_json: null,
        next_json: null,
        current_page: this.state.current_page - 1,
        true_page: this.state.true_page - 1,
      }, function () {
        this.parsePrevAndNext()
      })
    } else {
      this.setState({
        current_page: this.state.current_page - 1,
      }, function () {
        this.parsePrevAndNext()
      })
    }
  }

  // The following four functions help in making renderTransitionButtons() more
  // succint. Each function describes a case of the navigation buttons.
  bothNav() {
    return (
      <div id="search-end">
        <button id="prev" onClick={this.goPrev.bind(this)}>Previous</button>
        Page {this.state.current_page}
        <button id="next" onClick={this.goNext.bind(this)}>Next</button>
      </div>);
  }
  onlyPrev() {
    return (
      <div id="search-end">
        <button id="prev" onClick={this.goPrev.bind(this)}>Previous</button>
        Page {this.state.current_page}
      </div>);
  }
  onlyNext() {
    return (
      <div id="search-end">
        Page {this.state.current_page}
        <button id="next" onClick={this.goNext.bind(this)}>Next</button>
      </div>);
  }
  neitherNav() {
    return (
      <div id="search-end">
        Page {this.state.current_page}
      </div>);
  }

  renderTransitionButtons() {
    // Case where we are viewing the first 25 items of a page.
    if ((this.state.true_page * 4) - 3 === this.state.current_page) {
      // Covers the edge case where there is only one page of items
      if (this.state.prev_json === null && this.state.next_json === null) {
        let count = this.state.json.collection.items.length
        let greatest_index = (this.state.current_page % 4) * 25 - 1

        // If greatest_index >= count, that means the current page
        // has the last remaining items.
        if (this.state.current_page === 1 && greatest_index >= count) {
          // Covers case when page 1 is the only page and there are
          // less than 25 elements.
          this.setState({
            end: this.neitherNav()
          })
        }
        else if (greatest_index >= count) {
          this.setState({
            end: this.onlyPrev()
          })
        }
        else if (this.state.current_page === 1) {
          this.setState({
            end: this.onlyNext()
          })
        }
        else {
          this.setState({
            end: this.bothNav()
          })
        }
      }
      else if (this.state.prev_json === null) {
        // next_nav must be true for this condition to be true.
        this.setState({
          end: this.onlyNext()
        })
      }
      else if (this.state.next_json === null) {
        let count = this.state.json.collection.items.length
        let greatest_index = (this.state.current_page % 4) * 25 - 1
        if (greatest_index >= count) {
          this.setState({
            end: this.onlyPrev()
          })
        } else {
          this.setState({
            end: this.bothNav()
          })
        }
        // prev_nav must exist for this condition to be true.
      } else {
        this.setState({
          end: this.bothNav()
        })
      }
    }
    // Case where we are viewing the last 25 items out of 75-100 items 
    // in a page
    else if (this.state.true_page * 4 === this.state.current_page) {
      if (this.state.prev_json === null && this.state.next_json === null) {
        if (this.state.current_page === 4) {
          this.setState({
            end: this.onlyPrev()
          })
        } else {
          this.setState({
            end: this.neitherNav()
          })
        }
      }
      // next_nav must exist for this to be true
      else if (this.state.prev_json === null) {
        if (this.state.current_page === 4) {
          this.setState({
            end: this.bothNav()
          })
        }
        else {
          this.setState({
            end: this.onlyNext()
          })
        }
      }
      // Case of the the last page of a search query
      else if (this.state.next_json === null) {
        this.setState({
          end: this.onlyPrev()
        })
      } else {
        this.setState({
          end: this.bothNav()
        })
      }
    }
    // In remaining cases, we compare the the largest possible number of items     
    // in the page, with the actual total amount of items from the JSON.
    else {
      let count = this.state.json.collection.items.length
      let greatest_index = (this.state.current_page % 4) * 25 - 1
      if (this.state.current_page === 1 && greatest_index >= count) {
        this.setState({
          end: this.neitherNav()
        })
      }
      else if (greatest_index >= count) {
        this.setState({
          end: this.onlyPrev()
        })
      } else if (this.state.current_page === 1) {
        this.setState({
          end: this.onlyNext()
        })
      } else {
        this.setState({
          end: this.bothNav()
        })
      }
    }
  }

  render() {
    return (
      <div>
        <header className="Search-header">
          <section id="search">
            <a href="index.html" id="search-name"> NASA Image Archive </a>
            <div>
              <input value={this.state.input.q}
                onChange={this.updateQuery.bind(this)}
                id="search-bar"></input>
              <button className="search-submit"
                onClick={this.pressedSearch.bind(this)}>Search</button>
              <button className="search-submit"
                onClick={this.openSpecifics.bind(this)}>Specify My Search</button>
            </div>
            <div>
              <Table json={this.state.json}
                page={this.state.current_page}
                row={this.state.row}
                col={this.state.col}
              />
            </div>
            {this.state.end}
            <div id="specific_search" className="overlay">
              <a href="javascript:void(0)" className="closebutton"
                onClick={this.closeSpecifics.bind(this)}>
                &times;</a>
              <div className="overlay-content">
                <a href="#">Regular Search Terms</a>
                <input value={this.state.input.q}
                  onChange={this.updateQuery.bind(this)}
                  className="specify"></input>
                <a href="# " id="t">Title</a>
                <input value={this.state.input.title}
                  onChange={this.updateTitle.bind(this)}
                  className="specify"></input>
                <a href="#" id="d">Photographer</a>
                <input value={this.state.input.photographer}
                  onChange={this.updatePhotographer.bind(this)}
                  className="specify"></input>
                <a href="#" id="l">Location</a>
                <input value={this.state.input.location}
                  onChange={this.updateLocation.bind(this)}
                  className="specify"></input>
                <div className="year-slider">
                  <a href="#" id="date">Start Year: {this.state.input.year_start}</a>
                  <input value={this.state.input.year_start}
                    min="1" max={new Date().getFullYear()}
                    step="2" type="range"
                    onChange={this.updateStart.bind(this)} />
                  <a href="#" id="date">Year End: {this.state.input.year_end}</a>
                  <input value={this.state.input.year_end}
                    min="1" max={new Date().getFullYear()}
                    step="2" type="range"
                    onChange={this.updateEnd.bind(this)} />
                  <br />
                  <button onClick={this.pressedSearch.bind(this)}
                    id="specify-button">Search</button>
                </div>
              </div>
            </div>
          </section>
        </header>
      </div >
    );
  }
}

export default Search;