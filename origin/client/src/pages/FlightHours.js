import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  useHistory,
  useParams,
  useLocation,
} from "react-router-dom";
import { useTranslation } from 'react-i18next';

import Webservice from '../api/webservice'
import Button from '../components/common/Button'
import DatePicker from '../components/common/DatePicker'
import NumberInput from '../components/common/NumberInput'
import Textarea from '../components/common/Textarea'
import TextInput from '../components/common/TextInput'
import background from '../assets/hours_background.jpg'

import Layout from '../components/Layout'
import { Paper } from '@material-ui/core';
import { DateTime } from 'luxon';
import useCheckMobile from '../utils/useCheckMobile';
import Alert from '@material-ui/lab/Alert';

const Container = styled.div`
  max-width: 1170px;
  margin: auto;
  margin-bottom: 150px;
`
const Label = styled.p`
  font-weight: 500;
  color: black;
`

const Row = styled.div`
display: flex;
flex-direction: column;
opacity: ${props => props.disabled ? '0.3' : 1};
pointer-events: ${props => props.disabled ? 'none' : 'inherit'};
margin-right: 30px;
margin-bottom: 16px;
@media (max-width: 780px) {
  margin-right: 0px;
}
`

const StyledPaper = styled(Paper)`
  display: flex;
  position: relative;
`
const Form = styled.div`
padding: 30px;
 flex: 2;
 @media (max-width: 780px) {
  flex: 1;
  padding: 12px;
}
`
const Background = styled.div`
margin-left:30px;
flex: 1;
background: url(${background});
background-position: center;
background-repeat: no-repeat;
background-size: cover;
border-top-right-radius: 4px;
border-bottom-right-radius: 4px;
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: rgba(0,0,0,0.2);
  margin-top: 5px;
  margin-bottom: 5px;
  @media (max-width: 780px) {
    width: 90%;
  }
  `

function FlightHours() {
  const { planeId, hoursId } = useParams()
  const history = useHistory()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const [data, setData] = useState({
    planeId,
    hoursId,
    date: DateTime.now(),
    H: null,
    M: null,
    HC: null,
    MC: null,
    ATT: null,
    ATTC: null,
    pilote: '',
    carburant: null,
    huile: null,
    message: ''
  })
  const isMobile = useCheckMobile()
  const plane = location?.state?.plane

  useEffect(() => {
    if (location.state && location.state.data) {
      setData(prev => ({ ...prev, ...location.state.data, date: DateTime.fromFormat(location.state.data.date, t('date_format')) }))
    }
  }, [location])

  const update = (property, value) => {
    if (property === 'date') {
      // localStorage.setItem('date', value)
    }
    setData(prev => ({ ...prev, [property]: value }))
  }

  const postHdv = async () => {
    setLoading(true)
    const action = hoursId !== undefined ? Webservice.updateHdv : Webservice.postHdv
    await action({ ...data, huile: data.huile ? data.huile / 10 : data.huile, immat: plane?.immatriculation, date: data.date.toISODate() })
    history.goBack()
  }

  const canSubmit = () => {
    return (data.HC && data.MC) || (data.H && data.M)
  }

  const tdvDisabled = (data.HC && data.HC != 0) || (data.MC && data.MC != 0) || data.ATTC
  const htcDisabled = (data.H && data.H != 0) || (data.M && data.M != 0) || data.ATT


  return (
    <Layout>
      <Container>
        <h3 className="page-title">{t(hoursId ? 'edit_flights_title' : 'add_flights_title')}<b>{plane?.immatriculation}</b></h3>
        <StyledPaper>
          <Form>
            <Row>
              <Label>{t('form_flight_date')}*</Label>
              <DatePicker value={data.date} onChange={v => update('date', v)} disableFuture />
            </Row>
            <Divider />
            <h4>{t('flight_hours_caption')}</h4>
            <Alert severity="info"> <b>{t('flight_hours_warning')}</b></Alert>

            <div className="flex between" style={{ alignItems: 'center', maxWidth: '100%', minWidth: 415, marginBottom: 20, marginTop: 10, flexDirection: 'column' }}>

              <b>{t('flight_hours_total')}</b>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Row disabled={htcDisabled}>
                  <Label>{t('form_total_cell_time')}</Label>
                  <div>
                    <NumberInput disabled={htcDisabled} value={data.HC} suffix="H" onChange={v => update('HC', v.target.value)} format="#####" width="100px" />
                    <NumberInput disabled={htcDisabled} value={data.MC} suffix="M" onChange={v => update('MC', v.target.value)} format="##" width="75px"  />
                  </div>
                </Row>

                <Row disabled={htcDisabled}>
                  <Label>{t('form_landings_t')}</Label>
                  <NumberInput format="#####" value={data.ATTC} onChange={v => update('ATTC', v.target.value)} width="150px" />
                </Row>
              </div>
              <h3 style={{ margin: 16 }}>{t('or')}</h3>
              <b>{t('flight_hours_partial')}</b>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Row disabled={tdvDisabled}>
                  <Label>{t('form_flight_duration')}</Label>
                  <div>
                    <NumberInput disabled={tdvDisabled} value={data.H} suffix="H" onChange={v => update('H', v.target.value)} format="###" width="75px" />
                    <NumberInput disabled={tdvDisabled} value={data.M} suffix="M" onChange={v => update('M', v.target.value)} width="75px" format="##" />
                  </div>
                </Row>

                <Row disabled={tdvDisabled}>
                  <Label>{t('form_landings')}</Label>
                  <NumberInput format="###" value={data.ATT} onChange={v => update('ATT', v.target.value)} width="150px" />
                </Row>
              </div>
            </div>

            <Divider />

            <div className="flex" style={{ alignItems: 'center', maxWidth: '100%', minWidth: 415 }}>
              <Row>
                <Label>{t('form_pilot')}</Label>
                <TextInput value={data.pilote} onChange={v => update('pilote', v.target.value)} width="250px" />
              </Row>
            </div>

            <div className="flex" style={{ alignItems: 'center', maxWidth: '100%', minWidth: 415 }}>
              <Row>
                <Label>{t('form_fuel')}</Label>
                <NumberInput format="###" suffix="L" width="75px" value={data.carburant} onChange={v => update('carburant', v.target.value)} />
              </Row>
              <Row>
                <Label>{t('form_oil')}</Label>
                <NumberInput format="#,#" suffix="L" width="100px" value={data.huile} onChange={v => update('huile', v.target.value)} />
              </Row>
            </div>
            <Row>
              <Label>{t('form_remark')}</Label>
              <Textarea value={data.message} onChange={v => update('message', v.target.value)} />
            </Row>
            <Button
              loading={loading}
              label={hoursId ? t('edit') : t('validate')}
              onClick={postHdv} disabled={!data.date || data.date.invalid || !canSubmit()}
              width="100%"
            />
          </Form>
          {!isMobile && <Background />}
        </StyledPaper>
      </Container>
    </Layout >
  )
}

export default FlightHours