import React, {Component} from 'react';
import './Entscheidomat.css';
import ReactAudioPlayer from "react-audio-player";
import audio1 from "../audio/Angry-Beavers.mp3";
import audio2 from "../audio/Jeopardy.mp3";
import applause from "../audio/Applause.ogg";
import zonk from "../audio/Zonk.mp3";
import Fireworks from "./Fireworks";
import {injectIntl} from "react-intl";
import PropTypes from "prop-types";
import CollapsableOptions from "./CollapsableOptions";
import TextareaAutosize from "react-autosize-textarea";

/**
 * TODOs
 * - Save options
 * - Multiple lists (save list function)
 * - Server to get translations and audios
 * - Spread list in groups and choose random option from groups
 * - Fast loading of audio on Apple safari
 * - Split render in multiple functions
 * - Use List instead of textarea
 * - Material UI?
 */


const Title = (props) => {
	return <h2 className="margin-top-30px text-center">{props.text}</h2>;
};
Title.propTypes = {
	text: PropTypes.string.isRequired
};

const StartStopButton = (props) => {
	let {className, isDisabled, onClick, ...other} = props;
	return <button type="button" className={"btn btn-danger btn-lg " + className}
	               disabled={isDisabled ? isDisabled : null}
	               onClick={onClick} {...other}>{props.children}</button>;
};
StartStopButton.propTypes = {
	isDisabled: PropTypes.bool,
	onClick: PropTypes.func.isRequired
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

	/**
	 * Key for the local storage caching
	 * @type {string}
	 */
	static LOCAL_STORAGE_KEY = "entscheidomat-list";

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
			list: Entscheidomat.getInitialListFromStorage()
		};

		this.noMusicOption = this.props.intl.formatMessage({id: "common.options.option.no_music"});

		this.timerId = null;
		// Firework -> Will be initialised when the fireworks start
		this.fireworks = null;
	}


	/**
	 * Handle start / stop button click
	 */
	handleButtonClick = () => {
		if (this.state.status === Entscheidomat.STATUS.stopped) {
			this.start();
		} else {
			this.stopLazy();
		}
	};

	/**
	 * Toggles the options
	 */
	toggleOptions = () => {
		// https://github.com/reactstrap/reactstrap/issues/251
		// When clicking to fast, it won't be showed correctly
		this.setState((prevState, props) => ({
			optionsCollapsed: !prevState.optionsCollapsed
		}));
	};
	/**
	 *  Plays the audio player
	 */
	playAudio = () => {
		this.audioPlayer.play();
	};


	static getOptionText(optionValue) {
		return (optionValue.charAt(0) === Entscheidomat.OPTION_MARKERS.positive || optionValue.charAt(0) === Entscheidomat.OPTION_MARKERS.negative) ?
			optionValue.substr(1) : optionValue;
	}

	/**
	 * Get the initial list from localstorage (when app was used before) or use the default start options
	 */
	static getInitialListFromStorage() {
		let list = localStorage.getItem(Entscheidomat.LOCAL_STORAGE_KEY);
		if (list) {
			return JSON.parse(list);
		}
		// Return the default list
		return ['Option 1', 'Option 2', 'Option 3'];
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
			self.setState({
				currentOptionValue: optionValue,
				currentOptionText: Entscheidomat.getOptionText(optionValue)
			});
		}, 100);
		self.setState({
			status: Entscheidomat.STATUS.started,
			selectedAudio: this.audioSelect.value === self.noMusicOption ? null : this.audioSelect.value,
			list: list
		});
		this.saveCurrentList(list);
	}

	/**
	 *  Saves the given list in the local storage
	 *  @param {Array} list List to save
	 */
	saveCurrentList(list) {
		let listToSave = JSON.stringify(list);
		localStorage.setItem(this.LOCAL_STORAGE_KEY, listToSave);
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
		if (Number(this.fireworkSelect.value) === 1
			|| (Number(this.fireworkSelect.value) === 2 && this.hasCurrentOptionMarker(Entscheidomat.OPTION_MARKERS.positive))) {
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
		return this.textarea.value.split("\n").filter(function (entry) {
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
		// Check the selected audio has changed, so play it
		// On mobile devices the autoplay function won't work
		if (prevState.selectedAudio !== this.state.selectedAudio) {
			this.audioPlayer.audioEl.play();
		}
	}

	/**
	 * Get the paths for the audio files
	 */
	// TODO Put this in an extra service later
	getAudioOptions() {
		return [
			this.noMusicOption,
			audio1,
			audio2
		];
	}

	/**
	 * Get the options for the firework
	 */
	getFireworkOptions() {
		return this.getYesNoOptions().concat(this.props.intl.formatMessage({id: "common.options.option.on_positive"}));
	}

	/**
	 * Get yes and no options
	 * @return {Array} Array with yes and no option
	 */
	getYesNoOptions() {
		return [
			this.props.intl.formatMessage({id: "common.options.option.no"}),
			this.props.intl.formatMessage({id: "common.options.option.yes"})
		];
	}

	/**
	 * Render
	 * @return {XML}
	 */
	render() {
		let buttonTitle = this.state.status === Entscheidomat.STATUS.started ? "Stop" : (this.state.status === Entscheidomat.STATUS.stopping ? "..." : "Start");
		let btnDisabled = this.state.list.length === 0 || this.state.status === "stopping",
			listString = this.state.list.join("\n");


		let self = this;
		return (
			<div>
				<TextareaAutosize style={{minHeight: "10em"}}
				                  innerRef={(ref) => {this.textarea = ref;}}
				                  className="form-control" defaultValue={listString}/>

				<Title text={this.state.currentOptionText}/>

				<div className="text-center">
					<StartStopButton className="margin-top-20px" isDisabled={btnDisabled}
					                 onClick={this.handleButtonClick}>{buttonTitle}</StartStopButton>
				</div>
				<CollapsableOptions delay={{hide: 0, show: 0}} options={[
					{
						name: "audios",
						label: this.props.intl.formatMessage({id: "common.options.music"}),
						values: this.getAudioOptions(),
						reference: (ref) => {this.audioSelect = ref;},
						mapFunc: (audioFileName) => {
							let lastSlash = audioFileName.lastIndexOf('/'),
								length = audioFileName.indexOf(".") - lastSlash - 1,
								audioName = audioFileName === self.noMusicOption ? audioFileName : audioFileName.substr(lastSlash + 1, length);
							return <option key={audioFileName}
							               value={audioFileName}>{audioName}</option>;
						}
					},
					{
						name: "firework",
						label: this.props.intl.formatMessage({id: "common.options.fireworks"}),
						values: this.getFireworkOptions(),
						default: 1,
						reference: ref => this.fireworkSelect = ref,
					},
					{
						name: "moveToUsedList",
						label: this.props.intl.formatMessage({id: "common.options.movetousedlist"}),
						values: this.getYesNoOptions(),
						reference: ref => this.moveToUsedListSelect = ref,
					},

				]}
				/>
				<ReactAudioPlayer ref={(ref) => {this.audioPlayer = ref;}}
				                  src={this.state.selectedAudio === null ? "" : this.state.selectedAudio}/>
			</div>
		);
	}
}

// Asynchroner zugriff auf alte states, z.B. bei
// Use this to prevent strange states because set state won't be called immediatly
// handleCLick = (event) => {
// 	this.setState((prevState, props) => ({
// 		clicks: prevState.clicks
// 	}))
// }

export default injectIntl(Entscheidomat);
