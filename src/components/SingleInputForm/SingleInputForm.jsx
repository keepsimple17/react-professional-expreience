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
    const {
      buttonText,
      iconUrl,
      onSubmit,
      ...rest
    } = this.props

    return (
      <form className="single-input-form" onSubmit={event => this.onSubmit(event)}>
        <input
          {...rest}
          className="input"
          onChange={event => this.setState({ value: event.target.value })}
          value={this.state.value}
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
  iconUrl: null
}

SingleInputForm.propTypes = {
  buttonText: PropTypes.string,
  iconUrl: PropTypes.string,
  onSubmit: PropTypes.func.isRequired
}

export default SingleInputForm
