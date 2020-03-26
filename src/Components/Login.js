import React, {Component} from 'react';

class Login extends Component {
	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
		this.callBackParent = this.callBackParent.bind(this);
	}

	handleClick() {
		window.location = 'http://localhost:8888/login';
		this.callBackParent();
	}
	callBackParent() {
		this.props.callbackFromParent(true);
	}
	render() {
		return (
			<div>
				<button onClick={this.handleClick}> Login </button>
			</div>
		);
	}
}

export default Login;