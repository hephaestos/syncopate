import React from 'react';

/**
 * @component Controls
 * @summary Playback controls component
 * @description This contains the next, previous, and play/pause buttons
 * @returns The Controls component
 */
function Controls() {
    return (
        <div className="Controls">
            <i className="fas fa-step-backward" />
            <i className="far fa-pause-circle" />
            <i className="fas fa-step-forward" />
        </div>
    );
}

export default Controls;
