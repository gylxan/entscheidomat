import React from "react";
import PropTypes from "prop-types";
import {Col, Form, FormGroup, Label} from "reactstrap";


// TODO Remove offsets
const OptionLabel = (props) => {
	return <Label for={props.name} sm={6}>{props.label ? props.label : props.name}</Label>;
};

class OptionsForm extends React.Component {

	static propTypes = {
		options: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			label: PropTypes.string,
			// Default value is the first option
			default: PropTypes.node,
			values: PropTypes.oneOfType([
				PropTypes.array
			]).isRequired,
			reference: PropTypes.func,
			mapFunc: PropTypes.func
		}))
	};


	render() {
		return <Form>
			{this.renderOptions()}
		</Form>;
	}

	renderOptions() {
		return this.props.options.map((option) => {
				return (
					<FormGroup row key={option.name}>
						<OptionLabel name={option.name} label={option.label ? option.label : null}/>
						<Col sm={6}>
							<select className="form-control" id={option.name} name={option.name}
							        defaultValue={option.default ? option.default : null}
							        ref={ref => option.reference ? option.reference(ref) : null}>
								{option.values.map((optValue, index) => {
									return option.mapFunc ? option.mapFunc(optValue) :
										<option key={optValue} value={index}>{optValue}</option>;
								})}
							</select>
						</Col>
					</FormGroup>
				);
			}
		);
	}
}

export default OptionsForm;