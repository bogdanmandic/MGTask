import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Card, CardSection, Input, Spinner } from './common';

// Marko mora da sredi za konekciju sa netom da l cemo preko props ili ponovo willMount

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      error: '',

    };
  }

  forgotPassword() {
    users = global.allUsers.users;
    user = users.find(({ email }) => {
      return this.state.email === email;
    })
    if (user) {
      
      const formData = new FormData();
      formData.append("email", this.state.email);
        fetch('http://www.cduppy.com/salescms/?a=ajax&do=passwordforgetUser&languageId=1&projectId=5&token=1234567890', {
          method: 'POST',
          body: formData
        })
          .then(res => console.log(res))
          .catch(error => console.log(error));
      
      this.setState({ error: 'Email exists, proceed!' });
    } else {
      this.setState({ error: 'Email does not exist!' });
    }
  }

  render() {
    return (
      <Card>
        <CardSection>
          <Input
            label="Email"
            placeholder="your_email@test-magna.com"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            keyboardType="email-address"
          />
        </CardSection>

        <Text style={styles.errorTextStyle}>{this.state.error}</Text>

        <CardSection>
          <Button
            onPress={this.forgotPassword.bind(this)}
          // disabled={this.state.emailExist}
          >
            Reset Password
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