import * as React from 'react';
//import all necessary libraries here, e.g., Material-UI Typography, as follows
import Typography from '@mui/material/Typography';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const MovieSelection = (props) => {

  //states declarations
  //constants and functions declarations

  return (
    <FormControl fullWidth size="small" variant="filled" >
      <InputLabel id="select-movie">Movie</InputLabel>
      <Select
        required
        id="movies"
        value={props.selectedMovie}
        label="Select a movie"
        onChange={(e) => props.setSelectedMovie(e.target.value)}
      >
        {props.movies.map((movie) => {
          return <MenuItem value={movie.name}>{movie.name}</MenuItem>
        })}
      </Select>
      {(props.showMessage == -1 && !props.selectedMovie)
        ?
        <Typography variant="caption" color="error">
          Select your movie
        </Typography>
        : 
        (props.showMessage == 1 && props.selectedMovie)
        &&
        <Typography variant="caption" color="secondary">
          Your review has been received
        </Typography>
      }
    </FormControl>
  );
}

export default MovieSelection;
