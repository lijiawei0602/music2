import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import App from '../containers/App.js';
import Music from '../containers/Music.js';
import Playlist from '../containers/Playlist.js';
import Top from '../containers/Top.js';
import Search from '../containers/Search.js';
import Mylist from '../containers/Mylist.js';
import History from '../containers/History';
import Comment from '../containers/Comment.js';
import Detail from '../components/Detail.js';

export default (
	<App>
		<Music>
				<Route exact path='/' component={Playlist}/>
				{/* <Redirect to="/playlist"></Redirect> */}
				<Route path="/playlist" component={Playlist}></Route>
				<Route exact path="/top" component={Top}></Route>
				<Route path="/search" component={Search}></Route>
				<Route exact path="/mylist" component={Mylist}></Route>
				<Route path="/history" component={History}></Route>
				<Route path="/comment/:id" component={Comment}></Route>
				<Route path='/top/detail/:id' component={Detail}/>
				<Route path='/mylist/detail/:id' component={Detail}></Route>
		</Music>
	</App>
);

// const AppCom = ({match}) => {
// 	<div>
// 		<Route path={`${match.url}/`} component={App}></Route>
// 		<Route path={`${match.url}/music`} component={MusicCom}></Route>
// 	</div>
// }

// const MusicCom = ({match}) => {
// 	<div>
// 		<Route path={`${match.url}/`} component={Music}></Route>
// 		<Route path={`${match.url}/playlist`} component={Playlist}></Route>
// 	</div>
// }