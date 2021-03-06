import React from 'react'
import { connect } from 'react-redux'
import { saveGoto, editGoto, deleteGoto } from '../actions'

class Goto extends React.Component {
  state = {
    dirty: false,
    focus: false
  }

  onFocus = () => {
    this.setState({focus: true})
  }

  onBlur = () => {
    this.setState({focus: false})
    // debounce in case we're tabbing between inputs
    setTimeout(() => {
      if (!this.state.focus) {
        this.onSubmit()
      }
    }, 0)
  }

  delete = () => {
    if (!this.props.editable) {
      return
    }
    this.props.dispatch(deleteGoto({id: this.props.id}))
  }

  editAttribute = (attr) => {
    return e => {
      const change = {}
      change[attr] = e.target.value
      const goto = Object.assign({}, this.props, change)
      this.props.dispatch(editGoto(goto))

      if (change[attr] != this.props[attr]) {
        this.setState({dirty: true})
      }
    }
  }

  onKeyDown = (e) => {
    if (e.key == 'Enter') {
      this.onSubmit()
    }
  }

  onSubmit = (e) => {
    if (!this.props.editable || !this.state.dirty) {
      return
    }
    if (!this.props.skill.length || !this.props.nickname.length) {
      return
    }
    this.props.dispatch(saveGoto(this.props))
    this.setState({dirty: false})
  }

  render() {
    // hide blank goto on other people's pages
    if (!this.props.editable && !this.props.created_at) {
      return null
    }

    let className = ''
    if (this.state.focus) {
      className += ' editing'
    }
    return (
      <a target="_blank" className="row-link" href={this.props.editable ? undefined : this.props.twitter_profile_url}>
        <li
          className={'goto' + className}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
        >
        <form className="row" onSubmit={this.onSubmit}>
          <input type="text"
            ref="skill"
            className="skill craft"
            placeholder="Write a skill..."
            value={this.props.skill}
            onChange={this.editAttribute('skill')}
            disabled={!this.props.editable}
            autoFocus={false && !this.props.created_at}
          />
          <div className="profile">
            <div className="user">
              <span className="name">{this.props.name}</span>
              <input
                className="handle"
                type="text"
                placeholder="Add a Twitter handle..."
                value={this.props.nickname}
                onChange={this.editAttribute('nickname')}
                disabled={!this.props.editable}
              />
            </div>
            <img src={this.props.image} />
          </div>
          {this.props.editable && this.props.created_at ?
            <div className="remove x" onClick={this.delete}>✕</div>
            : null
          }
        </form>
        </li>
      </a>
    )
  }
}

const props = state => ({
  editable: state.user.id == state.profile.id,
})

export default connect(props)(Goto)
