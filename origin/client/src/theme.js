import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#534bae',
      main: '#103358',
      dark: '#132335',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffd149',
      main: '#ffa000',
      dark: '#c67100',
      contrastText: '#000',
    },
    error: {
      main: '#b71c1c'
    }
  },
});

export default theme