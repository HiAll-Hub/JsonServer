
# Custom JSON Server API

Este proyecto implementa un servidor personalizado usando Node.js para simular una API RESTful con datos dinámicos y archivos estáticos. Se puede utilizar para desarrollo y pruebas de prototipos sin necesidad de tener una base de datos real.

## Requisitos

- Node.js (v12 o superior)
- npm (o yarn)

## Instalación

1. Clona el repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tu-usuario/json-server-api.git
   cd json-server-api
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

## Uso

1. Inicia el servidor:

   ```bash
   node server.js
   ```

   El servidor escuchará en el puerto `3000` de forma predeterminada.

2. Accede a las rutas API en la URL base `http://localhost:3000`.
   ###### Si lo vas a usar en la App con expo recuerda usar el numero de la IP de la maquina para que el mobile tome la IP del pc y no del telefono.


   - **`GET /api/:db/:resource/:id`**: Obtiene un recurso específico de la base de datos.
   - **`GET /api/:db/:resource`**: Obtiene todos los recursos de un tipo determinado de la base de datos.
   - **`GET /public/:filename`**: Devuelve archivos estáticos como imágenes desde la carpeta `public/`.

3. Ejemplo de rutas:

   - `GET /api/db1/posts/1`: Obtiene el recurso con ID 1 de la colección `posts` de la base de datos `db1`.
   - `GET /api/db1/posts`: Obtiene todos los recursos de `posts` de la base de datos `db1`.
   - `GET /public/images/picture.jpg`: Devuelve el archivo `picture.jpg` que está en la carpeta `public/images`.

## Configuración

### Configuración de las bases de datos

Puedes cargar varias bases de datos al iniciar el servidor. Cada base de datos debe ser un archivo JSON dentro de la carpeta `db/` con una estructura como la siguiente:

```json
{
  "posts": [
    { "id": 1, "title": "Post 1", "content": "Contenido del post 1" },
    { "id": 2, "title": "Post 2", "content": "Contenido del post 2" }
  ],
  "comments": [
    { "id": 1, "postId": 1, "text": "Comentario 1" },
    { "id": 2, "postId": 2, "text": "Comentario 2" }
  ]
}
```

El archivo de configuración en `server.js` cargará todas las bases de datos que pongas en la carpeta `db/`.

### Archivos Estáticos

El servidor está configurado para servir archivos estáticos desde la carpeta `public/`. Coloca las imágenes y otros archivos estáticos en esta carpeta para poder acceder a ellos a través de rutas como `GET /public/images/poster.jpg`.

La estructura de tu proyecto debería verse más o menos así:

```
json-server-api/
│
├── db/
│   ├── db1.json
│   └── db2.json
│
├── public/
│   ├── images/
│   │   └── poster.jpg
│   └── other-files/
│       └── file.txt
│
└── server.js
```

### Bases de Datos Dinámicas

El servidor carga las bases de datos desde archivos JSON. Al iniciar el servidor, pasa el nombre de la base de datos como parámetro, o usa la configuración en `server.js` para cargar las bases de datos necesarias.

## Contribución

Si deseas contribuir al proyecto, por favor haz un fork del repositorio y envía un pull request con tus cambios. ¡Estaré encantado de revisar tu propuesta!

## Licencia

Este proyecto está bajo la licencia MIT.
