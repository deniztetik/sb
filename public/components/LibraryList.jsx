
var LibraryList =({records,handleClick})=>{

   var entriesToList = records.map((record, idx) =>
       <li className="library-list-entry" key={idx} onClick={function(){ handleClick(record)} }>
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

