import React, {Component} from 'react';
import queryString from 'query-string';
import ArtistList from '../Artists/ArtistList';
import AlbumList from '../Albums/AlbumList';
import PlaylistList from '../Playlists/PlaylistList';
import SongList from '../Songs/SongList';
import CategoriesList from './CategoriesList';
import '../style.css';

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			accessToken: '',
			artists: [],
			albums: [],
			tracks: [],
			playlists: [],
			categories: [],
			isSearching: false
		}
		this.handleChange = this.handleChange.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
	}
	componentDidMount() {
		let info = queryString.parse(window.location.search);
		let token = info.access_token;
		this.setState({
			accessToken: token
		})
		fetch('https://api.spotify.com/v1/browse/categories', {
			headers: {'Authorization': 'Bearer ' + token},
			json: true
		}).then(res => res.json())
		.then(data => {
			this.setState({
				categories: data.categories.items
			});
		});
	}

	handleChange() {
		let query = document.getElementById("query").value;
		query = query.replace(/ /g, "%20");
		if (query !== '') {
			fetch('https://api.spotify.com/v1/search?q=' + query + '&type=album%2Ctrack%2Cplaylist%2Cartist&limit=8', {
				headers: {'Authorization': 'Bearer ' + this.state.accessToken},
				json: true
			}).then(res => res.json())
			.then(data => {
				this.setState({
					search: query,
					artists: data.artists.items,
					albums: data.albums.items,
					tracks: data.tracks.items,
					playlists: data.playlists.items,
					isSearching: true
				});
			});
		} else {
			this.setState({
				isSearching: false
			})
		}
	}
	
	render() {
		return (
			<div>
				<div className="searchBar">
					<img alt="Search Icon" src="https://i.ibb.co/BrTd87m/Search.jpg" className="SearchIcon" border="0" height="32px" width="32px"/>
					<input id="query" placeholder="Search for Artists, Songs, and Playlists" onChange={this.handleChange}/>
				</div>
				{this.state.isSearching ?
					(<ul className="list">
						<ArtistList search={this.state.search} items={this.state.artists} />
						<AlbumList search={this.state.search} items={this.state.albums} />
						<SongList search={this.state.search} items={this.state.tracks} />
						<PlaylistList search={this.state.search} items={this.state.playlists} />
					</ul>)
					:
					(<div>
						<h5 className="listTitle"> Browse All </h5>
						<CategoriesList items={this.state.categories} />
					</div>)}
			</div>);
	}
}

export default Search;