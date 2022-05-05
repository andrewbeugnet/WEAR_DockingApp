import React, { Component } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { slide as Menu } from "react-burger-menu";
import "./sidebar.css"



class Sidebar extends Component {

  static currPage = 'status-page';
  static nextPage = '';

    constructor (props) {
        super(props)
        this.state = {
          menuOpen: false
        }
      }
    
    // This keeps your state in sync with the opening/closing of the menu
    // via the default means, e.g. clicking the X, pressing the ESC key etc.
    handleStateChange (state) {
    this.setState({menuOpen: state.isOpen})  
    }
    
    // This can be used to close the menu, e.g. when a user clicks a menu item
    closeMenu () {
    this.setState({menuOpen: false})
    }

    // This can be used to toggle the menu, e.g. when using a custom icon
    // Tip: You probably want to hide either/both default icons if using a custom icon
    // See https://github.com/negomi/react-burger-menu#custom-icons
    toggleMenu () {
    this.setState(state => ({menuOpen: !state.menuOpen}))
    }

    test(){
        this.closeMenu();
        console.log('This is a test')
    }

    switchPage(){
        console.log(Sidebar.currPage);
        console.log(Sidebar.nextPage);
        document.getElementById(Sidebar.currPage).hidden = true;
        document.getElementById(Sidebar.nextPage).hidden = false;
    }

   //Page Navigation

    navStatusPage(){
        Sidebar.nextPage = 'status-page';
        this.switchPage();
        Sidebar.currPage = Sidebar.nextPage;
        this.closeMenu();
    }

    navWorkOrderPage(){
        Sidebar.nextPage = 'work-order-page';
        this.switchPage();
        Sidebar.currPage = Sidebar.nextPage;
        this.closeMenu();
    }

    navHoloSyncPage(){
        Sidebar.nextPage = 'holo-sync-page';
        this.switchPage();
        Sidebar.currPage = Sidebar.nextPage;
        this.closeMenu();
    }

    logout() {
        console.log('Attempting to Logout')
        document.getElementById(Sidebar.currPage).hidden = true;
        document.getElementById('page-nav').hidden = true;
        document.getElementById('page-header').hidden = true;
        document.getElementById("login-page").hidden = false;
        this.closeMenu();
        window.resizeTo(400,600);
        Sidebar.currPage = 'status-page';
        Sidebar.nextPage = '';
    }

    

    render(){
      return(
        <Menu 
        isOpen={this.state.menuOpen}
        onStateChange={(state) => this.handleStateChange(state)}
      >
        <Button id="menuButton" onClick={() => this.navStatusPage()}>Status</Button>
        <Button id="menuButton" onClick={() => this.navWorkOrderPage()}>Work Order</Button>
        <Button id="menuButton" onClick={() => this.navHoloSyncPage()}>HoloSync</Button>


        <Button id="menuButton" onClick={() => this.logout()}>Logout</Button>
      </Menu>
      );
    }
}

export default Sidebar;
// function test () {
//   console.log("Test");
// }

// export default props => {
//   return (
//     // Pass on our props
    
//   );
// };
