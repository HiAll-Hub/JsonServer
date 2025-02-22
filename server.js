import { getIPAddress } from './libs/IPAddress.js';
import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtén la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtén el directorio del archivo actual
const __dirname = dirname(__filename);

const app = express();
const PORT = 3002;
const CONFIG_FILE = './config.json';
const PUBLIC_FOLDER = path.join(__dirname, 'public');

app.use((req, res, next) => {
    console.log(`Acceso a recurso: ${req.originalUrl}`);
    next();
});

app.use(cors({
    origin: '*', // Permitir todos los dominios
    methods: ['GET'], // Solo permitir GET
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(PUBLIC_FOLDER)); // Servir archivos estáticos desde "public/"


// 🔹 Cargar configuración de bases de datos
const loadConfig = () => fs.readJsonSync(CONFIG_FILE, { throws: false }) || { dbs: [] };

// 🔹 Cargar datos de todas las bases de datos definidas en la configuración
const loadDatabases = () => {
    const config = loadConfig();
    const databases = {};

    console.log('config:' + JSON.stringify(config));


    console.log(`[${new Date().toLocaleTimeString()}] - Cargando Bases de datos ...`);
    config.dbs.forEach(dbName => {
        console.log(`🔍 BD Loading: ${dbName}`);
        const dbPath = `./data/${dbName}.json`;
        if (fs.existsSync(dbPath)) {
            databases[dbName] = fs.readJsonSync(dbPath, { throws: false }) || {};
        } else {
            console.warn(`⚠️  Base de datos no encontrada: ${dbPath}`);
        }
    });

    return databases;
};

const ipAddress = getIPAddress();

let databases = loadDatabases();

// 🔹 Endpoint para obtener toda la información de una base de datos
app.get('/api/:db', (req, res) => {
    const { db } = req.params;

    console.log(`🔍 [${new Date().toLocaleTimeString()}] - Consultando: ${db}`);

    if (!databases[db]) {
        return res.status(404).json({ error: `Database '${db}' not found` });
    }

    res.json(databases[db]);
});

// 🔹 Endpoint para obtener todos los datos de un recurso en una base de datos específica
app.get('/api/:db/:resource', (req, res) => {
    const { db, resource } = req.params;

    console.log(`🔍 [${new Date().toLocaleTimeString()}] - Consultando: ${db}/${resource}`);

    if (!databases[db]) {
        return res.status(404).json({ error: `Database '${db}' not found` });
    }

    if (!databases[db][resource]) {
        return res.status(404).json({ error: `Resource '${resource}' not found in database '${db}'` });
    }

    res.json(databases[db][resource]);
});

// 🔹 Endpoint para obtener un ítem específico dentro de un recurso en una base de datos
app.get('/api/:db/:resource/:id', (req, res) => {
    const { db, resource, id } = req.params;

    console.log(`🔍 [${new Date().toLocaleTimeString()}] - Consultando recurso: ${db}/${resource}/${id}`);

    if (!databases[db]) {
        return res.status(404).json({ error: `Database '${db}' not found` });
    }

    if (!databases[db][resource] || !databases[db][resource][id]) {
        return res.status(404).json({ error: `ID '${id}' not found in resource '${resource}' of database '${db}'` });
    }

    res.json(databases[db][resource][id]);
});

// 🔹 Recargar las bases de datos en memoria (por si se actualizan los archivos)
app.get('/reload', (req, res) => {
    databases = loadDatabases();
    res.json({ message: `[${new Date().toLocaleTimeString()}] - Databases reloaded successfully` });
});

app.listen(PORT, () => {
    console.log(`📡 Server running at http://${ipAddress}:${PORT}/api`);
});


process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', (key) => {
    if (key === 'r' || key === 'R') {
        console.log(`\n🔄 Recargando bases de datos... [${new Date().toLocaleTimeString()}]`);
        databases = loadDatabases();
    } else if (key === '\u0003') { // Ctrl+C para salir
        console.log('\n👋 Saliendo del servidor...');
        process.exit();
    }
});