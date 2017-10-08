import de from "../i18n/de";
import en from "../i18n/en";

/**
 * Supported languages
 * @type {{de: {[common.options.title], [common.options.music], [common.options.fireworks], [common.options.option.no_music], [common.options.option.yes], [common.options.option.no], [common.options.option.on_positive]}, en: {[common.options.title], [common.options.music], [common.options.fireworks], [common.options.option.no_music], [common.options.option.yes], [common.options.option.no], [common.options.option.on_positive]}}}
 */
const SUPPORTED_LANGS = {
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
			if(typeof SUPPORTED_LANGS[lang]!== "undefined") {
				return SUPPORTED_LANGS[lang];
			}
			return SUPPORTED_LANGS[I18nMessageFactory.DEFAULT];
		}
		return {};
	}
}
