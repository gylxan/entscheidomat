import React from 'react';
import SingleList from "./scenes/Single/SingleList";
import './App.css'


/**
 * Main App with router to show correct page
 */
const App = () => {
	return (
		<div className="App">
			<SingleList/>
		</div>
	);
};
export default App;
