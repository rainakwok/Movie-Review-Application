import * as React from 'react';
//import all necessary libraries here, e.g., Material-UI Typography, as follows
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';

const ReviewBody = (props) => {

  //states declarations
  //constants and functions declarations

  const CHAR_LIMIT = 200;

  return (
    <>
      <TextField
        fullWidth
        multiline
        id="review-body"
        label="Write Your Review"
        variant="outlined"
        rows={5}
        value={props.enteredReview}
        sx={{background: "white"}}
        style={{ whiteSpace: "pre-line" }}
        inputProps={{ maxLength: CHAR_LIMIT }}
        helperText={`Character Count: ${props.enteredReview.length}/${CHAR_LIMIT}`}
        onChange={(e) => props.updateReview(e.target.value)}
      />      
      {(props.showMessage == -1 && !props.enteredReview)
        ?
        <Typography variant="caption" color="error">
          Enter your review
        </Typography>
        : 
        (props.showMessage == 1 && props.enteredReview)
        &&
        <Typography variant="caption" color="secondary">
          Your review has been received
        </Typography>
      }
    </>
  );
}

export default ReviewBody;
