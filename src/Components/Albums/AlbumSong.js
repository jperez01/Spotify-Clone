import React, {Component} from 'react';
import queryString from 'query-string';
import '../style.css'

class AlbumSong extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "",
			artist: "",
			uri: "",
			time: ""
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
		let songs = document.getElementsByClassName('albumSongTitle');
		let times = document.getElementsByClassName('songTime');
		let buttons = document.getElementsByClassName('smallPlayButtonChanged');
		for (let i = 0; i < songs.length; i++) {
			songs[i].style.color = "#fff";
			times[i].style.color = "#9f9f9f";
		}
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].className = "smallPlayButton";
		}
		document.getElementById(this.state.title).style.color = "#1db954";
		document.getElementById(this.state.time).style.color = "#1db954";
		document.getElementById(this.state.uri).className = "smallPlayButtonChanged";
	}
	componentDidMount() {
		let time = Math.trunc(this.props.data.duration_ms / 60000);
		let seconds = (this.props.data.duration_ms / 60000 % 1) * 60;
		seconds = Math.trunc(seconds);
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		this.setState({
			title: this.props.data.name,
			artist: this.props.data.artists[0].name,
			uri: this.props.data.uri,
			time: time + ":" + seconds
		})
	}

	render() {
		return (
			<div className="artistSong" onClick={this.handleClick}>
				<div className="smallPlayButton" id={this.state.uri} />
				<div className="albumContent">
					<h1 id={this.state.title} className="albumSongTitle"> {this.state.title} </h1>
					<h4 className="albumSongArtist"> {this.state.artist} </h4>
				</div>
				<h4 id={this.state.time} className="songTime"> {this.state.time} </h4>
			</div>
		);
	}
}

export default AlbumSong;