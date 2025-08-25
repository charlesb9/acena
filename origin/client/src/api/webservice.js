import { DateTime } from "luxon"
import { convertDaysToHoursMin, formatHoursMin } from "../utils/Date"
import { store } from '../store/store'
import { addNotification } from '../store/userSlice'
import i18n from '../i18n'

import HttpClient from "../utils/HttpClient"

class Webservice {

  static async login(login, password) {
    try {
      const res = await HttpClient.post('/auth/login', { login, password })
      return res.data
    } catch (e) {
      if (e?.response?.data?.type === 'wrong_password') {
        store.dispatch(addNotification({ message: 'Identifant ou mot de passe incorrect', variant: 'error' }))
      }
    }
  }

  static async getMyInfos() {
    const res = await HttpClient.post('/auth/me')
    return res.data
  }

  static async getHdv(planeId) {
    try {
      const hdv = await HttpClient.get(`/plane/hdv/${planeId}`)
      const formattedHdv = hdv.data.hdv.map(h => {
        return {
          ...h,
          date: DateTime.fromISO(h.date).toFormat(i18n.t('date_format')),
          ht: formatHoursMin(h.HC, h.MC),// `${h.HC ?? ''}:${h.MC ?? ''}`,
          temps_vol: formatHoursMin(h.H, h.M),//`${h.H ?? ''}:${h.M ?? ''} `,
        }
      })
      return formattedHdv
    } catch (e) {

    }
  }

  static async postHdv(data) {
    const result = await HttpClient.post(`/plane/hdv/${data.planeId}`, data)
    return result.data
  }

  static async updateHdv(data) {
    const result = await HttpClient.put(`/plane/hdv/${data.planeId}/${data.hoursId}`, data)
    return result.data
  }

  static async deleteHdv(id) {
    const result = await HttpClient.delete(`/plane/hdv/${id}`)
    return result.data
  }

  static async sendEmail(subject, message, name, email, phone) {
    const result = await HttpClient.post(`/contact`, { subject, message, name, email, phone })
    return result.data
  }

  static async getPrevisions(planeId) {
    try {

      const previsions = await HttpClient.get(`/plane/previsions/${planeId}`)
      const formattedPrevisions = previsions.data.previsions.map(h => {
        return {
          ...h,
          Dlast: h.Dlast && DateTime.fromISO(h.Dlast).toFormat(i18n.t('date_format')),
          forecaste: h.forecaste && DateTime.fromISO(h.forecaste).toFormat(i18n.t('date_format')),
          Dnext: h.Dnext && DateTime.fromISO(h.Dnext).toFormat(i18n.t('date_format')),
          JHTnext: h.JHTnext && convertDaysToHoursMin(h.JHTnext).formatted,
          Hlast: h.Hlast && convertDaysToHoursMin(h.Hlast).formatted,
          Hremain: h.JHTnext && h.log && h.log[0] && h.log[0].AC_JHT && convertDaysToHoursMin(h.JHTnext - h.log[0].AC_JHT),
          Dremain: h.Dnext && Math.round(DateTime.fromISO(h.Dnext).diff(DateTime.now(), ["days"]).toObject().days),
          Cremain: h.Cnext && h.log && h.log[0] && h.log[0].AC_C && Math.round(h.log[0].AC_C - h.Cnext),
          schedule: h.schedule && DateTime.fromISO(h.schedule).toFormat(i18n.t('date_format')),
        }
      })
      return formattedPrevisions
    } catch (e) {

    }
  }

  static async updateUserData(userId, data) {
    try {
      const result = await HttpClient.put(`/user/${userId}`, data)
      return result.data
    } catch (e) {
      console.log(e)
    }
  }

  static async updateScheduleDate(id, data) {
    const result = await HttpClient.put(`/plane/previsions/schedule/${id}`, data)
    return result.data;
  }

  static async fetchExpiredForecaste(planeId) {
    const result = await HttpClient.get(`/plane/forecaste/${planeId}`)
    return result.data.result;
  }
}

export default Webservice