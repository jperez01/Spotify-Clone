import React, {Component} from 'react';
import queryString from 'query-string';
import NavLink from 'react-router-dom/NavLink';
import '../style.css';

class MiniPlaylist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			imageUrl: "",
			id: "",
			creator: ""
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		if (this.props.data.images[1] !== undefined) {
			this.setState({
				name: this.props.data.name,
				imageUrl: this.props.data.images[1].url,
				id: this.props.data.id,
				creator: this.props.data.owner.display_name
			});
		} else if (this.props.data.images[0] !== undefined) {
			this.setState({
				name: this.props.data.name,
				imageUrl: this.props.data.images[0].url,
				id: this.props.data.id,
				creator: this.props.data.owner.display_name
			});
		} else {
			this.setState({
				name: this.props.data.name,
				imageUrl: 'https://cdn0.iconfinder.com/data/icons/google-material-design-3-0/48/ic_playlist_play_48px-512.png',
				id: this.props.data.id,
				creator: this.props.data.owner.display_name
			});

		}
	}

	handleClick() {
		let parsed = queryString.parse(window.location.search);
		return '/PlaylistPage/?access_token=' + parsed.access_token +'&id=' + this.state.id;
	}
	
	render() {
		return (
			<div className="box">
				<NavLink 
						className="link"
						to={this.handleClick}>
					<img alt="Playlist Image" src={this.state.imageUrl} className="img"/>
					<h5 className="title">{this.state.name}</h5>
					<h6 className="artist"> {"By " + this.state.creator} </h6>
				</NavLink>
			</div>
			);
	}
}

export default MiniPlaylist;