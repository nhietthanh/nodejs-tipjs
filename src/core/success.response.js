"use strict";

const StatusCode = {
  CREATE: 201,
  OK: 200,
};

const ResonStatusCode = {
  CREATE: "Created!",
  OK: "Success",
};

class SuccessReponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    resonStatusCode = ResonStatusCode.OK,
    metadata = {},
  }) {
    this.message = !message ? resonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessReponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATE extends SuccessReponse {
  constructor({
    options = {},
    message,
    metadata = {},
    statusCode = StatusCode.CREATE,
    resonStatusCode = ResonStatusCode.CREATE,
  }) {
    super({ message, statusCode, resonStatusCode, metadata });
    this.options = options;
  }
}

module.exports = {
  CREATE,
  OK,
  SuccessReponse,
};
