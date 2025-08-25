import {
  KeyboardDatePicker as MDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  input: {
    textAlign: 'center'
  },
}));

function DatePicker({ value, onChange, disableFuture, disablePast, variant = "outlined", small = false }) {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <MDatePicker
      value={value}
      onChange={onChange}
      format={t('date_format')}
      autoOk
      disableFuture={true}
      disablePast={disablePast}
      inputVariant={variant}
      InputProps={{ style: { fontSize: small ? 10 : 'inherit', maxWidth: 250 }, classes: { input: classes.input } }}
      invalidDateMessage={t('invalid_date')}
    />
  )
}

export default DatePicker