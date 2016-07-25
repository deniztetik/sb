/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	module.exports = __webpack_require__(11);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	//sample input:
	//This example would bind the 'a' key to the "example.wav" file.
	//{
	//  65: '/path/to/example'
	//}

	//For a comprehensive list of keycode bindings, see "keycode.js"
	//in this same directory.

	// App React class.  Contains a number of methods which control the audio, as well as rendering pretty much the whole damn app.
	var App = React.createClass({
	  displayName: "App",

	  //declaring some states.
	  getInitialState: function getInitialState() {
	    return {
	      bindings: [],
	      soundList: [],
	      changeKey: "",
	      record: [],
	      loggedIn: false,
	      keyMap: {}
	    };
	  },
	  //once the component mounts, we set those states equal to the correct data.  We also hide the binding window using JQuery until it is required.
	  componentDidMount: function componentDidMount() {
	    $('#bindingWindow').hide();
	    this.serverRequest = $.get(window.location.href + "default", function (result) {
	      this.setState({
	        soundList: result,
	        bindings: map.default.board.map(function (key) {
	          return key !== 0 ? { key: key, path: map.default.keys[key], loop: false, playing: false } : 0;
	        }),
	        keyMap: map.default.keys
	      });
	    }.bind(this));
	    //OSX and MAC reserve functionality of either the alt or ctrl key, this checks the OS
	    // and sets the rebind-key trigger to be that specific keypress
	    navigator.appVersion.includes("Windows") ? this.setState({ bindTrigger: "altKey" }) : this.setState({ bindTrigger: "ctrlKey" });

	    //one event listener for all keypresses.
	    window.addEventListener('keypress', this.handleKeyPress);
	  },

	  bindPiano: function bindPiano(instrument) {
	    $.get(window.location.href + instrument, function (result) {
	      this.setState({
	        soundList: result,
	        bindings: map[instrument].board.map(function (key) {
	          return key !== 0 ? { key: key, path: map[instrument].keys[key], loop: false, playing: false } : 0;
	        }),
	        keyMap: map[instrument].keys
	      });
	    }.bind(this));
	  },

	  //I'm not sure why this is important but online resources say put it in and it doesn't break anything.
	  componentWillUnmount: function componentWillUnmount() {
	    this.serverRequest.abort();
	  },

	  //this is our keyhandler function.  It handles all keypress events on the DOM.  Plays/stops the appropriate sound file,
	  //as well as changing the styling on the appropriate hey.
	  handleKeyPress: function handleKeyPress(event) {
	    console.log(this.state.record);
	    //store all our relevent DOM elements as variables so that we can reference them easily later.
	    var key = event.code.toLowerCase()[3],
	        keyNumber = key.charCodeAt(),
	        $audio = document.getElementById(keyNumber),
	        $vKey = $('#' + keyNumber).parent();

	    var tmp = this.state.record;
	    tmp.push($audio);
	    tmp.push(this.state.keyMap[keyNumber]);
	    this.setState({
	      record: tmp
	    });

	    // handles the ctrl+key menu drop.
	    // originally checked boolean value [ event.ctrlKey ] to check to see if ctrl was
	    // held down or not. Now this.state.bindTrigger is declared upon component mount to
	    // be ctrlKey for mac OSX and altKey for windows.
	    if (event[this.state.bindTrigger] && $('#keyboardWindow').is(':visible')) {
	      if (keyNumber < 123 && keyNumber > 96) {
	        this.setState({ changeKey: key });
	        this.handleCtrlKey();
	      }
	    } else if (event.shiftKey) {
	      //handles the shift+key loop functionality
	      $vKey.addClass('red pressed');
	      this.handleShiftKey($audio, event);
	    } else {
	      //handles a bare keypress.
	      this.triggerKey($vKey, $audio);
	    }
	  },

	  //All this does is change the styling of a key as appropriate, and plays/pauses the audio element as appropriate.
	  triggerKey: function triggerKey($vKey, $audio) {
	    $vKey.addClass('green pressed');
	    $audio.currentTime = 0;

	    if ($audio.paused) {
	      $audio.play();
	    } else {
	      $audio.pause();
	      $vKey.removeClass('green red pressed');
	    }
	    event.preventDefault();
	  },
	  //Hides and shows the rebinding menu using jQuery.
	  handleCtrlKey: function handleCtrlKey() {
	    $('#bindingWindow').animate({ height: 'toggle' }, 350);
	    $('#keyboardWindow').animate({ width: 'toggle' }, 350);
	  },

	  //Sets the specified audio element to loop, then plays/pauses and styles as appropriate.
	  handleShiftKey: function handleShiftKey($audio, event) {
	    var key = event.code.toLowerCase()[3],
	        keyNumber = key.charCodeAt(),
	        $vKey = $('#' + keyNumber).parent();
	    $audio.loop = !$audio.loop;
	    $audio.currentTime = 0;
	    if ($audio.paused) {
	      $audio.play();
	    } else {
	      $audio.pause();
	      $vKey.removeClass('green red pressed');
	    }
	  },

	  //useful helper for re-rendering DOM when a new binding is assigned.
	  reRender: function reRender() {
	    $('#bindingWindow').animate({ height: 'toggle' }, 350);
	    $('#keyboardWindow').animate({ width: 'toggle' }, 350);
	    ReactDOM.render(React.createElement(
	      "div",
	      null,
	      React.createElement(App, null)
	    ), document.getElementById('app'));
	  },
	  clearRecord: function clearRecord() {
	    this.setState({
	      record: []
	    });
	  },

	  render: function render() {
	    var _this = this;

	    var userText = this.state.loggedIn ? 'Logout' : 'Login';
	    return React.createElement(
	      "div",
	      { id: "appWindow" },
	      React.createElement(Login, null),
	      React.createElement(
	        "div",
	        { id: "bindingWindow" },
	        React.createElement(
	          "h3",
	          null,
	          "Click on a file to change the binding of ",
	          this.state.changeKey.toUpperCase(),
	          " to"
	        ),
	        React.createElement(
	          "ul",
	          { id: "binding" },
	          this.state.soundList.map(function (sound, idx) {
	            return (//es6 again
	              React.createElement(RebindNode, { key: idx, targetSong: sound, targetKey: _this.state.changeKey, bindings: _this.state.bindings, reRender: _this.reRender })
	            );
	          }, this)
	        )
	      ),
	      React.createElement(InstrumentList, { handleClick: this.bindPiano }),
	      React.createElement(
	        "div",
	        { id: "keyboardWindow", className: "keyboard" },
	        this.state.bindings.map(function (keyBinding, idx) {
	          return (//yay es6
	            keyBinding === 0 ? React.createElement("br", { key: idx }) : React.createElement(VKey, { key: idx, keyId: keyBinding.key, path: keyBinding.path })
	          );
	        })
	      ),
	      React.createElement(Levels, null),
	      React.createElement(Library, { record: this.state.record, clearRecord: this.state.clearRecord })
	    );
	  }
	});

	//This simulates a loading page. In all of our tests the server loaded the sound
	//files instantly but by the time we noticed this we already had an awesome
	//loading page up and running. This timeout feature honors that hard work
	setTimeout(function () {
	  document.getElementById('secretSound').pause();
	  ReactDOM.render(React.createElement(
	    "div",
	    null,
	    React.createElement(App, null)
	  ), document.getElementById('app'));
	}, 2000);

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	'esversion: 6';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Layout = function (_React$Component) {
	  _inherits(Layout, _React$Component);

	  function Layout() {
	    _classCallCheck(this, Layout);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Layout).apply(this, arguments));
	  }

	  _createClass(Layout, [{
	    key: "render",
	    value: function render() {
	      return React.createElement(
	        "div",
	        { className: "loading" },
	        React.createElement(
	          "h1",
	          { className: "intro" },
	          "Good Times Ahead . . ."
	        ),
	        React.createElement("img", { src: "../../assets/tumblr_luxr3mmGVw1r1sjguo1_400.gif" })
	      );
	    }
	  }]);

	  return Layout;
	}(React.Component);

	ReactDOM.render(React.createElement(
	  "div",
	  null,
	  React.createElement(Layout, null)
	), document.getElementById('app'));

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	var Eq = React.createClass({
		displayName: "Eq",

		getInitialState: function getInitialState() {
			return {
				filters: this.props.filters,
				presets: this.props.presets
			};
		},

		render: function render() {
			return React.createElement(
				"select",
				null,
				this.state.presets.map(function (preset, index) {
					return React.createElement(
						"option",
						{ value: index, key: index },
						preset[0]
					);
				})
			);
		}
	});

	window.Eq = Eq;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	//input syntax:  {
	//  targetKeyCode1: "/path/to/source/file.wav",
	//  targetKeyCode2: "/path/to/next/source.wav"
	//  ...
	//}
	var instruments = ['default', 'piano'];
	var freq = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
	var qValues = [2, 2, 2, 2, 2, 1.68, 1.68, 1.68];
	var pianoKeys = {
	  97: "/piano/c.wav",
	  119: "/piano/cH.wav",
	  115: "/piano/d.wav",
	  101: "/piano/eb.wav",
	  100: "/piano/e.wav",
	  102: "/piano/f.wav",
	  116: "/piano/fH.wav",
	  103: "/piano/g.wav",
	  121: "/piano/gH.wav",
	  104: "/piano/a.wav",
	  117: "/piano/bb.wav",
	  106: "/piano/b.wav",
	  32: "/piano/c.wav"
	};
	var defaultKeys = {
	  97: "/soundfiles/deep-techno-groove.wav",
	  98: "/soundfiles/bam-bam-bolam.wav",
	  99: "/soundfiles/nyan-cat.wav",
	  100: "/soundfiles/day.wav",
	  101: "/soundfiles/beads.wav",
	  102: "/soundfiles/drums.wav",
	  103: "/soundfiles/pew-pew.wav",
	  104: "/soundfiles/grendel.wav",
	  105: "/soundfiles/derp-yell.wav",
	  106: "/soundfiles/beltbuckle.wav",
	  107: "/soundfiles/oh-yeah.wav",
	  108: "/soundfiles/power-up.wav",
	  109: "/soundfiles/straight-techno-beat.wav",
	  110: "/soundfiles/kamehameha.wav",
	  111: "/soundfiles/fart.wav",
	  112: "/soundfiles/heavy-rain.wav",
	  113: "/soundfiles/jet-whoosh.wav",
	  114: "/soundfiles/mystery-chime.ogg",
	  115: "/soundfiles/space-bloop.wav",
	  116: "/soundfiles/techno-drums2.wav",
	  117: "/soundfiles/whale.wav",
	  118: "/soundfiles/vegeta-big-bang.wav",
	  119: "/soundfiles/piano-mood.wav",
	  120: "/soundfiles/boing.wav",
	  121: "/soundfiles/techno-drums.wav",
	  122: "/soundfiles/guitar-chord.wav"
	};
	var pianoBoard = [119, 101, 32, 116, 121, 117, 0, 97, 115, 100, 102, 103, 104, 106];
	var defaultBoard = [113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 0, 97, 115, 100, 102, 103, 104, 106, 107, 108, 0, 122, 120, 99, 118, 98, 110, 109];

	var map = {
	  default: {
	    board: defaultBoard,
	    keys: defaultKeys
	  },
	  piano: {
	    board: pianoBoard,
	    keys: pianoKeys
	  }
	};

	var keyCodes = {
	  3: "break",
	  8: "backspace / delete",
	  9: "tab",
	  12: 'clear',
	  13: "enter",
	  16: "shift",
	  17: "ctrl ",
	  18: "alt",
	  19: "pause/break",
	  20: "caps lock",
	  27: "escape",
	  32: " ",
	  33: "page up",
	  34: "page down",
	  35: "end",
	  36: "home ",
	  37: "left arrow ",
	  38: "up arrow ",
	  39: "right arrow",
	  40: "down arrow ",
	  41: "select",
	  42: "print",
	  43: "execute",
	  44: "Print Screen",
	  45: "insert ",
	  46: "delete",
	  48: "0",
	  49: "1",
	  50: "2",
	  51: "3",
	  52: "4",
	  53: "5",
	  54: "6",
	  55: "7",
	  56: "8",
	  57: "9",
	  58: ":",
	  59: "semicolon (firefox), equals",
	  60: "<",
	  61: "equals (firefox)",
	  63: "ß",
	  64: "@ (firefox)",
	  65: "a",
	  66: "b",
	  67: "c",
	  68: "d",
	  69: "e",
	  70: "f",
	  71: "g",
	  72: "h",
	  73: "i",
	  74: "j",
	  75: "k",
	  76: "l",
	  77: "m",
	  78: "n",
	  79: "o",
	  80: "p",
	  81: "q",
	  82: "r",
	  83: "s",
	  84: "t",
	  85: "u",
	  86: "v",
	  87: "w",
	  88: "x",
	  89: "y",
	  90: "z",
	  91: "Windows Key / Left ⌘ / Chromebook Search key",
	  92: "right window key ",
	  93: "Windows Menu / Right ⌘",
	  96: "numpad 0 ",
	  97: "A",
	  98: "B",
	  99: "C",
	  100: "D",
	  101: "E",
	  102: "F",
	  103: "G",
	  104: "H",
	  105: "I",
	  106: "J",
	  107: "K",
	  108: "L",
	  109: "M",
	  110: "N",
	  111: "O",
	  112: "P",
	  113: "Q",
	  114: "R",
	  115: "S",
	  116: "T",
	  117: "U",
	  118: "V",
	  119: "W",
	  120: "X",
	  121: "Y",
	  122: "Z",
	  123: "f12",
	  124: "f13",
	  125: "f14",
	  126: "f15",
	  127: "f16",
	  128: "f17",
	  129: "f18",
	  130: "f19",
	  131: "f20",
	  132: "f21",
	  133: "f22",
	  134: "f23",
	  135: "f24",
	  144: "num lock ",
	  145: "scroll lock",
	  160: "^",
	  161: '!',
	  163: "#",
	  164: '$',
	  165: 'ù',
	  166: "page backward",
	  167: "page forward",
	  169: "closing paren (AZERTY)",
	  170: '*',
	  171: "~ + * key",
	  173: "minus (firefox), mute/unmute",
	  174: "decrease volume level",
	  175: "increase volume level",
	  176: "next",
	  177: "previous",
	  178: "stop",
	  179: "play/pause",
	  180: "e-mail",
	  181: "mute/unmute (firefox)",
	  182: "decrease volume level (firefox)",
	  183: "increase volume level (firefox)",
	  186: "semi-colon / ñ",
	  187: "equal sign ",
	  188: "comma",
	  189: "dash ",
	  190: "period ",
	  191: "forward slash / ç",
	  192: "grave accent / ñ",
	  193: "?, / or °",
	  194: "numpad period (chrome)",
	  219: "open bracket ",
	  220: "back slash ",
	  221: "close bracket ",
	  222: "single quote ",
	  223: "`",
	  224: "left or right ⌘ key (firefox)",
	  225: "altgr",
	  226: "< /git >",
	  230: "GNOME Compose Key",
	  233: "XF86Forward",
	  234: "XF86Back",
	  255: "toggle touchpad"
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	var Instrument = function Instrument(_ref) {
	  var instrument = _ref.instrument;
	  var handleClick = _ref.handleClick;
	  return React.createElement(
	    "div",
	    { className: "", onClick: function onClick() {
	        return handleClick(instrument);
	      } },
	    instrument
	  );
	};

	window.Instrument = Instrument;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	var InstrumentList = function InstrumentList(_ref) {
	  var handleClick = _ref.handleClick;
	  return React.createElement(
	    "div",
	    { className: "" },
	    instruments.map(function (instrument, index) {
	      return React.createElement(Instrument, { instrument: instrument, key: index, handleClick: handleClick });
	    })
	  );
	};

	window.InstrumentList = InstrumentList;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	/**
	 *   This file creates a levels display and equalizer for the app using the web audio api. All audio elements of the page are 
	 *   merged into one audio node, which then passes through a 10 channel equalizer implemented with 10 biquadfilters. From there
	 *   it is passed to an analyzer node which collects the data for the levels visualization
	 **/

	//  creates our state, most of the properties are initialized when the button created by this file is clicked
	var Levels = React.createClass({
		displayName: 'Levels',

		getInitialState: function getInitialState() {
			return {
				audioElms: [],
				container: null,
				ac: new window.AudioContext(),
				analyzer: null,
				filters: null,
				width: 800, //  for the canvas element holding the levels display
				height: 300,
				presets: []
			};
		},

		//  called when the button is clicked, starts off the rest of this code to create the levels display/eq
		startLevels: function startLevels() {
			$.get(window.location.href + "presets", function (result) {
				//  loads the equalizer presets from the server


				for (var i = 0; i < this.state.audioElms.length; i++) {
					this.state.audioElms[i].disconnect();
				}

				var elms = $('audio');
				var tempArray = [];

				for (var i = 0; i < elms.length; i++) {
					var temp = this.state.ac.createMediaElementSource(elms[i]);
					tempArray.push(temp);
				}

				this.setState({
					audioElms: tempArray,
					container: $('canvas')[0].getContext('2d'),
					analyzer: this.state.ac.createAnalyser(),
					presets: result
				}, this.checkLevels); //  calls next function in the chain
			}.bind(this));
		},

		//  sets up the audio node chain that implements the equalizer and levels display
		checkLevels: function checkLevels() {
			var merge = this.state.ac.createChannelMerger(this.state.audioElms.length);
			var tempArray = [];

			//  here we create our ten biquad filters for the equalizer. filters are given frequencies/q values held by arrays in helpers.jsx
			for (var i = 0; i < 10; i++) {
				var temp = this.state.ac.createBiquadFilter();
				temp.frequency.value = freq[i];
				i !== 0 && i !== 9 ? temp.type = "peaking" : i === 0 ? temp.type = "lowshelf" : temp.type = "highshelf";
				i !== 0 && i !== 9 ? temp.Q.value = qValues[i - 1] : null;
				temp.gain.value = this.state.presets[0][i + 1];
				tempArray.push(temp);
			}

			//  merges all current audio elements into one node
			for (var i = 0; i < this.state.audioElms.length; i++) {
				this.state.audioElms[i].connect(merge, 0, 0);
				this.state.audioElms[i].connect(merge, 0, 1);
			}

			//  runs the audio through the equalizer and the filter
			this.setState({ filters: tempArray }, function () {
				merge.connect(this.state.filters[0]);

				for (var i = 1; i < 10; i++) {
					this.state.filters[i - 1].connect(this.state.filters[i]);
				}

				this.state.filters[9].connect(this.state.analyzer);
				this.state.analyzer.connect(this.state.ac.destination);
				this.state.analyzer.fftSize = 2048;
				setInterval(this.updateLevels, 33);
			});
		},

		//  runs ever 33 ms to update the display of the current audio
		updateLevels: function updateLevels() {
			var len = this.state.analyzer.frequencyBinCount;
			var data = new Uint8Array(len);

			this.state.analyzer.getByteFrequencyData(data);
			this.state.container.clearRect(0, 0, this.state.width, this.state.height);

			var width = this.state.width / len;
			var coefficient = 255 / len;

			var gradient = this.state.container.createLinearGradient(0, 0, this.state.width, 0);
			gradient.addColorStop(0, "#DB36A4");
			gradient.addColorStop(1, "#F7FF00");

			for (var i = 0; i < data.length; i++) {
				var magnitude = data[i] / 128.0;
				this.state.container.fillStyle = gradient;
				this.state.container.fillRect(i * width, this.state.height - magnitude * .5 * this.state.height, 1, this.state.height);
			}
		},

		//  allows user to change the equalizer filter values
		changePreset: function changePreset() {
			for (var i = 0; i < 10; i++) {
				this.state.filters[i].gain.value = this.state.presets[$('select').val()][i + 1];
			}
		},

		render: function render() {
			return React.createElement(
				'div',
				null,
				React.createElement(
					'div',
					{ className: 'levels' },
					React.createElement('canvas', { width: this.state.width, height: this.state.height })
				),
				React.createElement(
					'div',
					null,
					React.createElement(
						'button',
						{ type: 'button', onClick: this.startLevels },
						'Click to initiliaze levels and equalizer'
					),
					React.createElement(
						'select',
						{ onChange: this.changePreset },
						this.state.presets.map(function (preset, index) {
							return React.createElement(
								'option',
								{ value: index, key: index },
								preset[0]
							);
						})
					)
				)
			);
		}
	});

	window.Levels = Levels;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	//import React, { Component, PropTypes } from 'react'
	var Library = function (_React$Component) {
	  _inherits(Library, _React$Component);

	  function Library(props) {
	    _classCallCheck(this, Library);

	    // this._onButtonClick = this._onButtonClick.bind(this);
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Library).call(this, props));

	    console.log('record', _this.record, _this.clearRecord);
	    return _this;
	  }

	  _createClass(Library, [{
	    key: 'clearSong',
	    value: function clearSong() {
	      this.clearRecord();
	    }
	  }, {
	    key: 'playSong',
	    value: function playSong() {
	      for (var i = 0; i < this.record.length; i++) {
	        this.record[i].play();
	      }
	    }
	  }, {
	    key: 'saveSong',
	    value: function saveSong() {}
	  }, {
	    key: 'render',
	    value: function render() {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'div',
	          { className: 'library' },
	          React.createElement(
	            'h2',
	            null,
	            'Library'
	          ),
	          React.createElement(
	            'div',
	            { width: '800', height: '300' },
	            React.createElement('textarea', { width: '800', height: '300', id: 'library', value: this.record })
	          )
	        ),
	        React.createElement(
	          'div',
	          null,
	          React.createElement(
	            'button',
	            { type: 'button', onClick: this.clearSong },
	            'Clear Song'
	          ),
	          React.createElement(
	            'button',
	            { type: 'button', onClick: this.saveSong },
	            'Save Song'
	          ),
	          React.createElement(
	            'button',
	            { type: 'button', onClick: this.playSong },
	            'Play Song'
	          )
	        )
	      );
	    }
	  }]);

	  return Library;
	}(React.Component);

	window.Library = Library;

