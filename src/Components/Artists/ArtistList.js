import React, {Component} from 'react';
import MiniArtist from './MiniArtist';
import NavLink from 'react-router-dom/NavLink';
import queryString from 'query-string';
import '../style.css';

class ArtistList extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(event) {
		let parsed = queryString.parse(window.location.search);
		let token = parsed.access_token;
		return '/search/artists/?access_token=' + token + "&search=" + this.props.search; 
	}
	render() {
		return (
			<div>
				<div className="row">
					<h3 className="listTitle">Artists</h3>
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
						<MiniArtist key={item.id} data={item}/>))}
				</ul>
			</div>
			);
	}
}

export default ArtistList;