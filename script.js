// Get the audio context and play mic sound directly to speakers
async function startMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(audioContext.destination); // connect mic directly to speaker
    alert("🎤 Microphone is live! Speak and you'll hear yourself.");
  } catch (err) {
    alert("⚠️ Microphone access denied or error: " + err.message);
  }
}

document.getElementById("startBtn").addEventListener("click", startMic);
