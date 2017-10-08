import React from 'react';
import FontAwesome from "react-fontawesome";
import {FormattedMessage} from "react-intl";
import "./NotFound.css";

/**
 * Shows the page for non existing sites
 */
class NotFoundPage extends React.Component {
	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="error-template" style={{textAlign: "center"}}>
							<h1>Oops!</h1>
							<h2>404 <FormattedMessage id="sites.notfound.title"/></h2>
							<div className="error-details">
								<FormattedMessage id="sites.notfound.details"/>
							</div>
							<div className="error-actions margin-top-10px">
								<a href="/" className="btn btn-primary btn-lg"><FontAwesome name="home"/>
									<FormattedMessage id="sites.notfound.button"/> </a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default NotFoundPage;