import React, {Component} from 'react';
import queryString from 'query-string';
import MiniPlaylist from './Playlists/MiniPlaylist.js';
import Album from './Albums/Album.js';
import ArtistSong from './Artists/ArtistSong';
import './style.css';

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			email: "",
			imageUrl: "",
			accessToken: "",
			playlists: [],
			albums: [],
			deviceId: "",
			tracks: [],
			country: ""
		}
		this.componentDidMount = this.componentDidMount.bind(this);
	}
	
	componentDidMount() {
		let parsed = queryString.parse(window.location.search);
		let accessToken = parsed.access_token;
		fetch('https://api.spotify.com/v1/me', {
			headers: {'Authorization': 'Bearer ' + accessToken},
			json: true
		}).then((res) => res.json())
		.then(data =>  {
			if (data.images.length !== 0) {
				this.setState({
					username: data.display_name,
					email: data.email,
					imageUrl: data.images[0],
					accessToken: parsed.access_token,
					deviceId: this.props.deviceId,
					country: data.country
				});
			} else {
				this.setState({
					username: data.display_name,
					email: data.email,
					imageUrl: "https://png.pngtree.com/svg/20161212/f93e57629c.png",
					accessToken: parsed.access_token,
					deviceId: this.props.deviceId,
					country: data.country
				});
			}
		});

		fetch('https://api.spotify.com/v1/me/playlists', {
			headers: {'Authorization': 'Bearer ' + accessToken}
		}).then(res => res.json())
		.then(data => {
			this.setState({
				playlists: data.items.map(item => ({
					name: item.name,
					images: item.images,
					id: item.id,
					description: item.description,
					owner: item.owner,
					songs: [],
					deviceId: this.props.deviceId
				}))
			});
		});

		fetch('https://api.spotify.com/v1/me/albums?limit=4', {
			headers: {'Authorization': 'Bearer ' + accessToken}
		}).then(res => res.json())
		.then(data => {
			this.setState({
				albums: data.items.map(item => ({
					name: item.album.name,
					tracks: item.album.total_tracks,
					images: item.album.images,
					id: item.album.id,
					artist: item.album.artists[0].name
				}))
			})
		});

		fetch('https://api.spotify.com/v1/me/tracks', {
			headers: {'Authorization': 'Bearer ' + accessToken},
			json: true
		}).then(res => res.json())
		.then(data => {
			this.setState({
				tracks: data.items
			});
		});
	}

	handleClick() {
		window.location = 'http://localhost:3000/search';
	}

	render() {
			let Playlists = (
				this.state.playlists.map(playlist => <MiniPlaylist key={playlist.id} data={playlist}/>)
			);
			let Albums = (
				this.state.albums.map(album => <Album key={album.id} data={album} />)
			);
			let Tracks = (
				this.state.tracks.map(track => <ArtistSong key={track.track.id} data={track.track} />)
			);
			return (
			<div className="profile">
				<div className="artistHeader">
					<img src={this.state.imageUrl} className="artistPageImg" alt="Profile"/>
					<div className="content">
						<h1 className="artistTracks">{this.state.username}</h1>
						<h1 className="artist">{"email: " + this.state.email}</h1>
						<h1 className="artist">{"country: " + this.state.country}</h1>
					</div>
				</div>
				<h4 className="artistTracks"> Playlists </h4>
				<ul>
					{Playlists}
				</ul>
				<h4 className="artistTracks"> Albums </h4>
				<ul>
					{Albums}
				</ul>
				<h4 className="artistTracks"> Tracks </h4>
				<ul>
					{Tracks}
				</ul>
			</div>
		);
	}
}
export default Profile;