/***/ },
/* 9 */
/***/ function(module, exports) {

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

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Login).call(this, props));

	    _this.state = {
	      showComponent: false
	    };
	    _this._onButtonClick = _this._onButtonClick.bind(_this);
	    return _this;
	  }

	  _createClass(Login, [{
	    key: "_onButtonClick",
	    value: function _onButtonClick() {
	      this.setState({
	        showComponent: true
	      });
	    }
	  }, {
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
	      console.log("email", this.state.email);
	      console.log("password", this.state.password);
	      $.ajax({
	        type: "POST",
	        url: "/login",
	        processData: false,
	        contentType: "application/json",
	        data: JSON.stringify({
	          email: this.state.email,
	          password: this.state.password
	        }),
	        success: function success() {
	          console.log("device control succeeded");
	          console.log("woohoooo");
	        },
	        error: function error(err) {
	          console.log("Error!!", err);
	          console.log("arguments", arguments);
	        }
	      });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var loggedIn = this.state.loggedIn ? 'Logout' : 'Login';
	      return React.createElement(
	        "div",
	        { id: "loginComponent" },
	        this.state.showComponent ? null : React.createElement(
	          "button",
	          { type: "button", onClick: this._onButtonClick },
	          loggedIn
	        ),
	        this.state.showComponent ? React.createElement(
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
	            React.createElement("input", { type: "submit", value: "Login", onClick: this.attemptLogin.bind(this) })
	          )
	        ) : null
	      );
	    }
	  }]);

	  return Login;
	}(React.Component);

	window.Login = Login;
	// export default Login;

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	//RebindNode React class.  Represents one entry in the drop-down list for rebinding keys.
	var RebindNode = React.createClass({
	  displayName: "RebindNode",

	  //this is the function that actually changes the binding of the key.
	  updateKeyBinding: function updateKeyBinding(event) {
	    var code = this.props.targetKey.charCodeAt();
	    var path = "/soundfiles/" + this.props.targetSong;
	    // var path = "/piano/" + this.props.targetSong;

	    this.props.bindings.forEach(function (ele, idx) {
	      if (ele.key === code) {
	        this.props.bindings[idx].path = path;
	      }
	    }, this);
	  },
	  //method for previewing sound before binding it.
	  playSample: function playSample() {
	    var soundExample = window.location.href + "soundFiles/" + this.props.targetSong;
	    // var soundExample = window.location.href + "piano/" + this.props.targetSong;
	    var $soundNode = document.getElementById('secretSound');

	    $soundNode.pause();
	    $soundNode.src = soundExample;
	    $soundNode.currentTime = 0;
	    $soundNode.play();
	  },
	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "rebindNode", onClick: this.updateKeyBinding },
	      React.createElement(
	        "p",
	        { className: "rebindSong", onClick: this.props.reRender },
	        " ",
	        this.props.targetSong.slice(0, -4).split("-").join(" "),
	        " "
	      ),
	      React.createElement("img", { className: "rebindIcon", src: "assets/listen.png", onClick: this.playSample })
	    );
	  }
	});
	//

	//this is actually not needed. Just remember that you might need to do this someday.
	window.rebindNode = RebindNode;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	//VKey React class.  Represents one key on our virtual keyboard.
	var VKey = React.createClass({
	  displayName: 'VKey',

	  //method for removing styling from key after its audio element has stopped playing.
	  handleAudioEnd: function handleAudioEnd(event) {
	    var $vKey = $('#' + this.props.keyId).parent();

	    $vKey.removeClass('green red pressed');
	    event.preventDefault();
	    this.render();
	  },

	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'key' },
	      React.createElement(
	        'p',
	        { className: 'keyLabel' },
	        keyCodes[this.props.keyId]
	      ),
	      React.createElement(
	        'p',
	        { className: 'filename' },
	        this.props.path.substr(12).slice(0, -4).split("-").join(" ")
	      ),
	      React.createElement('audio', { id: this.props.keyId, src: this.props.path, onEnded: this.handleAudioEnd, preload: 'auto' })
	    ) //
	    ;
	  }
	});

/***/ }
/******/ ]);