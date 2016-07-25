
//sample input:
//This example would bind the 'a' key to the "example.wav" file.
//{
//  65: '/path/to/example'
//}

//For a comprehensive list of keycode bindings, see "keycode.js"
//in this same directory.

// App React class.  Contains a number of methods which control the audio, as well as rendering pretty much the whole damn app.
var App = React.createClass({
  //declaring some states.

  getInitialState: () => (
     {
      bindings: [],
      soundList: [],
      changeKey: "",
      record: [],
      loggedIn: false,
      sideModals: [],
      keyMap: {},
      recordTitles:[]
    }

  ),
  //once the component mounts, we set those states equal to the correct data.  We also hide the binding window using JQuery until it is required.
  componentDidMount: function() {
    $('#bindingWindow').hide();
    this.serverRequest = $.get(window.location.href + "default", function (result) {
      this.setState({
        soundList: result,
        bindings: map.default.bindings.map(function(key) {
          return key !== 0
            ? {key: key, path: map.default.keys[key], loop: false, playing: false}
            : 0;
        }),
        keyMap: map.default.keys
      });
    }.bind(this));
    //OSX and MAC reserve functionality of either the alt or ctrl key, this checks the OS
    // and sets the rebind-key trigger to be that specific keypress
    navigator.appVersion.includes("Windows")
      ? this.setState({bindTrigger: "altKey"})
      : this.setState({bindTrigger: "ctrlKey"});

      //one event listener for all keypresses.
    var that = this;
    window.addEventListener('keypress', function(event) {
      // var that = this;
      if (that.state.sideModals.length === 0) {
        that.handleKeyPress(event);
      }
    });
  },

  bindTo: function(instrument){
    $.get(window.location.href + instrument, function(result){
      this.setState({
        soundList: result,
        bindings: map[instrument].bindings.map(function(key){
          return key !== 0
          ? {key: key, path: map[instrument].keys[key], loop: false, playing: false}
          : 0;
        }),
        keyMap: map[instrument].keys
      })
    }.bind(this));
  },

//I'm not sure why this is important but online resources say put it in and it doesn't break anything.
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  _onLoginButtonClick: function() {
    // if already logged in, logout (get change state of currentUser and loggedIn)
    // TO-DO: - send logout ajax call to server so user gets deleted from session
    if (this.state.loggedIn) {
      this.setState({
        currentUser: null,
        loggedIn: false
      });
    } else {
      var newSideModals = this.state.sideModals.concat(['login']);
      this.setState({
        sideModals: newSideModals,
      });
    }
  },

  loginSuccess: function(user) {
    var newSideModals = this.state.sideModals;
    newSideModals.pop();
    this.setState({
      sideModals: newSideModals,
      loggedIn: true,
      currentUser: user
    });
  },

  searchInputClick: function() {
    var newSideModals = this.state.sideModals.concat(['searchComponent']);
    this.setState({
      sideModals: newSideModals
    });
  },

  searchButtonClick: function() {
    this.setState({
      sideModals: []
    });
  },

  //this is our keyhandler function.  It handles all keypress events on the DOM.  Plays/stops the appropriate sound file,
  //as well as changing the styling on the appropriate hey.
  handleKeyPress: function(event) {
    //store all our relevent DOM elements as variables so that we can reference them easily later.
    var key = event.code.toLowerCase()[3],
        keyNumber = key.charCodeAt(),
        $audio = document.getElementById(keyNumber),
        $vKey = $('#' + keyNumber).parent();
    var tmp1 = this.state.recordTitles;
    var tmp = this.state.record;
    tmp.push($audio);
    var tmpstr = this.state.keyMap[keyNumber].toString()
    var a = this.state.keyMap[keyNumber].lastIndexOf('/')
    tmpstr=this.state.keyMap[keyNumber].slice(a+1,-4)
    tmp1.push(" " + tmpstr)
    this.setState({
      recordTitles:tmp1,
      record: tmp
    })


    // handles the ctrl+key menu drop.
    // originally checked boolean value [ event.ctrlKey ] to check to see if ctrl was
    // held down or not. Now this.state.bindTrigger is declared upon component mount to
    // be ctrlKey for mac OSX and altKey for windows.
    if (event[this.state.bindTrigger] && $('#keyboardWindow').is(':visible')) {
      if (keyNumber < 123 && keyNumber > 96) {
        this.setState({changeKey: key})
        this.handleCtrlKey();
      }
    } else if (event.shiftKey) { //handles the shift+key loop functionality
      $vKey.addClass('red pressed');
      this.handleShiftKey($audio, event);
    } else {  //handles a bare keypress.
      this.triggerKey($vKey, $audio);
    }
  },

  //All this does is change the styling of a key as appropriate, and plays/pauses the audio element as appropriate.
  triggerKey: function($vKey, $audio) {
    $vKey.addClass('green pressed');
    $audio.currentTime = 0;
    if ($audio.paused) {
      $audio.play()
    } else {
      $audio.pause()
      $vKey.removeClass('green red pressed');
    }
    event.preventDefault();
  },
  //Hides and shows the rebinding menu using jQuery.
  handleCtrlKey: function() {
    $('#bindingWindow').animate({height:'toggle'},350);
    $('#keyboardWindow').animate({width:'toggle'},350);
  },

  //Sets the specified audio element to loop, then plays/pauses and styles as appropriate.
  handleShiftKey: function($audio, event) {
    var key = event.code.toLowerCase()[3],
      keyNumber = key.charCodeAt(),
      $vKey = $('#' + keyNumber).parent();
    $audio.loop = !$audio.loop
    $audio.currentTime = 0;
    if ($audio.paused ) {
      $audio.play();
    } else {
      $audio.pause();
      $vKey.removeClass('green red pressed');
    }
  },

  //useful helper for re-rendering DOM when a new binding is assigned.
  reRender: function() {
    $('#bindingWindow').animate({height:'toggle'},350);
    $('#keyboardWindow').animate({width:'toggle'},350);
    ReactDOM.render(<div>
      <App/>
      </div>, document.getElementById('app')
    );
  },

  clearRecord: function(){
    this.setState({
      record : [],
      recordTitles:[]
    })
  },

  render: function() {
  const userText = this.state.loggedIn ? 'Logout' : 'Login';
   return (
     <div id="appWindow">
      <Login
        _onLoginButtonClick={this._onLoginButtonClick}
        loginSuccess={this.loginSuccess}
        sideModals={this.state.sideModals}
        loggedIn={this.state.loggedIn}
        currentUser={this.state.currentUser}
      />
       <div id = "bindingWindow">
         <h3>Click on a file to change the binding of {this.state.changeKey.toUpperCase()} to</h3>
           <ul id="binding">
           {
             this.state.soundList.map( (sound, idx) => ( //es6 again
               <RebindNode key={idx} targetSong = {sound} targetKey = {this.state.changeKey} bindings = {this.state.bindings} reRender={this.reRender}/>
             ), this)
           }
           </ul>
       </div>
       <Search searchInputClick={ this.searchInputClick } searchButtonClick={ this.searchButtonClick } />
       <SearchResults />
       <InstrumentList handleClick={ this.bindTo } />
       <div id='keyboardWindow' className="keyboard">
       {
         this.state.bindings.map( (keyBinding, idx) => //yay es6
           keyBinding === 0
            ? <br key={idx}/>
            : <VKey key={idx} keyId={keyBinding.key} path={keyBinding.path}/>
         )
       }
       </div>
       <Levels/>
       <Library recording={this.state.record} recordNames={this.state.recordTitles.toString()} clearRecord={this.clearRecord}/>

     </div>
   )
 }
})



//This simulates a loading page. In all of our tests the server loaded the sound
//files instantly but by the time we noticed this we already had an awesome
//loading page up and running. This timeout feature honors that hard work
setTimeout(function() {
  document.getElementById('secretSound').pause();
  ReactDOM.render(<div>
    <App/>
    </div>, document.getElementById('app')
  );

}, 2000);


window.App = App;
