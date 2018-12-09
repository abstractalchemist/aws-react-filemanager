import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify, {  Auth, API } from 'aws-amplify'
import { withOAuth } from 'aws-amplify-react'
import { from } from 'rxjs'
import { flatMap, tap } from 'rxjs/operators'

Amplify.configure({
   Auth: {
      identityPoolId:'us-west-2:48fb86f8-fec9-4773-8169-4ef85d6a6442',
      region:'us-west-2',
      userPoolId:'us-west-2_d79JKtmxD',
      userPoolWebClientId:'ohaklnuai9tgugfiebspltevn',
      oauth: {
         domain:'panacea-testing.auth.us-west-2.amazoncognito.com',
         scope: ['profile', 'openid', 'email'],
         redirectSignIn: 'https://d271m28k61mkrh.cloudfront.net',
         redirectSignOut: 'https://d21m28k61mkrh.cloudfront.net',
         responseType: 'token'
      }


   },
   API: {
      endpoints: [
         {
            name:"test-gateway",
            endpoint:"https://nnqquz0b0g.execute-api.us-west-2.amazonaws.com/Prod",
            region: 'us-west-2'
         }
      ]
   }
})

class App extends Component {

   constructor(props) {
      super(props)
      this.state = {}
   }

   testcall() {
      from(Auth.currentCredentials())
         .subscribe(
            data => console.log(data))
      from(Auth.currentSession())
         .pipe(
            flatMap(session => 
               from(API.get('test-gateway', '/applications', {
               }))
            )
         )
         .subscribe(
            data => {
               console.log('application call complete')
               console.log(data)
            },
            error => {
               alert(error)
            },
            _ => {
               console.log('call complete')
            })
   }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={this.props.OAuthSignIn}>
          Sign in with AWS
          </button>
          <button onClick={this.testcall.bind(this)}>
          Trigger Call
          </button>
        </header>
      </div>
    );
  }
}

export default withOAuth(App);
