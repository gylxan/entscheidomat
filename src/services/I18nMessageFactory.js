import de from "../i18n/de";
import en from "../i18n/en";

const LANGS = {
	de : de,
	en : en
};
export default class I18nMessageFactory {
	/**
	 * Default language (Ensure it's imported!)
	 * @type {string}
	 */
	static DEFAULT = "de";

	/**
	 * Get the translated messages for a given lang
	 * @param {string}  lang Language like "de", "en",...
	 * @returns {*}
	 */
	static getMessages(lang) {
		if (lang) {
			if(typeof LANGS[lang]!== "undefined") {
				return LANGS[lang];
			}
			return LANGS[I18nMessageFactory.DEFAULT];
		}
		return {};
	}
}
