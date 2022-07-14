import './App.css';
import { BrowserRouter as Router, Routes as Switch, Route } from "react-router-dom";
import { useState } from 'react';

import CONSTANTS from './modules/CONSTANTS.json';
import { postRequest } from './modules/requests';

import Navbar from './components/Navbar/Navbar.js';
import ThreadListPage from './content/ThreadListPage/ThreadListPage.js'
import ThreadPage from './content/ThreadPage/ThreadPage';
import UserPage from './content/UserPage/UserPage.js'
import LoginRegisterPage from './content/LoginRegisterPage/LoginRegisterPage';
import LogoutPage from './content/LogoutPage/LogoutPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(document.cookie.indexOf(CONSTANTS.JWT_COOKIE_NAME) !== null)
  const [vote, setVote] = useState()

  const refreshJWT = () => {
    if (loggedIn) {
      const address = `${CONSTANTS.INTERFACE_API_LOCATION}auth/renew_token`
      postRequest(address, {}).then(() => {
        //try to refresh jwt every half hour
        setTimeout(function () { refreshJWT() }, 1800000)
      })
    }
  }
  setTimeout(function () { refreshJWT() }, 3000)

  const postLogIn = () => {
    setLoggedIn(true)
  }
  const postLogOut = () => {
    setLoggedIn(false)
  }
  
  return (
    <div >
      <Router>
        <Navbar loggedIn={loggedIn}/>
        
        <Switch>
          <Route exact path='/' element={<ThreadListPage vote={vote}/>}/>
          <Route path='/search/user'>
            <Route path='threads/:userID' element={<UserPage />}/>
          </Route>
          <Route path='/thread'>
            <Route path=':id' element={<ThreadPage vote={vote}/>} />
          </Route>
          <Route path='/login' element={<LoginRegisterPage postLogIn={postLogIn}/>}/>
          <Route path='/logout' element={<LogoutPage postLogOut={postLogOut}/>}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
