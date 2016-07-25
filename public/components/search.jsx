class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    // this.attemptLogin = this.attemptLogin.bind(this);
    this.searchSounds = this.searchSounds.bind(this);
  }

  // search_id_names('cars');

  searchSounds() {
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
      success: function(data){
        for(var i = 0; i < data.results.length; i++) {
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
      error: function(err){
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

  render() {
    return (
      <div>
        <h3> Or search for a sound here: </h3>
        <input id="search_field" onClick={ this.props.searchInputClick }></input>
        <button onClick={ this.searchSounds }>Search</button>
      </div>
    );
  }
}

window.Search = Search;
