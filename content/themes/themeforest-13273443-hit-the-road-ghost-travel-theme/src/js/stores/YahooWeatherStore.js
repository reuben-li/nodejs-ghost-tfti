import $ from 'jquery'

export default class YahooWeatherStore {
  constructor(units) {
    this.units = units
  }

  get attribution() {
    return {
      text: 'Powered by Yahoo!',
      link: 'https://www.yahoo.com/?ilc=401'
    }
  }

  load(location, callback) {

    let url = `https://query.yahooapis.com/v1/public/yql?format=json&q=select * from weather.forecast where woeid in (select woeid from geo.placefinder where text="${location}" and gflags="R" limit 1) and u="${this.units}"`
    let weather = {
      success: false
    }

    $.getJSON(encodeURI(url), function(data) {

      if (data.query.results != null) {

        let channel = data.query.results.channel;

        weather = {
          success: true,
          title: channel.item.title,
          city: channel.location.city,
          current: {
            temp: channel.item.condition.temp,
            code: `wi-yahoo-${channel.item.condition.code}`
          },
          forecast: []
        }

        channel.item.forecast.slice(1, 4).map((f) => {
          weather.forecast.push({
            code: `wi-yahoo-${f.code}`,
            day: f.day,
            high: f.high,
            low: f.low
          })
        })
      }

      typeof callback === 'function' && callback(weather);
    })
  }
}