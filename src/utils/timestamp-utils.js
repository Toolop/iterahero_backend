const getLocalISOString = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() / 60; // get the timezone offset in hours
  const gmtDate = new Date(date.setHours(date.getHours() + offset + 7));
  return gmtDate.toISOString();
};

module.exports = { getLocalISOString };
