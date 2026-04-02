const express = require('express');
const multer = require('multer');
const path = require('path');
const { parseFile } = require('./src/parser');
const { compare } = require('./src/comparator');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/compare', upload.fields([
  { name: 'fileA', maxCount: 1 },
  { name: 'fileB', maxCount: 1 },
]), (req, res) => {
  try {
    if (!req.files?.fileA?.[0] || !req.files?.fileB?.[0]) {
      return res.status(400).json({ error: 'Envie dois arquivos (fileA e fileB).' });
    }

    const fileA = req.files.fileA[0];
    const fileB = req.files.fileB[0];

    const listA = parseFile(fileA.buffer, fileA.originalname);
    const listB = parseFile(fileB.buffer, fileB.originalname);

    const result = compare(listA, listB);
    res.json(result);
  } catch (err) {
    console.error('Erro ao processar arquivos:', err);
    res.status(500).json({ error: 'Erro ao processar os arquivos.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PhoneListMatcher rodando em http://localhost:${PORT}`);
});
