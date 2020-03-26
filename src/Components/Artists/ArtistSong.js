import React, {Component} from 'react';
import queryString from 'query-string';
import '../style.css';

class ArtistSong extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "",
			artist: "",
			url: "",
			uri: ""
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		let parsed = queryString.parse(window.location.search);
		let accessToken = parsed.access_token;
		fetch('https://api.spotify.com/v1/me/player/play', {
			method: "PUT",
			headers: {'Authorization': 'Bearer ' + accessToken},
			body: JSON.stringify({
				'uris': [ this.state.uri ]
			}),
			json: true
		});
	}
	componentDidMount() {
		this.setState({
			title: this.props.data.name,
			artist: this.props.data.artists[0].name,
			url: this.props.data.album.images[1].url,
			uri: this.props.data.uri
		})
	}

	render() {
		return (
			<div className="artistSong" onClick={this.handleClick}>
					<img alt="Song Image from current artist" src={this.state.url} height="72" width="72"/>
				<div className="content">
					<h1 className="title"> {this.state.title} </h1>
					<h4 className="artist"> {this.state.artist} </h4>
				</div>
			</div>
		);
	}
}

export default ArtistSong;