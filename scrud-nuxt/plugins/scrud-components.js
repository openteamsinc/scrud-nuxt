import Vue from 'vue'

import Person from '~/components/Person'
import PartnerProfile from '~/components/PartnerProfile'
import CardCollection from '~/components/CardCollection'

import Form from '~/components/Form'
import FormCompanyName from '~/components/Form/FormCompanyName'
import FormEmail from '~/components/Form/FormEmail'
import FormName from '~/components/Form/FormName'
import FormPhoneNumber from '~/components/Form/FormPhoneNumber'
import FormURL from '~/components/Form/FormURL'
import FormServiceSelect from '~/components/Form/FormServiceSelect'
import FormCompanyAddress from '~/components/Form/FormCompanyAddress'
import FormCountry from '~/components/Form/FormCountry'

import Email from '~/components/Render/Email'
import URL from '~/components/Render/URL'
import Services from '~/components/Render/Services'
import Skills from '~/components/Render/Skills'
import String from '~/components/Render/String'

const components = {
  Person,
  PartnerProfile,
  CardCollection,
  Form,
  FormCompanyName,
  FormEmail,
  FormName,
  FormPhoneNumber,
  FormURL,
  FormServiceSelect,
  FormCompanyAddress,
  FormCountry,
  Email,
  URL,
  Services,
  Skills,
  String
}

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
