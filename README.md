# Entrega proyecto final

El proyecto coinsiste de un organizador de agenda semanal implementando un sistema de guardado por sesión en servidor remoto mediante el consumo de una API REST construida en Django-python y persistencia mediante una base de datos en Postgress.

La principal finalidad del planteamiento de este enfoque fue extender los elementos aprendidos del curso a un aplicativo fullstack mediante la implementación de un sistema de inicio de sesión mediante JWT y consumo de api usando hooks y herramientas proporcionadas por el framework ReactJs así como protección de endopoints mediante CORS-policy.

> **Nota**: el despliegue web del aplicativo se hizo mediante la plataforma **Render** dada la facilidad que ofrece para despliegue de API y base de datos integrada. Para probar la versión desplegada en la web cree un usuario mediante la interfaz e inicie sesión.

## Integrantes del grupo: 
* Tomás Alejandro Delgado Ortíz - 20221020045 tadelgadoo@udistrital.edu.co

> * **Solicito** el certificado virtual
> * **NO necesito** el crédito de la materia
> * **Primera vez** viendo la materia 

# Instrucciones de despliegue (IMPORTANTE)
Dado que el proyecto se consolida a partir de tres componentes principales (frontend, API-backend y BD) a continuación se presenta una breve guía de despliegue para correr el aplicativo de manera local.
 ## Requisitos básicos de despliegue:

 - Node v22+
 - npm v10+
 - python 3.x
 - postgress 17

## 1. Despliegue frontend (ReactJs):
Una vez clonado el repositorio dirigrse al archivo ubicado en el siguiente directorio `/scheduleProject/frontend-React/front-react/src/enviroment.js` allí encontrará la variable de entorno de consumo de api.

Si desea probar unicamente el frontend dejar tal cual está, la configuración actual apunta al backend desplegado en render, sin embargo es posible que cause problemas por politicas de CORS dada la configuración de protección de endpoints del backend.

En caso de querer hacer una ejecución completa del aplicativo es necesario cambiar la variable `urlApi` por la direccion local en la que está corriendo el backend, como sugerencia se dejó comentada la direccion local por defecto que configura Django en el mismo archivo, por favor deje comentada la url del backend externo y quite la marca de comentarios de la url que está marcada como entorno local. En caso de desplegar el backend en una direccion o puerto personalizada es necesario configurarla en ese mismo archivo.

Una vez configurada la variable de entorno dirijase al directorio `/scheduleProject/frontend-React/front-react/` y abra allí una terminal en la que deberá ejecutar los siguientes comandos:
```bash
npm install

npm run dev
```
## 2.1 Base de datos
Como requisito previo al despliegue del API es necesario tener una base de datos corriendo en el motor Postgress.

>El backend está configurado de manera que se conecte por defecto a la base de datos desplegada en render, por lo que puede omitir este paso si opta por no usar una base de datos propia.

Para ello basta con crear una instancia de base de datos en la maquina local corriendo en el motor correspondiente o si lo prefiere en alguna plataforma de hosting web, el unico requisito es tener las credenciales a la mano.

Una vez tenga la instancia desplegada deberá crear un archivo llamado `.env` y guardarlo en la siguiente ruta `/scheduleProject/backend-django` el cual debe tener la siguiente estructura:

```properties
DEBUG=true
SECRET_KEY=[Clave de encriptacion del token a eleccion propia]

DB_ENGINE=django.db.backends.postgresql
DB_NAME=[nombre de la base de datos]
DB_USER=[Usuario de la base de datos]
DB_PASSWORD=[contraseña de la base de datos]
DB_HOST=[url del host de la BD]
DB_PORT=[Puerto en el que se aloja la BD]
```
## 2.2 Backend (Django REST framework)
### 2.2.1 Creación del entorno virtual (opcional pero recomendado):
Para instalar las dependencias necesarias para correr el backend es necesaria la creacion de un entorno virtual si no desea instalarlas de forma global en la maquina local.

Para ello simplemente dirijase al directorio `/scheduleProject/backend-django` y ejecute el siguiente comando:

```bash
python -m venv env
```
una vez creado activelo ejecutando el siguiente comando en la misma terminal:
```bash
env\Scripts\activate
```
a continuación notara que la ruta indicada en la terminal estará precedida por un **(env)** esto es el indicativo de que el entorno virtual fue activado correctamente. 

una vez haya terminado la ejecucion **completa** del aplicativo puede desactivar el entorno con el comando:
```bash
deactivate
```
### 2.2.2 Instalacion de dependencias y ejecución
una vez inicializado el entorno virtual procederemos a instalar la ultima versión de pip para instalar las dependencias del proyecto consignadas en `requirements.txt` usando los siguientes comandos en la terminal:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```
una vez instaladas las dependencias estaremos listos para ejecutar las migraciones correspondientes para preparar la base de datos con los siguientes comandos:

```bash
python manage.py makemigrations
python manage.py migrate
```
 Finalmente al correr el servidor este dejará expuesta la siguiente direccion por defecto: `http://127.0.0.1:8000` en caso de querer hacerlo se puede cambiar el puerto en el argumento del comando de ejecución. **Nota**: En caso de cambiar el puerto expuesto por defecto será necesario modificar la variable de entorno en el frontend. El comando para iniciar la ejecucion del API es el siguiente:

```bash
python manage.py runserver
```