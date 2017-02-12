import $ from 'jquery'
import YahooWeatherStore from './YahooWeatherStore'
import OpenWeatherMapWeatherStore from './OpenWeatherMapWeatherStore'

export default class WeatherStore {

  static resolve(name, units, key) {

    switch (name) {
      case 'yahoo': return new YahooWeatherStore(units)
      case 'openweathermap': return new OpenWeatherMapWeatherStore(units, key)
      default: return null
    }
  }
}