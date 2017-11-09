import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './SingleInputForm.css'

class SingleInputForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: ''
    }
  }

  onSubmit (event) {
    event.preventDefault()
    this.props.onSubmit(event, this.state.value)
  }

  render () {
    return (
      <form className="single-input-form" onSubmit={event => this.onSubmit(event)}>
        <input
          className="input"
          placeholder={this.props.placeholder}
          onChange={event => this.setState({ value: event.target.value })}
          required
          type={this.props.type}
          value={this.value}
        />
        <button className="submit" type="submit" title={this.props.buttonText || 'Submit'}>
          {this.props.iconUrl && <img className="icon" src={this.props.iconUrl} alt="Submit" />}
          {this.props.buttonText && <span className="text">{this.props.buttonText}</span>}
        </button>
      </form>
    )
  }
}

SingleInputForm.defaultProps = {
  buttonText: null,
  iconUrl: null,
  type: 'text'
}

SingleInputForm.propTypes = {
  buttonText: PropTypes.string,
  iconUrl: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string
}

export default SingleInputForm
