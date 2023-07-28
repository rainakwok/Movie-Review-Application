import * as React from 'react';
import Typography from "@mui/material/Typography";
import { Grid, Box, TextField, Button } from '@mui/material';
import { Card, CardContent } from '@mui/material';

import NavAppBar from '../Navigation';

const serverURL = "";

const Search = () =>{

  const [movieSearch, setMovieSearch] = React.useState('');
  const [actorSearch, setActorSearch] = React.useState('');
  const [directorSearch, setDirectorSearch] = React.useState('');
  const [showResults, setShowResults] = React.useState(false);
  const [searchResults, updateResults] = React.useState([]);
  const [movieResults, updateMovieResults] = React.useState([]);

  const handleMovieField = (event) => {
    const val = event.target.value.trim();
    setMovieSearch(val);
    console.log("Searched movie: "+val)
  }

  const handleActorField = (event) => {
    const val = event.target.value.trim();
    setActorSearch(val);
    console.log("Searched actor: "+val)
  }

  const handleDirectorField = (event) => {
    const val = event.target.value.trim();
    setDirectorSearch(val);
    console.log("Searched director: "+val)
  }

  React.useEffect(() => {
    console.log(searchResults);
    let movieArray = Array.from(new Set(searchResults.map((item) => item.id)));
    updateMovieResults(movieArray);
    console.log("Unique movies returned: " + movieArray);
  }, [searchResults]);

  const handleSearch = () => {
    setShowResults(false);
    console.log("Searching for movie: '"+movieSearch+" by actor: "+actorSearch+
      " and director: "+directorSearch)
    callApiSearchMovies()
      .then(res => {
        console.log("callApiLoadMovies returned: ", res);
        var parsed = JSON.parse(res.express);
        console.log("callApiLoadMovies parsed: ", parsed);
        updateResults(parsed);
        setShowResults(true);
      });
  }

  const callApiSearchMovies = async () => {
    const url = serverURL + "/api/searchMovies";
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieName: movieSearch,
        actorName: actorSearch,
        directorName: directorSearch
      })
    });

    const body = await response.json();
    console.log("body");
    if (response.status !== 200) throw Error(body.message);
    console.log("Matching movie data returned");
    return body;
  }
  
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#e6f3fc', minHeight: '100vh' }}>
      <NavAppBar/>
      <Box style={{ marginLeft: "70px", marginRight: "70px", paddingTop: "40px"}}>

        <Grid container
          spacing={1}
          direction='column'
          justifyContent='center'
          alignItems='center'
          style={{ marginBottom: "20px"}}
        >
          <Grid item>
            <Typography variant="h3" color="inherit" noWrap>
              <strong>Movie Search Page</strong>
            </Typography>
          </Grid>
          
          <Grid item  >
            <Typography variant="body1">
              Search for movies by title, actor, and/or director!
            </Typography>
          </Grid>
        </Grid>

        <Grid container
          spacing={2}
          direction='row'
          sx={{ marginTop: "20px" }}
          justifyContent='center'
          alignItems='flex-end'
        >
          <Grid item>  
            <Grid container direction="column">   
              <Grid item>
                <Typography variant="subtitle2" color="inherit" sx={{ marginLeft: "5px" }}>
                  Title
                </Typography>   
              </Grid>  
              <Grid item>              
                <TextField
                  onChange={handleMovieField}
                  // type={type}
                  placeholder="e.g. Black Panther"
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  style={{ backgroundColor: 'white' }}
                />
              </Grid>  
            </Grid> 
          </Grid>
              
          <Grid item>  
            <Grid container direction="column">   
              <Grid item>
                <Typography variant="subtitle2" color="inherit" sx={{ marginLeft: "5px" }}>
                  Actor
                </Typography>   
              </Grid>
              <Grid item>
                <TextField
                  onChange={handleActorField}
                  // type={type}
                  placeholder="e.g. Chadwick Boseman"
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  style={{ backgroundColor: 'white' }}
                />
              </Grid>
            </Grid>
          </Grid>
              
          <Grid item>  
            <Grid container direction="column">   
              <Grid item>
                <Typography variant="subtitle2" color="inherit" sx={{ marginLeft: "5px" }}>
                  Director
                </Typography>   
              </Grid>
              <Grid item>
                <TextField
                  onChange={handleDirectorField}
                  // type={type}
                  placeholder="e.g. Ryan Coogler"
                  variant="outlined"
                  size="small"
                  style={{ backgroundColor: 'white' }}
                />
              </Grid>
            </Grid>
          </Grid>
  
          <Grid item style={{ marginLeft: "30px", marginBottom: "3px"}}> 
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        {/* Search results */}
        { showResults && (
          <Box
            sx={{ marginTop: "50px", borderRadius: "4px" }}
          >
            <Typography variant="subtitle1" color="inherit" sx={{ marginBottom: "20px" }}>
              {movieResults.length} {(movieResults.length == 1) ? "result:" : "results:"}
            </Typography>
            <Grid container
              spacing={2}
              direction='row'
              justifyContent='flex-start'
              alignItems='center'
              sx={{ paddingBottom: "40px" }}
            >
              {movieResults.map((id) => {
                return (
                  <Grid item xs={12}>
                    <MovieResult id={id} data={searchResults}/>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        )}

      </Box>
    </Box>
  )
}


const MovieResult = (props) =>{

  let reviewData = [];
  for (var item of props.data) {
    if (item.id == props.id){
      console.log("data: " + JSON.stringify(item));
      reviewData.push(item);
    }
  };
  console.log("Review data: "+JSON.stringify(reviewData));
  console.log("Review data type: "+typeof(reviewData));
  console.log("Review data 1: "+JSON.stringify(reviewData[0]));
  console.log("Review data 1 type: "+typeof(reviewData[0]));
  console.log("Review data 1 prop: "+JSON.stringify(reviewData[0].id));
  console.log("Review data 1 prop type: "+typeof(reviewData[0].id));
  let movieInfo = reviewData[0];
  

  return (
    <Box
      width="100%"
      sx={{ marginX: "20px", borderRadius: "2px" }}
    >
      <Card variant="outlined" sx={{ paddingLeft: "10px", paddingRight: "10px", marginRight: "20px" }}>
        <CardContent>
          <Grid container justifyContent="space-between" gutterbottom>
            <Grid item>
              <Typography variant="h5">
                {movieInfo.movie}
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                Rating: { (movieInfo.avgScore) ? (movieInfo.avgScore+'/5') : 'N/A' }
              </Typography> 
            </Grid>
          </Grid> 
          <Typography sx={{ mb: 3 }} color="text.secondary">
            Directed By: {movieInfo.directorName}
          </Typography>

          { (reviewData) && (reviewData.map((review) => {
            return ( (review.userID) &&
              <Typography variant="body2" sx={{ mb: 1 }} wrap >
                &#91;User {review.userID}&#93; {review.reviewTitle}
                <br />
                {review.reviewContent}
              </Typography>
            )
          })) }
{/* 
          <Typography variant="body2">
          &#91;User 2&#93; It was ok
            <br />
            {'"Give me a break, all the acting seemed SO FAKE"'}
          </Typography> */}
        </CardContent>
      </Card>
    </Box>
  )
}

export default Search;