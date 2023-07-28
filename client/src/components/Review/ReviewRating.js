import * as React from 'react';
//import all necessary libraries here, e.g., Material-UI Typography, as follows
import Typography from '@mui/material/Typography';
import { FormControl, FormControlLabel, FormLabel, RadioGroup, Radio } from '@mui/material';

const ReviewRating = (props) => {

  //states declarations
  //constants and functions declarations

  return (
    <>
      <FormControl>
        <FormLabel id="radio-buttons-group">Rating</FormLabel>
        <RadioGroup
          row
          aria-labelledby="radio-buttons-group"
          // defaultValue={5}
          name="radio-buttons-group"         
          value={props.selectedRating}
          onChange={(e) => props.updateRating(e.target.value)}
        >
          <FormControlLabel value={1} control={<Radio />} label="1" />
          <FormControlLabel value={2} control={<Radio />} label="2" />
          <FormControlLabel value={3} control={<Radio />} label="3" />
          <FormControlLabel value={4} control={<Radio />} label="4" />
          <FormControlLabel value={5} control={<Radio />} label="5" />
        </RadioGroup>
        {(props.showMessage == -1 && props.selectedRating == 0)
          ?
          <Typography variant="caption" color="error">
            Select the rating
          </Typography>
          : 
          (props.showMessage == 1 && props.selectedRating != 0)
          &&
          <Typography variant="caption" color="secondary">
            Your review has been received
          </Typography>
        }
      </FormControl>
    </>
  );
}

export default ReviewRating;
