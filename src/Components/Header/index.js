import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const logout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <ul className="nav-bar-ul">
      <li>
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo-img"
          />
        </Link>
      </li>
      <li>
        <div className="menu-option">
          <Link to="/" className="link-style ">
            Home
          </Link>
          <Link to="/jobs" className="link-style ">
            Jobs
          </Link>
        </div>
      </li>
      <li>
        <button type="button" className="logout-button" onClick={logout}>
          Logout
        </button>
      </li>
    </ul>
  )
}

export default withRouter(Header)
