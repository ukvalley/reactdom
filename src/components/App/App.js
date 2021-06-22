import React from 'react';
import Register from './register';
import Upgrade from './upgrade';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Componant {
	render(){
		Return{
			<>
			<Router>
			<Link to="">Home</link>
			<Link to="/about">About</link>
			<Link to="/contact">Contact</link>
			</Router>
			</>
		}
	}
}