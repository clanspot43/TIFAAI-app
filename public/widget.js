sync function triggerCommand(cmd) {
  const response = await fetch('/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command: cmd })
  });
  const data = await response.text();
  document.getElementById('status').innerText = data;
}
