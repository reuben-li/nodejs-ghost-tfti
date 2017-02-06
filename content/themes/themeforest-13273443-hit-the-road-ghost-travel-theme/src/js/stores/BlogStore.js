import $ from 'jquery'

export default class BlogStore {

  constructor(url = '/rss') {
    this.document = {}
    this.tags = null
    this.posts = null
    this.featuredPosts = null
    this.url = url
  }

  load(callback) {
    $.ajax({
      dataType: 'xml',
      url: this.url,
      type: 'GET',
      success: (response) => {
        this.document = $(response)
        typeof callback === 'function' && callback();
      }
    })

  }

  getTags() {

    if (this.tags == null) {
      this.tags = []
      this.document.find('category').map((i, el) => {

        var name = $(el).text()
        var tag = null
        for (let i=0; i<this.tags.length; i++) {
          if (this.tags[i].name == name)
            tag = this.tags[i];
        }

        if (tag == null) {
          this.tags.push({name: name, count: 1})
        } else {
          tag.count = tag.count + 1
        }
      })
    }

    return this.tags
  }

  getPosts(limit = 100) {

    if (this.posts == null) {
      this.posts = []
      this.document.find('item').map((i, el) => {
        let $el = $(el)
        this.posts.push({
          title: $el.find('title').text(),
          description: $el.find('description').text(),
          link: $el.find('link').text(),
          date: $el.find('pubDate').text(),
          category: $el.find('category').first().text(),
          image: $el.find('content').attr('url')
        })
      })
    }

    return this.posts.slice(0, limit)
  }

  getFeaturedPost() {

    if (this.featuredPosts == null) {
      this.featuredPosts = []
      this.document.find('item').map((i, el) => {
        let $el = $(el)

        if ($el.find('category:contains("Featured")').length){

          this.featuredPosts.push({
            title: $el.find('title').text(),
            description: $el.find('description').text(),
            link: $el.find('link').text(),
            date: $el.find('pubDate').text(),
            image: $el.find('content').attr('url')
          })
        }
      })

      if (this.featuredPosts.length) {
        return this.featuredPosts[Math.floor(Math.random()*this.featuredPosts.length)]
      }

      return null
    }

  }
}