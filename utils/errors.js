const BAD_REQUEST = 400;        // Bad Request (validation errors, invalid data)
const UNAUTHORIZED = 401;       // Unauthorized (authentication required)
const FORBIDDEN = 403;          // Forbidden (access denied)
const NOT_FOUND = 404;          // Not Found (resource doesn't exist)
const SERVER_ERROR = 500;       // Internal Server Error
const SUCCESS = 200;            // OK
const CREATED = 201;            // Created

module.exports = {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  SERVER_ERROR,
  SUCCESS,
  CREATED,
};
