import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import SidebarAndChat from './components/Sidebar.js'
import SignUp from './pages/SignUp.js'
import SignIn from './pages/SignIn'
import { isAuthenticated } from './utils/handleToken.js';

export default function Routes(){

	const PrivateRoute = ({ render : Render, ...rest }) => (
		<Route
			{...rest}
			render={props =>
			isAuthenticated() ? (
					<Render {...props} />
			) : (
					<Redirect to={{ pathname: "/SignUp", state: { from: props.location } }} />
			)
			}
		/>
	);
	
	return(
		<BrowserRouter>
			<Switch>
				<PrivateRoute exact path='/' render={()=>
						<SidebarAndChat/>
				}/>

				<Route path='/signUp' component={SignUp}/>
				<Route path='/signIn' component={SignIn}/>
			</Switch>
		</BrowserRouter>
	)
}