/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import sessionService from '../sessionService';

class Form extends Component {
    join(event) {
        sessionService.joinSession(event.target.roomCode.value);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.join}>
                    <input type="text" name="roomCode" className="form-control" placeholder="Enter Room Code" />
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}

export default Form;
