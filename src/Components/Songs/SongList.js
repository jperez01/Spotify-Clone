import React, {Component} from 'react';
import Song from './Song';
import '../style.css';

class SongList extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<h3 className="listTitle">Tracks</h3>
				<ul className="innerList">
					{this.props.items.map(item => (
						<Song key={item.id} data={item}/>))}
				</ul>
			</div>
			);
	}
}

export default SongList;