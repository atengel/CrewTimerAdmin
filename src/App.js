import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RegattaList from './RegattaList';
import RegattaEdit from './RegattaEdit';
import ResultsEdit from './ResultsEdit';
import EventResults from './EventResults';
import About from './About';
import Help from './Help';
import Store from './Store';
import StoreComplete from './StoreComplete';
import Contact from './Contact';
import Login from './Login';
import Register from './Register';
import Donate from './Donate';
import Page404 from './Page404.js';
import Util from './Util';
import { Redirect, Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Nav from './Nav';

import './App.css';
import { blue300, blue700 } from 'material-ui/styles/colors';

// https://stackoverflow.com/questions/25646502/how-to-render-repeating-elements
// See sites/examples/ExamplesPage.js for how container is resized

// firebase deploy: https://www.codementor.io/yurio/all-you-need-is-react-firebase-4v7g9p4kf

// https://medium.com/@liangchun/using-react-toolbox-with-create-react-app-f4c2a529949

// material-ui with create-react-app: https://stackoverflow.com/questions/44192576/use-create-react-app-with-material-uihttps://github.com/firebase/functions-samples/tree/master/quickstarts/uppercase

// mobile detect: https://github.com/hgoebl/mobile-detect.js/

// themes: http://www.material-ui.com/#/customization/themes

const muiTheme = getMuiTheme({
  palette: {
    // rgba
    primary1Color: blue300,
    primary2Color: blue700
  },
  appBar: {
    height: 50,
    color: '#ffffff',
    textColor: '#6c7d96'
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      uid: null
    };

    Util.initializeAppUtilities();
    Util.onAuthStateChange(function (user) {
      this.setState({ user: user });
    }.bind(this));
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <Router>
            <div>
              <PropsRoute component={Nav} authenticated={Util.isUserSignedIn()} />
              <Switch>
                <PrivateRoute exact path="/" component={RegattaList} />
                <PropsRoute path="/results-edit/" edit={true} component={EventResults} onRegattaUpdated={this.onRegattaSelected}/>
                <PrivateRoute exact path="/list" component={RegattaList} />
                <PrivateRoute path="/edit/" component={RegattaEdit} />
                <PrivateRoute path="/results-edit-old/" component={ResultsEdit} />
                <PropsRoute exact path="/login" component={Login} redirectToReferrer={this.state.user != null} />
                <PropsRoute exact path="/register" component={Register} />
                <PropsRoute path="/help" component={Help} />
                <PropsRoute path="/store-complete" component={StoreComplete} />
                <PropsRoute path="/store" component={Store} />
                <PropsRoute exact path="/about" component={About} />
                <PropsRoute exact path="/contact" component={Contact} />
                <PropsRoute exact path="/donate" component={Donate} />
                <Route component={Page404} />
              </Switch>
            </div>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

// See http://bodiddlie.github.io/firebase-auth-with-react-router/
// https://reacttraining.com/react-router/web/example/auth-workflow
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Util.isUserRegistered() ? (
      <Component {...props} />
    ) : Util.isAuthInitialized() ? (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
    ) : null
  )} />
)

// https://github.com/ReactTraining/react-router/issues/4105
const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }} />
  );
}

export default App;
