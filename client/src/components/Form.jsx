import React, { Component } from 'react';

class Form extends Component {
    render() {
        return (
            <div>
                <form onSubmit={this.submit}>
                    <input type="text" className="form-control" placeholder="Enter Room Code" />
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}

export default Form;
