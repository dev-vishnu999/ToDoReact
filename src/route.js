import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Login from './components/login';
import AdminLogin from './components/admin_login';
import Registration from './components/registration';
import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import Roles from './components/dashboard/Roles';
function Routes() {
    return (
        <Router>
            <Switch>
            <Route exact path='/' component={Login}></Route>
            <Route exact path='/admin-login' component={AdminLogin}></Route>
            <Route path='/registration' component={Registration}></Route>
            <Route path='/dashboard' component={Dashboard}></Route>
            <Route path='/admin-dashboard' component={AdminDashboard}></Route>
            <Route path='/role-listing' component={Roles}></Route>
            
            </Switch>
        </Router>
    );
  }
  
  export default Routes;
  