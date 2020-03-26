import React, {Component} from 'react';
import queryString from 'query-string';
import NavLink from 'react-router-dom/NavLink';
import '../style.css';

class ArtistAlbum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			imageUrl: "",
			id: "",
			artist: "",
			uri: ""
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handlePlay = this.handlePlay.bind(this);
		this.changePage = this.changePage.bind(this);
	}

	componentDidMount() {
		if (this.props.data.images[1] !== undefined) {
			this.setState({
				name: this.props.data.name,
				imageUrl: this.props.data.images[1].url,
				id: this.props.data.id,
				artist: this.props.data.artist,
				uri: this.props.data.uri
			});
		} else {
			this.setState({
				name: this.props.data.name,
				imageUrl: '',
				id: this.props.data.id,
				artist: this.props.data.artist,
				uri: this.props.data.uri
			});
		}
	}

	handleClick() {
		let parsed = queryString.parse(window.location.search);
		window.location = 'http://localhost:3000/AlbumPage/?access_token=' + parsed.access_token +'&id=' + this.state.id;
	}
	
	handlePlay() {
		let parsed = queryString.parse(window.location.search);
		let accessToken = parsed.access_token;
		fetch('https://api.spotify.com/v1/me/player/play', {
			method: "PUT",
			headers: {'Authorization': 'Bearer ' + accessToken},
			body: JSON.stringify({
				'context_uri': this.state.uri,
				'offset': {
					'position': 0 
				},
				'position_ms': 0
			}),
			json: true
		});
	}

	changePage() {
		let parsed = queryString.parse(window.location.search);
		let token = parsed.access_token;
		return '/AlbumPage/?access_token=' + parsed.access_token +'&id=' + this.state.id; 
	}
	render() {
		return (
			<div className="artistAlbum">
				<div className="stack">
					<NavLink className="link" to={this.changePage}>
						<img alt="Album from current Artist" src={this.state.imageUrl} className="artistimg"/>
					</NavLink>
					<div onClick={this.handlePlay}>
						<div className="playbutton"/>
						<div className="circle" />
					</div>
				</div>
				<h5 className="title">{this.state.name}</h5>
			</div>
			);
	}
}

export default ArtistAlbum;