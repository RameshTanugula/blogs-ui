
import './App.css';
import SideBar from './components/sidebar';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
function App() {
  return (
<Box sx={{ flexGrow: 1 }}>
<Grid container spacing={2}>
  <Grid item xs={4}>
    <SideBar />
  </Grid>
</Grid>
</Box>
  );
}

export default App;
