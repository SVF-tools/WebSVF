import './Login.scss';

import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';

import './Login.scss';

import {
  signin,
  signup,
  signInWithGoogle,
  signInWithGitHub,
  forgotpass,
  updatepass,
} from '../../../helpers/auth';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      loginError: null,
      signupError: null,
      forgotpwError: null,
      email: '',
      password: '',
      newpass: '',
      username: '',
      showForgot: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleForgotPass = this.handleForgotPass.bind(this);
    this.handleUpdatePass = this.handleUpdatePass.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
    this.githubSignIn = this.githubSignIn.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onRegister = this.onRegister.bind(this);
    this.onForgot = this.onForgot.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async handleSignIn(event) {
    event.preventDefault();
    this.setState({ loginError: '' });
    try {
      await signin(this.state.email, this.state.password);
      console.log(this.props);
      this.props.setRoute('/dashboard');
      window.open('#/dashboard', '_self');
    } catch (error) {
      this.setState({ loginError: error.message });
    }
  }

  async handleUpdatePass(event) {
    event.preventDefault();
    this.setState({ forgotpwError: '' });
    try {
      await signin(this.state.email, this.state.password).then(
        async function () {
          await updatepass(this.state.newpass);
        }
      );
    } catch (error) {
      this.setState({ forgotpwError: error.message });
    }
  }

  async handleForgotPass(event) {
    event.preventDefault();
    this.setState({ forgotpwError: '' });
    try {
      await forgotpass(this.state.email);
    } catch (error) {
      this.setState({ forgotpwError: error.message });
    }
  }

  async handleSignUp(event) {
    event.preventDefault();
    this.setState({ signupError: '' });
    try {
      await signup(this.state.email, this.state.password, this.state.username);
      this.props.setRoute('/dashboard');
      window.open('#/dashboard', '_self');
    } catch (error) {
      this.setState({ signupError: error.message });
    }
  }

  async googleSignIn() {
    try {
      await signInWithGoogle();
      this.props.setRoute('/profile');
      window.open('#/profile', '_self');
    } catch (error) {
      this.setState({ loginError: error.message });
    }
  }

  async githubSignIn() {
    try {
      await signInWithGitHub();
      this.props.setRoute('/profile');
      window.open('#/profile', '_self');
    } catch (error) {
      this.setState({ loginError: error.message });
    }
  }

  onLogin() {
    document.getElementById('container').classList.remove('right-panel-active');
    setTimeout(() => {
      this.setState({ showForgot: false });
    }, 500);
  }

  onRegister() {
    document.getElementById('container').classList.add('right-panel-active');
    this.setState({ showForgot: false });
  }

  onForgot() {
    document.getElementById('container').classList.add('right-panel-active');
    this.setState({ showForgot: true });
  }

  render() {
    return (
      <div id="login">
        {/* s */}
        <div id="container" className="login-container">
          {!this.state.showForgot ? (
            <div className="form-container sign-up-container">
              <h1>Sign Up</h1>
              <div className="input-wrap">
                <form autoComplete="off" onSubmit={this.handleSignUp}>
                  <TextField
                    id="standard"
                    label="Username"
                    name="username"
                    onChange={this.handleChange}
                    InputProps={{ value: this.state.username }}
                  />
                  <TextField
                    required
                    label="Email"
                    name="email"
                    onChange={this.handleChange}
                    InputProps={{ value: this.state.email }}
                  />
                  <TextField
                    required
                    label="Password"
                    type="password"
                    name="password"
                    onChange={this.handleChange}
                    InputProps={{ value: this.state.password }}
                  />
                  {this.state.signupError ? (
                    <p className="text-danger">{this.state.signupError}</p>
                  ) : null}
                  <button type="submit" className="ghost">
                    Register
                  </button>
                </form>
              </div>
              <div className="icons">
                <FontAwesomeIcon
                  icon={faGithub}
                  size="2x"
                  onClick={this.githubSignIn}
                />
                <FontAwesomeIcon
                  icon={faGoogle}
                  size="2x"
                  onClick={this.googleSignIn}
                />
              </div>
            </div>
          ) : (
            <div className="form-container sign-up-container forgot">
              <form
                style={{ height: 'auto' }}
                autoComplete="off"
                onSubmit={this.handleForgotPass}
              >
                <h1>Forgot Password</h1>
                <div className="input-wrap">
                  <TextField
                    required
                    label="Email"
                    name="email"
                    onChange={this.handleChange}
                    InputProps={{ value: this.state.email }}
                  />
                  {this.state.forgotpwError ? (
                    <p className="text-danger">{this.state.forgotpwError}</p>
                  ) : null}
                  <button
                    type="submit"
                    style={{ padding: 0 }}
                    className="ghost"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="form-container sign-in-container">
            <form autoComplete="off" onSubmit={this.handleSignIn}>
              <h1>Sign In</h1>
              <div className="input-wrap">
                <TextField
                  label="Email"
                  name="email"
                  onChange={this.handleChange}
                  InputProps={{ value: this.state.email }}
                />
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  onChange={this.handleChange}
                  InputProps={{ value: this.state.password }}
                />
                <span
                  style={{ display: 'block', textAlign: 'left' }}
                  onClick={this.onForgot}
                >
                  Forgot Password?
                </span>
                {this.state.loginError ? (
                  <p className="text-danger">{this.state.loginError}</p>
                ) : null}
                <button type="submit" className="ghost">
                  Login
                </button>
                <div className="icons">
                  <FontAwesomeIcon
                    icon={faGithub}
                    size="2x"
                    onClick={this.githubSignIn}
                  />
                  <FontAwesomeIcon
                    icon={faGoogle}
                    size="2x"
                    onClick={this.googleSignIn}
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>
                  {this.state.showForgot
                    ? 'Remember password?'
                    : 'Already have an account?'}
                </h1>
                <button onClick={this.onLogin} className="ghost">
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Don't have an account?</h1>
                <button onClick={this.onRegister} className="ghost">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
