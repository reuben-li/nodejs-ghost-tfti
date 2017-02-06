import React from 'react'

export default class FeaturedPost extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {

    return <a href={this.props.post.link} className="featured-post featured-post-side" style={{background: 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6)), url(' + this.props.post.image + ') 50% 50% no-repeat', backgroundSize: 'cover'}}>
      <span className="post-category-wrap"><span className="post-category post-featured">{this.props.title}</span></span>
      <h2>{this.props.post.title}</h2>
    </a>
  }
}