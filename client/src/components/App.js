import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Session from './Session';
import Landing from './Landing';

class App extends Component {
    render() {
        return(
            <div className='App'>
                <BrowserRouter>
                    <Switch>
                        <Route exact path='/' component={Landing} />
                        <Route path='/session' component={Session} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
