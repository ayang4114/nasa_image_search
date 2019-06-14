import React, { Component } from 'react'
import './style.css'

export default class SearchModal extends Component {

  constructor(props) {
    super(props);
    console.log(this.props.visibility);
    this.setVisibility = this.props.setVisibility;
    this.input = this.props.input
    this.updateFields = this.props.update
    this.goSearch = this.props.goSearch
    this.renderFields = this.renderFields.bind(this)
  }

  renderFields() {
    var fields = []
    var term;
    for (var field in this.input) {
      const key = field
      console.log('Key', key)
      if (key === 'media_type') continue;
      else if (key === 'year_start' || key === 'year_end') {
        if (key === 'year_start') term = 'Start Year';
        else term = 'End Year';
        fields.push(
          <div className="year-slider">
            <a href="#" id="date">
              {term}: {this.input[key]}
            </a>
            <input value={this.input[key]}
              min="1" max={new Date().getFullYear()}
              step="2" type="range"
              onChange={event => this.updateFields(key, event.target.value)} />
          </div>
        )
        {/* Search by Date Range */ }
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
          <div>
            <a href="#" id="t">{term}</a>
            <input value={this.input[key]}
              onChange={(event) => this.updateFields(key, event.target.value)}
              className="specify" />
          </div>)
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
          <button onClick={() => this.goSearch()}
            id="specify-button">
            Search
          </button>
        </div>
      </div>
    );
  }
}


/**
 *
 *           <a href="#">Regular Search Terms</a>
          <input value={this.state.input.q}
            onChange={this.updateQuery.bind(this)}
            className="specify" />
          {/* Search by Title
<a href="#" id="t">Title</a>
  <input value={this.state.input.title}
    onChange={this.updateTitle.bind(this)}
    className="specify" />
  /* Search by Photographer
  <a href="#" id="d">Photographer</a>
  <input value={this.state.input.photographer}
    onChange={this.updatePhotographer.bind(this)}
    className="specify" /
  // {/* Search by Location *
  <a href="#" id="l">Location</a>
  <input value={this.state.input.location}
    onChange={this.updateLocation.bind(this)}
    className="specify" />

  <div className="year-slider">
    {/* Search by Date Range
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
  </div>

  */