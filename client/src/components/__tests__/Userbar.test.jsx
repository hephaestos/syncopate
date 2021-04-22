// import { isTSAnyKeyword } from '@babel/types';
import React from 'react';
import ReactDOM from 'react-dom';
import Userbar from '../Userbar';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Userbar />, div)
})
