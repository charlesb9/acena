import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  useHistory,
  useParams
} from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { DateTime } from 'luxon';
import { useTranslation, Trans } from 'react-i18next';

import Layout from '../components/Layout'
import Webservice from '../api/webservice';

import SelectInput from '../components/common/SelectInput';
import CustomTable from '../components/common/CustomTable';
import DateDialog from '../components/common/DateDialog'
import { addNotification } from '../store/userSlice'
import { Edit } from '@material-ui/icons';

const Container = styled.div`
  max-width: 1170px;
  margin: auto;
  margin-bottom: 150px;
  & .MuiTableCell-root {
    font-size: 13px;
  }
  & th {
    border: 1px solid #D3D3D3;
    & button {
      margin: auto;
    }
  }
`

const formatCell = (ranges, value) => {
  if (value < ranges[0]) {
    return 'red'
  } else if (value > ranges[0] && value < ranges[1]) {
    return 'orange'
  } else {
    return 'black'
  }
}

function User() {
  const { planeId } = useParams();
  const [previsions, setPrevisions] = useState([])
  const [plane, setPlane] = useState(null)
  let history = useHistory();
  const user = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [dateOpen, setDateOpen] = useState(false)
  const [date, setDate] = useState(null)

  const onPlaneChange = (plane) => {
    if (!plane) {
      return
    }
    const newPlane = user.planes.find(p => p.immatriculation === plane.immatriculation)
    setPlane(newPlane)
    history.replace(`/previsions/${newPlane.id}`)
  }

  useEffect(() => {
    async function fetchData() {
      const previsions = await Webservice.getPrevisions(planeId)
      setPrevisions(previsions)
    }
    if (planeId) {
      fetchData()
    }
    if (user?.planes) {
      const newPlane = user?.planes?.find(p => p.id == planeId)
      setPlane(newPlane)
    }
  }, [planeId, user?.planes])

  const onScheduleChange = async (id, newDate) => {
    const res = await Webservice.updateScheduleDate(id, { newDate })
    if (res.success === true) {
      const updatedPrev = previsions.map(prev => (prev.id == id ? { ...prev, schedule: newDate.toFormat(t('date_format')) } : prev))
      setPrevisions(updatedPrev)
      dispatch(addNotification({ message: t('planned_date_updated') }))
      setDateOpen(false)
      setDate(null)
    } else {
      dispatch(addNotification({ message: t('planned_date_updated_fail'), variant: "error" }))
    }
  }

  const onDateClicked = (date) => {
    setDate({ id: date?.id, value: date?.schedule ? DateTime.fromFormat(date?.schedule, t('date_format')) : null })
    setDateOpen(true)
  }

  const preHeadCells = [
    { id: 'designation', label: t('designation'), col: 1 },
    { id: 'rep_hours', label: t('rep'), col: 2 },
    { id: 'rep_days', label: t('last_app'), col: 2 },
    { id: 'last_hours', label: t('next_app'), col: 2 },
    { id: 'last_date', label: t('leftover'), col: 2 },
    { id: 'next_hours', label: t('date') },
    { id: 'next_hours', label: t('planned_date') },
  ];

  const headCells = [
    {
      name: 'action', label: ' ', width: '300px', options: {
        customBodyRenderLite: (dataIndex) => (
          <div style={{ maxHeight: 50, display: 'block', overflow: 'overlay', fontSize: 11, minWidth: 200, paddingTop: 8 }}>
            {previsions[dataIndex].action}
          </div>
        ),
        setCellHeaderProps: (value) => {
          return {
            style: { textAlign: 'center' },
            align: 'center'
          }
        }
      }
    },
    { name: 'repH', label: t('hours'), width: '80px' },
    { name: 'repJ', label: t('days'), width: '80px', },
    // { name: 'repC', label: t('cycles'), width: '80px' },
    { name: 'Hlast', label: t('hours'), width: '80px' },
    {
      name: 'Dlast', label: t('date'), width: '90px', options: {
        sortCompare: (order) => {
          return (a, b) => {
            const val1 = a.data ? DateTime.fromFormat(a.data, t('date_format')).toMillis() : 0
            const val2 = b.data ? DateTime.fromFormat(b.data, t('date_format')).toMillis() : 0
            return (val1 - val2) * (order === 'asc' ? 1 : -1);
          };
        }
      }
    },
    // { name: 'Clast', label: t('cycles'), width: '100px' },
    { name: 'JHTnext', label: t('hours'), width: '100px' },
    {
      name: 'Dnext', label: t('date'), width: '90px', options: {
        sortCompare: (order) => {
          return (a, b) => {
            const val1 = a.data ? DateTime.fromFormat(a.data, t('date_format')).toMillis() : 0
            const val2 = b.data ? DateTime.fromFormat(b.data, t('date_format')).toMillis() : 0
            return (val1 - val2) * (order === 'asc' ? 1 : -1);
          };
        }
      }
    },
    {
      name: 'Hremain',
      label: t('hours'),
      width: '100px',
      options: {
        customBodyRenderLite: (dataIndex) => (
          <div style={{ color: formatCell([0, 30], previsions[dataIndex].Hremain?.hours), fontWeight: 'bold' }}>
            {previsions[dataIndex].Hremain?.formatted}
          </div>
        )
      }
    },
    {
      name: 'Dremain', label: t('days'), width: '80px',
      options: {
        customBodyRenderLite: (dataIndex) => (
          <div style={{ color: formatCell([0, 30], previsions[dataIndex].Dremain), fontWeight: 'bold' }}>
            {previsions[dataIndex].Dremain}
          </div>
        )
      }
    },
    // {
    //   name: 'Cremain', label: t('cycles'), width: '80px', options: {
    //     customBodyRenderLite: (dataIndex) => (
    //       <div style={{ color: formatCell([0, 50], previsions[dataIndex].Cremain), fontWeight: 'bold' }}>
    //         {previsions[dataIndex].Cremain}
    //       </div>
    //     )
    //   }
    // },
    {
      name: 'forecaste', label: t('estimated_date'), width: '90px', options: {
        sortCompare: (order) => {
          return (a, b) => {
            const val1 = a.data ? DateTime.fromFormat(a.data, t('date_format')).toMillis() : 0
            const val2 = b.data ? DateTime.fromFormat(b.data, t('date_format')).toMillis() : 0
            if (val1 === 0) {
              return 1
            }
            else if (val2 === 0) {
              return -1
            }
            return (val1 - val2) * (order === 'asc' ? 1 : -1);
          };
        },
        customBodyRenderLite: (dataIndex) => (
          previsions[dataIndex]?.forecaste ?
            <div style={{ color: formatCell([DateTime.now().toMillis(), DateTime.now().plus({ days: 30 }).toMillis()], DateTime.fromFormat(previsions[dataIndex].forecaste, t('date_format')).toMillis()), fontWeight: 'bold' }}>
              {previsions[dataIndex]?.forecaste}
            </div> : null
        ),
      }
    },
    {
      name: 'schedule', label: t('date'), width: '90px', options: {
        sort: false,
        customBodyRenderLite: (dataIndex) => (
          <div style={{ cursor: 'pointer', width: '100%', height: '100%', minHeight: 25, color: 'blue', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => onDateClicked(previsions[dataIndex])}>
            {previsions[dataIndex]?.schedule ?? <Edit style={{ fontSize: 20, opacity: 0.5 }} />}
          </div>
        ),
        setCellHeaderProps: () => ({ align: 'center' })
      }
    },
  ];

  return (
    <>
      <Layout>
        <Container>
          <h3 className="page-title">
            <Trans i18nKey="prev_title" values={{ name: plane?.immatriculation }}>
              Prévisions pour <b>{plane?.immatriculation}</b>
            </Trans>
          </h3>
          <CustomTable
            data={previsions}
            headCells={headCells}
            preHeadCells={preHeadCells}
            dense
            grid
            sortOrder={{ name: 'forecaste', direction: 'asc' }}
            filter={false}
            preHeader={
              <SelectInput
                value={plane?.immatriculation || ''}
                onChange={v => onPlaneChange(v)}
                options={user.planes || []}
                optionLabel={o => o?.immatriculation || ""}
                style={{ width: '100%' }}
              />
            }
          />
          {dateOpen && (
            <DateDialog
              open={dateOpen}
              value={date.value}
              onConfirm={() => onScheduleChange(date.id, date.value)}
              onChange={(newDate) => setDate({ id: date.id, value: newDate })}
              onClose={() => { setDate(null); setDateOpen(false); }}
            />
          )}
        </Container>
      </Layout>
    </>
  )
}

export default User