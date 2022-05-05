import React from 'react';
import './App.css';
import Login from "./pages/Login";
import Status from "./pages/Status";
import WorkOrder from "./pages/WorkOrder";
import HoloSync from "./pages/HoloSync";
import Logo from "./logo.svg"

import SideBar from './components/sidebar';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <div class="page-header" id="page-header" hidden>
          <img className="about-img" width="75" src={Logo} alt=""/>
          <h1 id="header-title">WEAR</h1>
      </div>
        <div id="page-nav" hidden>
          <SideBar  />
        </div>
        <div id="page-wrap">
        <div>
          <Login />
        </div>
        <div id="pages">
          <Status />
          <WorkOrder />
          <HoloSync />
        </div>
      </div>
    </div>
  );
}

export default App;
