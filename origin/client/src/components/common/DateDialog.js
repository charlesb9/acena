import React from 'react';
import Button from '@material-ui/core/Button';
import MDialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from 'react-i18next';

import DatePicker from '../common/DatePicker'

function DateDialog({ open, onClose, onConfirm, value, onChange }) {
  const { t } = useTranslation()
  return (
    <MDialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t('Modifier la date')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <DatePicker
            value={value}
            onChange={onChange}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} style={{ color: '#b71c1c' }}>
          {t('Annuler')}
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          {t('Valider')}
        </Button>
      </DialogActions>
    </MDialog>
  );
}

export default DateDialog