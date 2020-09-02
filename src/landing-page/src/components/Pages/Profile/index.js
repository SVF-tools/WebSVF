import React, { Component } from 'react';

import './Profile.scss';

import TextField from '@material-ui/core/TextField';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

import { db } from '../../../services/firebase';
import { auth } from '../../../services/firebase';
import { storage } from '../../../services/firebase';

class Text extends Component {
  render() {
    var text = this.props.text || '';
    return <div>{text}</div>;
  }
}

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      email: null,
      username: null,
      photoUrl: null,
      readError: null,
      writeError: null,
      image: null,
      progress: 0,
      usernameEditable: false,
      emailEditable: false,
      passwordEditable: false,
      photoEditable: false,
      error: null,
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleUsernameCancel = this.handleUsernameCancel.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleEmailCancel = this.handleEmailCancel.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordCancel = this.handlePasswordCancel.bind(this);
    this.handlePhotoChange = this.handlePhotoChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleimageChange = this.handleimageChange.bind(this);
    this.handlePhotoStateChange = this.handlePhotoStateChange.bind(this);
  }

  async writeUserData(userId, name, email) {
    try {
      await db.ref('users/' + userId).update({
        email: email,
        name: name,
      });
      this.refreshUserDetails();
      return true;
    } catch (error) {
      this.refreshUserDetails();
      return false;
    }
  }

  //Username Callback
  handleUsernameCancel(e) {
    e.preventDefault();
    this.setState({
      usernameTemp: '',
      usernameEditable: !this.state.usernameEditable,
    });
  }
  async handleUsernameChange(e) {
    e.preventDefault();
    if (this.state.usernameEditable) {
      if (
        typeof this.state.usernameTemp !== 'undefined' &&
        this.state.usernameTemp !== ''
      ) {
        try {
          var success = await this.writeUserData(
            this.state.user.uid,
            this.state.usernameTemp,
            this.state.email
          );

          if (success) {
            this.setState({
              error: 'Successfully changed Username',
            });
          } else {
            throw new Error('Could not set Username, try again later.');
          }
        } catch (error) {
          console.log(error);
          this.setState({
            error: error,
          });
        }
        this.setState({ usernameTemp: '' });
      } else {
        this.setState({
          error: 'Username cannot be empty.',
        });
      }
    }
    this.setState({
      usernameEditable: !this.state.usernameEditable,
    });
  }
  handleimageChange = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({ image }));
    }
  };
  handlePhotoChange = () => {
    const { image } = this.state;
    try {
      const uploadTask = storage.ref('ProfilePhoto/' + this.state.user.uid);
      uploadTask.put(image).on(
        'state_changed',
        (snapshot) => {
          // progrss function ....
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        (error) => {
          // error function ....
          console.log(error);
        },
        async () => {
          // complete function ....
          await storage
            .ref('ProfilePhoto')
            .child(this.state.user.uid)
            .getDownloadURL()
            .then((url) => {
              this.setState({
                url: url,
                error: 'The profile image was uploaded successfully.',
              });
            })
            .catch((error) => {});
          if (this.state.url) {
            await db.ref(`users/${this.state.user.uid}`).update({
              profilePic: this.state.url,
            });
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  };
  //Email Callback
  handleEmailCancel(e) {
    e.preventDefault();
    this.setState({
      emailTemp: '',
      emailEditable: !this.state.emailEditable,
    });
  }
  async handleEmailChange(e) {
    e.preventDefault();
    if (this.state.emailEditable) {
      if (
        typeof this.state.emailTemp !== 'undefined' &&
        this.state.emailTemp !== ''
      ) {
        try {
          await this.state.user.updateEmail(this.state.emailTemp);
          this.writeUserData(
            this.state.user.uid,
            this.state.username,
            this.state.emailTemp
          );
          this.setState({
            error: 'Successfully changed Email.',
          });
        } catch (error) {
          this.setState({
            error: error.message + ' Email was not changed.',
          });
          console.log(error);
        }

        this.setState({ emailTemp: '' });
      } else {
        this.setState({
          error: 'Email cannot be empty.',
        });
      }
    }

    this.setState({
      emailEditable: !this.state.emailEditable,
    });
  }

  //Password Callback
  handlePasswordCancel(e) {
    e.preventDefault();
    this.setState({
      passwordEditable: !this.state.passwordEditable,
    });
  }
  async handlePasswordChange(e) {
    e.preventDefault();

    if (this.state.passwordEditable) {
      if (
        typeof this.state.passwordTemp !== 'undefined' &&
        this.state.passwordTemp !== ''
      ) {
        if (this.state.passwordTemp === this.state.confirmPassTemp) {
          try {
            await this.state.user.updatePassword(this.state.passwordTemp);
            this.setState({
              error: 'Successfully changed Password.',
            });
          } catch (error) {
            console.log(error);
            var errorMessage = error.message + '. Password was not changed.';
            this.setState({
              error: errorMessage,
            });
          }
        } else {
          this.setState({
            error: "Password and Confirmation fields aren't equal.",
          });
          console.log("Both fields aren't equal.");
        }
      } else {
        this.setState({
          error: 'Password cannot be empty',
        });
        console.log('Password cannot be empty');
      }
    }
    this.setState({
      passwordTemp: '',
      passwordEditable: !this.state.passwordEditable,
    });
  }

  //Store the value in a temp variable when textInput changes
  handleChange(evt, name) {
    const text = evt.target.value;
    this.setState(() => ({ [name]: text }));
  }
  handlePhotoStateChange(e) {
    e.preventDefault();
    this.setState({
      photoEditable: !this.state.photoEditable,
    });
  }
  //Refreshes the user details by pulling new data from the database

  async refreshUserDetails() {
    this.setState({ readError: null });

    try {
      db.ref(`users/${this.state.user.uid}`).once('value', (snapshot) => {
        this.setState({
          email: snapshot.val().email,
          username: snapshot.val().name ? snapshot.val().name : null,
        });
      });

      const exists = await storage
        .ref('ProfilePhoto')
        .child(this.state.user.uid)
        .listAll();

      if (exists.items.length !== 0) {
        const url = await storage
          .ref('ProfilePhoto')
          .child(this.state.user.uid)
          .getDownloadURL();

        console.log(url);
        this.setState({ url });
      }
    } catch (error) {
      this.setState({ readError: error.message });
    }
  }

  componentDidMount() {
    this.refreshUserDetails();
  }

  render() {
    var usernameTextRender,
      emailTextRender,
      passwordTextRender,
      crossRender,
      errorText,
      confirmPassword,
      passwordConfirmTextbox,
      photo,
      photoRender;
    crossRender = <FontAwesomeIcon icon={faTimes} aria-hidden="true" />;
    errorText = <Text text={this.state.error} />;
    confirmPassword = 'CONFIRM PASSWORD';

    //username
    if (this.state.usernameEditable) {
      usernameTextRender = (
        <div>
          <TextField
            style={{
              fontSize: 16,
              height: 35,
              borderColor: 'gray',
              borderWidth: 1,
              width: '95%',
            }}
            defaultValue={this.state.username}
            onChange={(event) => this.handleChange(event, 'usernameTemp')}
          />
        </div>
      );
    } else {
      usernameTextRender = (
        <div>
          <Text text={this.state.username} />
        </div>
      );
    }

    //Email
    if (this.state.emailEditable) {
      emailTextRender = (
        <div>
          <TextField
            style={{
              fontSize: 16,
              height: 35,
              borderColor: 'gray',
              borderWidth: 1,
              width: '95%',
            }}
            defaultValue={this.state.email}
            onChange={(event) => this.handleChange(event, 'emailTemp')}
          />
        </div>
      );
    } else {
      emailTextRender = (
        <div>
          <Text text={this.state.email} />
        </div>
      );
    }

    //Password
    if (this.state.passwordEditable) {
      passwordTextRender = (
        <div>
          <TextField
            style={{
              fontSize: 16,
              height: 35,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 5,
              marginTop: 5,
              width: '95%',
            }}
            type="password"
            onChange={(event) => this.handleChange(event, 'passwordTemp')}
          />
        </div>
      );
      passwordConfirmTextbox = (
        <div>
          <TextField
            style={{
              fontSize: 16,
              height: 35,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 5,
              marginTop: 5,
              width: '95%',
            }}
            type="password"
            onChange={(event) => this.handleChange(event, 'confirmPassTemp')}
          />
        </div>
      );
      confirmPassword = (
        <h3>
          PASSWORD <br />
          CONFIRM PASSWORD
        </h3>
      );
    } else {
      passwordTextRender = (
        <div>
          <Text
            style={{
              marginBottom: 5,
              marginTop: 5,
            }}
            text="************"
          />
        </div>
      );
      passwordConfirmTextbox = '';
      confirmPassword = <h3>PASSWORD</h3>;
    }
    //Profile photo
    if (this.state.photoEditable) {
      photoRender = (
        <div>
          <progress value={this.state.progress} max="100" />
          <br />
          <input type="file" onChange={this.handleimageChange} />
          <button onClick={this.handlePhotoChange}>Upload</button>
          <br />
        </div>
      );
    } else {
      photoRender = (
        <div className="content">
          <h4>Add a photo to personalise your account</h4>
        </div>
      );
    }

    if (this.state.url != null) {
      photo = (
        <img
          className="photo-icon"
          src={this.state.url}
          alt="Uploaded images"
        />
      );
    } else {
      photo = (
        <div className="name-icon">
          {this.state.username != null ? this.state.username.charAt(0) : ''}
        </div>
      );
    }

    return (
      <div id="profile">
        <div className="content-wrap">
          {photo}
          <h1>
            Welcome,{' '}
            {this.state.username != null
              ? this.state.username
              : this.state.email}
          </h1>
          <h2>Manage your information to make WebSVF work better for you</h2>
          <div className="card">
            <div className="inner-heading">Profile</div>
            <div className="info">
              <h3>PHOTO</h3>
              <div className="content">{photoRender}</div>
              <div className="icon" onClick={this.handlePhotoStateChange}>
                {photo}
                <div className="photo">
                  <svg
                    data-v-d223ba98=""
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="camera"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="svg-inline--fa fa-camera fa-w-16"
                    style={{ fontSize: '17px' }}
                  >
                    <path
                      data-v-d223ba98=""
                      fill="currentColor"
                      d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z"
                      className=""
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="info">
              <h3>EMAIL</h3>
              <div className="content">{emailTextRender}</div>
              <div onClick={this.handleEmailCancel}>
                <b>{this.state.emailEditable ? crossRender : ''}</b>
              </div>
              <div className="popup" onClick={this.handleEmailChange}>
                <svg
                  data-v-d223ba98=""
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="close"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="svg-inline--fa fa-close fa-w-16"
                >
                  <path
                    data-v-d223ba98=""
                    fill="currentColor"
                    d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"
                    className=""
                  ></path>
                </svg>
              </div>
            </div>
            <div className="info">
              <h3>USERNAME</h3>
              <div className="content">{usernameTextRender}</div>
              <div onClick={this.handleUsernameCancel}>
                <b>{this.state.usernameEditable ? crossRender : ''}</b>
              </div>
              <div className="popup" onClick={this.handleUsernameChange}>
                <svg
                  data-v-d223ba98=""
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="pen"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="svg-inline--fa fa-pen fa-w-16"
                >
                  <path
                    data-v-d223ba98=""
                    fill="currentColor"
                    d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"
                    className=""
                  ></path>
                </svg>
              </div>
            </div>
            <div className="info" style={{ borderBottom: 'none' }}>
              {confirmPassword}
              <div className="content">
                <div className="content" type="password">
                  {passwordTextRender}
                  {passwordConfirmTextbox}
                </div>
              </div>
              <div onClick={this.handlePasswordCancel}>
                <b>{this.state.passwordEditable ? crossRender : ''}</b>
              </div>
              <div className="popup" onClick={this.handlePasswordChange}>
                <svg
                  data-v-d223ba98=""
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="pen"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="svg-inline--fa fa-pen fa-w-16"
                >
                  <path
                    data-v-d223ba98=""
                    fill="currentColor"
                    d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"
                    className=""
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <div>{errorText}</div>
        </div>
      </div>
    );
  }
}
export default Profile;
