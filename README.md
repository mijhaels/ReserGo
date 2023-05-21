# backend-parcial2

## Requerimientos
* NodeJS 16.0.0:
```
nvm install 16.0.0
```
* Angular 12.x.x https://cli.angular.io/
```
npm install -g @angular/cli@12.x.x
```
* Postgres 15.x https://www.postgresql.org/


## Base de Datos
Para poder levantar el proyecto, se necesita que esté creada una base de datos con nombre "parcial2"
* user = postgres 
* pass = postgres 

 de datos se configuró con el nombre *reservas* y las tablas son creadas (si no existen) por el servidor node (utilizando sequelize), al momento de levantar el servidor.


# Back End
Para levantar el backend, primero debe posicionarse en la carpeta "backend" y luego correr los sigiuentes comandos (Si la BD no está creada, no se levnatará el proyecto)

Primero se instalan todas las librerias necesarias
```
npm install
```

luego se levanta el proyecto con el sgte comando
```
npm start
```

# Front End
Para levantar el backend, primero debe posicionarse en la carpeta "backend" y luego correr los sigiuentes comandos

Primero se instalan todas las librerias necesarias
```
npm install
```

luego se levanta el proyecto con el sgte comando
```
ng serve
```