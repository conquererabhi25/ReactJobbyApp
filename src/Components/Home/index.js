import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

class Home extends Component {
  render() {
    return (
      <div className="Home-container">
        <Header />
        <div>
          <div className="home-description-box">
            <h1 className="heading">Find The Job That Fits Your Life</h1>
            <p className="paragraph">
              Millions of people are searching for
              jobs,salary,information,company reviews. Find the job that fits
              your abilities and potential
            </p>
            <Link to="/jobs">
              <button type="button" className="find-job-button">
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
