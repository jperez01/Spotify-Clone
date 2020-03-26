import React, {Component} from 'react';
import queryString from 'query-string';
import './style.css';

class Player extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      token: "",
	      deviceId: "",
	      loggedIn: false,
	      error: "",
	      trackName: "Track Name",
	      artistName: "Artist Name",
	      albumName: "Album Name",
	      imageUrl: "",
	      playing: false,
	      durationString: "",
	      position: "",
	      duration: 0,
	      minutes: 0,
	      seconds: 0,
	      songPosition: 0,
	      songDuration: 0,
	      changingValue: undefined,
	      changingPosition: undefined,
	      changing: true,
	      paused: false,
	      shuffle: true,
	      repeat: true
	    };
	    this.playerCheckInterval = null;
	    this.checkForPlayer = this.checkForPlayer.bind(this);
	    this.callBackParent = this.callBackParent.bind(this);
	    this.changePosition = this.changePosition.bind(this);
	    this.changeValue = this.changeValue.bind(this);
	    this.handlePlay = this.handlePlay.bind(this);
	    this.handleNext = this.handleNext.bind(this);
	    this.handleRepeat = this.handleRepeat.bind(this);
	    this.handleShuffle = this.handleShuffle.bind(this);
	    this.handlePrevious = this.handlePrevious.bind(this);
	    this.doInfo = this.doInfo.bind(this);
	  }

	transferPlaybackHere() {
	  const { deviceId, token } = this.state;
	  fetch("https://api.spotify.com/v1/me/player", {
	    method: "PUT",
	    headers: {
	      authorization: `Bearer ${this.state.token}`,
	      "Content-Type": "application/json",
	    },
	    body: JSON.stringify({
	      "device_ids": [ deviceId ],
	      "play": true,
	    }),
	  });
	}

	callBackParent(data) {
		let device = data;
		this.props.callbackFromParent(device);
	}

	checkForPlayer() {
		let parsed = queryString.parse(window.location.search);
		let accessToken = parsed.access_token;

		  if (window.Spotify !== null && accessToken !== undefined) {
		    this.player = new window.Spotify.Player({
		      name: "Spotify Player",
		      getOAuthToken: cb => { cb(accessToken); },
		    });
		    this.createEventHandlers();
		    this.setState({
		    	loggedIn: true,
		    	token: accessToken
		    })
		    // finally, connect!
		    this.player.connect();
		    clearInterval(this.playerCheckInterval);
		    fetch('https://api.spotify.com/v1/me/player/devices', {
				headers: {'Authorization': 'Bearer ' + accessToken},
				json: true
			}).then((res) => res.json())
			.then(data =>  {
				console.log(data);
			});
		  }
	}

	createEventHandlers() {
	  this.player.on('initialization_error', e => { console.error(e); });
	  this.player.on('authentication_error', e => {
	    console.error(e);
	  });
	  this.player.on('account_error', e => { console.error(e); });
	  this.player.on('playback_error', e => { console.error(e); });

	  // Playback status updates
	  this.player.on('player_state_changed', state => { 
	  	if (state != null && this.state.trackName.localeCompare(state.track_window.current_track.name) !== 0) {
	  		let time = Math.trunc(state.duration / 60000);
			let seconds = (state.duration / 60000 % 1) * 60;
			let secondsString = Math.trunc(seconds);
			seconds = Math.trunc(seconds);
			let currentTime = (state.position / state.duration) * (time * 60 + seconds);
			if (seconds < 10) {
				secondsString = "0" + secondsString;
			}
	  		if (state.track_window.current_track.album.images[0] !== undefined) {
	  			this.setState({
			  		artistName: state.track_window.current_track.artists[0].name,
			  		trackName: state.track_window.current_track.name,
			  		albumName: state.track_window.current_track.album.name,
			  		imageUrl: state.track_window.current_track.album.images[0].url,
			  		durationString: time + ":" + secondsString,
			  		duration: time * 60 + seconds,
			  		position: "0:00",
			  		songPosition: state.position,
			  		songDuration: state.duration,
			  		minutes: Math.trunc(currentTime / 60),
			  		seconds: Math.trunc(currentTime) - Math.trunc(currentTime / 60) * 60
	  			});
	  		} else {
	  			this.setState({
			  		artistName: state.track_window.current_track.artists[0].name,
			  		trackName: state.track_window.current_track.name,
			  		albumName: state.track_window.current_track.album.name,
			  		imageUrl: "",
			  		durationString: time + ":" + secondsString,
			  		duration: time * 60 + seconds,
			  		songPosition: state.position,
			  		songDuration: state.duration,
			  		minutes: Math.trunc(currentTime / 60),
			  		seconds: currentTime - Math.trunc(currentTime / 60) * 60
	  			});
	  		}
	  		setTimeout(this.doInfo(), 1000);
	  	}
	  });

	  // Ready
	  this.player.on('ready', data => {
	    let { device_id } = data;
	    this.setState({ deviceId: device_id });
	    this.callBackParent(device_id);
	    this.transferPlaybackHere();
	  });
	}
	componentDidMount() {
		this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
	}

	doInfo() {
		if (this.state.changingValue !== undefined) {
			clearInterval(this.state.changingValue);
			clearInterval(this.state.changingPosition);
			this.setState({
				minutes: 0,
				seconds: 0,
				position: "0:00",
				changing: true
			});
			setTimeout(function() {
				document.getElementById('upperProgress').value = 0;
			}, 700);
		} else {
			document.getElementById('upperProgress').value = Math.trunc(this.state.songPosition / this.state.songDuration * this.state.duration);
		}
		this.changeValue();
		this.changePosition();
	}

	changePosition() {
		if (this.state.position.localeCompare("") !== 0) {
			if (this.state.duration <= this.state.seconds + (this.state.minutes * 60)) {
				clearInterval(this.state.changingPosition);
				this.setState({
					position: "0:00"
				})
			} else {
				if (this.state.seconds + 1 === 60) {
					this.setState({
						minutes: this.state.minutes + 1,
						seconds: 0,
						position: this.state.minutes + ":0" + this.state.seconds
					});
				} else {
					if (this.state.seconds < 10) {
						this.setState({
							seconds: this.state.seconds + 1,
							position: this.state.minutes + ":0" + this.state.seconds
						});
					} else {
						this.setState({
							seconds: this.state.seconds + 1,
							position: this.state.minutes + ":" + this.state.seconds
						});
					}
				}
			}
		}	
		if (this.state.changing) {
			this.setState({
				changingPosition: setInterval(() => this.changePosition(), 1000),
				changing: false
			});
		}
	}
	changeValue() {
		let progress = document.getElementById('upperProgress');
		let number = Math.trunc(this.state.songPosition / this.state.songDuration * this.state.duration);
		let duration = this.state.duration;
		this.setState({
			changingValue: setInterval(scene, 1000)
		})
		var identity = this.state.changingValue;
		function scene() {
			if (number >= duration) {
				progress.value = 0;
				number = 0;
				clearInterval(identity);
			} else {
				progress.value = number;
				number++;
			}
		}
	}

	handlePlay() {
		if (this.state.paused) {
			fetch("https://api.spotify.com/v1/me/player/play?device_id=" + this.state.deviceId, {
				method: 'PUT',
				headers: {'Authorization': 'Bearer ' + this.state.token},
				json: true
				});
			this.changeValue();
			this.changePosition();
			this.setState({
				changingPosition: setInterval(() => this.changePosition(), 1000),
				paused: !this.state.paused
			});
		} else {
			fetch("https://api.spotify.com/v1/me/player/pause?device_id=" + this.state.deviceId, {
				method: 'PUT',
				headers: {'Authorization': 'Bearer ' + this.state.token},
				json: true
				});
			clearInterval(this.state.changingValue);
			clearInterval(this.state.changingPosition);
			this.setState({
				paused: !this.state.paused
			})
		}
	}

	handleNext() {
		fetch("https://api.spotify.com/v1/me/player/next?device_id=" + this.state.deviceId, {
			method: 'POST',
			headers: {'Authorization': 'Bearer ' + this.state.token},
			json: true
		});
	}

	handlePrevious() {
		fetch("https://api.spotify.com/v1/me/player/previous?device_id=" + this.state.deviceId, {
			method: 'POST',
			headers: {'Authorization': 'Bearer ' + this.state.token},
			json: true
		});
	}

	handleShuffle() {
		fetch("https://api.spotify.com/v1/me/player/shuffle?state=" + this.state.shuffle + "&device_id=" + this.state.deviceId, {
			method: 'PUT',
			headers: {'Authorization': 'Bearer ' + this.state.token},
			json: true
		});
		this.setState({
			shuffle: !this.state.shuffle
		});
	}

	handleRepeat() {
		if (this.state.repeat) {
			fetch("https://api.spotify.com/v1/me/player/repeat?state=track" + "&device_id=" + this.state.deviceId, {
				method: 'PUT',
				headers: {'Authorization': 'Bearer ' + this.state.token},
				json: true
			});
		} else {
			fetch("https://api.spotify.com/v1/me/player/repeat?state=off" + "&device_id=" + this.state.deviceId, {
				method: 'PUT',
				headers: {'Authorization': 'Bearer ' + this.state.token},
				json: true
			});
		}
		this.setState({
			repeat: !this.state.repeat
		});
	}
	render() {
	  return (
	    <div className="playerBase">
	      {this.state.loggedIn ?
	      (<div className="Playerrow">
		      	<div className="playerRow">
		      		<img alt="Current Song Playing" src={this.state.imageUrl} height="70" width="70"/>
			      	<div>
				      	<p className="playerTitle"> {this.state.trackName}</p>
				        <p className="playerArtistInfo"> {this.state.artistName}</p>
				        <p className="playerArtistInfo"> {this.state.albumName}</p>
			        </div>
		      </div>
		      <div className="playerActions">
		      	<div className="playerActionRow">
		      		<div onClick={this.handleRepeat} className="repeat">
		      			<img alt="Repeat Icon Gray" className="repeat1" src="https://i.ibb.co/xCxms5r/Repeat-Gray.png" width="25px" height="25px" />
		      			<img alt="Repeat Icon White" className="repeat2" src="https://i.ibb.co/HxtmCHW/Repeat-White.png" width="25px" height="25px"/>
		      		</div>
		      		<div onClick={this.handlePrevious} className="playerButton">
		      			<img alt="Previous Icon Gray" className="playerButton1" src="https://i.ibb.co/WVsXWwY/Previous-Gray.png" width="30px" height="30px" />
		      			<img alt="Previous Icon White"className="playerButton2" src="https://i.ibb.co/HGcQ5Nk/Previous-White.png" width="30px" height="30px"/>
		      		</div>
		      		<div onClick={this.handlePlay} className="playerPlay">
		      			<img alt="Play Icon Gray"className="repeat1" src="https://i.ibb.co/CthHPTJ/Play-Button-Gray.png" width="40px" height="40px" />
		      			<img alt="Play Icon White" className="playerPlayButton2" src="https://i.ibb.co/WvzccGD/Play-Button-White.png" width="45px" height="45px"/>
		      		</div>
		      		<div onClick={this.handleNext} className="playerButton">
		      			<img alt="Next Icon Gray" className="playerButton1" src="https://i.ibb.co/9w4HV1J/NextGray.png" width="30px" height="30px" />
		      			<img alt="Next Icon White" className="playerButton2" src="https://i.ibb.co/64bZBjg/Next-White.png" width="30px" height="30px"/>
		      		</div>
		      		<div onClick={this.handleShuffle} className="playerButton">
		      			<img alt="Shuffle Icon Gray" className="playerButton1" src="https://i.ibb.co/LNBznk8/Shuffle-Gray.png" width="30px" height="30px" />
		      			<img alt="Shuffle Icon White" className="playerButton2" src="https://i.ibb.co/FXm4MyD/Shuffle-White.png" width="30px" height="30px"/>
		      		</div>
		      	</div>
		      	<div className="playerBar">
		      		<h4 className="artist"> {this.state.position} </h4>
		      		<progress id="upperProgress" max={this.state.duration} value="0"/>
		      		<h4 className="artist"> {this.state.durationString} </h4>
		      	</div>
		      </div>
	      </div>
	      	)
	      :
	      (<div>
	      </div>)
		}
	    </div>
	  );
	}
}

export default Player;