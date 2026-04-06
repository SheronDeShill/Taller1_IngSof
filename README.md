# TALLER 1 INGENIERIA DE SOFTWARE, SISTEMA DE CHAT


# LENGUAJES (PREFERENTEMENTE DESCARGAR EN LA TERMINAL DEL COMPUTADOR)
LENGUAJE BACKEND-CHAT (node.js): 
LENGUAJE FRONTEND-CHAT (angular): npm install -g @angular/cli

# DEPENDENCIAS DE BACKEND-CHAT
npm install express mysql2 bcryptjs jsonwebtoken dotenv cors
npm install --save-dev nodemon
npm install cors
npm install socket.io

# DEPENDENCIAS DE FRONTEND-CHAT
npm install
npm install ngx-socket-io

# INCLUIR EN BACKEND-CHAT EL ARCHIVO ".env", CON LOS SIGUIENTES PARAMETROS:
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=taller1
JWT_SECRET =clave_super_secreta

# COMANDOS PARA INICIAR CADA SISTEMA
INICIAR BACKEND-CHAT: npm run dev
INICIAR FRONTEND-CHAT: ng serve
INICIAR CLIENTE_MOVIL: flutter run

NOTA: LOS COMANDOS SE DEBEN HACER DENTRO DE CADA CARPETA (cd CarpetaDestino)


# INSTRUCCIONES PARA INICIAR CLIENTE_MOVIL (LOCAL)
1.- conectar el computador con el celular a traves de un cable de datos
2.- activar las opciones de desarrollador -> depuracion por USB en el celular a utilizar
3.- permitir la transferencia de archivos en el celular
4.- iniciar el codigo (flutter run) en la carpeta cliente_movil y esperar (aprox 10m la primera vez). al terminar la aplicacion se iniciara automaticamente en el celular y dejara una aplicacion para abrise en cualquier momento.

NOTA: la base de datos solo funcionara mientras que el codigo este activo, al terminarse, la aplicacion no podra ejecutar más instrucciones, solo se podra acceder a las distintas interfaces que posee (modo offline).
