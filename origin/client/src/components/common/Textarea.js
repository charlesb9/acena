import React from 'react'
import { TextField } from '@material-ui/core'

function Textarea({ value, onChange, lines = 5, width }) {
  return (
    <TextField variant="outlined" multiline rows={lines} value={value} onChange={onChange} style={{ width }} />
  )
}

export default Textarea