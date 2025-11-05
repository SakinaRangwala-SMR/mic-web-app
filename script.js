let audioContext;
let stream;
let source;
let processor;
let mySocketId;

const socket = io();

// Save your socket ID
socket.on("connect", () => {
  mySocketId = socket.id;
});

// Start mic: local playback + streaming
async function startMic() {
  try {
    if (!stream) {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    source = audioContext.createMediaStreamSource(stream);

    // Play mic locally
    source.connect(audioContext.destination);

    // Create processor to send audio to server
    processor = audioContext.createScriptProcessor(2048, 1, 1);
    source.connect(processor);
    processor.connect(audioContext.destination); // optional if you want local monitoring via processor

    processor.onaudioprocess = function (e) {
      const inputData = e.inputBuffer.getChannelData(0);
      socket.emit("audioData", { id: mySocketId, data: Array.from(inputData) });
    };

    document.getElementById("status").textContent = "🎤 Microphone live!";
  } catch (err) {
    alert("⚠️ Microphone access denied or error: " + err.message);
  }
}

// Stop mic: stops everything
async function stopMic() {
  try {
    if (processor) {
      processor.disconnect();
      processor.onaudioprocess = null;
      processor = null;
    }

    if (source) {
      source.disconnect();
      source = null;
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }

    if (audioContext) {
      await audioContext.close();
      audioContext = null;
    }

    document.getElementById("status").textContent = "🛑 Microphone stopped.";
  } catch (err) {
    console.error("Error stopping mic:", err);
  }
}

// Play audio from other clients (ignore your own)
socket.on("playAudio", ({ id, data }) => {
  if (id === mySocketId) return; // ignore own stream

  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const buffer = audioContext.createBuffer(1, data.length, audioContext.sampleRate);
  buffer.copyToChannel(new Float32Array(data), 0);

  const playbackSource = audioContext.createBufferSource();
  playbackSource.buffer = buffer;
  playbackSource.connect(audioContext.destination);
  playbackSource.start();
});

document.getElementById("startBtn").addEventListener("click", startMic);
document.getElementById("stopBtn").addEventListener("click", stopMic);
