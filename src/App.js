import tmdbLogo from './images/tmdbLogo.svg'
import './App.css';
import { useState } from "react";
const axios = require('axios');

function App() {
  let [searchText, setSearchText] = useState("");
  let [filmsList, setFilmsList] = useState([]);

  const apiUrl = 'http://127.0.0.1:8081'
  const rootPosterUrl = 'https://www.themoviedb.org/t/p/w94_and_h141_bestv2/';

  const [isLoading, setLoading] = useState(false);

  let handleInputChanges = (event) => {
    setSearchText(event.currentTarget.value);
  };

  function submitSearch () {
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=***REMOVED***&query=' + searchText;
    setLoading(true);
    
    axios
      .get(url)
      .then(res => {
        let resultsWithRelationships = res.data.results;
        let counter = 0;

        // this is a very annoying way in which I get the relationships for each result
        Promise.all(resultsWithRelationships.forEach(item => {
          axios
          .get(apiUrl + '/getRelatedMovies?id=' + item.id)
          .then(res => {
            let response = res.data;
            if (item.id == response.first_id) {
              if (response.relationship_id == 0) {
                item.relatedRequiredFilms = "This film is required for " + response.second_id;
              } else if (response.relationship_id == 1) {
                item.relatedSuggestedFilms = "This film is suggested for " + response.second_id;
              }
            } else if (item.id == response.second_id) {
              if (response.relationship_id == 0) {
                item.relatedRequiredFilms = response.first_id + " is required for this film";
              } else if (response.relationship_id == 1) {
                item.relatedSuggestedFilms = response.first_id + " is suggested for This film";
              }
            }
            
            counter++;
            
            if (counter == resultsWithRelationships.length) {
              setLoading(false);
              setFilmsList(resultsWithRelationships);
            }
          })
          .catch(error => {
            console.log('error');
            console.error(error);
          })
        }));
      })
      .catch(error => {
          console.error(error);
      });
  }

  if (isLoading) {
    return (<div>loading</div>)
  };

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
      <table>
        <tbody>
          {filmsList.map(film =>
            <tr className='rows' key={film.id}>
              <td>
                {
                  film.poster_path && <img src={rootPosterUrl + film.poster_path}></img>
                }
              </td>
              <td>
                <p >{film.title}</p>
              </td>
              <td>
                {film.relatedRequiredFilms ? <div>
                  <p>{film.relatedRequiredFilms}</p>
                  <button>+</button>
                  <button>-</button>
                </div> : "N/A"}
              </td>
              <td>
                {film.relatedSuggestedFilms ? <div>
                  <p>{film.relatedSuggestedFilms}</p>
                  <button>+</button>
                  <button>-</button>
                </div> : "N/A"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
