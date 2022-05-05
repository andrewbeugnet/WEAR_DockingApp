import React, { Component } from 'react';
import {Button, ListGroup, Card } from 'react-bootstrap';
import "./Status.css"

/* Status Page
  - Displays last time the HoloLens was synced with system
  - Displays whether the HoloLens is currently visible to system
  - Displays pending work order
  - Displays Last Logs that were generated

*/

var HoloLens = {
    connected: '',
    lastSyncOn: '',
    lastSyncStatus: '',
    workOrder: ''
  }

let WorkOrder = {
  upcoming: '',
  lastComplete: '',
  incomplete: ''
}




class Status extends Component {

  constructor(props) {
    super(props);
  }

  async updateProps() {
      var parseJSON = await window.ipcRenderer.invoke('get-status-props')
      console.log(parseJSON.status.hololens.connected)
      HoloLens.connected = parseJSON.status.hololens.connected;
      HoloLens.lastSyncOn = parseJSON.status.hololens.lastSyncOn;
      HoloLens.lastSyncStatus = parseJSON.status.hololens.lastSyncStatus;
      HoloLens.workOrder = parseJSON.status.hololens.workOrder;
    
      WorkOrder.upcoming = parseJSON.status.workOrder.upcoming;
      WorkOrder.lastComplete = parseJSON.status.workOrder.lastComplete;
      WorkOrder.incomplete = parseJSON.status.workOrder.incomplete;
    
      document.getElementById("hololens-field-1").innerHTML = HoloLens.connected
  if(HoloLens.connected == "Yes"){
    document.getElementById("hololens-field-1").parentElement.style.backgroundColor = 'lightgreen'
  }
  else if(HoloLens.connected == 'No'){
    document.getElementById("hololens-field-1").parentElement.style.backgroundColor = 'lightcoral'
  }
  else{
    document.getElementById("hololens-field-1").parentElement.style.backgroundColor = 'lightgray'
  }
  // HoloLens Last Sync
  document.getElementById("hololens-field-2").innerHTML = HoloLens.lastSyncOn
  if(HoloLens.lastSyncOn == undefined){
    document.getElementById("hololens-field-2").parentElement.style.backgroundColor = 'lightcoral'
  }
  else{
    document.getElementById("hololens-field-2").parentElement.style.backgroundColor = 'lightgray'
  }
  //HoloLens Last Sync Status
  document.getElementById("hololens-field-3").innerHTML = HoloLens.lastSyncStatus
  if(HoloLens.lastSyncStatus == 'Success'){
    document.getElementById("hololens-field-3").parentElement.style.backgroundColor = 'lightgreen'
  }
  else if(HoloLens.lastSyncStatus == 'Failed'){
    document.getElementById("hololens-field-3").parentElement.style.backgroundColor = 'lightcoral'
  }
  else{
    document.getElementById("hololens-field-3").parentElement.style.backgroundColor = 'lightgray'
  }
  //Last Work Order Uploaded
  document.getElementById("hololens-field-4").innerHTML = HoloLens.workOrder
  if(HoloLens.workOrder == undefined){
    document.getElementById("hololens-field-4").parentElement.style.backgroundColor = 'lightcoral'
  }
  else{
    document.getElementById("hololens-field-4").parentElement.style.backgroundColor = 'lightgray'
  }

  /* Work Order */
  // Upcoming
  document.getElementById("work-order-field-1").innerHTML = WorkOrder.upcoming
  if(WorkOrder.upcoming == undefined){
    document.getElementById("work-order-field-1").parentElement.style.backgroundColor = 'lightcoral'
  }
  else{
    document.getElementById("work-order-field-1").parentElement.style.backgroundColor = 'lightgray'
  }
  //Last Completed
  document.getElementById("work-order-field-2").innerHTML = WorkOrder.lastComplete
  if(WorkOrder.lastComplete == undefined){
    document.getElementById("work-order-field-2").parentElement.style.backgroundColor = 'lightcoral'
  }
  else{
    document.getElementById("work-order-field-2").parentElement.style.backgroundColor = 'lightgray'
  }
  //Incomplete
  document.getElementById("work-order-field-3").innerHTML = WorkOrder.incomplete
  if(WorkOrder.incomplete == "None"){
    document.getElementById("work-order-field-3").parentElement.style.backgroundColor = 'lightgray'
  }
  else if(WorkOrder.incomplete == undefined){
    document.getElementById("work-order-field-3").parentElement.style.backgroundColor = 'lightcoral'
  }
  else{
    document.getElementById("work-order-field-3").parentElement.style.backgroundColor = 'lightyellow'
  }
}

/* This function will add all of the values from the config.json file into the page as well as add conditional formatting */
async componentDidMount() {
  window.ipcRenderer.on('login-success', (event) => {
    console.log('update status')
    this.updateProps();
  })
  /* HoloLens */
  //HoloLens Connected
}

  render() {
      var { title, children } = this.props;
      return (
          <div id="status-page" hidden>
              <h2 id="status-page-title"> Status Page </h2><hr/>
              <div id="status-cards">
                <div class="row">
                  <div class="col-sm-3"><h3></h3></div>
                    <div class="col-sm-6">
                    <h3>HoloLens</h3>
                      <ListGroup>
                          <ListGroup.Item id="hololens-field-1"><p><strong>Currently Connected: </strong></p>
                            <p id="hololens-field-1"></p></ListGroup.Item>
                          <ListGroup.Item><p><strong>Last Sync Attempt On:</strong></p>
                            <p id="hololens-field-2"></p></ListGroup.Item>
                          <ListGroup.Item><p><strong>Last Sync Status:</strong></p>
                            <p id="hololens-field-3"></p></ListGroup.Item>
                          <ListGroup.Item><p><strong>Current Work Order Uploaded</strong></p>
                            <p id="hololens-field-4"></p></ListGroup.Item>
                      </ListGroup>
                    </div>
                    <div class="col-sm-3"><h3></h3></div>
                </div>
                <div class="row" id="status-cards"></div>
                <div class="row">
                <div class="col-sm-3"><h3></h3></div>
                <div class="col-sm-6">
                      <h3>Work Order</h3>
                      <ListGroup>
                          <ListGroup.Item><p><strong>Upcoming Work Orders: </strong></p>
                            <p id="work-order-field-1"></p></ListGroup.Item>
                          <ListGroup.Item><p><strong>Last Work Order Completed:</strong></p>
                            <p id="work-order-field-2"></p></ListGroup.Item>
                          <ListGroup.Item><p><strong>Incomplete Work Order:</strong></p>
                            <p id="work-order-field-3"></p></ListGroup.Item>
                      </ListGroup>
                    </div>
                </div>
                <div class="col-sm-3"><h3></h3></div>
                </div>
              
          </div>
      )
    }
  }


export default Status;