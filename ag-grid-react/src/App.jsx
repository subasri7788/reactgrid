import React, {Component} from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import ReactGridCore from "./reactgrid/ReactGridCore";

    const SideBar = () => (
        <div style={{float: "left", width: 300, marginRight: 25}}>
            
        </div>
    ); 

class App extends Component {
    render() {
        return (
            <div style={{display: "inline-block", width: "100%"}}>
                <SideBar/>
                <div style={{float: "left"}}>
                    <Switch>
                        <Redirect from="/" exact to="/reactgrid"/>
                        <Route exact path='/reactgrid' component={ReactGridCore}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

export default App
