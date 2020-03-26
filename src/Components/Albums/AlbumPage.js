import React, {Component} from 'react';
import queryString from 'query-string';
import AlbumSong from './AlbumSong';

class AlbumPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			imageUrl: "",
			totalTracks: "",
			releaseDate: "",
			uri: "",
			artist: [],
			songs: [],
			copyright: "",
			added: false
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.handlePlay = this.handlePlay.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
	}

	componentDidMount() {
		let info = queryString.parse(window.location.search);
		let accessToken = info.access_token;
		fetch('https://api.spotify.com/v1/albums/' + info.id, {
			headers: {'Authorization': 'Bearer ' + accessToken},
			json: true
		}).then((res) => res.json())
		.then(data =>  {
			if (data.copyrights[0]) {
				this.setState({
					name: data.name,
					imageUrl: data.images[1].url,
					songs: data.tracks.items,
					artist: data.artists[0],
					totalTracks: data.total_tracks,
					releaseDate: data.release_date,
					uri: data.uri,
					copyright: data.copyrights[0].text
				});
			} else {
				this.setState({
					name: data.name,
					imageUrl: data.images[1].url,
					songs: data.tracks.items,
					artist: data.artists[0],
					totalTracks: data.total_tracks,
					releaseDate: data.release_date,
					uri: data.uri
				});
			}
		});
		fetch('https://api.spotify.com/v1/me/albums/contains?ids=' + info.id, {
			headers: {'Authorization': 'Bearer ' + accessToken},
			json: true
		}).then((res) => res.json())
		.then(data => {
			this.setState({
				added: data[0]
			})
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
	}

	handleAdd() {
		let query = queryString.parse(window.location.search);
		let accessToken = query.access_token;
		if (this.state.added) {
			fetch('https://api.spotify.com/v1/me/albums?ids=' + query.id, {
				method: 'DELETE',
				headers: {'Authorization': 'Bearer ' + accessToken},
				json: true
			});
			this.setState({
				added: !this.state.added
			});
		} else {
			fetch('https://api.spotify.com/v1/me/albums?ids=' + query.id, {
				method: 'PUT',
				headers: {'Authorization': 'Bearer ' + accessToken},
				json: true
			});
			this.setState({
					added: !this.state.added
				});
		}
	}
	render() {
		let songs = (
			this.state.songs.map(song => <AlbumSong  data={song}/>)
			);
		return (
			<div className="albumPage">
				<div className="albumInfo">
					<div className="stack">
						<img alt="Album Image" src={this.state.imageUrl} className="albumImg"/>
						<div onClick={this.handlePlay}>
							<div className="albumPlaybutton"/>
							<div className="albumCircle" />
						</div>
					</div>
					<h1 className="albumName"> {this.state.name} </h1>
					<h1 className="albumArtist"> {this.state.artist.name} </h1>

					{this.state.added ?
						<h1 className="addToLibrary" onClick={this.handleAdd}> Add </h1>
					:
						<h1 className="addToLibraryRemove" onClick={this.handleAdd}> Remove </h1>
						}
					<div className="albumRow">
						<h1 className="artist"> {"Released: " + this.state.releaseDate} </h1>
						<h1 className="artist"> {this.state.totalTracks + " SONGS"} </h1>
					</div>
				</div>
				<div className="albumSongs">
					<ul>
						{songs}
					</ul>
					<h4 className="copyright"> &copy; {this.state.copyright} </h4>
				</div>
			</div>
		);
	}
}

export default AlbumPage;