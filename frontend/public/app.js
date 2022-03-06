const API_URL = 'http://localhost:3000';
const ON_UPLOADED_EVENT = 'file-uploaded';
let bytesAmount = 0;

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat(bytes / Math.pow(k, i).toFixed(dm) + " " + bytes[i]);
};

const updateStatus = (size) => {
  const text = `Pending Bytes to Upload: <strong>${formatBytes(size)}</strong>`;
  document.getElementById("size").innerHTML = text;
};

const updateMessage = (message) => {
  const msg = document.getElementById("msg");
  msg.innerHTML = message;
  msg.classList.add('alert', 'alert-success');

  setTimeout(() => msg.hidden = true, 3000);
};

const showSize = () => {
  const { files: fileElements } = document.getElementById("file");
  if (!fileElements) return;

  const files = Array.from(fileElements);
  const { size } = files.reduce(
    (prev, next) => ({ size: prev.size + next.size }),
    { size: 0 }
  );

  bytesAmount = size;
  updateStatus(size);
};

const configureForm = (targetUrl) => {
  const form = document.getElementById('form');
  form.action = targetUrl;
}

const showMessage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const serverMessage = urlParams.get('msg');
  if (!serverMessage) return;

  updateMessage(serverMessage);
}

const onload = () => {
  showMessage();

  const ioConnect = io.connect(API_URL, { withCredentials: false });
  ioConnect.on('connect', (msg) => {
    console.log('connected', ioConnect.id);
    const targetUrl = API_URL + `?socketId=${ioConnect.id}`;
    configureForm(targetUrl);
  });

  ioConnect.on(ON_UPLOADED_EVENT, (bytesReceived) => {
    console.log('connected', bytesReceived );
    bytesAmount = bytesAmount - bytesReceived;
    updateStatus(bytesAmount);
  });

  updateStatus(0);
};

window.onload = onload;
window.showSize = showSize;
