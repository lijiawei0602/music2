import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import './index.css';
import configStore from './stores';
import routes from './routes';
import registerServiceWorker from './registerServiceWorker';

let store = configStore();


ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            {routes}
        </HashRouter>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
