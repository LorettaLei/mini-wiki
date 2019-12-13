import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import {Provider} from "react-redux"; 

import store from './redux'

import Layout from './components/layout'
import Index from './pages/index'
import Editor from './pages/editor'
import Login from './pages/login'
import User from './pages/user'
import Menu from './pages/menu'
import Log from './pages/log'
import Setting from './pages/setting'
import NoMatch from './pages/404'

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Switch>
          <Route exact path="/login" component={Login}/>
          <Layout>
            <Switch>
              <Route exact path="/sys" component={Index}></Route>
              <Route exact path="/sys/" component={Index}></Route>
              <Route exact path="/sys/index" component={Index}></Route>
              <Route exact path="/sys/editor" component={Editor}></Route>
              <Route exact path="/sys/user" component={User}></Route>
              <Route exact path="/sys/menu" component={Menu}></Route>
              <Route exact path="/sys/setting" component={Setting}></Route>
              <Route exact path="/sys/log" component={Log}></Route>
            </Switch>
          </Layout>
          <Route exact path="/*" component={NoMatch}></Route>
        </Switch>
      </HashRouter>
    </Provider>
  );
}

export default App;
