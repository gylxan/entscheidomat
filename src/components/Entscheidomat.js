import React, {Component} from 'react';
import './Entscheidomat.css';
import {Button, FormGroup, Label, Row, Col, Form, Collapse} from "reactstrap";
import FontAwesome from "react-fontawesome";
import ReactAudioPlayer from "react-audio-player";
import audio1 from "../audio/Angry-Beavers.mp3";
import audio2 from "../audio/Jeopardy.mp3";
import applause from "../audio/Applause.ogg";
import zonk from "../audio/Zonk.mp3";
import Fireworks from "./Fireworks";
import {FormattedMessage, injectIntl} from "react-intl";

/**
 * TODOs
 * - Save options
 * - Multiple lists
 * - Server to get translations and audios
 * - Fast loading of audio on Apple safari
 */


class Entscheidomat extends Component {

	/**
	 * Constant status
	 * @type {{started: string, stopping: string, stopped: string}}
	 */
	static STATUS = {
		started: "started",
		stopping: "stopping",
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
		let startValue = "Let's entscheid!";
		this.state = {
			status: Entscheidomat.STATUS.stopped,
			// Current option text without marker
			currentOptionText: startValue,
			// Current option value
			currentOptionValue: startValue,
			// Whether options are collapsed
			optionsCollapsed: false,
			// The currently selected audio
			selectedAudio: null,
			// List of initial options
			list: this.getInitialListFromStorage()
		};

		this.noMusicOption = this.props.intl.formatMessage({id: "common.options.option.no_music"});

		this.timerId = null;
		this.fireworks = new Fireworks();

		this.handleButtonClick = this.handleButtonClick.bind(this);
		this.toggleOptions = this.toggleOptions.bind(this);
		this.playAudio = this.playAudio.bind(this);
	}


	/**
	 * Get the initial list from localstorage (when app was used before) or use the default start options
	 */
	getInitialListFromStorage() {
		let list = localStorage.getItem(this.LOCAL_STORAGE_KEY);
		if (list) {
			return JSON.parse(list);
		}
		return ['Option 1', 'Option 2', 'Option 3'];
	}

	/**
	 * Returns a random option from the current list
	 */
	getRandomOption() {
		return this.state.list[Math.floor(Math.random() * this.state.list.length)];
	}


	handleButtonClick() {
		if (this.state.status === Entscheidomat.STATUS.stopped) {
			this.start();
		} else {
			this.stopLazy();
		}
	}

	static getOptionText(optionValue) {
		return (optionValue.charAt(0) === Entscheidomat.OPTION_MARKERS.positive || optionValue.charAt(0) === Entscheidomat.OPTION_MARKERS.negative) ?
			optionValue.substr(1) : optionValue;
	}

	start() {
		let self = this;
		// Stop the firework
		this.fireworks.stop();

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

	startFirework() {
		if (Number(this.fireworkSelect.value) === 1
			|| (Number(this.fireworkSelect.value) === 2 && this.hasCurrentOptionMarker(Entscheidomat.OPTION_MARKERS.positive))) {
			this.fireworks.start();
			let self = this;
			// Stop fireworks after some seconds
			setTimeout(function () {
				self.fireworks.stop();
			}, 3000);
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
	 * Toggles the options
	 */
	toggleOptions() {
		this.setState({
			optionsCollapsed: !this.state.optionsCollapsed
		});
	}


	/**
	 *  Plays the audio player
	 */
	playAudio() {
		this.audioPlayer.play();
	}

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

		return [
			this.props.intl.formatMessage({id: "common.options.option.no"}),
			this.props.intl.formatMessage({id: "common.options.option.yes"}),
			this.props.intl.formatMessage({id: "common.options.option.on_positive"})
		];
	}

	render() {
		let buttonTitle = this.state.status === Entscheidomat.STATUS.started ? "Stop" : (this.state.status === Entscheidomat.STATUS.stopping ? "..." : "Start");
		let btnDisabled = this.state.list.length === 0 || this.state.status === "stopping",
			rotateDeg = this.state.optionsCollapsed ? 90 : null,
			listString = this.state.list.join("\n");


		let self = this;
		return (
			<div className="App">
				<Row>
					<Col md={4} className="offset-md-4">
					<textarea style={{minHeight: "150px"}} ref={(textarea) => {
						this.textarea = textarea;
					}} className="form-control"
					          defaultValue={listString}></textarea>
					</Col>
				</Row>

				<h2 id="current-option" className="margin-top-30px" ref={(ref) => {
					this.showTitle = ref
				}}>{this.state.currentOptionText}</h2>

				<Button className="margin-top-20px" disabled={btnDisabled} size="lg" onClick={this.handleButtonClick}
				        color="danger">{buttonTitle}</Button>

				<div>
					<div onClick={this.toggleOptions} className="margin-top-5px clickable"
					     style={{display: "inline-block"}}>
						<FontAwesome className="angle" rotate={rotateDeg} name="angle-right"
						             style={{marginBottom: '1rem'}}/> <FormattedMessage id="common.options.title"/>
					</div>

					{/*<div className="text-center clickable" onClick={this.toggleOptions} style={{ marginBottom: '1rem' }}> - Options - </div>*/}
					<Collapse isOpen={this.state.optionsCollapsed}>
						<Form>
							<FormGroup row>
								<Label for="audios" sm={2}><FormattedMessage id="common.options.music"/></Label>
								<Col sm={10}>
									<select className="form-control" id="audios" name="audio" ref={(ref) => {
										this.audioSelect = ref;
									}}>
										{this.getAudioOptions().map(function (audio) {
											let lastSlash = audio.lastIndexOf('/'),
												length = audio.indexOf(".") - lastSlash - 1,
												audioName = audio === self.noMusicOption ? audio : audio.substr(lastSlash + 1, length);
											return <option key={audio}
											               value={audio}>{audioName}</option>
										})}
									</select>
								</Col>
							</FormGroup>
							<FormGroup row>
								<Label for="firework" sm={2}><FormattedMessage id="common.options.fireworks"/></Label>
								<Col sm={10}>
									<select className="form-control" id="firework" name="firework" defaultValue={1}
									        ref={(ref) => {
										        this.fireworkSelect = ref;
									        }}>
										{self.getFireworkOptions().map(function (option, index) {
											return <option key={option} value={index}>{option}</option>
										})}
									</select>
								</Col>
							</FormGroup>
						</Form>
					</Collapse>
				</div>
				<ReactAudioPlayer ref={(ref) => {
					this.audioPlayer = ref;
				}} src={this.state.selectedAudio === null ? "" : this.state.selectedAudio}/>
			</div>
		);
	}
}
export default injectIntl(Entscheidomat);
