import React from "react";
import FontAwesome from "react-fontawesome";
import {Collapse} from "reactstrap";
import {FormattedMessage} from "react-intl";
import OptionsForm from "./OptionsForm";

class CollapsableOptions extends React.Component {

	static propTypes = {
		options: OptionsForm.propTypes.options
	};
	toggleOptions = () => {
		this.setState((prevState, props) => ({
			isCollapsed: !prevState.isCollapsed
		}));
	};

	constructor(props) {
		super(props);
		this.state = {
			isCollapsed: false
		};
	}

	render() {
		let rotateDeg = this.state.isCollapsed ? 90 : null;
		return (
			<div>
				<div className="text-center">
					<div onClick={this.toggleOptions} className="margin-top-5px clickable"
					     style={{display: "inline-block"}}>
						<FontAwesome className="angle" rotate={rotateDeg} name="angle-right"
						             style={{marginBottom: '1rem'}}/> <FormattedMessage id="common.options.title"/>
					</div>
				</div>

				<Collapse isOpen={this.state.isCollapsed}>
					<OptionsForm options={this.props.options}/>
				</Collapse>
			</div>
		);
	}
}

export default CollapsableOptions;