import * as React from 'react';
import Typography from "@mui/material/Typography";
import { Grid, Box, TextField, Button } from '@mui/material';

import NavAppBar from '../Navigation';

const MyPage = () =>{

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
          <Typography variant="h3" color="inherit" noWrap>
            <strong>My Page</strong>
          </Typography>
        </Grid>
        
        <Grid container
          spacing={2}
          direction='row'
          sx={{ marginTop: "20px" }}
          justifyContent='center'
          alignItems='flex-end'
        >
          <Grid item>  

          </Grid>
        </Grid>
      </Box>
    </Box>
  )


}

export default MyPage;