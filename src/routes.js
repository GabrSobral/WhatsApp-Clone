import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import { isAuthenticated } from './utils/handleToken.js';
import { Main } from './pages/Main/index.js';
import { UsersProvider } from './contexts/UsersContext';
import { StatusProvider } from './contexts/StatusContext';

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
					<UsersProvider>
						<StatusProvider>
							<Main/>
						</StatusProvider>
					</UsersProvider>
				)}/>

				<Route path='/signUp' component={SignUp}/>
				<Route path='/signIn' component={SignIn}/>
			</Switch>
		</BrowserRouter>
	)
}