const video = document.getElementById('video');
const progress = document.getElementById('progress');
const msg = document.getElementById('msg');

let stream = null;

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    takePhotos();
  } catch (err) {
    msg.textContent = 'Erro ao acessar a câmera: ' + err.message;
    progress.textContent = '';
  }
}

async function takePhotos() {
  const totalPhotos = 5;
  let taken = 0;

  progress.textContent = `Tirando fotos...`;

  // Espera a câmera carregar
  await new Promise(res => setTimeout(res, 1000));

  const canvas = document.createElement('canvas');
  
  function captureAndSend() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video,0,0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('photo', blob, `foto${taken+1}.png`);
      try {
        await fetch('/upload', { method:'POST', body: formData });
        taken++;
        progress.textContent = `Foto ${taken} de ${totalPhotos} enviada.`;
        if (taken < totalPhotos) {
          setTimeout(captureAndSend, 1000); // tira uma foto por segundo
        } else {
          progress.textContent = '';
          msg.textContent = 'Todas as fotos foram enviadas com sucesso!';
          if (stream) stream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        msg.textContent = 'Erro ao enviar foto.';
      }
    }, 'image/png');
  }

  captureAndSend();
}

startCamera();
