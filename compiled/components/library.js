"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Library = function (_React$Component) {
  _inherits(Library, _React$Component);

  function Library(props) {
    _classCallCheck(this, Library);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Library).call(this, props));

    _this.state = {
      recordNames: props.recordNames,
      record: props.recording,
      clearSong: props.clearRecord,
      library: ['library...'],
      title: ""
    };
    return _this;
  }

  _createClass(Library, [{
    key: "getSonglibrary",
    value: function getSonglibrary() {
      var that = this;
      $.ajax({
        type: "GET",
        url: "/getSonglibrary",
        processData: false,
        contentType: "application/json",

        success: function success(data) {
          console.log("success", data);
          var lib = [];
          for (var i = 0; i < data.length; i++) {
            lib.push(data[i].record);
          }
          that.state.library = lib;
          that.forceUpdate();
          return lib;
        },
        error: function error(err) {
          console.error(err);
        }
      });
    }
  }, {
    key: "clearSong",
    value: function clearSong() {
      this.props.clearRecord();
    }
  }, {
    key: "playSong",
    value: function playSong() {
      for (var i = 0; i < this.props.recording.length; i++) {
        this.props.recording[i].play();
      }
    }
  }, {
    key: "saveSong",
    value: function saveSong() {
      var that = this;
      var title = this.state.title.toString();
      var recording = this.props.recordNames.toString();
      console.log('savesong', recording);
      $.ajax({
        type: "POST",
        url: "/saveSong",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify({
          title: title,
          record: recording
        }),
        success: function success() {
          console.log("success");
          that.props.clearRecord();
        },
        error: function error(err) {
          console.error(err);
        }
      });
    }
  }, {
    key: "handleClick",
    value: function handleClick(audio) {
      audio.play();
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return true;
    }
  }, {
    key: "handlelibraryClick",
    value: function handlelibraryClick(audio) {
      audio.play();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      //$('.libraryList').hide();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { id: "library" },
        React.createElement(
          "div",
          { id: "libraryrow" },
          React.createElement(
            "h2",
            { style: { color: 'white' } },
            "Record"
          ),
          React.createElement(SongList, { id: "songlist", songs: this.props.recordNames, handleClick: this.handleClick.bind(this) }),
          React.createElement(
            "h2",
            { style: { color: 'white' } },
            "Library"
          ),
          React.createElement(LibraryList, { id: "librarylist", records: this.state.library, handleClick: this.handlelibraryClick.bind(this) })
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "button",
            { type: "button", onClick: this.playSong.bind(this) },
            "Play Song"
          ),
          React.createElement(
            "button",
            { type: "button", onClick: this.saveSong.bind(this) },
            "Save Song"
          ),
          React.createElement(
            "button",
            { type: "button", onClick: this.clearSong.bind(this) },
            "Clear Song"
          ),
          React.createElement(
            "button",
            { type: "button", onClick: this.getSonglibrary.bind(this) },
            "Get Song Library"
          )
        )
      );
    }
  }]);

  return Library;
}(React.Component);

window.Library = Library;