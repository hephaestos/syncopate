import React from 'react';
import ReactDOM from 'react-dom';
import SongDisplay from '../SongDisplay';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SongDisplay />, div);
});
