import { login, getUser, updateUser, deleteUser, register, resetPassword } from '../config/api-routes/login'
import { api } from '../boot/axios'


let registerAjax = (params) => api({
  url: register,
  method: 'post',
  data: params
})

let loginAjax = (params) => api({
  url: login,
  method: 'post',
  data: params
})

let getUserAjax = (params) => api({
  url: getUser,
  method: 'get',
  param: params
})

let resetPasswordAjax = (params) => api({
  url: resetPassword,
  method: 'post',
  data: params
})

let updateUserAjax = (params) => api({
  url: updateUser,
  method: 'get',
  param: params
})

let deleteUserAjax = (params) => api({
  url: deleteUser,
  method: 'delete',
  data: params
})


export { loginAjax, getUserAjax, updateUserAjax, deleteUserAjax, registerAjax, resetPasswordAjax }
