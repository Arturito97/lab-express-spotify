require('dotenv').config();

const { query } = require('express');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebAPI = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebAPI({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


app.get(`/`,(req,res)=>{
    res.render(`home`)
})

app.get(`/artist-search`,(req,res)=>{
    console.log(req.query)
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      const artists = {array : data.body.artists.items}
      console.log(artists)
      res.render(`artist-search-results`, artists)

    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    console.log(req.params)
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data)=>{
       const albums = {album : data.body.items}
       res.render(`albums`, albums)
    })
    .catch((err)=>{console.log(err)})
  });

app.get('/tracks/:albumId', (req, res, next) => {
    console.log(req.params)
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
        console.log(data.body)
        const track = {song : data.body.items}
        res.render(`tracks`, track)
    })
    .catch((err) =>{console.log(err)})
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
