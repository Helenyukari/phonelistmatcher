function normalize(raw) {
  const str = String(raw).trim();
  let digits = str.replace(/\D/g, '');

  // Remove country code (55) if present
  if (digits.length > 10 && digits.startsWith('55')) {
    digits = digits.slice(2);
  }

  // Return DDD (2 digits) + last 8 digits of subscriber number
  // This effectively ignores the 9th digit on Brazilian mobile numbers
  if (digits.length >= 10) {
    const ddd = digits.slice(0, 2);
    const subscriber = digits.slice(-8);
    return ddd + subscriber;
  }

  return digits;
}

module.exports = { normalize };
