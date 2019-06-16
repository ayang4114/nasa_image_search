import React, { Component } from 'react'
import PhotoModal from './PhotoModal/index'
import './style.css'


/**
 * The Photo component prepares the search result appearance specfically
 * for an image. 
 */
export default class TablePhoto extends Component {
  constructor(props) {
    super(props);
    this.setPhotoModalVisibility = this.setPhotoModalVisibility.bind(this)
    this.getBetterPicture = this.getBetterPicture.bind(this)

    this.item = this.props.item
    this.image = this.item.links[0].href
    this.data = this.item.data
    this.title = this.data[0].title
    this.caption = this.data[0].description
    this.state = {
      modal_visibility: false,
      modal_image: null
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
  setPhotoModalVisibility(status) {
    console.log('Fire', status)
    this.setState({
      modal_visibility: status
    })
  }

  render() {
    return (
      <div>
        <div className="galleryDivider" onClick={() => this.setPhotoModalVisibility(true)}>
          <img src={this.image} alt="Space" className="photos" />
          <br />
          {this.title}
        </div>
        <PhotoModal show={this.state.modal_visibility}
          title={this.title}
          caption={this.caption}
          closeModal={() => this.setPhotoModalVisibility(false)}
          image={this.image}
          data={this.data[0]}
        />
      </div>);
  }
}