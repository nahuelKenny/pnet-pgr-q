import { api } from 'boot/axios'
import axios from 'axios'
import httpConst from '../config/httpConst'
import { Notify } from 'quasar'

let useApi = axios.create({
  baseURL: process.env.API,
  headers: {
    Accept: "application/json",
    //"accept": "application/ld+json",
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(async config => {
  //add header as needed
  return config
}, error => {
  Promise.reject(error)
})

api.interceptors.response.use( response => {
 //check response codes
 console.log("Response err first")
 let data = response.data
  if ( response.status === httpConst.CODE_OK) {
    return data
  }
}, error => {
  if (error.response && error.response.status ) {
    let { status } = error.response
    if ( !status ) {
      console.log("respnse err - crea notify de red")
      Notify.create({
        message: 'Error de red',
        type: 'warning'
      })
    } else {
      console.log("INterceptor show err")
      Notify.create({
        message: 'Error: ' + httpConst.err(status),
        type: 'warning'
      })
    }

  }
  return Promise.reject(error)
}
)

export default {
  useApi
}
