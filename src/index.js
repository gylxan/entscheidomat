import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {addLocaleData, IntlProvider} from "react-intl";
import registerServiceWorker from './registerServiceWorker';
// Include this to activate the languages
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import I18nMessageFactory from "./services/I18nMessageFactory";
import App from "./App";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

addLocaleData([...de, ...en]);

// Get the current user language
let userLang = navigator.language || navigator.userLanguage;

ReactDOM.render(
	<MuiThemeProvider>
		<IntlProvider locale={userLang} messages={I18nMessageFactory.getMessages(userLang)}>
			<App/>
		</IntlProvider>
	</MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
