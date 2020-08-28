import Vue from 'vue'

import Person from '~/components/Person'
import PartnerProfile from '~/components/PartnerProfile'
import CardCollection from '~/components/CardCollection'

const components = {
  Person,
  PartnerProfile,
  CardCollection
}

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
