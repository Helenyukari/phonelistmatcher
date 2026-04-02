const XLSX = require('xlsx');

function parseFile(buffer, filename) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const phones = [];

  for (const row of rows) {
    for (const cell of row) {
      const value = String(cell).trim();
      const digits = value.replace(/\D/g, '');
      // Consider it a phone number if it has at least 8 digits
      if (digits.length >= 8) {
        phones.push(value);
      }
    }
  }

  return phones;
}

module.exports = { parseFile };
