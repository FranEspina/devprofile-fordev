# dev profile for dev [Work in progress]
## Funcionalidad
Web que permite a los usuario logarse y crear una cuenta de desarrollador donde poder mantener aspectos relacionados con el desarrollo: 
 - Enlaces a recursos / tips / imágenes

## Detalles técnicos
- Web realizada en Astro y con algún componente React. Estilada con tailwindCSS. Typescript.
- Backend realizado con express y contra un postgresql. Typescript.
- Gestión de autentificación y autorización con jwt tokens
- Modelos de formularios (frontend) y base de datos (backend) validados con zod.
- Validación de esquemas zod con tipos genéricos (servicio de validación de esquemas)

# Capturas
## Gestión de usuarios
![Pantalla de inicio](./resources/home.png)
![Registro de usuarios](./resources/register.png)
## Registro de CV por usuarios
![CV](./resources/cv.png)
## Formularios modales
![Modales](./resources/modal.png)
## Modo claro y responsive
![Modo claro y responsive](./resources/light.png)

# TODO
- [] Validaciones de tamaños máximos en zod
- [] Poder decidir si tu cv se puede ver públicamente
- [] Poder indicar que campos se ven públicamente y cuales son privados
- [] Poder order dentro de las secciones
- [] Crear vista pública del cv
- [] Incluir todas las secciones del cv
- [] Permitir importar las secciones del cv según el esquema
- [] Permitir exportar el cv a formato json segun el esquema 
- [] Crear gestiones de aplicaciones asociadas al usuario para exponer una api_key
- [] Integrar la api con las peticiones por api_key

# Créditos
- [Motomangucode Font](https://www.fontspace.com/Motomang-font-f101909)  by Meyerfonts (Bryndan Meyerholt)
- Esquema del JSON de CV de [jsonresume.org](https://jsonresume.org)
- Basado en el diseño de [Bartosz Jarocki](https://github.com/BartoszJarocki/cv)
