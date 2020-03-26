import React, {Component} from 'react';
import MiniPlaylist from './MiniPlaylist';
import NavLink from 'react-router-dom/NavLink';
import queryString from 'query-string';
import '../style.css';

class PlaylistList extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(event) {
		let parsed = queryString.parse(window.location.search);
		let token = parsed.access_token;
		return '/search/playlists/?access_token=' + token + "&search=" + this.props.search; 
	}
	render() {
		return (
			<div>
				<div className="row">
					<h3 className="listTitle">Playlists</h3>
					<NavLink id="seeAll"
						className="search"
						activeStyle= {{
							color: "white"
						}}
						to={this.handleClick}> 
						See All
					</NavLink>
				</div>
				<ul className="innerList">
					{this.props.items.map(item => (
						<MiniPlaylist key={item.id} data={item}/>))}
				</ul>
			</div>
			);
	}
}

export default PlaylistList;