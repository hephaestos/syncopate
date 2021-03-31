import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Session from './Session';
import Landing from './Landing';

/**
 * @component App
 * @summary The root component of the app.
 * @description This contains our router to direct the user to each page of the app.
 * @returns The App component.
 */
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
