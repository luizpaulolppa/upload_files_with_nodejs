const http = require("http");
const socketIO = require("socket.io");
const Routes = require("./routes");
const PORT = 3000;

const handler = function (request, response) {
  const defaultRoute = async (request, response) => response.end("Hello!");

  const routes = new Routes(io);
  const chosen = routes[request.method.toLowerCase()] || defaultRoute;

  return chosen.apply(routes, [request, response]);
};

const server = http.createServer(handler);
const io = socketIO(server, { cors: { origin: "*", credentials: false } });

io.on('connection', (socket) => console.log('someone connected', socket.id));

// const interval = setInterval(() => {
//   io.emit("file-uploaded", 5e6);
// }, 250);

const startServer = () => {
  const { address, port } = server.address();
  console.log(`App running at http://localhost:${address}:${port}`);
};

server.listen(PORT, startServer);