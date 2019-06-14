import React, { Component } from 'react';
import './index.css'

/**
 * processCaptionText() produces a caption for an image/video/audio
 * based on the data that is provided to them in the JSON. Any specific
 * data fields that are not defined in the JSON are ignored.
 * 
 * The following is the general list of the information:
 * _Title_
 * _Photographer_
 * _Secondary Creator_
 * _Center_
 * _Location_
 * _Date created_
 * _Description_
 * 
 */
function processCaptionText(arr) {
  let data = arr[0]
  let caption = data.title + "\n\n"

  if (data.photographer !== undefined) {
    caption += "Photographer: " + data.photographer + "\n\n"
  }
  if (data.secondary_creator !== undefined) {
    caption += "Secondary Creator: " + data.secondary_creator + "\n\n"
  }
  if (data.center !== undefined) {
    caption += "Center: " + data.center + "\n\n"
  }
  if (data.location !== undefined) {
    caption += "Location: " + data.location + "\n\n"
  }
  if (data.date_created !== undefined) {
    caption += "Date Created: " + data.date_created + "\n\n"
  }
  if (data.description !== undefined) {
    caption += "Description: " + data.description + "\n\n"
  }
  return caption
}


/**
 * The Photo component prepares the search result appearance specfically
 * for an image. 
 */
class Photo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.img_url,
      title: this.props.title,
      data: this.props.data,
      modal_image: null,
    };
  }

  getBetterPicture() {
    fetch(this.props.href)
      .then(response => response.json())
      .then(j => {
        this.setState({
          modal_image: j[0]
        })
      })
      .catch(error => {
        this.setState({
          modal_image: this.state.image
        })
      })
  }

  componentDidMount() {
    this.getBetterPicture()
  }

  componentDidUpdate(prevProps) {
    var changed = 0
    if (prevProps.img_url !== this.props.img_url) {
      this.setState({
        image: this.props.img_url
      })
      changed++
    }
    if (prevProps.title !== this.props.title) {
      this.setState({
        title: this.props.title
      })
      changed++
    }
    if (prevProps.data !== this.props.data) {
      this.setState({
        data: this.props.data
      })
      changed++
    }
    if (prevProps.href !== this.props.href) {
      this.setState({
        href: this.props.href
      })
      changed++
    }
    // Only if changes occur does getBetterPicture()
    // Prevents an infinte loop of rerendering.
    if (changed > 0)
      this.getBetterPicture()
  }

  /**
   * Opens a modal that provides more information about the image.
   */
  openModal() {
    var modal = document.getElementById('this_modal');
    var modalImage = document.getElementById('modal_img');
    var captionText = document.getElementById('caption');
    modal.style.display = "block";
    modalImage.src = this.state.modal_image;
    captionText.innerHTML = processCaptionText(this.state.data);
  }

  closeModal() {
    document.getElementById('this_modal').style.display = "none";
  }

  render() {
    return (
      <div>
        <div className="galleryDivider" onClick={this.openModal.bind(this)}>
          <img src={this.state.image} alt="Space" className="photos" />
          <br />{this.state.title}
        </div>
        {/* A modal appears when the image is clicked */}
        <div id="this_modal" className="modal">
          {/* close button */}
          <span className="close_modal" onClick={this.closeModal.bind(this)}>
            &times;</span>
          {/* the image content in the modal */}
          <img id="modal_img" alt={this.state.title} className="photo_modal_img" />
          {/* Description and text about the image */}
          <div id="caption"></div>
        </div>
      </div>);
  }
}

class Table extends Component {

  /**
   * renderResult(i) displays the ith result of the page, where i ranges from
   * 1 to 25. 
   * If the ith result does not exist, i.e. if the index associated to
   * the ith result is greater than the total number of items, then 
   * renderResult(i) returns a blank table cell.
   *
   * Requires: 1 <= i <= 25
   */
  renderResult(i) {
    let items = this.state.json.collection.items
    let perPage = this.state.col * this.state.row
    let index = ((this.state.page - 1) % 4) * (perPage) + (i - 1);
    if (index >= items.length) {
      return (
        <td></td>
      );
    }
    let resource = items[index].links;
    let data = items[index].data
    let title = data[0].title

    // The URL of the preview image
    let url = resource[0].href;

    // Any additional referenced links
    let href = items[index].href
    return (
      <td>
        <Photo img_url={url} title={title} data={data} href={href} />
      </td>);
  }


  constructor(props) {
    super(props);
    this.state = {
      json: this.props.json,
      page: this.props.page,
      row: this.props.row,
      col: this.props.col,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.json !== this.props.json) {
      this.setState({
        json: this.props.json
      })
    }
    if (prevProps.page !== this.props.page) {
      this.setState({
        page: this.props.page
      })
    }
    if (prevProps.row !== this.props.row) {
      this.setState({
        row: this.props.row
      })
    }
    if (prevProps.col !== this.props.col) {
      this.setState({
        col: this.props.col
      })
    }
  }

  render() {
    return (
      <table id="gallery">
        <tbody>
          <tr>
            {this.renderResult(1)}
            {this.renderResult(2)}
            {this.renderResult(3)}
            {this.renderResult(4)}
            {this.renderResult(5)}
          </tr>
          <tr>
            {this.renderResult(6)}
            {this.renderResult(7)}
            {this.renderResult(8)}
            {this.renderResult(9)}
            {this.renderResult(10)}
          </tr>
          <tr>
            {this.renderResult(11)}
            {this.renderResult(12)}
            {this.renderResult(13)}
            {this.renderResult(14)}
            {this.renderResult(15)}
          </tr>
          <tr>
            {this.renderResult(16)}
            {this.renderResult(17)}
            {this.renderResult(18)}
            {this.renderResult(19)}
            {this.renderResult(20)}
          </tr>
          <tr>
            {this.renderResult(21)}
            {this.renderResult(22)}
            {this.renderResult(23)}
            {this.renderResult(24)}
            {this.renderResult(25)}
          </tr>
        </tbody>
      </table>
    );
  }
}

export default Table