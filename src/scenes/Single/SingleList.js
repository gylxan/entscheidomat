import React, {Component} from 'react';
import Entscheidomat from "../../components/Entscheidomat";

export default class SingleList extends Component {
	render() {
		return (
			<div className="App">
				<div className="row">
					<div className="col-md-4 offset-md-4">
						<Entscheidomat/>
					</div>
				</div>
			</div>
		);
	}
}
