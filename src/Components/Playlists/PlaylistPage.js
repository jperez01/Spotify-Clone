import React, {Component} from 'react';
import queryString from 'query-string';
import PlaylistSong from './PlaylistSong';
import '../style.css';

class PlaylistPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			imageUrl: "",
			totalTracks: "",
			description: "",
			uri: "",
			creator: "",
			songs: [],
			playing: false
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.handlePlay = this.handlePlay.bind(this);
	}

	componentDidMount() {
		let info = queryString.parse(window.location.search);
		let accessToken = info.access_token;
		fetch('https://api.spotify.com/v1/playlists/' + info.id, {
			headers: {'Authorization': 'Bearer ' + accessToken},
			json: true
		}).then((res) => res.json())
		.then(data =>  {
			this.setState({
				name: data.name,
				imageUrl: data.images[0].url,
				songs: data.tracks.items,
				uri: data.uri,
				creator: data.owner.display_name,
				totalTracks: data.tracks.total,
				description: data.description,
			});
		});
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
		this.setState({
			playing: !this.state.playing
		})
	}
	render() {
		let songs = (
			this.state.songs.map(song => <PlaylistSong key={song.track.id} data={song.track}/>)
			);
		return (
			<div className="albumPage">
				<div className="albumInfo">
					<div className="stack">
						<img alt="Playlist Image" src={this.state.imageUrl} className="albumImg"/>
						<div onClick={this.handlePlay}>
							<div className="albumPlaybutton"/>
							<div className="albumCircle" />
						</div>
					</div>
					<h1 className="albumName"> {this.state.name} </h1>
					<h1 className="albumArtist"> {"By " + this.state.creator} </h1>

					{this.state.playing ?
						<h1 className="addToLibrary" onClick={this.handlePlay}> Playing </h1>
					:
						<h1 className="addToLibraryRemove" onClick={this.handlePlay}> Play </h1>
						}
					<h1 className="description"> {this.state.description} </h1>
					<h1 className="totalTracks"> {this.state.totalTracks + " SONGS"} </h1>
				</div>
				<div className="albumSongs">
					<ul>
						{songs}
					</ul>
				</div>
			</div>
		);
	}
}

export default PlaylistPage;