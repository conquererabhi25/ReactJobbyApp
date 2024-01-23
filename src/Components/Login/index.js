import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    ErrorMsg: '',
    isErrorOccured: false,
  }

  loginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  loginFailure = errorMsg => {
    this.setState({ErrorMsg: errorMsg})
  }

  loginFormSubmitted = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    console.log(userDetails)
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.loginSuccess(data.jwt_token)
      this.setState({isErrorOccured: false})
    } else {
      this.loginFailure(data.error_msg)
      this.setState({isErrorOccured: true})
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderUsernameField = () => (
    <div className="input-element-div">
      <label className="input-label" htmlFor="username">
        USERNAME
      </label>
      <input
        type="text"
        id="username"
        className="username-input-field"
        onChange={this.onChangeUsername}
        placeholder="Username"
      />
    </div>
  )

  renderPasswordField = () => (
    <div className="input-element-div">
      <label className="input-label" htmlFor="password">
        PASSWORD
      </label>
      <input
        type="password"
        id="password"
        className="username-input-field"
        onChange={this.onChangePassword}
        placeholder="Password"
      />
    </div>
  )

  render() {
    const {isErrorOccured, ErrorMsg} = this.state

    return (
      <form className="login-page-container" onSubmit={this.loginFormSubmitted}>
        <div className="login-box">
          <div className="App-Logo">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="websiteLogo"
            />
            <div className="input-container">{this.renderUsernameField()}</div>
            <div className="input-container">{this.renderPasswordField()}</div>
            {isErrorOccured ? <p className="error-msg">{ErrorMsg}</p> : null}
            <button type="submit" className="login-button">
              Login
            </button>
          </div>
        </div>
      </form>
    )
  }
}

export default Login
