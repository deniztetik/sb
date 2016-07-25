
var SongList =({songs,handleClick})=>{

   var entriesToList = songs.split(',').map((song) =>
       <li className="song-list-entry"  onClick={function(){ handleClick(entry)} }>{song}</li>
    ) ;


    return(
       <ul className="song-list media">
           {entriesToList}
       </ul>
     )
}

window.SongList = SongList;

