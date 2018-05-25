import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import Util from './Util';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import firebase from 'firebase/app';
import fire from './fire';
import glogo from './images/btn_google_light_normal_ios.svg';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      stepIndex: 0,
      affiliationErrorText: null
    }
    this.onChange = this.onChange.bind(this);
    this.onRegisterClicked = this.onRegisterClicked.bind(this);
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onRegisterClicked = (event) => {
    let error = !this.state.ClubAffiliation;
    if (error) {
      this.setState({ affiliationErrorText: error ? "This field is required" : null });
    }
    else {
      Util.registerUser({ 'ClubAffiliation': this.state.ClubAffiliation,
                          'Phone' : this.state.Phone
                         })
        .then(() => {
          // stop registering animation
        })
        .catch((reason) => {
          // stop registering animation
          console.log("Error setting user: " + reason);
        });
    }
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
      var user = result.user;

      console.log(user);
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
    console.log("rendering register");
    const contentStyle = { margin: '0 16px' };
    //    const {finished, stepIndex} = this.state;
    const stepIndex = Util.isUserRegistered() ? 2 : Util.isUserSignedIn() ? 1 : 0;
    return (
      <section>
        <div style={{ width: '100%', maxWidth: 700, margin: 'auto' }}>
          <Stepper activeStep={stepIndex}>
            <Step>
              <StepLabel>Login with Google account</StepLabel>
            </Step>
            <Step>
              <StepLabel>Provide Registration Data</StepLabel>
            </Step>
            <Step>
              <StepLabel>Registration Complete</StepLabel>
            </Step>
          </Stepper>
          <div style={contentStyle}>
            {stepIndex === 0 ? (<div><p>CrewTimer uses google authentication to protect your account.
              Please click on the Google icon below to begin your registration process.</p>
              <table>
                <tr>
                  <td>
                    <IconButton label="Login with Google" tooltip="Login with Google" onTouchTap={this.handleLogin.bind(this, 'google')}>

                      <img src={glogo} alt="Login with Google" />
                    </IconButton>
                  </td>
                  <td><div style={{ "marginLeft": "10px" }}>Login with Google</div></td>
                </tr>
              </table>
            </div>) :
              stepIndex === 1 ? (<div><p>Please provide a bit of information about your planned use of CrewTimer</p>
                <TextField name="ClubAffiliation" floatingLabelText="Rowing Club Affiliation" errorText={this.state.affiliationErrorText} onChange={this.onChange} />
                <br />
                <TextField name="Phone" floatingLabelText="Contact Phone Number" onChange={this.onChange} />
              
                <br />
                <RaisedButton label="Register" onTouchTap={this.onRegisterClicked} />
              </div>) :
                (<p>Welcome! You have sucessfully registered with CrewTimer.  You can now begin
                  setting up your regatta configuration by clicking on the CrewTimer logo at the 
                  top of the page or visiting <a href='https://admin.crewtimer.com'>https://admin.crewtimer.com</a>.</p>)}
          </div>
        </div>
      </section>
    );
  }
}

export default Register;
