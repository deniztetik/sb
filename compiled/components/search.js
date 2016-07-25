"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Search = function (_React$Component) {
  _inherits(Search, _React$Component);

  function Search(props) {
    _classCallCheck(this, Search);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Search).call(this, props));

    _this.state = {};
    // this.attemptLogin = this.attemptLogin.bind(this);
    _this.searchSounds = _this.searchSounds.bind(_this);
    return _this;
  }

  // search_id_names('cars');

  _createClass(Search, [{
    key: "searchSounds",
    value: function searchSounds() {
      this.props.searchButtonClick();
      var query = $('#search_field').val();
      // console.log('searchSounds(): query=' + query);

      // var url = "http://www.freesound.org/apiv2/search/text/?query=cars&token=qB7MyU80ihRahPodU46OY8g5tTXoRj8lYZ9UfZA6";
      var apiUrl = "http://www.freesound.org/apiv2/search/text/?query=" + query + "&token=qB7MyU80ihRahPodU46OY8g5tTXoRj8lYZ9UfZA6";
      //var soundList = [];
      $.ajax({
        type: "GET",
        url: apiUrl,
        processData: false,
        contentType: "application/json",
        success: function success(data) {
          for (var i = 0; i < data.results.length; i++) {
            var soundUrl = "http://www.freesound.org/apiv2/sounds/" + data.results[i].id;
            searchResults.push({
              id: data.results[i].id,
              name: data.results[i].name,
              url: soundUrl
            });
            // searchResults.push("https://www.freesound.org/data/previews/1/" + data.results[i].id + "_600-hq.mp3");
          }
          console.log('freesound.org ajax call returned data=', data);
          console.log('freesound.org ajax call returned searchResults=', searchResults);
        },
        error: function error(err) {
          console.log("Error!!", err);
          console.log("arguments", arguments);
        }
      });
    }

    // handleEmailChange(event) {
    //   this.setState({email: event.target.value});
    // }
    //
    // handlePasswordChange(event) {
    //   this.setState({password: event.target.value});
    // }
    //
    // attemptLogin() {
    //   var that = this;
    //   $.ajax({
    //     type: "POST",
    //     url: "/login",
    //     processData: false,
    //     contentType: "application/json",
    //     data: JSON.stringify({
    //       email:    this.state.email,
    //       password: this.state.password
    //     }),
    //     success: function(){
    //       that.props.loginSuccess();
    //     },
    //     error: function(err){
    //       console.log("Error!!", err);
    //       console.log("arguments", arguments);
    //     }
    //   });
    // }

  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "h3",
          null,
          " Or search for a sound here: "
        ),
        React.createElement("input", { id: "search_field", onClick: this.props.searchInputClick }),
        React.createElement(
          "button",
          { onClick: this.searchSounds },
          "Search"
        )
      );
    }
  }]);

  return Search;
}(React.Component);

window.Search = Search;