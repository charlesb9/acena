import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FlightTakeoff from '@material-ui/icons/FlightTakeoff'
import QueryBuilder from '@material-ui/icons/QueryBuilder'
import { useHistory } from "react-router-dom";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import InputAdornment from '@material-ui/core/InputAdornment'
import { IconButton } from '@material-ui/core';
import { useTranslation, Trans } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';

import Layout from '../components/Layout'
import CustomTable from '../components/common/CustomTable';
import Webservice from '../api/webservice';
import { addNotification, set } from '../store/userSlice'
import Loader from '../components/common/Loader'

const Container = styled.div`
  max-width: 1170px;
  margin: auto;
  padding: 40px;
  margin-bottom: 150px;
  & .MuiTableCell-root {
    font-size: 13px;
  }
`

const Form = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 50px;
`

const StyledTextfield = styled(TextField)`
  margin-right: 20px !important;
  margin-top: 2px !important;
  & .MuiInputBase-input {
    font-size: 14px !important;
  }
  
@media (max-width: 780px) {
  margin-right: 0px;
}
`

const Label = styled.p`
  font-weight: bold;
  font-size: 14px;
  color: #555;
  margin: 0px;
`

const Row = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-width: 205px;
  
@media (max-width: 780px) {
  width: 100%;
  max-width: 100%;
}
`

const ButtonsContainer = styled.div`
display: flex;
justify-content: space-evenly;
width: 100%; 
@media (max-width: 780px) {
width: 200%;
    position: relative;
    right: 100%;
}
`

function User() {
  const user = useSelector((state) => state.user.value)
  const [data, setData] = useState({})
  const [showButton, setShowButton] = useState(false)
  let history = useHistory();
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [expanded, setExpand] = useState(true)

  const onChange = (property, value) => {
    setData(prev => ({ ...prev, [property]: value }))
  }

  useEffect(() => {
    if (!user) {
      setLoading(true)
    } else {
      setLoading(false)
    }
    setData(user)
  }, [user])

  useEffect(() => {
    if (JSON.stringify(user) !== JSON.stringify(data)) {
      setShowButton(true)
    } else {
      setShowButton(false)
    }
  }, [user, data])

  const updateUserData = async () => {
    const success = await Webservice.updateUserData(data.id, data)
    if (!success) {
      dispatch(addNotification({ message: "Une erreur est survenue lors de la mise à jour de vos données.", variant: "error" }))
    }
    Webservice.getMyInfos().then(res => {
      dispatch(set(res.user))
      dispatch(addNotification({ message: "Vos informations ont bien été modifiées." }))
    })
  }

  const Input = (label, property, type) => (
    <Row>
      <Label>{label}</Label>
      <StyledTextfield
        variant="outlined"
        margin="dense"
        value={data[property] || ''}
        onChange={e => onChange(property, e.target.value)}
        type={showPassword || !type ? 'text' : 'password'}
        InputProps={type && {
          endAdornment:
            <InputAdornment position="end" >
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
        }}
      />
    </Row>
  )

  // const headCells = [
  //   { name: 'immatriculation', label: t('immat') },
  //   { name: 'type_cellule', label: t('model') },
  //   { name: 'constructeur', label: t('constructor') },
  //   {
  //     name: '', label: '', options: {
  //       filter: false,
  //       sort: false,
  //       customBodyRenderLite: (dataIndex) => (
  //         <ButtonsContainer>
  //           <Tooltip title={t('tooltip_flights')} placement="left">
  //             <Button startIcon={<FlightTakeoff />} onClick={() => history.push('/flights/' + user?.planes[dataIndex].id)} variant="contained" color="primary">{t('flights')}</Button>
  //           </Tooltip>
  //           <Tooltip title={t('tooltip_previsions')} placement="right">
  //             <Button startIcon={<QueryBuilder />} onClick={() => history.push('/previsions/' + user?.planes[dataIndex].id)} variant="contained" color="secondary">{t('previsions')}</Button>
  //           </Tooltip>
  //         </ButtonsContainer>
  //       )
  //     }
  //   },
  // ]

  return (
    <>
      <Layout>
        <Container>
          {user ? (
            <>
              <h3 className="page-title" style={{ marginTop: 0 }}>
                <Trans i18nKey="welcome" values={{ name: ((data.title ? data.title : '') + ' ' + (data.lastName ? data.lastName : '') + ' ' + (data.firstName ? data.firstName : '')) }}>
                  Bonjour <b>{data.title ? data.title : ''} {data.lastName ? data.lastName : ''} {data.firstName ? data.firstName : ''}</b>
                </Trans>
              </h3>
              <h4 style={{ textAlign: 'center', marginBottom: 20, marginTop: 50 }}>{t('your_infos')}
                <IconButton onClick={() => setExpand(!expanded)}>{expanded ? <ExpandLess /> : <ExpandMore />}</IconButton>
              </h4>
              {expanded && (
                <Form>
                  {Input(t('infos_title'), 'title')}
                  {Input(t('infos_lastname'), 'lastName')}
                  {Input(t('infos_firstname'), 'firstName')}
                  {Input(t('infos_address'), 'address')}
                  {Input(t('infos_address_bis'), 'address_b')}
                  {Input(t('infos_zipcode'), 'zipcode')}
                  {Input(t('infos_phone'), 'phone')}
                  {Input(t('infos_mobile'), 'mobile')}
                  {Input(t('infos_email'), 'email')}
                  {Input(t('infos_password'), 'password', 'password')}
                </Form>
              )}
              {showButton && <div className="flex center"><Button color="primary" variant="contained" onClick={updateUserData}>{t('update_changes')}</Button></div>}
            </>
          ) : <Loader label={"Chargement de vos informations"} />}
          {/* <h4 style={{ textAlign: 'center', marginBottom: 20, marginTop: 50 }}>{t('your_planes')}</h4>
          {loading ? <Loader label={"Chargement de vos appareils"} /> : (
            <CustomTable
              data={user?.planes}
              headCells={headCells}
              rowsPerPage={5}
            />
          )} */}
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '75%', margin: 'auto', flexWrap: 'wrap' }}>
            <div onClick={() => history.push('/flights/')} className="user-card" style={{ borderRadius: 10, width: 250, height: 200, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <FlightTakeoff style={{ width: '70%', height: '70%', color: '#103358' }} />
              <h5 style={{ color: '#103358' }}>Gestion des vols</h5>
            </div>
            <div onClick={() => history.push('/previsions/')} className="user-card" style={{ borderRadius: 10, width: 250, height: 200, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <QueryBuilder style={{ width: '70%', height: '70%', color: '#103358' }} />
              <h5 style={{ color: '#103358' }}>Prévisions</h5>
            </div>
          </div>
        </Container>
      </Layout>
    </>
  )
}

export default User