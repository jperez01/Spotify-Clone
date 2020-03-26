import React, {Component} from 'react';
import queryString from 'query-string';

class MiniSong extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "",
			albumName: "",
			artist: "",
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
			title: this.props.data.track.name,
			albumName: this.props.data.track.album.name,
			artist: this.props.data.track.artists[0].name,
			uri: this.props.data.track.uri
		})
	}

	render() {
		return (
			<div onClick={this.handleClick}>
				<h1> {this.state.title} </h1>
				<h4> {this.state.albumName} </h4>
				<h4> {this.state.artist} </h4>
			</div>
		);
	}
}

export default MiniSong;