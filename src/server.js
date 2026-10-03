const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🍷 Servidor Restaurante Gourmet "La Dolce Vita" activo en http://localhost:${PORT}`);
  console.log(`📌 Health check en http://localhost:${PORT}/healthz`);
});
