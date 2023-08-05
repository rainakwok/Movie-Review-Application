import * as React from 'react';
import Typography from "@mui/material/Typography";
import { Grid, Box, styled } from '@mui/material';
import { List, ListItem, ListItemText, ListItemButton, Collapse } from '@mui/material';
import FollowActorForm from './FollowActorForm';

import NavAppBar from '../Navigation';

const serverURL = "";

const MyPage = () =>{

  const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));
  
  const [userID, updateUserID] = React.useState(1);

  const [actorList, setActorList] = React.useState(['']); // list of all actors
  const [followList, updateFollowList] = React.useState([]); // list of followed actor names
  const [followInfo, updateFollowInfo] = React.useState(['']); // info for each actor on followList
  const [openToggle, setOpenToggle] = React.useState([]); // set open/close state of each followed artist toggle

  React.useEffect(() => {
    loadAllActors();
    loadFollowedActors();

    var tempOpenArr = [];    
    for (var i = 0; i < followList.length; i++){
      setOpenToggle(tempOpenArr.push(false));
    }
    console.log("openToggle [0]: " + openToggle[0]);
  }, []) 

  const setFollowing = (info) => {
    var tempList = [];
    if (typeof(info) == "string"){
      tempList = followList;
      tempList.push(info);
    } else {
      tempList = Array.from(new Set(info.map(obj => obj.actorName)));
    }
    updateFollowList(tempList);
    console.log("Updated Followed Actors list: ", tempList);    
  }

  const loadFollowedActors = () => {
    callApiLoadFollowedActors()
      .then(res => {
        console.log("callApiLoadFollowedActors returned: ", res)
        var parsed = JSON.parse(res.express);
        console.log("callApiLoadFollowedActors parsed: ", parsed);

        updateFollowInfo(parsed);
        setFollowing(parsed);
      })
  }

  const callApiLoadFollowedActors = async () => {
    const url = serverURL + "/api/loadFollowedActors";
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("Followed Actors info: ", body);
    return body;
  }

  const addFollowedActors = (selectedActor) => {
    setFollowing(selectedActor);
    
    callApiAddFollowedActors()
      .then(res => {
        console.log("callApiAddFollowedActors returned: ", res)
        var parsed = JSON.parse(res.express);
        console.log("callApiAddFollowedActors parsed: ", parsed);
        
        setOpenToggle(openToggle.push(false));
      })
  }

  const callApiAddFollowedActors = async () => {
    const url = serverURL + "/api/addFollowedActors";
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: userID,
        actorName: followList[followList.length - 1]
        })
    })
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("Retrieved Followed Actors info: ", body);
    return body;
  }

  const loadAllActors = () => {
    callApiLoadAllActors()
      .then(res => {
        console.log("callApiLoadAllActors returned: ", res)
        var parsed = JSON.parse(res.express);
        console.log("callApiLoadAllActors parsed: ", parsed);
        var tempList = parsed.map(obj => obj.actorName);
        console.log("All Actors: ", tempList);
        setActorList(tempList);
      })
  }
  
  const callApiLoadAllActors = async () => {
    const url = serverURL + "/api/loadAllActors";
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("List of All Actors: ", body);
    return body;
  }

  const handleList = (index) => {
    var tempOpenToggle = {...openToggle};
    console.log(tempOpenToggle[index]);
    tempOpenToggle[index] = !tempOpenToggle[index];
    console.log(tempOpenToggle[index]);

    setOpenToggle(tempOpenToggle);
  }

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#e6f3fc', minHeight: '100vh' }}>
      <NavAppBar/>
      <Box style={{ marginLeft: "80px", marginRight: "80px", paddingTop: "50px", overflow: "hidden"}}>
        <Grid container
          spacing={1}
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          style={{ marginBottom: "20px"}}
        >
          <Grid item>
            <Grid container
              spacing={2}
              direction='column'
              justifyContent='center'
              alignItems='flex-start'
            >
              <Grid item>
                <Typography variant="h3" color="inherit" noWrap>
                  <strong>My Page</strong>
                </Typography>
              </Grid>
              
              <Grid item>
                <Typography variant="subtitle1" color="inherit" noWrap>
                  Following {followList.length} { (followList.length == 1) ? "actor" : "actors"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4} 
            style={{ marginRight: "50px" }}
          >
            <Box
              fullWidth
              sx={{ padding: "20px", backgroundColor: "white",
                border: '1px solid #c0b9c9', borderRadius: "10px" }}
            >
              <FollowActorForm
                actorList={actorList}
                followList={followList}
                addFollowedActors={addFollowedActors}
              />
            </Box>
          </Grid>
        </Grid>

        <Grid container
          spacing={2}
          direction='row'
          sx={{ marginTop: "20px", paddingBottom: "40px" }}
          justifyContent='flex-start'
          alignItems='center'
        >
          {followList.map((actor, index) => {
            return (
              <Grid item xs={12}> 
                <Demo>
                <List>
                  <ListItemButton onClick={(actor) => handleList(index)}>
                    <ListItem>
                      <ListItemText
                        primary={ openToggle[index] ? <span>&#9660;&ensp;{actor}</span> : <span>&#9658;&ensp;{actor}</span>}
                      />
                    </ListItem>
                  </ListItemButton>
                  <Collapse in={openToggle[index]} timeout="auto" unmountOnExit>
                    {followInfo &&  
                      <Box
                        sx={{ marginLeft: "60px" }}
                      >                      
                        {followInfo.map((item) => {
                          return (
                            <>
                              {(item.actorName == actor)
                                &&
                                <Typography sx={{ mb: "5px" }}>
                                  <strong>Movie: </strong> {item.movie}<br/>
                                  <strong>Role: </strong> {item.role}
                                </Typography>}
                            </>
                          )                     
                        })}
                      </Box>
                    }
                  </Collapse>
                </List>
                </Demo>
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </Box>
  )

}

export default MyPage;