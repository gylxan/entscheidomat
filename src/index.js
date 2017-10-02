import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {addLocaleData, IntlProvider} from "react-intl";
import Entscheidomat from './components/Entscheidomat';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
// Include this to activate the languages
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import I18nMessageFactory from "./services/I18nMessageFactory";

addLocaleData([...de,...en]);

// Get the current user language
let userLang = navigator.language || navigator.userLanguage;

ReactDOM.render(
	<IntlProvider locale={userLang} messages={I18nMessageFactory.getMessages(userLang)}>
		<Entscheidomat />
	</IntlProvider>, document.getElementById('root'));
registerServiceWorker();
