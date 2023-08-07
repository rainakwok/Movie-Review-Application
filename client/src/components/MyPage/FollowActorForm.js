import * as React from 'react';
//import all necessary libraries here, e.g., Material-UI Typography, as follows
import Typography from '@mui/material/Typography';
import { Grid, Button, TextField, Autocomplete, Link } from '@mui/material';

const FollowActorForm = (props) => {
  
  const [selectedActor, setSelectedActor] = React.useState(null);
  const [lastSelectedActor, setLastSelectedActor] = React.useState(null);

  /**
   * -1 = show error message (already following this actor)
   * 0 = don't show message
   * 1 = show success message
   */
  const [showMessage, setShowMessage] = React.useState(0);

  React.useEffect(() => {
    setLastSelectedActor(selectedActor);
  }, [selectedActor])

  const handleAddFollow = () => {
    if (selectedActor) {
      console.log("handleAddFollow called. Selected actor: " + selectedActor);

      if (!props.followList.includes(selectedActor)) {
        props.addFollowedActors(selectedActor);
    
        // Show the message, then hide it after 3 seconds (3000 milliseconds)
        setShowMessage(1);
      } else {
        setShowMessage(-1);
        setTimeout(() => {
          setShowMessage(0);
          setSelectedActor('');
        }, 3000);
      }
      console.log("showMessage set to: " + showMessage);
    }
  };
  
  const handleRefresh = () => {
    window.location.reload();
  }

  return (
    <Grid container
      direction="column"
      spacing={2}
      justifyContent="flex-start"
      alignItems="center"
    >
      <Grid item fullWidth>
        <Typography variant="h5" color="inherit">
          <strong>Follow a New Actor</strong>
        </Typography>
        <hr/>
      </Grid>
      <Grid item sx={{ width: "100%" }}>
        <ActorSelection
          selectedActor={selectedActor}
          setSelectedActor={setSelectedActor}
          actorList={props.actorList}
          setShowMessage={setShowMessage}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddFollow}
        >
          + Add Follow
        </Button>
      </Grid>
      {(showMessage == 1 && selectedActor)
        ?
        <>
        <Grid item>
          <Typography variant="caption" color="secondary">
            {lastSelectedActor} added to Followed Actors
          </Typography>
        </Grid> 
        <Grid item>
          <Link href="#" onClick={handleRefresh}>
            <i>Refresh Page</i>
          </Link>
        </Grid>
        </>
      : (showMessage == -1 && selectedActor)
        &&
        <Grid item>
          <Typography variant="caption" color="secondary">
            {lastSelectedActor} already in Followed List
          </Typography>
        </Grid> 
        }
    </Grid> 
  )
}

const ActorSelection = (props) => {

  //states declarations
  //constants and functions declarations
  
  const handleSelectActor = (event, newSelect) =>{
    props.setShowMessage (0);
    props.setSelectedActor(newSelect);
    console.log("Selected actor: " + newSelect);
  }

  return (
    <div>
      <Autocomplete
        disablePortal
        id="actor-combo-box"
        options={['', ...props.actorList]}
        sx={{ width: "auto" }}
        onChange={handleSelectActor}
        renderInput={(params) =>
          <TextField {...params} size="small" label="Select an Actor"/>}
      />
    </div>
  );
}

export default FollowActorForm;
