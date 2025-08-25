import React, { useState } from 'react'
import styled from 'styled-components'
import { Paper } from '@material-ui/core'
import AccountCircle from '@material-ui/icons/AccountCircle';
import { AlternateEmail, Call, Email, Send } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux'

import Layout from '../components/Layout'
import TextInput from '../components/common/TextInput'
import Textarea from '../components/common/Textarea'
import Button from '../components/common/Button'
import Webservice from '../api/webservice'
import { addNotification } from '../store/userSlice'
import useCheckMobile from '../utils/useCheckMobile'

const Container = styled.div`
  max-width: 1170px;
  margin: auto;
  padding: 20px;
  margin-bottom: 100px;
`

const SPaper = styled(Paper)`
  padding: 30px;
  display: flex;
  flex-direction: column;
`

const Label = styled.p`
  font-weight: 500;
`

const Row = styled.div`
display: flex;
flex-direction: column;
width: ${props => props.width ? props.width : 'auto'};
margin: 12px;
margin-left: ${props => props.noMarginLeft ? '0px' : '12px'};

@media (max-width: 780px) {
  width: 100%;
  margin-left: 0px;
}
`

const Divider = styled.div`
  height: 1px;
  width: 25%;
  background-color: rgba(0, 0, 0, 0.1);
  margin: auto;
  margin-top: 16px;
  margin-bottom: 16px;
`

function Contact() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [mailSent, setMailSent] = useState(false)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isMobile = useCheckMobile()

  const sendEmail = async () => {
    setLoading(true)
    const success = await Webservice.sendEmail(subject, message, `${firstname} ${lastname}`, email, phone)
    if (!success) {
      dispatch(addNotification({ message: "Une erreur est survenue lors de l'envoi du mail", variant: "error" }))
      setLoading(false)
      return
    }
    setLoading(false)
    setMailSent(true)
  }

  const isEmpty = (item) => !item || item.length === 0

  return (
    <Layout>
      <Container>
        <h3 className="page-title">{t('contact')}</h3>
        <SPaper>
          {mailSent ? (
            <>
              <h4>{t('thanks')}</h4>
              <p>{t('thanks_bis')}</p>
            </>
          ) : (
            <>
              <p style={{ fontWeight: 400, fontSize: 17, textAlign: 'center' }}>{t('contact_desc')}</p>
              <Divider />
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Row noMarginLeft>
                  <Label>{t('name')}: *</Label>
                  <TextInput value={lastname} onChange={e => setLastname(e.target.value)} width={!isMobile && "250px"} startAdornment={<AccountCircle />} />
                </Row>
                <Row>
                  <Label>{t('firstname')}: *</Label>
                  <TextInput value={firstname} onChange={e => setFirstname(e.target.value)} width={!isMobile && "200px"} startAdornment={<AccountCircle />} />
                </Row>
                <Row>
                  <Label>{t('mail')}: *</Label>
                  <TextInput value={email} onChange={e => setEmail(e.target.value)} width={!isMobile && "300px"} startAdornment={<AlternateEmail />} />
                </Row>
                <Row>
                  <Label>{t('phone')}: </Label>
                  <TextInput value={phone} onChange={e => setPhone(e.target.value)} width={!isMobile && "175px"} startAdornment={<Call />} />
                </Row>
              </div>
              <Row noMarginLeft width="100%">
                <Label>{t('subject')}: *</Label>
                <TextInput value={subject} onChange={e => setSubject(e.target.value)} startAdornment={<Email />} />
              </Row>
              <Row noMarginLeft width="100%">
                <Label>{t('message')}: *</Label>
                <Textarea value={message} onChange={e => setMessage(e.target.value)} lines={10} />
              </Row>
              <Button label={t('send')} onClick={sendEmail} loading={loading} startIcon={<Send />} disabled={[subject, message, firstname, lastname, email].some(el => isEmpty(el))} />
            </>
          )}
        </SPaper>
      </Container >
    </Layout >
  )
}

export default Contact