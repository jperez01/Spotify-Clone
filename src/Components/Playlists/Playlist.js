import React, {Component} from 'react';
import queryString from 'query-string';
import '../style.css';

class Playlist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			imageUrl: "",
			id: "",
			description: "",
			owner: ""
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		this.setState({
			name: this.props.data.name,
			imageUrl: this.props.data.images[0].url,
			id: this.props.data.id,
			description: this.props.data.description,
			owner: this.props.data.owner.display_name
		});
	}

	handleClick() {
		let parsed = queryString.parse(window.location.search);
		window.location = 'http://localhost:3000/PlaylistPage/?access_token=' + parsed.access_token +'&id=' + this.state.id + '&deviceId=' + this.state.deviceId;
	}
	
	render() {
		return (
			<div onClick={this.handleClick} className="box">
				<img alt="Playlist Image" src={this.state.imageUrl} className="img"/>
				<h5 className="title">{this.state.name}</h5>
				<h5 className="artist">{this.state.owner}</h5>
			</div>
			);
	}
}

export default Playlist;