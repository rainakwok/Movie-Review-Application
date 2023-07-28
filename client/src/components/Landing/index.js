import React from 'react';
import Typography from "@mui/material/Typography";
import { Grid, Box } from '@mui/material';
// import GuardiansImg from "../../images/GuardiansOfTheGalaxyVol3.jpg"
// import TotoroImg from "../../images/MyNeighborTotoro.jpg"
// import SpiderverseImg from "../images/Spiderverse2.jpg"

import NavAppBar from '../Navigation';


const Landing = () => {
    const guardiansImg =  require("../../images/GuardiansOfTheGalaxyVol3.jpg");
    const totoroImg =  require("../../images/MyNeighborTotoro.jpg");
    const spiderverseImg =  require("../../images/Spiderverse2.jpg");

    return (
        <Box sx={{ flexGrow: 1 }}>
            <NavAppBar/>
            <Box style={{ marginLeft: "70px", marginRight: "70px", paddingTop: "40px" }}>
                <Grid container
                    spacing={1}
                    direction='column'
                    justifyContent='center'
                    alignItems='center'
                    style={{ marginBottom: "20px"}}
                >
                    <Typography variant="h3" color="inherit" noWrap>
                        <strong>Home</strong>
                    </Typography>
                </Grid>
                <hr/>
                <Grid container
                    spacing={1}
                    direction='column'
                    sx={{ marginTop: "30px" }}
                    justifyContent='center'
                    alignItems='left'
                >
                    <Typography variant="h5" noWrap>
                        <strong>Featured Movies:</strong>
                    </Typography>                    
                </Grid>
                
                <Grid container
                    spacing={2}
                    direction='row'
                    sx={{ marginTop: "20px" }}
                    justifyContent='space-evenly'
                    alignItems='center'
                >
                    <Grid item>
                        <img
                            src={guardiansImg}
                            style={{ height: '180px' }}
                        />            
                        <figcaption>Guardians of the Galaxy Vol. 3</figcaption>     
                    </Grid>
                    <Grid item>
                        <img 
                            src={spiderverseImg}
                            style={{ height: '180px' }}
                        />                
                        <figcaption>Spider-Man: Across the Spider-Verse</figcaption>    
                    </Grid>
                    <Grid item>
                        <img
                            src={totoroImg}
                            style={{ height: '180px' }}
                        />                 
                        <figcaption>My Neighbor Totoro</figcaption>   
                    </Grid>
                    
                </Grid>
            </Box>
        </Box>
    )
}
export default Landing;
    