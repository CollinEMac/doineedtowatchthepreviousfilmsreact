import tmdbLogo from './images/tmdbLogo.svg'
import './App.css';
import { useState } from "react";
import Modal from 'react-modal';
const REACT_APP_SEARCHURL = process.env.REACT_APP_SEARCHURL;

const axios = require('axios');

function App() {
  let [searchText, setSearchText] = useState("");
  let [filmsList, setFilmsList] = useState([]);
  let [relatedFilmsList, setRelatedFilmsList] = useState([]);

  const apiUrl = 'http://127.0.0.1:8081'
  const rootPosterUrl = 'https://www.themoviedb.org/t/p/w94_and_h141_bestv2/';

  const [isLoading, setLoading] = useState(false);
  const [isModalLoading, setModalLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  // For creating relationships
  const [selectedFilm, setSelectedFilm] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState('');
  const [checkedFilm, setCheckedFilm] = useState('');
  const [relationshipDirection, setRelationshipDirection] = useState('');

  let handleInputChanges = (event) => {
    setSearchText(event.currentTarget.value);
  };

  function submitSearch () {
    setLoading(true);

    axios
      .get(REACT_APP_SEARCHURL + searchText)
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
                item.relatedRequiredForFilms = "This film is required for " + response.second_id;
              } else if (response.relationship_id == 1) {
                item.relatedSuggestedForFilms = "This film is suggested for " + response.second_id;
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

  function submitRelatedSearch () {
    setModalLoading(true);
    
    axios
      .get(REACT_APP_SEARCHURL + searchText + '&page=1')
      .then(res => {
        setRelatedFilmsList(res.data.results.slice(0, 1));
        setModalLoading(false);
      })
      .catch(error => {
          console.error(error);
      });
  }

  function updateCheckedFilms (e) {
    const checkbox = e.target;

    if (checkbox.checked) {
      setCheckedFilm(checkbox.value);
    } else {
      setCheckedFilm(null);
    }
  }

  function createRelationship (event) {
    event.preventDefault();
    let first_id = selectedFilm;
    let second_id = checkedFilm;

    if (relationshipDirection == 'downstream') {
      first_id = checkedFilm;
      second_id = selectedFilm;
    }

    axios
      .post(apiUrl +
        '/addRelatedMovie?first_id=' +
        first_id +
        '&second_id=' +
        second_id +
        '&relationship_id=' +
        selectedRelationship)
      .then(res => {
        closeModal();
      })
      .catch(error => {
        console.error(error);
    });
  }

  if (isLoading) {
    return (<div className='center'>loading</div>)
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="App">
      <div>
        <input
          className='search'
          onChange={handleInputChanges}
        ></input>
        <button
          className='search buttons'
          onClick={submitSearch}>Submit
        </button>
      </div>
      <table>
        <tbody>
          { filmsList.length ? <tr>
              <th>
                Poster
              </th>
              <th>
                Title
              </th>
              <th>
                Required Films
              </th>
              <th>
                Films Required For
              </th>
              <th>
                Suggested Films
              </th>
              <th>
                Films Suggested For
              </th> 
             </tr> : <tr></tr>
          }
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
                  <button className='buttons'>+</button>
                  <button className='buttons'>-</button>
                </div> : "N/A"}
                <button className='buttons' onClick={
                  () => {
                    openModal();
                    setSelectedFilm(film.id);
                    setSelectedRelationship(0);
                    setRelationshipDirection('downstream');
                  }
                }>
                   Add Requirement
                </button>
              </td>
              <td>
                {film.relatedRequiredForFilms ? <div>
                  <p>{film.relatedRequiredForFilms}</p>
                  <button className='buttons'>+</button>
                  <button className='buttons'>-</button>
                </div> : "N/A"}
                <button className='buttons' onClick={
                  () => {
                    openModal();
                    setSelectedFilm(film.id);
                    setSelectedRelationship(0);
                    setRelationshipDirection('upstream');
                  }
                }>
                   Add Required For
                </button>
              </td>
              <td>
                {film.relatedSuggestedFilms ? <div>
                  <p>{film.relatedSuggestedFilms}</p>
                  <button className='buttons'>+</button>
                  <button className='buttons'>-</button>
                </div> : "N/A"}
                <button className='buttons' onClick={
                  () => {
                    openModal();
                    setSelectedFilm(film.id);
                    setSelectedRelationship(1);
                    setRelationshipDirection('downstream');
                  }
                }>
                  Add Suggestion
                </button>
              </td>
              <td>
                {film.relatedSuggestedForFilms ? <div>
                  <p>{film.relatedSuggestedForFilms}</p>
                  <button className='buttons'>+</button>
                  <button className='buttons'>-</button>
                </div> : "N/A"}
                <button className='buttons' onClick={
                  () => {
                    openModal();
                    setSelectedFilm(film.id);
                    setSelectedRelationship(1);
                    setRelationshipDirection('upstream');
                  }
                }>
                  Add Suggestion For
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className='center'
        contentLabel="Example Modal"
      >
        <div>
          <input
            className='search'
            onChange={handleInputChanges}
          />
          <button
            className='search search-button'
            onClick={submitRelatedSearch}>Submit
          </button>
        </div>
        <form onSubmit={createRelationship}>
          {!isModalLoading ? <div>
            <table>
              <tbody>
                {relatedFilmsList.map(film =>
                  <tr className='rows' key={film.id}>
                    <td>
                      <input onChange={updateCheckedFilms} type="checkbox" value={film.id}></input>
                    </td>
                    <td>
                      {
                        film.poster_path && <img src={rootPosterUrl + film.poster_path}></img>
                      }
                    </td>
                    <td>
                      <p >{film.title}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div> : <div>loading</div>}
          <div>
            <button type="submit">
              Add relationship
            </button>
            <button className='buttons' onClick={closeModal}>close</button>
          </div>
        </form>
      </Modal>

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
