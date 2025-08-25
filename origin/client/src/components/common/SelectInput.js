import React, { useState } from 'react'
import { Autocomplete } from '@material-ui/lab'
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core'

import useCheckMobile from '../../utils/useCheckMobile';

function SelectInput({ options, value, onChange, optionLabel = o => o, style }) {
  const [inputValue, setInputValue] = useState('')
  const { t } = useTranslation()
  const isMobile = useCheckMobile()

  return (
    <Autocomplete
      title="plane"
      style={style}
      options={options}
      getOptionLabel={option => optionLabel(option)}
      value={value || ''}
      onChange={(e, newValue) => onChange(newValue)}
      inputValue={inputValue}
      disableClearable
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            placeholder: t(isMobile ? 'select_placeholder_mobile' : 'select_placeholder'),
            margin: 'dense',
            style: {
              paddingRight: 8,
              height: 45,
            },
          }}
        />
      )}
      noOptionsText="Pas de résultat"
      openText="Ouvrir"
    />
  )
}

export default SelectInput