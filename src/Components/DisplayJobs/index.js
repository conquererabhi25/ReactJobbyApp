import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch, BsFillFolderFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import './index.css'

class DisplayJobs extends Component {
  state = {userInput: '', jobDataList: []}

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    const {userInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?search=""`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const jobSnakeData = data.jobs
      const updatedCamelCasedata = jobSnakeData.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({jobDataList: updatedCamelCasedata})
    }
  }

  searchText = event => {
    this.setState({userInput: event.target.value})
  }

  SearchResult = () => {
    const {userInput} = this.state
    this.setState({userInput: ''})
    console.log(userInput)
  }

  render() {
    const {userInput, jobDataList} = this.state

    return (
      <div className="jobItemMain-container">
        <div className="searchBar">
          <input
            type="search"
            className="searchInput"
            placeholder="Search"
            onChange={this.searchText}
            value={userInput}
          />
          <button
            type="button"
            className="searchButton"
            onClick={this.SearchResult}
            data-testid="searchButton"
          >
            <BsSearch />
          </button>
        </div>
        <ul className="unordered-list">
          {jobDataList.map(each => (
            <li className="jobsList" key={each.id}>
              <div className="eachJobData-div">
                <img
                  src={each.companyLogoUrl}
                  alt={each.title}
                  className="companyLogoImg"
                />
                <div className="company-name">
                  <h1 className="jobTitle">{each.title}</h1>
                  <div className="rating-div">
                    <AiFillStar color=" #fbbf24" />
                    <p className="text-color">{each.rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-div">
                <div className="part-1">
                  <div className="part-2">
                    <HiLocationMarker color="#ffffff" />
                    <p className="job-text">{each.location}</p>
                  </div>
                  <div className="part-2">
                    <BsFillFolderFill color="#ffffff" />
                    <p className="job-text">{each.employmentType}</p>
                  </div>
                </div>
                <p className="job-text">{each.packagePerAnnum}</p>
              </div>
              <hr className="division-line" />
              <div className="description-container">
                <h1 className="description-title">Description</h1>
                <p className="description-para">{each.jobDescription}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default DisplayJobs
