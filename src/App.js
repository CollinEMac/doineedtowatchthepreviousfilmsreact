import tmdbLogo from './images/tmdbLogo.svg'
import './App.css';
import { useState } from "react";
const axios = require('axios');

function App() {
  let [searchText, setSearchText] = useState("");
  let [filmsList, setFilmsList] = useState([]);
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
        {filmsList.map(film =>
          <div>
            <img src={rootPosterUrl + film.poster_path}></img>
            <p>{film.title}</p>
            <p>{film.overview}</p>
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


// var express = require('express');
// const axios = require('axios');
// const { MongoClient } = require("mongodb");
// var app = express();

// const uri = 'mongodb+srv://collinmacd:PASSWORD@cluster0.ppihs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// const client = new MongoClient(uri);

// app.get('/', function (req, res) {
//     res.send('healthcheck');
//  })

// app.get('/getRelatedMovies', function (req, res) {
//     res.send(req.query.id);

//     // Get all the relationships saved in MongoDB for this movie
//     async function run() {
//         try {
//           await client.connect();
//           const database = client.db('film_relationships');
//           const relationships = database.collection('relationships');
//           const query = { first_id: req.query.id };
//           const relationship = await relationships.findOne(query);
//           const query2 = { second_id: req.query.id };
//           const relationship2 = await relationships.findOne(query2);

//           if (!!relationship) {
//               console.log("this film is required or suggested for another film");
//           }
//           if (!!relationship2) {
//               console.log("this film has suggestions and requirements");
//           }
//           if (!relationship && !relationship2) {
//               console.log("nothing found for this film");
//           }
//         } finally {
//           // Ensures that the client will close when you finish/error
//           await client.close();
//         }
//       }
//     run().catch(console.dir);
// })

// app.listen(8081, function () {
//    var host = '127.0.0.1';
//    var port = 8081;
//    console.log("Example app listening at http://%s:%s", host, port)
// })
