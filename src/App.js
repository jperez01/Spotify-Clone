import React, {Component} from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Login from './Components/Login';
import Profile from './Components/Profile';
import PlaylistPage from './Components/Playlists/PlaylistPage';
import AlbumPage from './Components/Albums/AlbumPage';
import Player from './Components/Player';
import Menu from './Components/Menu';
import Search from './Components/Search/Search';
import ArtistPage from './Components/Artists/ArtistPage';
import FullAlbumList from './Components/Albums/FullAlbumList';
import FullArtistList from './Components/Artists/FullArtistList';
import FullPlaylistList from './Components/Playlists/FullPlaylistList';
import Home from './Components/Home';
import queryString from 'query-string';


class App extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	deviceId: '',
	    	loggedIn: false
	    };
	    this.callBack = this.callBack.bind(this);
	    this.LoginCallBack = this.LoginCallBack.bind(this);
	  }

	callBack(data) {
		this.setState({
			deviceId: data
		});
		let parsed = queryString.parse(window.location.search);
		let accessToken = parsed.access_token;
	}

	LoginCallBack(data) {
		this.setState({
			loggedIn: true
		});
		console.log(this.state.loggedIn);
	}
	render() {
	  return (
	  	<div className="App">
		  	<Router>
		  		<div className="Menu">
			  		<Menu />
			  		<Player className="Player" callbackFromParent={this.callBack}/>
			  	</div>
			  	<div className="Component">
			  		<Route path='/home' exact component={Home} />
				  	<Route path='/ArtistPage' exact component={ArtistPage} />
				  	<Route path="/search" exact component={Search} />
				  	<Route path="/search/playlists" exact component={FullPlaylistList} />
				  	<Route path="/search/albums" exact component={FullAlbumList} />
				  	<Route path="/search/artists" exact component={FullArtistList} />
				  	<Route path="/AlbumPage" exact component={AlbumPage}/>
				  	<Route path="/profile" exact component={Profile} />
				  	<Route path="/playlistPage" exact component={PlaylistPage}/>
			  	</div>
			</Router>
	  	</div>
	  );
}
}

export default App;
