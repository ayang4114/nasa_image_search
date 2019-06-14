import React, { Component } from 'react'
import './style.css'

const quote = "Explore the Advancements to the Final Frontier"

export default class MainPage extends Component {

  constructor(props) {
    super(props)
    this.updateSearchQuery = this.props.updateSearchQuery
    this.pressedSearch = this.props.pressedSearch
    this.setSearchModalVisibility = this.props.setSearchModalVisibility
  }

  render() {
    return (
      <section id="main-page">
        <a href="index.html" id="name"> NASA Image Archive </a>
        <h3 style={{ color: "#0070ff" }}> {quote} </h3>
        <input
          type='text'
          value={this.props.query}
          onChange={this.updateSearchQuery}
          id="app-search-bar"></input> <br />
        <button className="main-submit"
          onClick={this.pressedSearch}>Search</button>
        <button className="main-submit"
          onClick={this.setSearchModalVisibility}>
          Specify My Search
        </button>
      </section>
    )
  }
}