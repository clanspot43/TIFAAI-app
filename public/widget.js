async function sendCommand(command) {
  const res = await fetch('/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command })
  });
  const data = await res.text();
  alert(data);
}
