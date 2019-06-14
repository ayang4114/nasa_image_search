import React, { Component } from 'react'
import './style.css'

export default class SearchModal extends Component {

  constructor(props) {
    super(props);
    this.setVisibility = this.props.setVisibility
    this.updateFields = this.props.update
    this.goSearch = this.props.goSearch
    this.renderFields = this.renderFields.bind(this)
  }

  renderFields() {
    var fields = []
    var term;
    for (var field in this.props.input) {
      const key = field
      if (key === 'media_type') continue;
      else if (key === 'year_start' || key === 'year_end') {
        if (key === 'year_start') term = 'Start Year';
        else term = 'End Year';
        fields.push(
          <div className="year-slider" key={key}>
            <a href="#" id="date">
              {term}: {this.props.input[key]}
            </a>
            <input value={this.props.input[key]}
              min="1" max={new Date().getFullYear()}
              step="2" type="range"
              onChange={event => this.updateFields(key, event.target.value)} />
          </div>
        )
      } else {
        switch (key) {
          case 'q':
            term = 'Query'
            break;
          case 'title':
            term = 'Title'
            break;
          case 'photographer':
            term = 'Photographer'
            break;
          case 'location':
            term = 'Location';
            break;
          default:
            throw new Error(key + ' is not a valid field')
        }
        fields.push(
          <div key={key}>
            <a href="#">{term}</a>
            <input type='text' value={this.props.input.key}
              onChange={(event) => this.updateFields(key, event.target.value)}
              className="specify" />
          </div>
        )
      }
    }
    return fields
  }

  /* Specific Search Screen. This is hidden by the default
          by setting the height = "0". */
  render() {
    return (
      <div id="specific_search" className="overlay">
        <a href="javascript:void(0)" className="closebutton"
          onClick={() => this.setVisibility(false)}>
          &times;</a>
        <div className="overlay-content">
          {this.renderFields()}
          <br />
          <button onClick={this.goSearch}
            id="specify-button">
            Search
          </button>
        </div>
      </div>
    );
  }
}