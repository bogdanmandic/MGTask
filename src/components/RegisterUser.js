import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Card, CardSection, Input, Spinner } from './common';
import { hex_md5 } from '../../helpers/md5';
import RNFB from 'react-native-fetch-blob';


export default class RegisterUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      surname: '',
      email: '',
      password: '',
      error: '',
    };
  }

  registerUser() {
    const keys = Object.keys(this.state);
    const values = Object.values(this.state);
    // console.log(Object.keys(this.state))
    // console.log(Object.values(this.state))
    const { firstname, surname, email, password } = this.state;
    if (email === '' || password === '') {
      alert('Email and password are mandatory!');
    } else {
      const formData = new FormData();
      const hashPass = hex_md5(password);
      formData.append("firstname", firstname);
      formData.append("surname", surname);
      formData.append("email", email);
      formData.append("password", hex_md5(password));
      console.log(formData);

      fetch('http://www.cduppy.com/salescms/?a=ajax&do=registerUser&languageId=1&projectId=5&token=1234567890', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        console.log(response)
        res = JSON.parse(response._bodyText);
        res.hasOwnProperty("userId") ?
          this.setState({ error: `You have successfully registered an account!`, firstname: '', surname: '', email: '', password: '' }) :
          this.setState({ error: res.resultText.toUpperCase() })
      })
        .catch(error => console.log(error));

      console.log(`${firstname} ${surname} => ${email} : ${hex_md5(password)}`);
    }
  }

  render() {
    return (
      <Card>
        <CardSection>
          <Input
            label="First Name"
            placeholder="First Name"
            value={this.state.firstname}
            onChangeText={firstname => this.setState({ firstname })}
          />
        </CardSection>

        <CardSection>
          <Input
            label="Surname"
            placeholder="Surname"
            value={this.state.surname}
            onChangeText={surname => this.setState({ surname })}
          />
        </CardSection>

        <CardSection>
          <Input
            label="Email *"
            placeholder="your_email@email.com"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
        </CardSection>

        <CardSection>
          <Input
            label="Password *"
            placeholder="password"
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            secureTextEntry
          />
        </CardSection>

        <Text style={styles.errorTextStyle}>{this.state.error}</Text>

        <CardSection>
          <Button
            onPress={this.registerUser.bind(this)}
          // disabled={this.state.emailExist}
          >
            Register
          </Button>
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