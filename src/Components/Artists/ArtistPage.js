import React, {Component} from 'react';
import queryString from 'query-string';
import ArtistAlbum from './ArtistAlbum';
import MiniArtist from './MiniArtist';
import ArtistSong from './ArtistSong';

class ArtistPage extends Component {
	constructor() {
		super();
		this.state = {
			name: '',
			id: '',
			followers: '',
			imageUrl: '',
			albums: [],
			singles: [],
			toptracks: [],
			related: [],
			following: false
		}
		this.handleFollow = this.handleFollow.bind(this);
	}

	componentDidMount() {
		let query = queryString.parse(window.location.search);
		let accessToken = query.access_token;
		let id = query.id;
		fetch('https://api.spotify.com/v1/me/following/contains?type=artist&ids=' + id, {
			headers: {'Authorization': 'Bearer ' + accessToken},
			json: true
		}).then(res => res.json())
		.then(data => {
			this.setState({
				following: data[0]
			})
		});
		fetch('https://api.spotify.com/v1/artists/' + id, {
			headers: {'Authorization': 'Bearer ' + accessToken},
			json: true
		}).then(res => res.json())
		.then(data => {
			this.setState({
				name: data.name,
				id: query.id,
				followers: data.followers.total,
				imageUrl: data.images[0].url
			});
		});
		fetch('https://api.spotify.com/v1/artists/' + id + '/related-artists', {
			headers: {'Authorization': 'Bearer ' + accessToken},
			json: true
		}).then(res => res.json())
		.then(data => {
			this.setState({
				related: data.artists
			})
		});
		fetch('https://api.spotify.com/v1/artists/' + id + '/albums?include_groups=album', {
			headers: {'Authorization': 'Bearer ' + accessToken},
			json: true
		}).then(res => res.json())
		.then(data => {
			this.setState({
				albums: data.items
			});
		});
		fetch('https://api.spotify.com/v1/artists/' + id + '/albums?include_groups=single', {
			headers: {'Authorization': 'Bearer ' + accessToken},
			json: true
		}).then(res => res.json())
		.then(data => {
			this.setState({
				singles: data.items
			});
		});
		fetch('https://api.spotify.com/v1/artists/' + id + '/top-tracks?country=US', {
			headers: {'Authorization': 'Bearer ' + accessToken},
			json: true
		}).then(res => res.json())
		.then(data => {
			this.setState({
				toptracks: data.tracks
			});
		});
	}

	handleFollow() {
		let query = queryString.parse(window.location.search);
		let accessToken = query.access_token;
		let id = query.id;
		if (this.state.following) {
			fetch('https://api.spotify.com/v1/me/following?type=artist&ids=' + id, {
				method: 'DELETE',
				headers: {'Authorization': 'Bearer ' + accessToken},
				json: true
			});
			this.setState({
				following: !this.state.following
			})
		} else {
			fetch('https://api.spotify.com/v1/me/following?type=artist&ids=' + id, {
				headers: {'Authorization': 'Bearer ' + accessToken},
				json: true
			}).then(res => res.json())
			.then(data => {
				this.setState({
					following: !this.state.following
				})
			});
		}
	}
	render() {
			let Songs = this.state.toptracks.map(song => <ArtistSong key={song.id} data={song} />);
			let Singles = this.state.singles.map(single => <ArtistAlbum key={single.id} data={single}/>);
			let Albums =  this.state.albums.map(album => <ArtistAlbum key={album.id} data={album} />);
			let Artists = this.state.related.map(artist => <MiniArtist key={artist.id} data={artist} />);
		return (
			<div>
				<div className="artistHeader">
					<img alt="Artist Image" src={this.state.imageUrl} className="artistPageImg"/>
					<div>
						<h4 className="artistTracks"> {this.state.name} </h4>
						<h4 className="artist"> {this.state.followers + " followers"} </h4>
						{this.state.following ?
							<button onClick={this.handleFollow} className="follow"> Unfollow </button>
							:
							<button onClick={this.handleFollow} className="follow"> Follow </button>
						}
					</div>
				</div>
				<div className="artistSongs">
				<h4 className="artistTracks"> Top Tracks </h4>
					{Songs}
				</div>
				<div className="artistSection">
					<h4 className="artistTracks"> Albums </h4>
					{Albums}
				</div>
				<div className="artistSection">
					<h4 className="artistTracks"> Singles </h4>
					{Singles}
				</div>
				<div className="artistSection">
					<h4 className="artistTracks"> Related Artists </h4>
					{Artists}
				</div>
			</div>);
	}
}

export default ArtistPage;