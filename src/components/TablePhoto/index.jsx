import React, { Component } from 'react'

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
export default class TablePhoto extends Component {
  constructor(props) {
    super(props);
    this.item = this.props.item
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.getBetterPicture = this.getBetterPicture.bind(this)
    this.image = this.item.links[0].href
    this.data = this.item.data
    this.title = this.data[0].title
    this.state = {
      modal_image: null,
    };
  }

  getBetterPicture() {
    fetch(this.item.href)
      .then(response => response.json())
      .then(j => {
        this.setState({
          modal_image: j[0]
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({
          modal_image: this.image
        })
      })
  }

  componentDidMount() {
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
//    captionText.innerHTML = processCaptionText(this.state.data);
  }

  closeModal() {
    document.getElementById('this_modal').style.display = "none";
  }

  render() {
    return (
      <div>
        <div className="galleryDivider" onClick={this.openModal}>
          <img src={this.image} alt="Space" className="photos" />
          <br />{this.title}
        </div>
        {/* A modal appears when the image is clicked */}
        <div id="this_modal" className="modal">
          {/* close button */}
          <span className="close_modal" onClick={this.closeModal}>
            &times;</span>
          {/* the image content in the modal */}
          <img id="modal_img" alt={this.state.title} className="photo_modal_img" />
          {/* Description and text about the image */}
          <div id="caption"></div>
        </div>
      </div>);
  }
}