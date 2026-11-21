// Temporary debug endpoint — DELETE after fixing
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const BIN_ID  = process.env.JSONBIN_BIN_ID;
  const API_KEY = process.env.JSONBIN_API_KEY;
  const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  const result = { BIN_ID, API_KEY_SET: !!API_KEY, API_KEY_LENGTH: API_KEY ? API_KEY.length : 0 };

  try {
    // Test READ
    const readRes = await fetch(BIN_URL + '/latest', {
      headers: { 'X-Master-Key': API_KEY }
    });
    result.read_status = readRes.status;
    result.read_body = await readRes.json();

    // Test WRITE
    const writeRes = await fetch(BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
      body: JSON.stringify({ posts: [{ id: 'test', title: 'Debug Test', createdAt: new Date().toISOString() }] })
    });
    result.write_status = writeRes.status;
    result.write_body = await writeRes.json();
  } catch (err) {
    result.error = err.message;
  }

  return res.status(200).json(result);
};
