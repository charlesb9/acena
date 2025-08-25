import React from 'react'
import { TextField, InputAdornment } from '@material-ui/core'
import NumberFormat from 'react-number-format';

function NumberFormatCustom(props) {
  const { inputRef, onChange, format, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      format={format}
    />
  );
}

function NumberInput({ suffix, format, width, value, onChange, disabled }) {
  return (
    <TextField
      value={value}
      onChange={onChange}
      variant="outlined"
      disabled={disabled}
      InputProps={{
        endAdornment: suffix && <InputAdornment position="end">{suffix}</InputAdornment>,
        inputComponent: NumberFormatCustom,
        inputProps: {
          format,
          style: { textAlign: 'right' },
        }
      }}
      style={{ width: width ? width : 'auto' }}
    />
  )
}

export default NumberInput