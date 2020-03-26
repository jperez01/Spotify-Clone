import React, {Component} from 'react';
import MiniArtist from './MiniArtist';
import queryString from 'query-string';
import '../style.css';

class FullArtistList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			artists: [],
			query: ''
		}
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	componentDidMount() {
		let parsed = queryString.parse(window.location.search);
		let token = parsed.access_token;
		let search = parsed.search;
		fetch('https://api.spotify.com/v1/search?q=' + search + '&type=artist&limit=50', {
				headers: {'Authorization': 'Bearer ' + token},
				json: true
			}).then(res => res.json())
			.then(data => {
				this.setState({
					artists: data.artists.items,
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
					{this.state.artists.map(item => (
						<MiniArtist key={item.id} data={item}/>))}
				</ul>
			</div>
			);
	}
}
export default FullArtistList;