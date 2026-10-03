const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3110;

app.listen(PORT, () => {
  console.log(`🚀 Servidor Dashboard ejecutándose en http://localhost:${PORT}`);
  console.log(`📌 Health check disponible en http://localhost:${PORT}/healthz`);
});
