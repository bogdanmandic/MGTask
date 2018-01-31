import React, { Component } from 'react';
import { Button, Card, CardSection, Input, Spinner } from './common';
import { Text } from 'react-native';
import firebase from 'firebase';
import axios from 'axios';


export default class LoginForm extends Component {
  state = {
    email: '',
    password: '',
    error: '',
    isLoading: false
  };

  onButtonPress() {
    this.setState({ error: '', isLoading: true })
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.onLoginSuccess.bind(this))
      .catch(() => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(this.onLoginSuccess.bind(this))
          .catch(this.onLoginFail.bind(this));
      })
    /*
    fetch('http://localhost:3000/v1/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        username, 
        password
      })
    })
      .then(res => console.log(res))
      .catch(err => console.log(err.message));
  }
  */
  }

  onLoginFail() {
    this.setState({
      error: 'Authentication Failed!',
      isLoading: false
    });
  }

  onLoginSuccess() {
    this.setState({ 
      email: '',
      password: '',
      isLoading: false,
      error: '',
    });
  }

  renderButton() {
    if (this.state.isLoading) {
      return <Spinner size="small" />
    }

    return (
      <Button onPress={this.onButtonPress.bind(this)}>
        Log In
      </Button>
    );
  }


  render() {
    return (
      <Card>
        <CardSection>
          <Input
            label="Email"
            placeholder="user@gmail.com"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}

          />
        </CardSection>

        <CardSection>
          <Input
            placeholder="password"
            label="Password"
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            secureTextEntry
          />
        </CardSection>

        <Text style={styles.errorTextStyle}>{this.state.error}</Text>

        <CardSection>
          {this.renderButton()}
        </CardSection>
      </Card>
    );
  }
}


const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  }
}