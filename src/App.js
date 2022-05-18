import tmdbLogo from './images/tmdbLogo.svg'
import './App.css';
import { useState } from "react";
const axios = require('axios');

function App() {
  let [searchText, setSearchText] = useState("");
  let [filmsList, setFilmsList] = useState([]);

  const apiUrl = 'http://127.0.0.1:8081'
  const rootPosterUrl = 'https://www.themoviedb.org/t/p/w94_and_h141_bestv2/';

  let handleInputChanges = (event) => {
    setSearchText(event.currentTarget.value);
  };

  function submitSearch () {
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=***REMOVED***&query=' + searchText;
    
    axios
      .get(url)
      .then(res => {
        setFilmsList(res.data.results);
      })
      .catch(error => {
          console.error(error);
      });
  }

  function getRelatedMovies(id) {
    axios
      .get(apiUrl + '/getRelatedMovies?id=' + id)
      .then(res => {
        console.log("it's working");
        console.log(res);
      })
      .catch(error => {
        console.log('error');
        console.error(error);
      })
  }

  return (
    <div className="App">
      <div>
        <input
          className='search'
          onChange={handleInputChanges}
        ></input>
        <button
          className='search search-button'
          onClick={submitSearch}>Submit
        </button>
      </div>
      <div>
        {filmsList.map(film =>
          <div className='rows' key={film.id}>
            <img className='row' onClick={() => getRelatedMovies(film.id)} src={rootPosterUrl + film.poster_path}></img>
            <p className='row'>{film.title}</p>
          </div>
        )}
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
