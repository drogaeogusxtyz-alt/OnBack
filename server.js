const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Render define a porta via variável de ambiente
const PORT = process.env.PORT || 3000;

// Cria a pasta uploads se não existir
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Configuração do Multer para salvar as fotos
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    // Salva com timestamp e número aleatório para evitar sobrescrever
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.static('public'));

// Endpoint para upload da foto
app.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Nenhuma foto enviada.' });
  res.json({ message: 'Foto recebida com sucesso!' });
});

app.get('/', (req, res) => {
  res.send('Servidor está rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
