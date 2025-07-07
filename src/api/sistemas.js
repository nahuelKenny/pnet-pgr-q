import { getSistemas } from '../config/api-routes/sistemas'
import { api } from '../boot/axios'


let getSistemasAjax = () => api({
  url: getSistemas,
  method: 'get',
})



export { getSistemasAjax }
