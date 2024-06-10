# Replicar
Después de clonar el repositorio

``` bash
docker compose up -d
```

## Sin Docker
Para el servidor

``` bash
cd server
npm i
npm run start:dev
```

Para el cliente
``` bash
cd client
npm i
npm run dev
```

# TODO
- Página de administrador (en la universidad en la que estoy les gusta hacer todo manual así que esto es opcional tbh)
- Entidad Career para ya no manejarlas como texto 
- Reestructurar Usuarios para separar profesores, estudiantes y coordinadores