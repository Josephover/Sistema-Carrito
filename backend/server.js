const app = require('./src/app');
const { initializeSocket } = require('./src/sockets/cartSocket');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Verificar conexión a la BD antes de iniciar el servidor
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err.message);
    console.error('   Por favor verifica:');
    console.error('   - ¿PostgreSQL está ejecutándose?');
    console.error('   - ¿Las variables en .env son correctas?');
    console.error('   - ¿La base de datos "carrito_db" existe?');
    process.exit(1);
  }
  
  console.log('✅ Conexión a BD exitosa');
  console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
});

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Sistema listo en http://localhost:${PORT}`);
  console.log('📡 Socket.IO activado para actualizaciones en tiempo real\n');
});

// Inicializar Socket.IO
initializeSocket(server);
