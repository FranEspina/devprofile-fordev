# dev profile for dev [Work in progress]
[![Cypress Tests](https://github.com/FranEspina/devprofile-fordev/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/FranEspina/devprofile-fordev/actions/workflows/main.yml)
## Funcionalidad
Web que permite a los usuario logarse y crear una cuenta de desarrollador donde poder mantener aspectos relacionados con el curriculum del desarrollador: 
 - Uso del Formato estándar de curriculum [JSON Resume](https://jsonresume.org/)
 - Creación de cuenta de usuario y gestión de autorización.
 - Crear manualmente todas las secciones de su curriculum.
 - Importar ficheros JSON con un curriculum
 - Validar fichros JSON para ver si cumplen el esquema estándar
 - Enlaces a recursos / tips / imágenes
 - Posibilidad de publicar tu curriculum en diferentes plantillas de CV
 - Posibilidad de compartir tus urls públicas a tu CV con las diferentes plantillas
 - Decidir que campos son públicos y cuales no

## Detalles técnicos
- Web realizada en Astro y con algún componente React. Estilada con tailwindCSS. Typescript.
- Backend realizado con express y contra un postgresql. Typescript.
- Gestión de autentificación y autorización con jwt tokens
- Modelos de formularios (frontend) y base de datos (backend) validados con zod.
- Validación de esquemas JSON
- Test e2e con Cypress y GitHub Actions

# Capturas

## Pantalla de inicio

<img src="./resources/home.png" alt="Pantalla de inicio" width="500px">

## Registro de CV por usuarios

<img src="./resources/cv.png" alt="Secciones del cv" width="500px">

## Formularios modales

<img src="./resources/modal.png" alt="Modales" width="500px">

## Registro, modo claro y responsive

<div style="display: flex; gap:10px; ">
  <img src="./resources/register.png" alt="Registro de usuarios" height="400px">
  <img src="./resources/light.png" alt="Modo claro y responsive" height="400px">
</div>

# TODO
- [ ] Validaciones de tamaños máximos en zod
- [x] Mostrar visualmente los datos opcionales en los formularios 
- [x] Las validaciones deberían estar al perder el foco los campos del formulario no sólo al grabar
- [x] Validaciones de fecha inicio y fin pendientes en algunos esquemas
- [x] FIX: al eliminar el último elemento de una sección lo borra en bd pero sigue en pantalla
- [x] Cambiar todas las secciones para que compartan el formulario de Edición y creación como se hizo posteriormente con las nuevas
- [ ] Revisar el scroll de los modales cunando la sección no entra verticalmente 
- [ ] Poder decidir si tu cv se puede ver públicamente
- [x] Poder indicar que campos se ven públicamente y cuales son privados
- [ ] Poder order dentro de las secciones
- [x] Crear vista pública del cv
- [x] Incluir todas las secciones del cv
- [x] Poder seleccionar la plantilla pública del cv (varios templates)
- [ ] Tener una validación de los campos / secciones que son obligatorios para poder usar una plantilla
- [ ] Revisar que la(s) plantilla(s) no da(n) un error no controlado cuando le(s) falta un campo
- [x] Permitir importar las secciones del cv según el esquema
- [x] Permitir exportar el cv a formato json segun el esquema
- [x] FIX. Revisar el esquema, las fechas y arrays se están exportando en un formato que no cumple el esquema
- [ ] Incluir un username en el registro del usuario y que sea único
- [ ] poder perdir las secciones públicas por 'username' y no por id de usuario
- [ ] Crear gestiones de aplicaciones asociadas al usuario para exponer una api_key
- [ ] Integrar la api con las peticiones por api_key
- [x] Verificar el token contra el api del backend en la autorización
- [ ] Unificar las cookies y el localStorage del token e id de usuario
- [ ] Que la api devuelva el tiempo de expiración del token y ver si merece la pena tener refreshtoken
- [x] Hacer la landingpage en el inicio
- [x] Poder borrar todas las secciones del CV de una vez
- [x] Poder implementar si al importar se hace un insert o delete/insert
- [ ] Implementar otras plantillas de [JSON Resume](https://jsonresume.org/themes/) o alternativas
      
# Créditos
- [Motomangucode Font](https://www.fontspace.com/Motomang-font-f101909)  by Meyerfonts (Bryndan Meyerholt)
- Esquema del JSON de CV de [jsonresume.org](https://jsonresume.org)
- Plantillas para combinar curriculumns:
 - Plantilla elegant. Basado en el diseño Elegant desarrollado por [Mudassir](https://github.com/mudassir0909)
 - Plantilla midudev. Basado en el diseño de [Bartosz Jarocki](https://github.com/BartoszJarocki/cv) y posteriormente implementada por midudev.
