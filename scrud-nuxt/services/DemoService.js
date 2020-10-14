import CachingClient from 'caching-client'

const cachingClient = new CachingClient()

export default class DemoService {

  getPartnerProfile() {
    return cachingClient.get('http://localhost:8000/demo/examples/PartnerProfile')
      .then(res => {
        return res.json()
      })
  }

  getPartnerProfiles() {
    return cachingClient.get('http://localhost:8000/partner-profiles/')
      .then(res => {
        return res
      })
  }

  createPartnerProfile(data) {
    return cachingClient.post('http://localhost:8000/partner-profiles/', data)
  }

  editPartnerProfile(id, data) {
    return cachingClient.put(`http://localhost:8000/partner-profiles/${id}`, data)
  }

  clearCache() {
    cachingClient.clearCache()
  }

  get(url) {
    return cachingClient.get(url)
  }

  options(url) {
    return cachingClient.options(url)
  }

  post(url, data) {
    return cachingClient.post(url, data)
  }
}