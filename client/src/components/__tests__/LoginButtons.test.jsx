import React from 'react';
import ReactDOM from 'react-dom';
import LoginButtons from '../LoginButtons';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LoginButtons />, div);
});
