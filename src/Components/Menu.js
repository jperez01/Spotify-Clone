import React, {Component} from 'react';
import queryString from 'query-string';
import NavLink from 'react-router-dom/NavLink';
import Amplify, { Analytics, Storage, API } from 'aws-amplify';
import './style.css';

class Menu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			accessToken: ''
		}
		this.checkLogin = this.checkLogin.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleProfile = this.handleProfile.bind(this);
		this.handleSearchClick = this.handleSearchClick.bind(this);
		this.handleHomeClick = this.handleHomeClick.bind(this);
		this.handleProfileClick = this.handleProfileClick.bind(this);
		this.handleHome = this.handleHome.bind(this);
		this.LoginInterval = null;
	}
	checkLogin() {
		let parsed = queryString.parse(window.location.search);
		let token = parsed.access_token;
		if (token !== undefined) {
			this.setState({
		    	loggedIn: true,
		    	accessToken: token
		    });
		    clearInterval(this.LoginInterval);
		}
	}

	handleClick() {
		window.location = 'https://master.d25k9rbpw5dq0c.amplifyapp.com/login';
		const response = API.get('music', '/items');
	}

	handleHome() {
		let parsed = queryString.parse(window.location.search);
		let token = parsed.access_token;
		return '/home/?access_token=' + token;
	}
	handleSearch(event) {
		let parsed = queryString.parse(window.location.search);
		let token = parsed.access_token;
		return '/search/?access_token=' + token; 
	}
	handleProfile() {
		let parsed = queryString.parse(window.location.search);
		let token = parsed.access_token;
		return '/profile/?access_token=' + token; 
	}
	handleSearchClick() {
		document.getElementById('Home').style.background = "transparent";
		document.getElementById('Search').style.background = "#282828";
		document.getElementById('Profile').style.background = "transparent";
	}
	handleHomeClick() {
		document.getElementById('Home').style.background = "#282828";
		document.getElementById('Search').style.background = "transparent";
		document.getElementById('Profile').style.background = "transparent";
	}
	handleProfileClick() {
		document.getElementById('Home').style.background = "transparent";
		document.getElementById('Search').style.background = "transparent";
		document.getElementById('Profile').style.background = "#282828";
	}
	componentDidMount() {
		this.LoginInterval = setInterval(() => this.checkLogin(), 1000);
	}
	render() {
		return (
			<div className="boxSmall">
				{this.state.loggedIn ?
					(
						<div className="boxMenu" >
							<img src="https://i.ibb.co/KqrBchR/Juanify-App.jpg" alt="Juanify-App" border="0" className="logo"/>
							<div className="button"
								id="Home"
								onClick={this.handleHomeClick}>
								<img alt="Home icon" src="https://cdn.pixabay.com/photo/2017/06/05/19/05/house-2374925_960_720.png" height="20px" width="20px"/>
								<NavLink id="header"
									className="search"
									activeStyle= {{
										color: "white"
									}}
									to={this.handleHome}> Home </NavLink>
							</div>
							<div className="button" 
								id="Search"
								onClick={this.handleSearchClick}>
								<img alt="Search Icon" src="https://i.ibb.co/S5T7PCD/Search.png" width="20px" height="20px"/>
								<NavLink id="header"
									className="search"
									activeStyle= {{
										color: "white"
									}}
									to={this.handleSearch}> Search </NavLink>
							</div>
							<div className="button"
								id="Profile"
								onClick={this.handleProfileClick}>
								<img alt="Library Icon" src="https://i.ibb.co/9Z1Js1K/Library.png" width="20px" height="20px"/>
								<NavLink id="header"
								activeStyle = {{
									color: 'white'
								}}
								to={this.handleProfile}>Your Library</NavLink>
							</div>
						</div>)
					:
					(<div className="boxMenu">
						<img alt="Juanify Icon" src="https://i.ibb.co/KqrBchR/Juanify-App.jpg" border="0" className="logo"/>
						<button  className="login" onClick={this.handleClick}> Login </button>
					</div>)
				}
			</div>
		);
	}
}

export default Menu;