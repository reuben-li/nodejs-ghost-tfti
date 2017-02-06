import React from 'react'
import getSlug from 'speakingurl'

export default class Tags extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {

    if (this.props.items.length > 0) {
      return <div key={this.props.index} className='tag-cloud'>
        {this.props.items.map(item => {
          let name = item.trim()
          return <a key={getSlug(name)} href={this.props.baseUrl + "tag/" + getSlug(name)}>{name}</a>
        })}
      </div>
    } else {
      return <p>No popular tags defined yet. Learn how to make a list of popular tags in the documentation.</p>
    }
  }
}

