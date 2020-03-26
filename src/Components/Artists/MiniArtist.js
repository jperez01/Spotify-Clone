import React, {Component} from 'react';
import queryString from 'query-string';
import NavLink from 'react-router-dom/NavLink';
import '../style.css';

class MiniArtist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			name: '',
			followers: '',
			imageUri: ''
		}
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		if (this.props.data.images[0] === undefined) {
			this.setState({
				id: this.props.data.id,
				name: this.props.data.name,
				followers: this.props.data.followers.total,
				imageUri: 'https://lh3.googleusercontent.com/proxy/xNylL_kHH1Bupbma26k4xb9VCEYKLwzaDRvwxnDlc6MSTQ33xrMK5Cgcsqf-TnTdq2DyRfO6SLlD72atKjV_avleGpTubakKQzxnxw'
			});
		} else {
			this.setState({
				id: this.props.data.id,
				name: this.props.data.name,
				followers: this.props.data.followers.total,
				imageUri: this.props.data.images[0].url
			});
		}
	}

	handleClick() {
		let query = queryString.parse(window.location.search);
		let token = query.access_token;
		return '/ArtistPage/?access_token='  + token + '&id=' + this.state.id;
	}

	render() {
		return (
			<div onClick={this.handleClick} className="box">
				<NavLink 
					className="link"
					to={this.handleClick}>
					<img alt="Artist Image" src={this.state.imageUri} className="imgArtist"/>
					<h5 className="title">{this.state.name}</h5>
					<h5 className="artist"> Artist </h5>
				</NavLink>
			</div>
			)
	}
}

export default MiniArtist;