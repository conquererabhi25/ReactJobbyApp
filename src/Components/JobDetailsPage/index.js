import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch, BsFillFolderFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
}

class JobDetailsPage extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    requiredSkills: [],
    lifeAtJob: [],
    jobData: {},
    similarJobsList: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  convertSkillData = skillData => ({
    name: skillData.name,
    imageUrl: skillData.image_url,
  })

  convertToCamelCase = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    location: data.location,
    id: data.id,
    perAnnumPackage: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const caseUpdatedData = this.convertToCamelCase(data.job_details)
      const lifeAtCompanyUpdateData = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }
      const requiredSkillsData = data.job_details.skills.map(eachSkill =>
        this.convertSkillData(eachSkill),
      )
      const similarJobs = data.similar_jobs.map(eachJob =>
        this.convertToCamelCase(eachJob),
      )

      this.setState({
        jobData: caseUpdatedData,
        lifeAtJob: lifeAtCompanyUpdateData,
        requiredSkills: requiredSkillsData,
        similarJobsList: similarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView() {
    const {requiredSkills, lifeAtJob, jobData, similarJobsList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      title,
      rating,
      id,
      location,
      perAnnumPackage,
    } = jobData

    const {description, imageUrl} = lifeAtJob

    return (
      <div className="success-container">
        <div className="jobSpecific-Div">
          <div className="eachJobData-div">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="companyLogoImg"
            />
            <div className="company-name">
              <h1 className="jobTitle">{title}</h1>
              <div className="rating-div">
                <AiFillStar color=" #fbbf24" />
                <p className="text-color">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-div">
            <div className="part-1">
              <div className="part-2">
                <HiLocationMarker color="#ffffff" />
                <p className="job-text">{location}</p>
              </div>
              <div className="part-2">
                <BsFillFolderFill color="#ffffff" />
                <p className="job-text">{employmentType}</p>
              </div>
            </div>
            <a href={companyWebsiteUrl} className="anchor-element">
              Visit <BiLinkExternal />
            </a>
            <p className="job-text">{perAnnumPackage}</p>
          </div>
          <hr className="division-line" />
          <div className="description-container">
            <h1 className="description-title">Description</h1>
            <p className="description-para">{jobDescription}</p>
          </div>
          <h1 className="description-title">Skills</h1>
          <div className="ul-div">
            <ul className="skill-ul-list">
              {requiredSkills.map(each => (
                <li className="skill-list" key={each.name}>
                  <img
                    src={each.imageUrl}
                    alt={each.name}
                    className="skill-image"
                  />
                  <p className="description-title">{each.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <h1 className="description-title">Life at Company</h1>
          <div className="life-at-company-info">
            <p className="description-para">{description}</p>
            <img
              src={imageUrl}
              alt="job description"
              className="LifeAtJob-image"
            />
          </div>
        </div>
        <div className="similar-job-div">
          <h1 className="description-title-3">Similar Jobs</h1>
          <ul className="simlilar-job-unoredred-list">
            {similarJobsList.map(each => (
              <div className="jobSpecific-Div-similar-job">
                <li key={each.id}>
                  <div className="eachJobData-div">
                    <img
                      src={companyLogoUrl}
                      alt="company logo"
                      className="companyLogoImg"
                      key={title}
                    />
                    <div className="company-name">
                      <h1 className="jobTitle">{title}</h1>
                      <div className="rating-div">
                        <AiFillStar color=" #fbbf24" />
                        <p className="text-color" key={rating}>
                          {rating}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="location-div">
                    <div className="part-1">
                      <div className="part-2">
                        <HiLocationMarker color="#ffffff" />
                        <p className="job-text">{location}</p>
                      </div>
                      <div className="part-2">
                        <BsFillFolderFill color="#ffffff" />
                        <p className="job-text">{each.employmentType}</p>
                      </div>
                    </div>
                    <p className="job-text">{each.perAnnumPackage}</p>
                  </div>
                  <hr className="division-line" />
                  <div className="description-container">
                    <h1 className="description-title">Description</h1>
                    <p className="description-para">{each.jobDescription}</p>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-div">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-container">
        <Header />
        {this.renderApiStatus()}
      </div>
    )
  }
}

export default JobDetailsPage
