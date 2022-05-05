import React, { Component } from 'react';
import { Button, Modal, Form, Card, Table } from 'react-bootstrap';
import "./WorkOrder.css"

/* This is suuuupppperr cheesy but handles a read before write issue */
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

class WorkOrder extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = { show: false, showRemove: false};
        this.removeState = { show: false}
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCloseRemove = this.handleCloseRemove.bind(this);
        this.handleShowRemove = this.handleShowRemove.bind(this);
    }

    handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
		this.setState({ show: true });
    }

    handleCloseRemove() {
        document.getElementById('work-orders-remove-select').innerHTML = '';
        this.setState({ showRemove: false });
        console.log("rebuilding table");
        sleep(500);
        document.getElementById('work-order-table').innerHTML = '';
        this.appendWorkOrderTable();
	}

	async handleShowRemove() {
        this.setState({ showRemove: true });
        var files = await window.ipcRenderer.invoke('get-work-orders');
        files.forEach(function(file) {
            var selectRemove = document.getElementById('work-orders-remove-select');
            var option = document.createElement('option');
            option.text = file.split('.').slice(0, -1).join('.');
            selectRemove.add(option);
        })
        
    }
    
    async handleSubmit(){
        var workOrderNum = document.getElementById('order-num-field').value;
        var location = document.getElementById('location-field').value;
        var lastInspection = document.getElementById('last-inspection-field').value;
        var inspectBy = document.getElementById('inspect-by-field').value;
        console.log(workOrderNum)
        console.log(location)
        console.log(lastInspection)
        console.log(inspectBy)
        var successfulSubmit = await window.ipcRenderer.invoke('create-work-order', workOrderNum, location, lastInspection, inspectBy);
        if(successfulSubmit){
            console.log("rebuilding table")
            sleep(500);
            document.getElementById('work-order-table').innerHTML = '';
            this.appendWorkOrderTable();
        }
        this.setState({ show: false });
        
    }

    async removeWorkOrder () {
        var workOrderNum = document.getElementById('work-orders-remove-select').value;
        console.log('removing ' + workOrderNum)
        var successfulDelete = window.ipcRenderer.invoke('remove-work-order', workOrderNum);
        if(successfulDelete){
            document.getElementById('work-orders-remove-select').remove(workOrderNum);
        }
        console.log(workOrderNum);

    }

    async appendWorkOrderTable (json) {
        var files = await window.ipcRenderer.invoke('get-work-orders');
        console.log(files)
        var table = document.getElementById("work-order-table");
        var thead = document.createElement('thead');
        var trhead = document.createElement('tr');
            
        trhead.appendChild(document.createElement('td'))
        trhead.appendChild(document.createElement('td'))
        trhead.appendChild(document.createElement('td'))
        trhead.appendChild(document.createElement('td'))

        trhead.cells[0].appendChild(document.createTextNode('Work Order #'))
        trhead.cells[1].appendChild(document.createTextNode('Location'))
        trhead.cells[2].appendChild(document.createTextNode('Last Inspected'))
        trhead.cells[3].appendChild(document.createTextNode('Inspect Before'))

        thead.appendChild(trhead)
        table.appendChild(thead)
        
        var tbody = document.createElement('tbody');

        files.forEach(async function(file){
            var workOrder = await window.ipcRenderer.invoke('parse-work-order', file);
            
            var tr = document.createElement('tr');
            
            tr.appendChild(document.createElement('td'))
            tr.appendChild(document.createElement('td'))
            tr.appendChild(document.createElement('td'))
            tr.appendChild(document.createElement('td'))

            tr.cells[0].appendChild(document.createTextNode(workOrder.order.number))
            tr.cells[1].appendChild(document.createTextNode(workOrder.order.location))
            tr.cells[2].appendChild(document.createTextNode(workOrder.order.lastInspection))
            tr.cells[3].appendChild(document.createTextNode(workOrder.order.inspectBefore))

            tbody.appendChild(tr)
        })
        table.appendChild(tbody);
    }

    async componentDidMount() {
        window.ipcRenderer.on('login-success', (event) => {
            try{
                document.getElementById('work-order-table').innerHTML = '';
            }
            catch(e) { console.log(e) }
            
            this.appendWorkOrderTable();
        })
    }

    render () {
        var { title, children } = this.props;

        return (
            <div className="work-order-page" id="work-order-page" hidden>
                <h2 id="page-title">Work Orders</h2><hr/>
                <div class="row" id="work-order-buttons">    
                <div class="col-sm-2"></div>      
                <div class="col-sm-3">
                <Button id="workOrderButton" onClick={this.handleShow}>Add Work Order</Button>

				<Modal size="lg" show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Add Work Order</Modal.Title>
					</Modal.Header>
					<Modal.Body>Please Provide the following information for the Work Order you Wish to add...</Modal.Body>
                        <div id="newWorkOrderForm">
                            <Form>
                                <Form.Group controlId="order-num-field">
                                    <Form.Label>Work Order Number:</Form.Label>
                                    <Form.Control type="number" placeholder="###" />
                                </Form.Group>
                                <Form.Group controlId="location-field">
                                    <Form.Label>Location:</Form.Label>
                                    <Form.Control type="location" placeholder="123 Example Rd. Milwaukee, WI" />
                                </Form.Group>
                                <Form.Group controlId="last-inspection-field">
                                    <Form.Label>Last Inspection Date:</Form.Label>
                                    <Form.Control type="date" placeholder="MM/DD/YYYY" />
                                </Form.Group>
                                <Form.Group controlId="inspect-by-field">
                                    <Form.Label>Inspection Due By:</Form.Label>
                                    <Form.Control type="date" placeholder="MM/DD/YYYY" />
                                </Form.Group>
                            </Form>
                        </div>
					<Modal.Footer>
						<Button variant="Light" onClick={this.handleClose}>Close</Button>
						<Button id="modalButton" onClick={this.handleSubmit}>Save Work Order</Button>
					</Modal.Footer>
				</Modal>
                
                </div>
                <div class="col-sm-2"></div>
                <div class="col-sm-3">
                    <Button variant="danger" id="removeButton" onClick={this.handleShowRemove} >Remove Work Order</Button>
                        <Modal size="lg" show={this.state.showRemove} onHide={this.handleCloseRemove}>
                        <Modal.Header closeButton>
                            <Modal.Title>Remove a Work Order</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Select Work Order you would like to remove</Modal.Body>
                            <div id="removeWorkOrderForm">
                                <div class="row" id="remove-work-order-fields">   
                                    <div class="col-sm-1"></div> 
                                    <div class="col-sm-3"><h5>Work Order #</h5></div>
                                    <div class="col-sm-3">
                                        <select id="work-orders-remove-select">
                                        </select>
                                    </div>
                                    <div class="col-sm-3">
                                        <Button variant="danger" id="remove" onClick={this.removeWorkOrder}>Remove</Button>
                                    </div>  

                                </div>
                            </div>
                        <Modal.Footer>
                            <Button id="modalButton" onClick={this.handleCloseRemove}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div class="col-sm-2"></div>
                </div>
                <div id="table-area">
                    <table id="work-order-table">
                    </table>
                </div>
            </div>
        )
    }
}

export default WorkOrder;