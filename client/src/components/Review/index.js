import * as React from 'react';
import ReviewTitle from './ReviewTitle';
import ReviewBody from './ReviewBody';
import ReviewRating from './ReviewRating';
import MovieSelection from './MovieSelection';
//import all necessary libraries here, e.g., Material-UI Typography, as follows
import Typography from '@mui/material/Typography';
import { Grid, CssBaseline, Box, Button } from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import NavAppBar from '../Navigation';

const serverURL = "";

const Review = () => {

  //states declarations
  //constants and functions declarations
  
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1a3bb4'
      },
      secondary: {
        main: '#639e96',
      },
      error: {
        main: '#c71502'
      }
    }
  })

  const [movies, updateMovies] = React.useState([]);
  const [selectedMovie, setSelectedMovie] = React.useState('');
  const [enteredTitle, updateTitle] = React.useState('');
  const [enteredReview, updateReview] = React.useState('');
  const [selectedRating, updateRating] = React.useState(0);
  
  /**
   * [Error message] showMessage = -1
   * [No message] showMessage = 0
   * [Success message] showMessage = 1
  */
  const [showMessage, controlMessage] = React.useState(0);
  const [recentHistory, updateHistory] = React.useState();

  const [userID, updateUserID] = React.useState(1);
  const [movieID, updateMovieID] = React.useState(0);

  React.useEffect(() => {
    loadMovies();
  }, []);
  
  const loadMovies = () => {
    callApiLoadMovies()
      .then(res => {
        console.log("callApiLoadMovies returned: ", res)
        var parsed = JSON.parse(res.express);
        console.log("callApiLoadMovies parsed: ", parsed);
        updateMovies(parsed);
      })
  }

  const callApiLoadMovies = async () => {
    const url = serverURL + "/api/getMovies";
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("User settings: ", body);
    return body;
  }
  
  React.useEffect(() => {
    movies.map((movie) => {
      if (movie.name == selectedMovie){
        updateMovieID(movie.id);
        console.log(movie.id);
      }
    })
  }, [selectedMovie]);

  const callApiAddReviews = async () => {
    const url = serverURL + "/api/addReview";
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieID: movieID,
        userID: userID,
        reviewTitle: enteredTitle,
        reviewContent: enteredReview,
        reviewScore: selectedRating
      })
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("Review added to database");
    return body;
  }

  // /**
  //  * When an entered value has been changed,
  //  * reset the showMessage state to 0 so that no messages are shown
  //  * */ 
  // React.useEffect(() => {
  //   controlMessage(0);
  // }, [selectedMovie, enteredTitle, enteredReview, selectedRating]);

  const handleSubmit = () => {
    // If all entered values are truthy, show success messages and the most recent review
    if (selectedMovie && enteredTitle && enteredReview && selectedRating) {
      controlMessage(1);
      movies.map((movie) => {
        if (movie.name == selectedMovie) {
          // Overwrite last submission with most recent review submission
          var tempHistory = {...movie, review: {
            heading: enteredTitle,
            body: enteredReview,
            rating: selectedRating }};
          updateHistory(tempHistory);

          // Update movies state
          var tempMovies = [...movies];
          tempMovies[movies.indexOf(movie)] = tempHistory;
          updateMovies(tempMovies);
        }
      })

      // Put review data into database
      callApiAddReviews();

    // Otherwise, show error messages
    } else {
      controlMessage(-1);
    }
  };

  const handleNewReview = () => {
    setSelectedMovie('');
    updateTitle('');
    updateReview('');
    updateRating(0);
    updateHistory();
    controlMessage(0);
  }
//c9c3e8
  return (
    <ThemeProvider theme={lightTheme}>
      <NavAppBar/>
      <CssBaseline/>
      <Box
        sx={{minHeight: "100vh", backgroundColor: '#e6f3fc', paddingTop: "30px", paddingBottom: "20px" }}
      >
        <Box style={{ marginLeft: "70px", marginRight: "70px"}}>
          {/* Title, subheading, and movie selection dropdown */}
          <Grid container
            spacing={1}
            direction='column'
            justifyContent='center'
            alignItems='center'
          >
            <Grid item >
              <Typography variant="h3" component="div">
                <strong>Review a movie</strong>
              </Typography>
            </Grid>    
            <Grid item sx={{ marginBottom: "15px" }}>
              <Typography variant="body1">
                Select a movie from the dropdown menu and leave a rating below!
              </Typography>
            </Grid>
            <Grid item sx={{width: "40%"}}>
              <MovieSelection
                movies={movies}
                setSelectedMovie={setSelectedMovie}
                selectedMovie={selectedMovie}
                showMessage={showMessage}/>
            </Grid>
          </Grid>

          {/* Review headline */}
          <Grid container
            spacing={2}
            direction='column'
            justify='flex-start'
            alignItems='center'
            sx={{marginTop: "20px"}}
          >
            <Grid item sx={{width: "100%", marginBottom: "20px"}}>
              <ReviewTitle
                updateTitle={updateTitle}
                enteredTitle={enteredTitle}
                showMessage={showMessage}/>
            </Grid>
          </Grid>
  
          {/* Review body, rating, and submit button */}
          <Grid container
            spacing={2}
            direction='row'
            justifyContent='space-between'
            alignItems='flex-start'
            sx={{ marginBottom: "30px" }}
          >              
            <Grid item xs={7}>
              <ReviewBody
                updateReview={updateReview}
                enteredReview={enteredReview}
                showMessage={showMessage}/>
            </Grid>

            <Grid container item
              xs={4.5}
              spacing={2}
              direction='column'
              justifyContent='space-between'
              alignItems='flex-start'
            >
              <Grid item>
                <ReviewRating
                  updateRating={updateRating}
                  selectedRating={selectedRating}
                  showMessage={showMessage} 
                />
              </Grid>
              <Grid item sx={{marginTop: "15px"}}>
                { (selectedMovie && enteredTitle && enteredReview && selectedRating && recentHistory)
                  ?
                  <Button variant="contained" onClick={handleNewReview}>
                    Submit New Review
                  </Button>
                  :
                  <Button variant="contained" onClick={handleSubmit}>
                    Submit
                  </Button>
                }
                {(showMessage == 1)
                  &&
                  <Grid item>
                    <Typography variant="caption" color="secondary">
                      Your review has been received
                    </Typography>
                  </Grid>
                }
              </Grid>            
            </Grid>
          </Grid>
          
          {/* If there exists a most recent review, show the 'Last submitted review' info */}
          { (recentHistory) && (
              <Grid container
                spacing={2}
                direction='row'
                justifyContent='flex-start'
                alignItems='flex-start'
                sx={{ marginLeft: "1px", marginBottom: "10px" }}
              >
                <Box
                  component="fieldset"
                  title='Last Submitted Review'
                  style={{width: "90vw"}}
                  sx={{ px: 3, pt: 1, pb: 1, border: '1px dashed grey', borderRadius: '15px' }}
                >
                  <legend
                    color="primary"
                  >Last Submitted Review: </legend>
                  <Grid item>
                    <Typography variant="body2" color="secondary">
                      <strong>Movie: </strong>{recentHistory.title}
                      <br/><strong>Rating: </strong>{recentHistory.review.rating}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="secondary">
                      <strong>Review: </strong>{recentHistory.review.heading}
                      <br/>&emsp;{recentHistory.review.body}
                    </Typography>
                  </Grid>
              </Box>
            </Grid>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Review;
