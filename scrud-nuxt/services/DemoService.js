import CachingClient from 'caching-client'

const cachingClient = new CachingClient()

export default class DemoService {

  getPartnerProfile () {
    return cachingClient.get('http://127.0.0.1:8000/demo/examples/PartnerProfile')
      .then(res => { return res.json() })
  }

  getPartnerProfiles () {
    return cachingClient.get('http://127.0.0.1:8000/partner-profiles/')
      .then(res => { return res.json() })
  }

  createPartnerProfile (data) {
    return cachingClient.post('http://127.0.0.1:8000/partner-profiles/', data)
  }

  editPartnerProfile (id, data) {
    return cachingClient.put(`http://127.0.0.1:8000/partner-profiles/${id}`, data)
  }
}