import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import { isAuthenticated } from './utils/handleToken.js';
import { Main } from './pages/Main/index.js';
import { StatusProvider } from './contexts/StatusContext';
import { RoomsProvider } from './contexts/RoomsContext';

export default function Routes(){

	const PrivateRoute = ({ render : Render, ...rest }) => (
		<Route
			{...rest}
			render={props => isAuthenticated() ? (
				<Render {...props} />
			) : (
				<Redirect to={{ pathname: "/SignUp", state: { from: props.location } }} />
			)}
		/>
	);
	
	return(
		<BrowserRouter>
			<Switch>
				<PrivateRoute exact path='/' render={() => (
					<RoomsProvider>
						<StatusProvider>
							<Main/>
						</StatusProvider>
					</RoomsProvider>
				)}/>

				<Route path='/signUp' component={SignUp}/>
				<Route path='/signIn' component={SignIn}/>
			</Switch>
		</BrowserRouter>
	)
}