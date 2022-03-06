const url = require('url');

class Routes {
  #io
  constructor(io) {
    this.#io = io;
  }

  async post(request, response) {
    const { headers } = request;
    const { query: { socketId } } = url.parse(request.url, true);

    this.#io.to(socketId).emit('file-uploaded', 5e9);
    this.#io.to(socketId).emit('file-uploaded', 5e9);
    this.#io.to(socketId).emit('file-uploaded', 5e9);
    this.#io.to(socketId).emit('file-uploaded', 5e9);

    const onFinish = (response, redirectTo) => {
      response.writeHead(303, {
        Connection: 'close',
        Location: `${redirectTo}?msg=Files updated with success!`
      });

      response.end();
    }

    return onFinish(response, headers.origin);
  }
}

module.exports = Routes;