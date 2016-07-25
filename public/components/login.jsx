// import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this.props);
    // console.log(this.state);
    this.state = {
      // showComponent: false
    };
    // this._onLoginButtonClick = this._onLoginButtonClick.bind(this);
    this.attemptLogin = this.attemptLogin.bind(this);
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  attemptLogin() {
    var that = this;
    $.ajax({
      type: "POST",
      url: "/login",
      processData: false,
      contentType: "application/json",
      data: JSON.stringify({
        email:    this.state.email,
        password: this.state.password
      }),
      success: function(user){
        // console.log('sucesss');
        // that.setState({
        //   showComponent: false,
        //   loggedIn: true
        // });
        // console.log(data);
        that.props.loginSuccess(user);
        // so the login fields become empty after login
        that.setState({
          email: '',
          password: ''
        });
      },
      error: function(err){
        console.log("Error!!", err);
        console.log("arguments", arguments);
      }
    });
  }

  // logout() {
  //   $.ajax({
  //     type: "POST",
  //     url: "/logout"
  //   });
  // }

  render() {
    const loggedIn = this.props.loggedIn ? 'Logout' : 'Login';
    const sideModals = this.props.sideModals;
    const currentUser = this.props.currentUser;
    return (
      <div id="loginComponent">
        { sideModals.indexOf('login') !== -1 ?
          null :
          <button type="button" onClick={this.props._onLoginButtonClick}>{loggedIn}</button>
        }
        { currentUser ?
          <div id="userGreeting">
            <br />
            <h3>"Hello {currentUser}!"</h3>
          </div> :
          null
        }
        { sideModals.indexOf('login') !== -1 ?
          <div id="loginForm">
            <p>
              <input type="text" value={this.state.email} placeholder="Email" onChange={this.handleEmailChange.bind(this)} />
            </p>
            <p>
              <input type="password" value={this.state.password} placeholder="Password" onChange={this.handlePasswordChange.bind(this)} />
            </p>
            <p class="submit">
              <input type="submit" value="Login" onClick={this.attemptLogin} />
            </p>
          </div> :
          null
        }
      </div>
    );
  }
}

window.Login = Login;
// export default Login;
