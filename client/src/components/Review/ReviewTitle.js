import * as React from 'react';
//import all necessary libraries here, e.g., Material-UI Typography, as follows
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';

const ReviewTitle = (props) => {

  //states declarations
  //constants and functions declarations

  return (
    <>
      <TextField
        fullWidth
        size="small"
        id="review-headline"
        label="Review Headline"
        value={props.enteredTitle}
        variant="outlined"
        sx={{background: "white"}}
        onChange={(e) => props.updateTitle(e.target.value)}
      />
      {(props.showMessage == -1 && !props.enteredTitle)
        &&
        <Typography variant="caption" color="error">
          Enter your review title
        </Typography>
      }
    </>
  );
}

export default ReviewTitle;
