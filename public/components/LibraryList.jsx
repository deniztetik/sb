
var LibraryList =({records,handleClick})=>{

   var entriesToList = records.map((record) =>
       <li className="library-list-entry" onClick={function(){ handleClick(record)} }>
        {record}
       </li>
    ) ;


    return(
       <ul className="library-list media">
           {entriesToList}
       </ul>
     )
}

window.LibraryList = LibraryList;

