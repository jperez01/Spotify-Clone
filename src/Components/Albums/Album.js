import React, {Component} from 'react';
import queryString from 'query-string';
import NavLink from 'react-router-dom/NavLink';
import '../style.css';

class Album extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			imageUrl: "",
			id: "",
			artist: ""
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		if (this.props.data.images[1] !== undefined) {
			this.setState({
				name: this.props.data.name,
				imageUrl: this.props.data.images[1].url,
				id: this.props.data.id,
				artist: this.props.data.artist
			});
		} else {
			this.setState({
				name: this.props.data.name,
				imageUrl: '',
				id: this.props.data.id,
				artist: this.props.data.artist
			});
		}
	}

	handleClick() {
		let parsed = queryString.parse(window.location.search);
		return '/AlbumPage/?access_token=' + parsed.access_token +'&id=' + this.state.id;
	}
	
	render() {
		return ( 
			<div onClick={this.handleClick} className="box">
					<NavLink 
						className="link"
						to={this.handleClick}>
					<img src={this.state.imageUrl} className="img" alt="Album Image"/>
					<h5 className="title">{this.state.name}</h5>
					<h6 className="artist"> {this.state.artist} </h6>
					</NavLink>
			</div>
			);
	}
}

export default Album;