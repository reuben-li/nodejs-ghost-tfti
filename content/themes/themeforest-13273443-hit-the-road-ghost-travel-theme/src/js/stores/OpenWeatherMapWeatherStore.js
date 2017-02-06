import $ from 'jquery'
import moment from 'moment'

export default class OpenWeatherMapWeatherStore {
  constructor(units, key) {
    this.key = key
    this.units = units == 'c' ? 'metric' : 'imperial'
  }

  get attribution() {
    return {
      text: 'Powered by OpenWeatherMap',
      link: 'http://openweathermap.org/'
    }
  }

  load(location, callback) {

    let url = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${location}&mode=json&units=${this.units}&cnt=5&appid=${this.key}`
    let weather = {
      success: false
    }

    $.getJSON(encodeURI(url), function(data) {

      weather = {
        success: true,
        title: data.city.name,
        city: data.city.name,
        current: {
          temp: Math.round(data.list[0].temp.day),
          code: `wi-owm-${data.list[0].weather[0].id}`
        },
        forecast: []
      }

      data.list.slice(1, 4).map((f) => {
        weather.forecast.push({
          code: `wi-owm-${f.weather[0].id}`,
          day: moment(new Date(f.dt * 1000)).format('ddd'),
          high: Math.round(f.temp.max),
          low: Math.round(f.temp.min)
        })
      })

      typeof callback === 'function' && callback(weather);
    })
  }
}