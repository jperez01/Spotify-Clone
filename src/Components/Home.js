import React, {Component} from 'react';
import './style.css';

class Home extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<div>
				<h4 className="artistTracks"> Welcome </h4>
				<p className="title">
					This is a spotify replica that I made to learn about HTML, CSS, and React along with APIs.
					The different features include searching for different artists, tracks, playlists, and albums
					playing songs that you click on in the app, and being able to add and remove while also following
					and unfollowing artists and their albums.
				</p>
				<p className="title">
					SPOTIFY PREMIUM IS NEEDED FOR THE PLAYER TO WORK!
				</p>
				<p className="title">
					Github Repo:
				</p>
				<p className="title">
					Enjoy!
				</p>
			</div>)
	}
}

export default Home;