import React from 'react'
import ReactDOM from 'react-dom'
import {GoogleMap, GoogleMapLoader, Marker} from 'react-google-maps'

class Location extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    var mapPartial =
      <GoogleMapLoader
        containerElement={
          <div
            {...this.props}
            style={{
              height: "100%"
            }}
          />
        }
        googleMapElement={
          <GoogleMap
            containerProps={{ style: { height: "100%" } }}
            defaultZoom={this.props.zoom}
            defaultCenter={{lat: this.props.lat, lng: this.props.lng}}>
          </GoogleMap>
        } />

    var infoPartial = <div className='info'>
        <h2 className='widget-title'>{this.props.title}</h2>
        {this.props.desc != null ? <p>{this.props.desc}</p> : null}
        <ul>
          {this.props.location != null ? <li><i className="fa fa-map-marker"></i>{this.props.location}</li> : null}
          {this.props.website != null ? <li><i className="fa fa-globe"></i><a href={this.props.website} target="_blank">{this.props.website}</a></li> : null}
          {this.props.phone != null ? <li><i className="fa fa-phone"></i>{this.props.phone}</li> : null}
          {this.props.hours != null ? <li><i className="fa fa-clock-o"></i>{this.props.hours}</li> : null}
        </ul>
      </div>

    var isInfoAvailable = this.props.title || this.props.decs || this.props.location || this.props.website
      || this.props.phone || this.props.hours

    var classes = 'map' + (isInfoAvailable ? '' : ' map-full-width')

    return <div className='location'>
      <div className='row'>
        {isInfoAvailable ? infoPartial : null}
        <div className={classes}>{mapPartial}</div>
      </div>
    </div>
  }
}

export default function() {

  let elements = window.document.querySelectorAll('.render-component-location')

  for (var i=0; i<elements.length; i++) {
    let title = elements[i].getAttribute('data-title') || ''
    let lat = parseFloat(elements[i].getAttribute('data-lat'))
    let lng = parseFloat(elements[i].getAttribute('data-lng'))
    let zoom = ((zoom) => zoom ? parseInt(zoom) : 10)(elements[i].getAttribute('data-zoom'))
    let location = elements[i].getAttribute('data-location') || null
    let website = elements[i].getAttribute('data-website') || null
    let phone = elements[i].getAttribute('data-phone') || null
    let hours = elements[i].getAttribute('data-hours') || null
    let desc = elements[i].getAttribute('data-desc') || null

    ReactDOM.render(<Location
      lat={lat} lng={lng} title={title} zoom={zoom} location={location}
      website={website} phone={phone} hours={hours} desc={desc} />, elements[i])
  }
}
