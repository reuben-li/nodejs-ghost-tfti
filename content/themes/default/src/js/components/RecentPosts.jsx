import React from 'react'
import getSlug from 'speakingurl'
import moment from 'moment'

export default class RecentPosts extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <ul className='recent-posts'>
      {this.props.items.map(function(item) {
        let categoryUrl = `/hit-the-road/tag/${getSlug(item.category)}`
        return <li>
          <div><a href={categoryUrl} className='category'>{item.category}</a> <span className='meta'>{moment(new Date(item.date)).format('ddd, DD MMM YYYY')}</span></div>
          <a href={item.link} className='title'>{item.title}</a>
        </li>
      })}
      </ul>
  }
}
