import React, { Component } from 'react';
import { View, Text, NetInfo, Alert } from 'react-native';
import { Header, Button, Spinner } from './src/components/common';
import md5 from './helpers/md5';
import RNFB from 'react-native-fetch-blob';
import LoginForm from './src/components/LoginForm';
import ForgotPassword from './src/components/ForgotPassword';
import ChangePassword from './src/components/ChangePassword';
import RegisterUser from './src/components/RegisterUser';



export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: null,
      isConnected: false,
      allUsers: '',
      newUsers: '',
    };
  }

  getAllUsers() {
    let dirs = RNFB.fs.dirs;
    const allUsersJsonURL = 'http://www.cduppy.com/salescms/?a=ajax&do=getUsers&languageId=1&projectId=5&token=1234567890';
    const pathToAllUsersJson = dirs.DocumentDir + '/allUsers.json';

    ifJsonExists = () => {
      return new Promise((resolve, reject) => {
        RNFB.fs.exists(pathToAllUsersJson)
          .then(res => {
            if (!res) {
              console.log('Uso u if')
              getNewJson();
            } else {
              console.log('Uso u else')
              compareJsonsLastChanges();
            }
          })
          .then(() => resolve())
          .catch(error => console.log(error))
      })
    }

    getNewJson = () => {
      return new Promise((resolve, reject) => {
        RNFB.config({
          path: pathToAllUsersJson
        })
        .fetch('GET', allUsersJsonURL)
          .then(res => console.log(res.path()))
          .then(() => resolve())
          .catch(error => console.log(error))
      })
    }

    compareJsonsLastChanges = () => {
      return new Promise((resolve, reject) => {
        let newUsers = {};
        fetch(allUsersJsonURL)
          .then(res => res.json())
          .then(data => {  newUsers = data })
          .then(() => console.log(newUsers))
          .then(() =>  RNFB.fs.readFile(pathToAllUsersJson, 'utf8'))
          .then(res => global.allUsers = JSON.parse(res))
          .then(() => {
            if (newUsers.lastChanges !== global.allUsers.lastChanges) {
              console.log(newUsers.lastChanges)
              console.log(global.allUsers.lastChanges)
              getNewJson();
            }
          })
          .then(() => resolve())
          .catch(error => console.log(error));
      })
    }
    asd = () => {
      RNFB.fs.readFile(pathToAllUsersJson, 'utf8')
      .then(res => console.log(res))
    }
    ifJsonExists();
    // asd();
  }

  componentWillMount() {
    NetInfo.isConnected.fetch()
      .then(res => {
        this.setState(() => ({ isConnected: res }));
        return Promise.resolve();
      })
      .then(() => this.getAllUsers())
      .catch(err => console.log(err));
    
  }


  render() {
    return (
      <View style={{ height: 120 }}>
        <Header headerText='Authentication' />
        <LoginForm />
        {/* <ForgotPassword /> */}
        {/* <ChangePassword /> */}
        {/* <RegisterUser /> */}
      </View>
    )
  }
}