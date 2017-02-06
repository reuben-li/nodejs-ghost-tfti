import React from 'react'
import ReactDOM from 'react-dom'

import Tags from './components/Tags'
import RecentPosts from './components/RecentPosts'
import Weather from './components/Weather'
import FeaturedPost from './components/FeaturedPost'
import renderLocationComponent from './components/Location'
import BlogStore from './stores/BlogStore'
import WeatherStore from './stores/WeatherStore'

let rssElement = document.querySelector('link[rel="alternate"][type="application/rss+xml"]')
let blogStore = new BlogStore(rssElement == null ? '/rss' : rssElement.getAttribute('href'))

/**
 * Weather widget
 */

let weatherMeta = document.querySelectorAll('meta[property^=weather-widget]')

if (weatherMeta.length > 0) {

  let data = {
    location: '',
    provider: '',
    providerKey: '',
    delay: 0,
    title: 'Loading weather data...',
    units: 'c'
  }

  for (let i=0; i<weatherMeta.length; i++) {
    switch (weatherMeta[i].getAttribute('property')) {
      case 'weather-widget:location': data.location = weatherMeta[i].getAttribute('content')
        break
      case 'weather-widget:provider': data.provider = weatherMeta[i].getAttribute('content')
        break
      case 'weather-widget:provider-key': data.providerKey = weatherMeta[i].getAttribute('content')
        break
      case 'weather-widget:delay': data.delay = weatherMeta[i].getAttribute('content')
        break
      case 'weather-widget:title': data.title = weatherMeta[i].getAttribute('content')
        break
      case 'weather-widget:units': data.units = weatherMeta[i].getAttribute('content')
        break
    }
  }

  if (data.location.length) {
    let weatherElement = document.querySelector('.render-component-weather')
    let weatherStore = WeatherStore.resolve(data.provider, data.units, data.providerKey)

    if (weatherElement != null && weatherStore != null) {
      let weatherComponent = ReactDOM.render(<Weather loadingTitle={data.title} attribution={weatherStore.attribution} />, weatherElement)

      setTimeout(function() {
        weatherStore.load(data.location, (response) => {

          if (!response.success)
            weatherComponent.hide()

          weatherComponent.setData(response)
        })

      }, data.delay)
    }
  }
}

renderLocationComponent()

/**
 * Tags widget
 */

let tagElements = document.querySelectorAll('.render-component-tags')
let tagsMeta = document.querySelector('meta[property="tags-widget:tags"]')

for (let i=0; i<tagElements.length; i++) {
  let tags = tagsMeta != null ? tagsMeta.getAttribute('content').split(',') : []
  ReactDOM.render(<Tags key={i} index={i} items={tags} baseUrl={window.baseUrl} />, tagElements[i])
}

/**
 * Responsive image loading
 */


const preloadImages = function() {
  var posts = document.querySelectorAll('.preload-background')

  for (let i=0; i<posts.length; i++) {
    if (posts[i].hasAttribute('data-image')) {
      (function (post) {

        let loader = new Image()
        let resize = post.getAttribute('data-resize') || false

        loader.src = resize
          ? post.getAttribute('data-image') + '?rw=' + post.offsetWidth + '&rh=' + post.offsetHeight
          : post.getAttribute('data-image')

        loader.onload = function () {
          post.querySelector('.spinner').style.display = 'none'
          let image = post.querySelector('.preload-background-image')
          image.style.backgroundImage = 'url(' + loader.src + ')'
          image.style.opacity = 1
        }
      })(posts[i])
    }
  }
};

preloadImages();

/**
 * Search widget
 */

const getQueryString = function ( field, url ) {
  var href = url ? url : window.location.href;
  var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
  var string = reg.exec(href);
  return string ? decodeURIComponent(string[1].replace(/\+/g, ' ')) : null;
};

if(typeof $.fn.ghostHunter !== 'undefined' && typeof ghost !== 'undefined' && $('.render-search-results').length) {
  const $input = $('<input id="foo" />');
  const searchQuery = getQueryString('q');
  const $pageTitle = $('h1');

  const template =
    '<article class="post preload-background" data-image="{{image}}" data-resize="true"> \
      <a href="' + window.baseUrl + '{{link}}" class="post-image"> \
        <span class="preload-background-image"></span>\
        <span class="post-category-wrap"> \
          <span class="post-category">{{tag}}</span>\
        </span> \
        <span class="preload-background-spinner spinner" style="display: none;">\
          <span class="double-bounce1"></span>\
          <span class="double-bounce2"></span>\
        </span>\
        <header class="post-header">\
          <h2 class="post-title">{{title}}</h2>\
        </header>\
      </a> \
    </article>';
  const ghostHunter = $input.ghostHunter({
    results: ".render-search-results",
    onPageLoad: true,
    result_template: template,
    info_template: '',
    onComplete: function(result) {
      if (result.length) {
        preloadImages();
      } else {
        var $notFound = $('.render-search-results-not-found');
        $notFound.removeClass('hidden').show();
        $notFound.find('input:text').val(searchQuery);
      }
      $('.render-search-results-indicator').hide();
    },
    onLoaded: function() {
      ghostHunter.find(searchQuery);
    }
  });

  window.ghostHunter = ghostHunter;
}

/**
 * Workaround for vh100 bug
 */

let header = document.getElementById('header')
if (!header.classList.contains('header-hidden') && !header.classList.contains('header-naked')) {
  header.style.height = window.innerHeight + "px";
  header.classList.remove('header-vh100')
}

/**
 * Custom navbar toggler
 */

let els = document.querySelectorAll('button[data-toggle=collapse2]')
for (let i=0; i<els.length; i++) {
    els[i].addEventListener('click', function(e) {
        let target = this.getAttribute('data-target')
        let el = document.getElementById(target)

        if (el != null) {
            if (el.classList.contains('in')) {
                el.classList.remove('in')

                let items = document.querySelectorAll('.hide-on-menu')

                for (let i=0; i<items.length; i++) {
                    items[i].classList.remove('hidden-xs')
                    items[i].classList.remove('hidden-sm')
                }

                document.getElementById('body').classList.remove('menu-visible')
            }
            else {
                el.classList.add('in')

                let items = document.querySelectorAll('.hide-on-menu')

                for (let i=0; i<items.length; i++) {
                    items[i].classList.add('hidden-xs')
                    items[i].classList.add('hidden-sm')
                }

                document.getElementById('body').classList.add('menu-visible')

            }
        }
    }, false)
}

const searchButton = document.getElementById('header-search-button')

if (searchButton != null) {
  searchButton.addEventListener('click', function() {
    if (searchButton.classList.contains('inactive')) {
      searchButton.classList.remove('inactive')
      searchButton.attributes['type'] = 'submit'
      searchButton.parentNode.classList.add('active')
      const inputWrap = searchButton.parentNode.querySelector('.input-wrap')
      inputWrap.classList.add('active')
      document.getElementById('header-search-input').focus()
    } else {
      document.getElementById('header-search-form').submit()
    }
  })
}

document.onscroll = function(e) {
  let top = document.body.scrollTop
  let scrollHint = $('#scroll-hint')

  if (top > 0) {
    scrollHint.fadeOut()
  } else {
    scrollHint.fadeIn()
  }
}

