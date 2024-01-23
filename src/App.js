import {Switch, Route} from 'react-router-dom'
import Home from './Components/Home'
import Login from './Components/Login'
import NotFound from './Components/NotFound'
import Jobs from './Components/Jobs'
import JobDetailsPage from './Components/JobDetailsPage'
import ProtectedRoute from './Components/ProtectedRoute'

import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute path="/jobs/:id" component={JobDetailsPage} />
    <NotFound />
  </Switch>
)

export default App

// ccbp submit RJSCPAW11J
