import React, { Component } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import "./Login.css"
import Status from "./Status";
let logo = './../full-logo.png';

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

let Cascade = {
  lastSyncName: '',
  lastUploadOn: '',
  lastUploadStatus: ''
}

class Login extends Component {
    
    constructor(props) {
        super(props);
    }

    async checkBypass() {
        var bypassFlag = await window.ipcRenderer.invoke('check-bypass')
        console.log(bypassFlag)
        if(!bypassFlag){
            var username = document.getElementById('formLogin').value;
            var password = document.getElementById('formPassword').value;
            console.log(username);
            console.log(password);
            var successfulLogin = await window.ipcRenderer.invoke('check-credentials', username, password)
            console.log(successfulLogin)
            if(successfulLogin){
                window.ipcRenderer.send('login', 'testing');
                document.getElementById('failedLoginAttempt').hidden = true;
                document.getElementById('formLogin').value = '';
                document.getElementById('formPassword').value = '';
                document.getElementById("formLogin").style.backgroundColor = 'white'
                document.getElementById("formPassword").style.backgroundColor = 'white'
            }
            else{
                document.getElementById('failedLoginAttempt').hidden = false;
                document.getElementById("formLogin").style.backgroundColor = 'red'
                document.getElementById("formLogin").style.opacity = '0.4'
                document.getElementById("formLogin").style.color = 'black'
                document.getElementById("formPassword").style.backgroundColor = 'red'
                document.getElementById("formPassword").style.opacity = '0.4'

            }
        }
        else{
            window.ipcRenderer.send('login', 'testing');
        }
    }
    
    
    
    
    render() {
        var { title, children } = this.props;

        return (
            <div id="login-page">
				{(					
					<div className="boxContent">
						{children}
					</div>
                )}
                {(
                    <div id="login-content">
                        <img src={logo} className="App-logo" alt="logo" id="primary-logo"/>
                        <h2 id="primary-logo"><strong>Docking System</strong></h2>
                        <h6 id="failedLoginAttempt" hidden> Incorrect Username or Password</h6>
                            <Form id="login-forms">
                                <Form.Group controlId="formLogin">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="username" placeholder="Enter Username" />
                                </Form.Group>

                                <Form.Group controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>
                                <div className="text-center">
                                    <Button variant="login" id="loginButton" onClick={this.checkBypass}>Login</Button>
                                </div>
                            </Form>
                </div> )}
            </div>
        );
    }
}

export default Login;