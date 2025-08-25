import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import {
  useHistory,
  useParams
} from "react-router-dom";
import { useTranslation } from 'react-i18next';

import Tooltip from '@material-ui/core/Tooltip';
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'

import Layout from '../components/Layout'
import Webservice from '../api/webservice';
import SelectInput from '../components/common/SelectInput';
import CustomTable from '../components/common/CustomTable';
import Dialog from '../components/common/Dialog'
import { DateTime } from 'luxon';
import useCheckMobile from '../utils/useCheckMobile';

const Container = styled.div`
  max-width: 1170px;
  margin: auto;
  margin-bottom: 150px;
`

const ALERT_TEXTS = {
  warning: "Butée arrivant à échéance, ",
  error: "Butée dépassée, "
}

function Flights() {
  const { planeId } = useParams();
  const user = useSelector((state) => state.user.value)
  const [plane, setPlane] = useState(null)
  const [hdv, setHdv] = useState([])
  const [rowToDelete, setRowToDelete] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  let history = useHistory();
  const { t } = useTranslation()
  const isMobile = useCheckMobile()
  const [forecasteExpired, setForecasteExpired] = useState('')


  const onPlaneChange = (plane) => {
    if (!plane) {
      return
    }
    const newPlane = user.planes.find(p => p.immatriculation === plane.immatriculation)
    setPlane(newPlane)
    history.replace(`/flights/${newPlane.id}`)
  }

  const confirmDeleteHdv = (row) => {
    setRowToDelete(row)
    setDeleteOpen(true)
  }

  const onDeleteHdv = async (id) => {
    await Webservice.deleteHdv(id)
    setHdv(prev => (prev.filter(h => h.id !== id)))
    setDeleteOpen(false)
  }

  useEffect(() => {
    if (planeId && user?.planes?.length > 0) {
      setPlane(user.planes.find(p => p.id == planeId))
    }
  }, [planeId, user])

  useEffect(() => {
    async function fetchData() {
      const hdv = await Webservice.getHdv(plane.id)
      setHdv(hdv)
    }
    async function fetchExpiredForecaste() {
      const isExpired = await Webservice.fetchExpiredForecaste(plane.id)
      setForecasteExpired(isExpired)
    }
    if (plane && plane.id) {
      fetchData()
      fetchExpiredForecaste()
    }
  }, [plane])

  function compare(a, b) {
    if (a.immatriculation < b.immatriculation) {
      return -1;
    }
    if (a.immatriculation > b.immatriculation) {
      return 1;
    }
    return 0;
  }

  const PreHeader = () => {
    let sortedPlanes = user?.planes?.length > 0 ? [...user?.planes] : []
    sortedPlanes.sort(compare)
    return (
      <div className="flex center" style={{ justifyContent: 'flex-start' }}>
        <SelectInput
          value={plane?.immatriculation || ''}
          onChange={v => onPlaneChange(v)}
          options={sortedPlanes || []}
          optionLabel={o => o?.immatriculation || ""}
          style={{ width: 300, float: 'left' }}
        />
        {plane && (
          <Button
            variant="contained"
            startIcon="+"
            color="primary"
            onClick={() => history.push(`/hours/${planeId}`, { plane })}
            style={{ margin: 16, float: 'right' }}
          >
            {t(isMobile ? 'add_flights_mobile' : 'add_flights')}
          </Button>
        )}
      </div>
    )
  }

  const headCells = [
    {
      name: 'date', label: t('date'), options: {
        sortCompare: (order) => {
          return (a, b) => {
            const val1 = DateTime.fromFormat(a.data, t('date_format')).toMillis()
            const val2 = DateTime.fromFormat(b.data, t('date_format')).toMillis()
            return (val1 - val2) * (order === 'asc' ? 1 : -1);
          };
        },
        sort: true,
        sortDirection: 'desc'
      }
    },
    { name: 'temps_vol', label: t('flight_duration'), width: '120px' },
    { name: 'ATT', label: t('landings'), width: '30px' },
    { name: 'ht', label: t('ht_cell') },
    { name: 'ATTC', label: t('landings_t'), width: '30px' },
    { name: 'huile', label: t('oil'), width: '20px' },
    { name: 'carburant', label: t('fuel'), width: '20px' },
    {
      name: 'message', label: t('remark'), width: '80px', options: {
        customBodyRenderLite: (dataIndex) => (
          <div style={{
            maxHeight: 70, display: 'block', overflow: 'overlay', width: "200px"
          }}>
            {hdv[dataIndex].message}
          </div>
        )
      }
    },
    { name: 'pilote', label: t('pilot') },
    {
      name: 'situation', label: t('situation'),
    },
    {
      name: '', label: 'Actions', options: {
        sort: false,
        filter: false,
        customBodyRenderLite: (dataIndex) => (
          <Tooltip title={hdv[dataIndex]?.situation !== 'en cours' ? t('flight_not_editable') : ""} placement="right" arrow>
            <div style={{
              display: 'flex', width: 150, justifyContent: 'space-evenly'
            }}>
              <Button disabled={hdv[dataIndex]?.situation !== 'en cours'} variant="contained" color="secondary" onClick={() => history.push({
                pathname: `/hours/${planeId}/${hdv[dataIndex].id}`,
                state: {
                  data: hdv[dataIndex],
                  plane
                }
              })}>
                <Edit />
              </Button>
              <Button disabled={hdv[dataIndex]?.situation !== 'en cours'} variant="contained" style={{ background: hdv[dataIndex]?.situation !== 'en cours' ? 'rgba(0, 0, 0, 0.12)' : '#b71c1c', color: hdv[dataIndex]?.situation !== 'en cours' ? 'rgba(0, 0, 0, 0.26)' : '#fff' }} onClick={() => confirmDeleteHdv(hdv[dataIndex])}><Delete /></Button>
            </div>
          </Tooltip>
        )
      }
    },
  ];

  return (
    <Layout>
      <Container>
        {forecasteExpired && forecasteExpired !== 'ok' && <Alert severity={forecasteExpired}>{ALERT_TEXTS[forecasteExpired]} veuillez consulter les <a href={`/previsions/${planeId}`}>prévisions</a></Alert>}
        <h3 className="page-title">{t(plane ? 'flight_hours_title' : 'flight_hours_title_empty')}<b>{plane?.immatriculation}</b></h3>
        <CustomTable
          preHeader={PreHeader()}
          headCells={headCells}
          sortOrder={{ name: 'date', direction: 'desc' }}
          data={hdv}
          dense
        />
      </Container>
      {deleteOpen && (
        <Dialog
          title="Attention"
          text={<p>Supprimer l'heure de vol du <b>{rowToDelete?.date}</b> pour l'appareil <b>{plane?.immatriculation}</b> ?</p>}
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          confirmLabel="Supprimer"
          onConfirm={() => onDeleteHdv(rowToDelete.id)}
        />
      )}
    </Layout>
  )
}

export default Flights