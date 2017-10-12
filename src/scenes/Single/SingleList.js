import React, {Component} from 'react';
import Entscheidomat from "../../components/Entscheidomat/Entscheidomat";

import audio1 from "../../audio/Angry-Beavers.mp3";
import audio2 from "../../audio/Jeopardy.mp3";

export default class SingleList extends Component {

	/**
	 * Key for the local storage caching
	 * @type {string}
	 */
	static LOCAL_STORAGE_KEY = "single-list-entscheidomat-list";

	/**
	 * Gets the options list for the Entscheidomat from the local storage or uses default start options
	 * @return {Array} Array with options
	 */
	static getOptionList() {
		let list = localStorage.getItem(SingleList.LOCAL_STORAGE_KEY);
		if (list) {
			return JSON.parse(list);
		}
		// Return the default list
		return ['Option 1', 'Option 2', 'Option 3'];
	}

	/**
	 * Saves the given list as JSON in the local storage
	 * @param {Array} list List of the current options
	 */
	static saveOptionList(list) {
		let listToSave = JSON.stringify(list);
		localStorage.setItem(SingleList.LOCAL_STORAGE_KEY, listToSave);
	}

	static getAudioOptions() {
		return [
			audio1,
			audio2
		];
	}

	render() {
		return (
			<div className="row">
				<div className="col-md-4 offset-md-4">
					<Entscheidomat list={SingleList.getOptionList()}
					               saveListFunc={(list) => SingleList.saveOptionList(list)}
					               audioFiles={SingleList.getAudioOptions()}/>
				</div>
			</div>
		);
	}
}
