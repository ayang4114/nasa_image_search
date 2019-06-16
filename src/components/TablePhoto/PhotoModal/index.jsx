import React, { Component } from 'react'
import './style.css'
import { isNullOrUndefined } from 'util';

export default class PhotoModal extends Component {

  constructor(props) {
    super(props)
    this.processCaptionText = this.processCaptionText.bind(this)
    this.isDefined = this.isDefined.bind(this)
  }

  isDefined(object) {
    return !isNullOrUndefined(object)
  }

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

  processCaptionText() {
    const data = this.props.data
    let caption = data.title + "\n\n"

    const attributes = {
      'photographer': 'Photographer: ',
      'secondary_creator': 'Sceondary Creator: ',
      'center': 'Center: ',
      'location': 'Location: ',
      'date_created': 'Date Created: ',
      'description': 'Description: '
    }
    for (var info in attributes) {
      if (this.isDefined(data[info])) {
        caption += attributes[info] + data[info] + "\n\n"
      }
    }
    return caption
  }


  render() {
    if (!this.props.show) return null
    return (
      < div className="modal" >
        {/* A modal appears when the image is clicked */}
        {/* close button */}
        < span className="close_modal" onClick={this.props.closeModal} >
          &times;</span >
        {/* the image content in the modal */}
        < img className="modal_img" src={this.props.image}
          alt={this.props.title} className="photo_modal_img" />
        {/* Description and text about the image */}
        < p className="caption">{this.processCaptionText()}</p >
      </div >
    )
  }

}
