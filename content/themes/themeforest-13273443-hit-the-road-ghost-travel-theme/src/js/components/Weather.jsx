import React from 'react'

export default class Weather extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      visible: true,
      data: {}
    }
  }

  hide() {
    this.setState({visible: false})
  }

  setData(data) {
    this.setState({data: data, loading: false})
  }

  render() {

    let loading = this.state.loading

    if (!this.state.visible) return null

    let weatherPartial = !loading && <ul className="weather-forecast">
        <li>
          <span className="weather-weekday">Now</span>
          <i className={`wi ${this.state.data.current.code}`}></i>
          <span className="weather-temp">{this.state.data.current.temp}&deg;</span>
        </li>
        {this.state.data.forecast.map((f) => {
          return <li key={f.day}>
            <span className="weather-weekday">{f.day}</span>
            <i className={`wi ${f.code}`}></i>
            <span className="weather-temp">{f.high}&deg;/{f.low}&deg;</span>
          </li>
        })}
      </ul>

    let loadingPartial = <div className="weather-loading">
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
    </div>

    let title = loading ? this.props.loadingTitle : `${this.state.data.city} current weather`

    return <div className="widget widget-side">
      <h2 className="widget-title">{title}</h2>
      <div className="weather">
        {loading ? loadingPartial : weatherPartial}
        <div className="weather-attribution">
          <a href={this.props.attribution.link} target="_blank">{this.props.attribution.text}</a>
        </div>
      </div>
    </div>
  }
}
