
const CODE_OK = 200
const CODE_UNAUTHORIZED = 401
const CODE_NOT_FOUND = 404
const CODE_SERVER_ERROR = 500
const CODE_REQUEST_FAIL = 400

let err = (stat) => {
  let statNum = parseInt(stat)
  switch (statNum) {
    case 401:
     return 'Acceso denegado, confirme sus credenciales';
    case 404:
      return 'Ruta no encontrada';
    case 500:
      return 'Error del servidor';
    case 400:
      return 'La petición al servidor ha fallado';
    default:
      return 'Error sin código de status';
  }
}
export default {
  CODE_OK,
  CODE_UNAUTHORIZED,
  CODE_NOT_FOUND,
  CODE_SERVER_ERROR,
  CODE_REQUEST_FAIL,
  err
}

