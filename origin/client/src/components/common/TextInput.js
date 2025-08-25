import React from 'react'
import { TextField, InputAdornment } from '@material-ui/core'

function TextInput({ value, onChange, width, startAdornment }) {
  return (
    <TextField
      variant="outlined"
      value={value}
      onChange={onChange}
      style={{ width: width || 'auto' }}
      InputProps={startAdornment && {
        startAdornment: (
          <InputAdornment position="start">
            {startAdornment}
          </InputAdornment>
        ),
      }}
    />
  )
}

export default TextInput