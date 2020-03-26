import React, {Component} from 'react';
import MiniPlaylist from './MiniPlaylist';
import queryString from 'query-string';
import '../style.css';

class FullPlaylistList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			playlists: [],
			query: ''
		}
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	componentDidMount() {
		let parsed = queryString.parse(window.location.search);
		let token = parsed.access_token;
		let search = parsed.search;
		fetch('https://api.spotify.com/v1/search?q=' + search + '&type=playlist&limit=50', {
				headers: {'Authorization': 'Bearer ' + token},
				json: true
			}).then(res => res.json())
			.then(data => {
				this.setState({
					playlists: data.playlists.items,
					query: search
				});
			});
	}
	render() {
		return (
			<div>
				<div>
					<h3 className="listTitle"> {"Showing Albums for: " + this.state.query}</h3>
				</div>
				<ul className="innerList">
					{this.state.playlists.map(item => (
						<MiniPlaylist key={item.id} data={item}/>))}
				</ul>
			</div>
			);
	}
}
export default FullPlaylistList;