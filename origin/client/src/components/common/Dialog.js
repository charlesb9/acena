import React from 'react';
import Button from '@material-ui/core/Button';
import MDialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function Dialog({ open, onClose, onConfirm, confirmLabel, cancelLabel = "Annuler", title, text }) {
  return (
    <MDialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} style={{ color: '#b71c1c' }} autoFocus>
          {confirmLabel}
        </Button>
      </DialogActions>
    </MDialog>
  );
}

export default Dialog