import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Session from './Session';
import Landing from './Landing';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route path="/session" component={Session} />
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
