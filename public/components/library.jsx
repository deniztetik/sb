
class Library extends React.Component{
   constructor(props) {
    super(props)
    this.state = {
      recordNames:props.recordNames,
      record:props.recording,
      clearSong:props.clearRecord,
      library:['library...'],
      title:""
    }
   }
  
  getSonglibrary() {
    var that = this;
     $.ajax({
      type: "GET",
      url: "/getSonglibrary",
      processData: false,
      contentType: "application/json"
      ,
      success: function(data){
        console.log("success", data);
        var lib=[]
        for (var i=0;i<data.length;i++){
           lib.push(data[i].record)
        }
        that.state.library = lib;
        that.forceUpdate()
        return(lib);
      },
      error: function(err){
        console.error(err);
      }
    });
  }

  clearSong() {
    this.props.clearRecord()
  }

  playSong() {
    for (var i=0;i<this.props.recording.length;i++){
      this.props.recording[i].play()
    }
  }

  saveSong() {
    var that = this;
    var title = this.state.title.toString()
    var recording = this.props.recordNames.toString()
    console.log('savesong',recording)
     $.ajax({
      type: "POST",
      url: "/saveSong",
      processData: false,
      contentType: "application/json",
      data: JSON.stringify({
        title:  title,
        record: recording
      }),
      success: function(){
        console.log("success");
          that.props.clearRecord()
      },
      error: function(err){
        console.error(err);
      }
    });
  }
handleClick(audio){
   audio.play();
}
shouldComponentUpdate(nextProps, nextState) {
  return true;

 }
 handlelibraryClick(audio){
   audio.play();
 }
componentDidMount(){
  //$('.libraryList').hide();
}

  render() {
     return (
    <div id='library'>    
          
        <div id='libraryrow'>
        <h2 style={{color:'white'}}>Record</h2> 
           <SongList id='songlist' songs={this.props.recordNames} handleClick={this.handleClick.bind(this)}/> 
           <h2 style={{color:'white'}}>Library</h2> 
           <LibraryList id='librarylist' records={this.state.library} handleClick={this.handlelibraryClick.bind(this)}/>

        </div>
      <div>
         <button type="button" onClick={this.playSong.bind(this)}>Play Song</button>
         <button type="button" onClick={this.saveSong.bind(this)}>Save Song</button>
         <button type="button" onClick={this.clearSong.bind(this)}>Clear Song</button>
         <button type="button" onClick={this.getSonglibrary.bind(this)}>Get Song Library</button>
       </div>
    </div>
    )
  }
}
window.Library = Library;
