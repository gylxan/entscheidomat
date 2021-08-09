import React, {Component} from 'react';
import './Entscheidomat.css';
import ReactAudioPlayer from "react-audio-player";
import applause from "../../audio/Applause.ogg";
import zonk from "../../audio/Zonk.mp3";
import Fireworks from "../Fireworks";
import PropTypes from "prop-types";
import {RaisedButton, TextField} from "material-ui";
import {injectIntl} from "react-intl";
import Toolbar from "./components/Toolbar";

/**
 * TODOs
 * - Save options
 * - Multiple lists (save list function)
 * - Server to get translations and audiosaudioFiles
 * - Spread list in groups and choose random option from groups
 * - Fast loading of audio on Apple safari
 * - Split render in multiple functions
 * - Use List instead of textarea
 * - Material UI?
 */


const Title = (props) => {
	const {text, className, ...otherProps} = props;
	return <h2 className={"text-center " + className} {...otherProps}>{props.text}</h2>;
};
Title.propTypes = {
	text: PropTypes.string.isRequired
};

const StartStopButton = (props) => {
	let {isDisabled, onClick, ...other} = props;
	return <RaisedButton primary={true} disabled={isDisabled}
	                     onClick={onClick} {...other} label={props.label}/>;
};
StartStopButton.propTypes = {
	isDisabled: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
	label: PropTypes.string,
};
StartStopButton.defaultProps = {
	isDisabled: false
};

class Entscheidomat extends Component {

	/**
	 * Constant status
	 * @type {{started: string, stopping: string, stopped: string}}
	 */
	static STATUS = {
		/**
		 * State the randomizing started
		 */
		started: "started",
		/**
		 * Randomizing is stopping
		 */
		stopping: "stopping",
		/**
		 * Randomizing stopped (initial state)
		 */
		stopped: "stopped"
	};

	/**
	 * Markers for positive or negative options
	 * @type {{positive: string, negative: string}}
	 */
	static OPTION_MARKERS = {
		positive: "+",
		negative: "-"
	};


	static propTypes = {
		list: PropTypes.arrayOf(PropTypes.string),
		saveListFunc: PropTypes.func,
		audioFiles: PropTypes.arrayOf(PropTypes.string)
	};

	static defaultProps = {
		audioFiles: []
	};

	constructor(props) {
		super(props);
		this.state = {
			status: Entscheidomat.STATUS.stopped,
			// Current option text without marker
			currentOptionText: "Let's entscheid!",
			// Current option value
			currentOptionValue: "Let's entscheid!",
			// Whether options are collapsed
			optionsCollapsed: false,
			// The currently selected audio
			selectedAudio: null,
			// List of initial options
			list: this.props.list ? this.props.list : [],
		};

		this.noMusicOption = this.props.intl.formatMessage({id: "common.options.music.no"});

		this.timerId = null;
		// Firework -> Will be initialised when the fireworks start
		this.fireworks = null;
	}


	/**
	 * Handle start / stop button click
	 */
	handleStartStopButtonClick = () => {
		if (this.state.status === Entscheidomat.STATUS.stopped) {
			this.start();
		} else {
			this.stopLazy();
		}
	};


	/**
	 *  Plays the audio player
	 */
	playAudio = () => {
		this.audioPlayer.play();
	};


	/**
	 * Get the current option text
	 *
	 * Checks the given value starts with a marker and removes it eventually
	 * @param {string} optionValue The value to get the text from
	 * @return {string} The option value without beginning marker
	 */
	static getOptionText(optionValue) {
		return (optionValue.charAt(0) === Entscheidomat.OPTION_MARKERS.positive || optionValue.charAt(0) === Entscheidomat.OPTION_MARKERS.negative) ?
			optionValue.substr(1) : optionValue;
	}

	/**
	 * Returns a random option from the current list
	 * @return {String} A random option from the current list
	 */
	getRandomOption() {
		return this.state.list[Math.floor(Math.random() * this.state.list.length)];
	}

	/**
	 * Start randomizing
	 *
	 * Sets an interval for 100 ms, gets a current option and shows it.
	 * The Status will be set to {@link Entscheidomat#STATUS#started} and the current selected audio will be played.
	 * Also the current list will be saved.
	 */
	start() {
		let self = this;
		// Stop the firework
		this.stopFirework();

		let list = this.createList();
		this.timerId = setInterval(function () {
			let optionValue = self.getRandomOption();
			self.setState((prevState, newProps) => ({
				currentOptionValue: optionValue,
				currentOptionText: Entscheidomat.getOptionText(optionValue)
			}));
		}, 100);
		self.setState({
			status: Entscheidomat.STATUS.started,
			selectedAudio: this.toolbar.getWrappedInstance().getValue("music") === self.noMusicOption
				? null
				: this.toolbar.getWrappedInstance().getValue("music"),
			list: list
		});
		this.saveCurrentList(list);
	}

	/**
	 *  Saves the given list in the local storage
	 *  @param {Array} list List to save
	 */
	saveCurrentList(list) {
		if (this.props.saveListFunc) {
			this.props.saveListFunc(list);
		}
	}

