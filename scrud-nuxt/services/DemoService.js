import CachingClient from 'caching-client'

const cachingClient = new CachingClient(1,
                                        'read-through',
                                        'describedBy',
                                        'http://localhost:8123/json-schema/PartnerProfile')

export default class DemoService {

  getPartnerProfile (url) {
    return cachingClient.get(url)
      .then(res => { return res.json() })
  }

  getPartnerProfiles () {
    return cachingClient.get('http://127.0.0.1:8000/partner-profiles/')
      .then(res => { return res.json() })
  }

  createPartnerProfile (data) {
    return cachingClient.post('http://127.0.0.1:8000/partner-profiles/', data)
  }

  editPartnerProfile (url, data) {
      return cachingClient.put(url, data)
  }
}