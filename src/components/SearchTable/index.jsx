import React, { Component } from 'react'
import TablePhoto from '../TablePhoto/index'
import './style.css'


class SearchTable extends Component {

  constructor(props) {
    super(props)
    this.renderResult = this.renderResult.bind(this)
  }

  /**
   * renderResult(i) displays the ith result of the page, where i ranges from
   * 1 to 25. 
   * If the ith result does not exist, i.e. if the index associated to
   * the ith result is greater than the total number of items, then 
   * renderResult(i) returns a blank table cell.
   *
   * Requires: 1 <= i <= 25
   */
  renderResult() {
    var display = []
    for (var i = 0; i < this.props.row; i++) {
      var temp = []
      for (var j = 0; j < this.props.col; j++) {
        const index = i * this.props.col + j
        if (index >= this.props.items.length) {
          i = this.props.row
          break;
        }
        const item = this.props.items[index]
        temp.push(<td key={item.data[0].nasa_id}>
          <TablePhoto item={item} />
        </td>)
      }
      display.push(<tr key={i}>{temp}</tr>)
    }
    return display
  }

  render() {
    return (
      <table id="gallery">
        <tbody>
          {this.renderResult()}
        </tbody>
      </table>
    );
  }
}

export default SearchTable