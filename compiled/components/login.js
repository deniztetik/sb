"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import React from 'react';

var Login = function (_React$Component) {
  _inherits(Login, _React$Component);

  function Login(props) {
    _classCallCheck(this, Login);

    // console.log(this.props);
    // console.log(this.state);
    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Login).call(this, props));

    _this.state = {
      // showComponent: false
    };
    // this._onLoginButtonClick = this._onLoginButtonClick.bind(this);
    _this.attemptLogin = _this.attemptLogin.bind(_this);
    return _this;
  }

  _createClass(Login, [{
    key: "handleEmailChange",
    value: function handleEmailChange(event) {
      this.setState({ email: event.target.value });
    }
  }, {
    key: "handlePasswordChange",
    value: function handlePasswordChange(event) {
      this.setState({ password: event.target.value });
    }
  }, {
    key: "attemptLogin",
    value: function attemptLogin() {
      var that = this;
      $.ajax({
        type: "POST",
        url: "/login",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        }),
        success: function success(user) {
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
        error: function error(err) {
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

  }, {
    key: "render",
    value: function render() {
      var loggedIn = this.props.loggedIn ? 'Logout' : 'Login';
      var sideModals = this.props.sideModals;
      var currentUser = this.props.currentUser;
      return React.createElement(
        "div",
        { id: "loginComponent" },
        sideModals.indexOf('login') !== -1 ? null : React.createElement(
          "button",
          { type: "button", onClick: this.props._onLoginButtonClick },
          loggedIn
        ),
        currentUser ? React.createElement(
          "div",
          { id: "userGreeting" },
          React.createElement("br", null),
          React.createElement(
            "h3",
            null,
            "\"Hello ",
            currentUser,
            "!\""
          )
        ) : null,
        sideModals.indexOf('login') !== -1 ? React.createElement(
          "div",
          { id: "loginForm" },
          React.createElement(
            "p",
            null,
            React.createElement("input", { type: "text", value: this.state.email, placeholder: "Email", onChange: this.handleEmailChange.bind(this) })
          ),
          React.createElement(
            "p",
            null,
            React.createElement("input", { type: "password", value: this.state.password, placeholder: "Password", onChange: this.handlePasswordChange.bind(this) })
          ),
          React.createElement(
            "p",
            { "class": "submit" },
            React.createElement("input", { type: "submit", value: "Login", onClick: this.attemptLogin })
          )
        ) : null
      );
    }
  }]);

  return Login;
}(React.Component);

window.Login = Login;
// export default Login;