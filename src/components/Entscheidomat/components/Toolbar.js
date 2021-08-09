import React from "react";
import {IconButton, IconMenu, MenuItem, Toolbar, ToolbarGroup} from "material-ui";
import {injectIntl} from "react-intl";
import PropTypes from "prop-types";


class EntscheidomatToolbar extends React.Component {

	static defaultProps = {
		options: []
	};

	static propTypes = {
		options: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			tooltip: PropTypes.string,
			isYesNo: PropTypes.bool,
			values: PropTypes.arrayOf(PropTypes.shape({
				value: PropTypes.oneOfType([
					PropTypes.string,
					PropTypes.number,
					PropTypes.bool,
				]),
				text: PropTypes.string
			})),
			inactiveValue: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.number,
				PropTypes.bool
			]),
			iconClass: PropTypes.string,
			iconId: PropTypes.string,
			default: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.number,
				PropTypes.bool
			]),
		}))
	};

	constructor(props) {
		super(props);
		let optionValues = {};
		// Fill options with default values or with false (when isYesNo active) or zero (index based)
		for (let option of props.options) {
			optionValues[option.name] = option.default ? option.default : option.isYesNo ? false : 0;
		}
		this.state = {
			optionValues: optionValues
		};

	}

	/**
	 * Handle the change of the option with the given name
	 * @param {Event} event Triggered event
	 * @param  {string} value Value
	 * @param {string} optionName Name of the option
	 */
	handleOptionChange = (event, value, optionName) => {
		let options = this.state.optionValues;
		options[optionName] = value;
		this.setState({
			optionValues: options
		});
	};

	/**
	 * Handles the toggle of a option with the given name
	 * @param {string} optionName Name of the option to toggle
	 */
	handleOptionToggle = (optionName) => {
		let options = this.state.optionValues;
		options[optionName] = !this.state.optionValues[optionName];
		this.setState({
			optionValues: options
		});
	};


	handleLoadClick = () => {
		console.log("Now we should load!");
	};
	handleSaveClick = (optionName) => {
		console.log("Now we should save!");
	};

	/**
	 * Get the value of the option with the given name
	 * @param {string} optionName Name of the option
	 * @return {null|node}
	 */
	getValue(optionName) {
		return this.state.optionValues[optionName] ? this.state.optionValues[optionName] : null;
	}


	render() {
		const {options, intl, ...otherProps} = this.props;
		const firstGroupOptions = options.map(option => {
			if (option.isYesNo) {
				return <IconButton
					key={option.name}
					tooltipPosition={"top-center"}
					iconClassName={option.iconClass}
					// tooltip={option.tooltip}
					iconStyle={{
						color: (this.state.optionValues[option.name] ? "rgba(0, 0, 0, 0.87)" : "rgba(0, 0, 0, 0.26)")
					}}
					onClick={() => {this.handleOptionToggle(option.name);}}
				>{option.iconId}</IconButton>;
			} else {
				return <IconMenu
					key={option.name}
					iconButtonElement={<IconButton iconClassName={option.iconClass}
					                               tooltipPosition="top-center"
					                               iconStyle={{
						                               color: (option.hasOwnProperty("inactiveValue") && this.state.optionValues[option.name] === option.inactiveValue ? "rgba(0, 0, 0, 0.26)" : "rgba(0, 0, 0, 0.87)")
					                               }}
						// tooltip={option.tooltip}
					>{option.iconId}</IconButton>}
					anchorOrigin={{horizontal: 'right', vertical: 'top'}}
					targetOrigin={{horizontal: 'right', vertical: 'top'}}
					onChange={(event, value) => this.handleOptionChange(event, value, option.name)}
					value={this.state.optionValues[option.name]}
				>
					{option.values.map(value => {
						return <MenuItem key={value.value} value={value.value} primaryText={value.text}/>;
					})}
				</IconMenu>;
			}
		});
		return (
			<Toolbar {...otherProps}>
				<ToolbarGroup firstChild={true}>
					{firstGroupOptions}
				</ToolbarGroup>
			</Toolbar>
		);
	}
}

export default injectIntl(EntscheidomatToolbar, {withRef: true});
