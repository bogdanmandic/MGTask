import React, { Component } from 'react';
import { Button, Card, CardSection, Input, Spinner } from './common';
import { Text, Alert, NetInfo, AsyncStorage } from 'react-native';
import axios from 'axios';
import { hex_md5 } from '../../helpers/md5';
import RNFB from 'react-native-fetch-blob';




export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      isChecked: true,
      isConnected: false,
      userId: '',
    };
  }

  componentWillMount() {
    NetInfo.isConnected.fetch()
      .then(res => {
        this.setState(() => ({ isConnected: res }));
        return Promise.resolve();
      })
      .then(() => { console.log(this.state.isConnected) })
      .catch(err => console.log(err));
  }


  renderAuth() {
    if (this.state.userId.length > 0) {
      return (
        <Button onPress={this.logOut.bind(this)} >
          Log Out
        </Button>
      );
    } else {
      return (
        <Button
          onPress={this.logIn.bind(this)}
          disabled={this.state.isChecked}
        >
          Log In
        </Button>
      );
    }
  }
  /*
    setLoggedUser(userId) {
      console.log('usao u setloggeduser')
      AsyncStorage.setItem('@userId', userId);
      console.log('Success write to AsyncStorage');
    }
  
    async getLoggedUser() {
      try {
        let userId = await AsyncStorage.getItem('@userId');
        alert(key);
      } catch (error) {
        alert(error);
      }
    }
  */

  logIn() {
    // console.log(global.allUsers.users);
    const hashPass = hex_md5(this.state.password);
    const users = global.allUsers.users;

    if (this.state.isConnected === false) {
      user = users.find(({ email, password }) => {
        return email === this.state.email && password === hashPass
      });
      if (user === undefined) {
        this.setState({ error: 'Wrong credentials!' })
      } else {
        this.setState({ userId: user.userId, error: 'Welcome to our app from locale, userId ' + user.userId });
      }
    } else {
      let formData = new FormData();
      formData.append("email", this.state.email);
      formData.append("password", hashPass);
      console.log(formData);
      fetch('http://www.cduppy.com/salescms/?a=ajax&do=loginUser&languageId=1&projectId=5&token=1234567890', {
        method: 'POST',
        body: formData
      })
        .then(response => {
          res = JSON.parse(response._bodyText);
          res.hasOwnProperty("userId") ?
            this.setState({ userId: res.userId, error: `Welcome to our app from Internet user ${res.userId}.` }) :
            this.setState({ error: 'Wrong credentials from Internet!' })
        })
        .catch(error => this.setState({ error }));
    }
  }

  logOut() {
    this.setState({
      userId: '',
      error: 'You successfully logged out!',
      email: '',
      password: ''
    });
  }


  enableLogin() {
    const { email, password } = this.state;
    if (email !== '' && password !== '') {
      this.setState({ isChecked: false });
    } else if (email === '' || password === '') {
      this.setState({ isChecked: true });
    } else {
      this.setState({ isChecked: true })
    }
  }

  render() {
    return (
      <Card>
        <CardSection>
          <Input
            label="Email"
            placeholder="your_email@email.com"
            value={this.state.email}
            onChangeText={email => { this.enableLogin(); this.setState({ email }) }}
          />
        </CardSection>

        <CardSection>
          <Input
            placeholder="password"
            label="Password"
            value={this.state.password}
            onChangeText={password => { this.enableLogin(); this.setState({ password }) }}
            secureTextEntry
          />
        </CardSection>

        <Text style={styles.errorTextStyle}>{this.state.error}</Text>

        <CardSection>
          {this.renderAuth()}
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