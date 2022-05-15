import tmdbLogo from './images/tmdbLogo.svg'
import './App.css';
import { useState } from "react";
const axios = require('axios');

function App() {
  let [searchText, setSearchText] = useState("");

  let handleInputChanges = (event) => {
    setSearchText(event.currentTarget.value);
  };

  function logMovies(movie) {
    console.log(movie.original_title);
  }

  function submitSearch () {
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=***REMOVED***&query=' + searchText;
    
    console.log(url);

    axios
      .get(url)
      .then(res => {
          res.data.results.forEach(logMovies)
      })
      .catch(error => {
          console.error(error);
      });
  }

  return (
    <div className="App">
      <div>
        Search
      </div>
      <div>
        <input
          onChange={handleInputChanges}
        ></input>
        <button onClick={submitSearch}>Submit</button>
      </div>
      <div>
        Powered by
      </div>
      <div> 
        <img src={tmdbLogo} className="tmdbLogo"></img>
      </div>
    </div>
  );
}

export default App;
