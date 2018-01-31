import React, { Component } from 'react';
import { View } from 'react-native';
import firebase from 'firebase';
import { Header, Button, Spinner } from './src/components/common';
import LoginForm from './src/components/LoginForm';



export default class App extends Component {
  state = {
    isLoggedIn: null,
  }

  componentWillMount() {
    firebase.initializeApp({
      apiKey: 'AIzaSyDiCd9BCsoKsjf1pobZhSVCjndeuuZyB0E',
      authDomain: 'bogi-auth.firebaseapp.com',
      databaseURL: 'https://bogi-auth.firebaseio.com',
      projectId: 'bogi-auth',
      storageBucket: 'bogi-auth.appspot.com',
      messagingSenderId: '996958274385'
    });
  
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ isLoggedIn: true})
      } else {
        this.setState({ isLoggedIn: false })
      }
    });

  }


  renderContent() {
    switch(this.state.isLoggedIn) {
      case true:
        return (
          <Button 
            onPress={() => firebase.auth().signOut()}>
            Log Out
          </Button>
        );
      break;
      case false:
        return <LoginForm />;
      break;
      default:
        return <Spinner />;
    }
  }

  render() {
    return (
      <View style={{ height: 120 }}>
        <Header headerText='Authentication' />
        {this.renderContent()}
      </View>
    )
  }
}