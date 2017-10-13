import React from 'react';
import SingleList from "./scenes/Single/SingleList";
import GroupLists from "./scenes/Groups/GroupLists";
import {BrowserRouter, Route, Switch} from "react-router-dom";


/**
 * Main App with router to show correct page
 */
const App = () => {
	return (
		<div className="container" style={{paddingTop: "10px"}}>
			<BrowserRouter>
				<Switch>
					<Route path="/groups" component={GroupLists}/>
					<Route component={SingleList}/>
				</Switch>
			</BrowserRouter>
		</div>
	);
};
export default App;
