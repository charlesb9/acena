import React from 'react'
import styled from 'styled-components'
import { Button as MButton } from '@material-ui/core'
import Loader from './Loader'

const StyledButton = styled(MButton)`
  &.Mui-disabled {
    background: #132335 !important;
    opacity: 0.5 !important;
    color: #fafafa !important;
  }
`

function Button({ label, onClick, color = "primary", startIcon, endIcon, disabled, loading = false }) {
  return (

    <StyledButton
      onClick={!loading && onClick}
      color={color}
      variant="contained"
      startIcon={loading ? <Loader color="#fafafa" small /> : startIcon}
      endIcon={!loading && endIcon}
      disabled={disabled || loading}
      style={{
        height: 45
      }}
    >
      {!loading && label}
    </StyledButton>
  )
}

export default Button