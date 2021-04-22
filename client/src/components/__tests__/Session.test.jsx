import React from 'react';
import ReactDOM from 'react-dom';
import Session from '../Session';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Session />, div);
});
