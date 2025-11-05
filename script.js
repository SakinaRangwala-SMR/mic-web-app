let audioContext;
let stream;
let source;

async function startMic() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    source = audioContext.createMediaStreamSource(stream);
    source.connect(audioContext.destination);
    alert("🎤 Microphone is live! Speak and you'll hear yourself.");
  } catch (err) {
    alert("⚠️ Microphone access denied or error: " + err.message);
  }
}

function stopMic() {
  if (source) {
    source.disconnect();
  }
  if (audioContext) {
    audioContext.close();
  }
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  alert("🛑 Microphone stopped.");
}

document.getElementById("startBtn").addEventListener("click", startMic);
document.getElementById("stopBtn").addEventListener("click", stopMic);