	/**
	 * Stops the randomizing lazy (2 sec delay)
	 */
	stopLazy() {
		let self = this;
		this.setState({
			status: Entscheidomat.STATUS.stopping
		});
		setTimeout(function () {
			self.stop();
		}, 2000);
	}

	/**
	 * Stops the randomizing and playing audio
	 */
	stop() {
		clearInterval(this.timerId);
		this.setState({
			status: Entscheidomat.STATUS.stopped,
			selectedAudio: null
		});
		this.playOptionAudio();
		this.startFirework();
	}

	/**
	 * Plays the audio for the current option (positive, negative or none)
	 */
	playOptionAudio() {
		if (this.hasCurrentOptionMarker(Entscheidomat.OPTION_MARKERS.positive)) {
			this.setState({
				selectedAudio: applause
			});
		} else if (this.hasCurrentOptionMarker(Entscheidomat.OPTION_MARKERS.negative)) {
			this.setState({
				selectedAudio: zonk
			});
		}
	}

	/**
	 * Starts the firework
	 *
	 * Starts the fireworks when is selected and starts timeout
	 */
	startFirework() {
		if (Number(this.toolbar.getWrappedInstance().getValue("fireworks")) === 1
			|| (Number(this.toolbar.getWrappedInstance().getValue("fireworks")) === 2 && this.hasCurrentOptionMarker(Entscheidomat.OPTION_MARKERS.positive))) {
			if (this.fireworks === null) {
				this.fireworks = new Fireworks();
			}
			this.fireworks.start();
			let self = this;
			// Stop fireworks after some seconds
			setTimeout(function () { self.stopFirework(); }, 3000);
		}
	}

	/**
	 * Stops the firework
	 */
	stopFirework() {
		if (this.fireworks !== null) {
			this.fireworks.stop();
		}
	}

	/**
	 * Checks whether the current option has the given marker
	 * @param {string} marker Marker to check current option starts with
	 * @returns {boolean}
	 */
	hasCurrentOptionMarker(marker) {
		return this.state.currentOptionValue.startsWith(marker);
	}

	/**
	 * Creates a list of entries from the text area (splitted by "\n")
	 */
	createList() {
		return this.textarea.getValue().split("\n").filter(function (entry) {
			return entry !== undefined && entry.trim() !== "";
		});
	}

	/**
	 * Component did update
	 *
	 * Checks the selected audio has changed and plays the new audio file
	 * @param prevProps
	 * @param prevState
	 */
	componentDidUpdate(prevProps, prevState) {
		// Check the selected audio has changed, so play it, when it isn't null
		// On mobile devices the autoplay function won't work
		if (prevState.selectedAudio !== this.state.selectedAudio && this.state.selectedAudio !== null) {
			this.audioPlayer.audioEl.play();
		}
	}

	/**
	 * Render
	 * @return {XML}
	 */
	render() {
		let buttonTitle = this.state.status === Entscheidomat.STATUS.started
			? this.props.intl.formatMessage({id: "common.button.stop"})
			: (this.state.status === Entscheidomat.STATUS.stopping ? "..." : this.props.intl.formatMessage({id: "common.button.start"}));
		let btnDisabled = this.state.list.length === 0 || this.state.status === "stopping",
			listString = this.state.list.join("\n");


		const audioFileOptions = [{value: 0, text: this.noMusicOption}].concat(this.props.audioFiles.map(audioFile => {
			const lastSlash = audioFile.lastIndexOf('/');
			return {
				value: audioFile,
				text: audioFile.substr(lastSlash + 1, (audioFile.indexOf(".") - lastSlash - 1))
			};
		}));
		return (
			<div>
				<TextField
					hintText={this.props.intl.formatMessage({id: "common.textarea.placeholder"})}
					multiLine={true}
					rows={8}
					fullWidth={true}
					defaultValue={listString}
					ref={(ref) => {this.textarea = ref;}}
				/>

				<Title className="margin-top-3" text={this.state.currentOptionText}/>

				<div className="text-center margin-top-3">
					<StartStopButton isDisabled={btnDisabled}
					                 onClick={this.handleStartStopButtonClick} label={buttonTitle}/>
				</div>
				<ReactAudioPlayer ref={(ref) => {this.audioPlayer = ref;}}
				                  src={this.state.selectedAudio === null ? "" : this.state.selectedAudio}/>

				<Toolbar className="toolbar"
				         ref={(ref) => this.toolbar = ref}
				         options={[
					         {
						         name: "music",
						         default: 0,
						         tooltip: this.props.intl.formatMessage({id: "common.options.music.title"}),
						         iconClass: "fa fa-music",
						         values: audioFileOptions,
						         inactiveValue: 0
					         },
					         {
						         name: "fireworks",
						         isYesNo: true,
						         default: true,
						         tooltip: this.props.intl.formatMessage({id: "common.options.fireworks.title"}),
						         iconClass: "icon-firework-2",
					         },
					         // {
					         //    name: "moveToUsedList",
					         //    isYesNo: true,
					         //    tooltip: this.props.intl.formatMessage({id: "common.options.movetousedlist.title"}),
					         //    iconClass: "material-icons",
					         //    iconId: "low_priority"
					         // },
				         ]}/>
			</div>
		);
	}
}

export default injectIntl(Entscheidomat);
