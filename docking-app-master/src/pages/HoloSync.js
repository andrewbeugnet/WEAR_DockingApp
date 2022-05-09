import React, { Component } from 'react';
import "./HoloSync.css"
import Sidebar from '../components/sidebar';
import { Button, Form, Card, Table, ProgressBar } from 'react-bootstrap';
import { tsPropertySignature } from "../../node_modules/@babel/types";

let link = "https://10.160.13.116/" //hard-coded to current Hololens IP address

let steps = [
  'Make sure the Hololens is connected to the same network as this device.',
  'Navigate to Device Portal <a target="_blank" href='+link+'>here</a>.',
  'Navigate to File Explorer under System tab.',
  'Navigate to App Folder under LocalAppData/WEAR/LocalState and find .csv file. ',
  'Click save icon to save .csv file to Downloads folder. Exit Device Portal and click Done button when finished.'
]

let progressLevels = [
  10,
  30,
  50,
  75,
  100
]

class HoloSync extends Component {
  constructor(props, context){
    super(props, context);
    this.progress = 10;
    this.step = 0;
    this.disableDone = true;
    this.Sidebar = new Sidebar();
    this.nextStep = this.nextStep.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this);
  }  

  nextStep(){
    console.log(document.getElementById('holosync-directions').innerHTML)
    console.log(document.getElementById('progress-bar').children.value)
    document.getElementById('holosync-directions').innerHTML = steps[this.step];
    this.progress = progressLevels[this.step];
    this.step = (this.step + 1)%5;
    if (this.step == 0 || this.step == 1) this.disableDone = !this.disableDone;
    if (this.step == 1)
    {
        document.getElementById('holo-sync-page').hidden = true;
        document.getElementById('status-page').hidden = false;
        Sidebar.currPage = 'status-page';
    }
    this.forceUpdate();
  }

  componentDidMount() {
    window.ipcRenderer.on('login-success', (event) => {
        console.log("Good Sir")
        this.step = 0;
        this.progress = 0
        this.nextStep()
    })
}

  render() {
    var {title, children } = this.props;

    return (
      <div className="holo-sync-page" id="holo-sync-page" hidden>
          <h2 id="page-title">HoloSync</h2><hr/>
          <p>Follow the following steps to download a .csv file for Cascade use</p>
          <br/>
          <h4>Upload Progress</h4>
          <div id="progress-bar">
            <ProgressBar variant="info" now={this.progress} />
          </div>
          <div id="steps">
            <Card id="step-1">
              <Card.Body>
                <Card.Title><p id="holosync-directions"></p></Card.Title>
                
                <div class="row" id="work-order-buttons">    
                  <div class="col-sm-8"></div>      
                  <div class="col-sm-2">
                    <Button disabled={this.disableDone} variant="login" id="loginButton" onClick={this.nextStep} >Next Step</Button>
                  </div>
                  <div class="col-sm-2">
                  <Button disabled={!this.disableDone} variant="login" id="loginButton" onClick={this.nextStep} >Done</Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
      </div>



  )
  }
    
}

export default HoloSync;