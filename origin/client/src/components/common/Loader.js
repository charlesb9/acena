import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// Spinner won't be displayed for request time lower than this value
const DELAY = 350;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
}));
function DelayedSpinner({ label, color, small = false }) {
  const classes = useStyles();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(true), DELAY);
    return () => clearTimeout(timer);
  });

  return showSpinner && (
    <div className={classes.root}>
      <CircularProgress color={color} size={small ? 20 : 35} />
      {label && label}
    </div>
  )
}
export default DelayedSpinner;