class ApiResponse {
  static success(message, data = {}, meta = {}) {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  static created(message, data = {}, meta = {}) {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  static updated(message, data = {}, meta = {}) {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  static deleted(message, data = {}, meta = {}) {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  static error(message, error = {}, statusCode = 500) {
    return {
      success: false,
      message,
      error,
      statusCode,
    };
  }
}

module.exports = ApiResponse;
