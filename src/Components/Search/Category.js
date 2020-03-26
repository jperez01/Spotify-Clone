import React, {Component} from 'react';
import '../style.css';

class Category extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			id: "",
			imageUrl: ""
		}
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	componentDidMount() {
		if (this.props.data.icons === undefined) {
			this.setState({
				name: this.props.data.name,
				id: this.props.data.id,
				imageUrl: ''
		});
		} else {
			this.setState({
				name: this.props.data.name,
				id: this.props.data.id,
				imageUrl: this.props.data.icons[0].url
			});
		}
	}

	render() {
		return (
			<div className="box">
				<img alt="Category Image" src={this.state.imageUrl} className="img"/>
				<h5 className="title">{this.state.name}</h5>
			</div>
			);
	}
}

export default Category;