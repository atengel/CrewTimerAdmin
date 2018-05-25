import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import Util from './Util';
import firebase from 'firebase/app';
import fire from './fire';
import glogo from './images/btn_google_light_normal_ios.svg';
import logo from './logo.svg';

import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up';

class Login extends Component {
  state = {
    redirectToReferrer: false
  }

  handleLogin = (option) => {
    let provider = null;
    if (option === 'google') {
      provider = new firebase.auth.GoogleAuthProvider();
    } else if (option === 'facebook') {
      provider = new firebase.auth.FacebookAuthProvider();
    }
    //let component = this;
    fire.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      //var token = result.credential.accessToken;
      // The signed-in user info.
      // var user = result.user;
      // ...
    }).catch(function (error) {
      console.log("Sign in error: " + JSON.stringify(error));
      // An error happened.
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Step 2.
        // User's email already exists.
        // The pending Google credential.
        var pendingCred = error.credential;
        // The provider account's email address.
        var email = error.email;
        // Get registered providers for this email.
        firebase.auth().fetchProvidersForEmail(email).then(function (providers) {
          // Step 3.
          // If the user has several providers,
          // the first provider in the list will be the "recommended" provider to use.
          if (providers[0] === 'password') {
            // Asks the user his password.
            // In real scenario, you should handle this asynchronously.
            var password = firebase.auth().promptUserForPassword(); // TODO: implement promptUserForPassword.
            firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
              // Step 4a.
              return user.linkWithCredential(pendingCred);
            }).then(function () {
              // Google account successfully linked to the existing Firebase user.
              this.setState({ redirectToReferrer: true })
              //             firebase.auth().goToApp();
            });
            return;
          }
          // All the other cases are external providers.
          // Construct provider object for that provider.
          // TODO: implement getProviderForProviderId.
          //         var provider = firebase.auth().getProviderForProviderId(providers[0]);
          var provider = null;
          if (providers[0].indexOf('google') >= 0) {
            provider = new firebase.auth.GoogleAuthProvider();
          } else if (providers[0].indexOf('facebook') >= 0) {
            provider = new firebase.auth.FacebookAuthProvider();
          }
          // At this point, you should let the user know that he already has an account
          // but with a different provider, and let him validate the fact he wants to
          // sign in with this provider.
          // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
          // so in real scenario you should ask the user to click on a "continue" button
          // that will trigger the signInWithPopup.
          firebase.auth().signInWithPopup(provider).then(function (result) {
            // Remember that the user may have signed in with an account that has a different email
            // address than the first one. This can happen as Firebase doesn't control the provider's
            // sign in flow and the user is free to login using whichever account he owns.
            // Step 4b.
            // Link to Google credential.
            // As we have access to the pending credential, we can directly call the link method.
            result.user.linkWithCredential(pendingCred).then(function () {
              // Google account successfully linked to the existing Firebase user.
              //             firebase.auth().goToApp();
              this.setState({ redirectToReferrer: true })
            }).catch((reason) => { console.log("Account linking failed:", reason) });
          });
        });
      }
    });
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    // auth.signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
    //   this.setState({redirectToReferrer: true});
    // });
  }

  // See example at https://reacttraining.com/react-router/web/example/auth-workflow
  render() {
    const { from } = this.props.location.state || '/';
    const { redirectToReferrer } = this.props;

    return (
      <section>
        <div style={{ width: '100%', maxWidth: 700, margin: 'auto' }}>
          {redirectToReferrer && Util.isUserRegistered() ? (
            <Redirect to={from || '/'} />
          ) : Util.isUserSignedIn() ? (<Redirect to={'/register'} />) : null}
          {from && (
            <p>You must log in or Register</p>
          )}
          <table>
            <tr>
              <td>
                <IconButton label="Login with Google" tooltip="Login with Google" onTouchTap={this.handleLogin.bind(this, 'google')}>

                  <img src={glogo} alt="Login with Google" />
                </IconButton>
              </td>
              <td><div style={{ "marginLeft": "10px" }} onTouchTap={this.handleLogin.bind(this, 'google')}>Login with Google</div></td>
            </tr>
            <tr>
              <td>
                <IconButton label="Register with CrewTimer" tooltip="Register with CrewTimer" onTouchTap={() => this.props.history.replace('/register')}>
                  <img height="40px" width="40px" src={logo} alt="Register with CrewTimer" />
                </IconButton>
              </td>
              <td><div style={{ "marginLeft": "10px" }} onTouchTap={() => this.props.history.replace('/register')}>Register with CrewTimer</div></td>
            </tr>
            <tr>
              <td>
                <IconButton label="Donate" tooltip="Donate" onTouchTap={() => this.props.history.replace('/donate')}>
                  <ActionThumbUp/>
                </IconButton>
              </td>
              <td><div style={{ "marginLeft": "10px" }} onTouchTap={() => this.props.history.replace('/store')}>Visit the CrewTimer store.</div></td>
            </tr>
          </table>
        </div>
      </section>
    );
  }
}

export default Login;
