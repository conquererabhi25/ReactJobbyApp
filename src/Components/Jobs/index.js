import {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {BsSearch, BsFillFolderFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import Header from '../Header'

import DisplayJobs from '../DisplayJobs'
import JobDetailsPage from '../JobDetailsPage'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const apiStatusJobSection = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
  noJobs: 'NOJOB',
}

class Jobs extends Component {
  state = {
    userDetails: {},
    apiStatus: apiStatusConstants.initial,
    employmentType: [],
    salaryRange: '1000000',
    jobDataList: [],
    userInput: '',
    apiJobStatus: apiStatusJobSection.initial,
  }

  componentDidMount() {
    this.getUserProfileData()
    this.getJobData()
  }

  getJobData = async () => {
    const {employmentType, salaryRange, userInput} = this.state
    console.log(employmentType)
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${userInput}`
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiJobStatus: apiStatusJobSection.loading})
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

      if (data.total === 0) {
        this.setState({
          apiJobStatus: apiStatusJobSection.noJobs,
        })
      } else {
        this.setState({
          jobDataList: updatedCamelCasedata,
          apiJobStatus: apiStatusJobSection.success,
        })
      }
    } else {
      this.setState({apiJobStatus: apiStatusConstants.failure})
    }
  }

  profileUpdatedData = data => {
    const userProfileDetails = {
      name: data.name,
      profileImageUrl: data.profile_image_url,
      shortBio: data.short_bio,
    }
    this.setState({userDetails: userProfileDetails})
  }

  getUserProfileData = async () => {
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    this.setState({apiStatus: apiStatusConstants.loading})
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.profileUpdatedData(data.profile_details)
      this.setState({apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  checkBoxSelected = event => {
    console.log(event.target.value)
  }

  renderLoader = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {userDetails, apiStatus} = this.state
    const {name, profileImageUrl, shortBio} = userDetails

    return (
      <div className="profile">
        <div>
          <img src={profileImageUrl} alt="profile" className="profile-img" />
          <h1 className="profile-heading">{name}</h1>
          <p>{shortBio}</p>
        </div>
      </div>
    )
  }

  refreshPageView = () => {
    const refreshPage = () => {
      this.getUserProfileData()
    }
    return (
      <button type="button" className="logout-button" onClick={refreshPage}>
        Retry
      </button>
    )
  }

  checkApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.refreshPageView()
      default:
        return null
    }
  }

  searchText = event => {
    this.setState({userInput: event.target.value})
  }

  SearchResult = () => {
    const {userInput} = this.state
    this.setState({userInput: ''})
    this.getJobData()
  }

  renderJobSectionLoader = () => (
    <div className="job-section-loader" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderDisplayJobSection = () => {
    const {jobDataList, userInput, employmentType, salaryRange} = this.state

    return (
      <ul className="unordered-list">
        {jobDataList.map(each => (
          <li className="jobsList" key={each.id}>
            <Link to={`/jobs/${each.id}`} className="jobs-link-style">
              <div className="eachJobData-div">
                <img
                  src={each.companyLogoUrl}
                  alt="company logo"
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
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  refreshPageJobs = () => {
    this.getJobData()
  }

  renderJobSectionFailure = () => (
    <div className="failure-div">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="logout-button-2"
        onClick={this.refreshPageJobs}
      >
        Retry
      </button>
    </div>
  )

  noJobsFound = () => (
    <div className="failure-div">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="job-failure-img"
      />
      <h1>No Jobs Found</h1>
    </div>
  )

  renderApiStatusForJobSection = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiStatusJobSection.loading:
        return this.renderJobSectionLoader()
      case apiStatusJobSection.success:
        return this.renderDisplayJobSection()
      case apiStatusJobSection.noJobs:
        return this.noJobsFound()
      case apiStatusJobSection.failure:
        return this.renderJobSectionFailure()
      default:
        return null
    }
  }

  render() {
    const {employmentType, salaryRange} = this.state
    return (
      <div className="Job-page-main-div">
        <Header />
        <div className="job-search-functionalities">
          <div className="job-filters">
            {this.checkApiStatus()}
            <hr className="divison-line" />
            <h1 className="filter-heading">Type of Employment</h1>
            <div className="ul-div">
              <ul className="filter-unordered-list">
                {employmentTypesList.map(each => {
                  const onSelectEmploymentType = event => {
                    const typeValue = event.target.value
                    this.setState(prevState => ({
                      employmentType: [...prevState.employmentType, typeValue],
                    }))
                    this.getJobData()
                  }
                  return (
                    <li
                      key={each.employmentTypeId}
                      onChange={onSelectEmploymentType}
                    >
                      <input
                        type="checkbox"
                        id={each.employmentTypeId}
                        className="input-element"
                        value={each.employmentTypeId}
                        default="unchecked"
                      />
                      <label htmlFor={each.employmentTypeId}>
                        {each.label}
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
            <hr className="divison-line" />
            <h1 className="filter-heading">Salary Range</h1>
            <ul className="filter-unordered-list">
              {salaryRangesList.map(each => {
                const onSelectSalaryRange = event => {
                  this.setState({salaryRange: event.target.value})
                  this.getJobData()
                }
                return (
                  <li key={each.salaryRangeId} onChange={onSelectSalaryRange}>
                    <input
                      type="radio"
                      className="input-element"
                      id={each.salaryRangeId}
                      name="salaryRange"
                      value={each.salaryRangeId}
                    />
                    <label htmlFor={each.salaryRangeId}>{each.label}</label>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="jobItemMain-container">
            <div className="searchBar">
              <input
                type="search"
                className="searchInput"
                placeholder="Search"
                onChange={this.searchText}
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
            {this.renderApiStatusForJobSection()}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
