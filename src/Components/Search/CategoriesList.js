import React, {Component} from 'react';
import Category from './Category';

class CategoriesList extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<ul>
					{this.props.items.map(item => (
						<Category key={item.id} data={item}/>))}
				</ul>
			</div>
			);
	}
}

export default CategoriesList;