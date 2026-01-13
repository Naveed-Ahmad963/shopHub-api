// src/utils/responses.js
// ============================================
export const sendResponse = (
  res,
  statusCode,
  success,
  message,
  data = null
) => {
  const response = {
    success,
    message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const sendSuccess = (res, statusCode, message, data = null) => {
  return sendResponse(res, statusCode, true, message, data);
};

export const sendError = (res, statusCode, message) => {
  return sendResponse(res, statusCode, false, message);
};
