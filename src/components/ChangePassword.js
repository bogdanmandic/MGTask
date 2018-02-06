import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Card, CardSection, Input, Spinner } from './common';
import { hex_md5 } from '../../helpers/md5';

// Marko mora da sredi za konekciju sa netom da l cemo preko props ili ponovo willMount

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      oldpassword: '',
      newpassword: '',
      error: '',
    };
  }

  changePassword() {
    const users = global.allUsers.users;
    let hashPass = hex_md5(this.state.oldpassword);
    user = users.find(({ email, password }) => {
      return email === this.state.email && password === hashPass
    });
    if (user) {
      const formData = new FormData();
      formData.append("email", this.state.email);
      formData.append("oldpassword", hashPass);
      formData.append("newpassword", hex_md5(this.state.newpassword));

      fetch('http://www.cduppy.com/salescms/?a=ajax&do=passwordUser&languageId=1&projectId=5&token=1234567890', {
        method: 'POST',
        body: formData
      })
        .then(response => {
          console.log(response)
          res = JSON.parse(response._bodyText);
          res.hasOwnProperty("userId") ?
            this.setState({ error: res.resultText.toUpperCase(), email: '', oldpassword: '', newpassword: '' }) :
            this.setState({ error: res.resultText.toUpperCase() })
        })
        .then()
        .catch(error => console.log(error));
    } else {
      this.setState({ error: 'User not found!' });
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
            onChangeText={email => this.setState({ email })}
            keyboardType="email-address"
          />
        </CardSection>

        <CardSection>
          <Input
            label="Old Password"
            placeholder="password"
            value={this.state.oldpassword}
            onChangeText={oldpassword => this.setState({ oldpassword })}
            secureTextEntry
          />
        </CardSection>

        <CardSection>
          <Input
            label="New Password"
            placeholder="password"
            value={this.state.newpassword}
            onChangeText={newpassword => this.setState({ newpassword })}
            secureTextEntry
          />
        </CardSection>

        <Text style={styles.errorTextStyle}>{this.state.error}</Text>

        <CardSection>
          <Button
            onPress={this.changePassword.bind(this)}
          >
            Change Password
          </Button>
        </CardSection>
      </Card>
    )
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  }
}