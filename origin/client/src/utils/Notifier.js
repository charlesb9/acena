import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux'
import { dismissNotification, addNotification } from '../store/userSlice'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function Notifier() {
  const classes = useStyles();
  const dispatch = useDispatch()
  const notification = useSelector((state) => state.user.notification)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (notification) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [notification])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    dispatch(dismissNotification())
  };

  if (!notification) {
    return null
  }
  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={notification.duration ?? 3500} onClose={handleClose}>
        <Alert onClose={handleClose} severity={notification.variant ?? 'success'}>
          {notification.message}
        </Alert>
      </Snackbar>
      {/* <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}
    </div>
  );
}

export default Notifier