# ⚡ API - Sistema Assist

API backend para gestión de asistencia, usuarios e incidencias.

---

## 🚀 Setup

```bash
npm install
npm run db:migrate
npm run dev
```

---

## 🌐 Base URL

http://localhost:3000

---

## 🔐 Autenticación

- Usa cookies HTTP-only
- El frontend debe enviar:

```js
credentials: "include"
```

---

## 🧠 Roles

ADMIN  
AUXILIAR  
PARENT  

---


## 📌 Endpoints

### Auth

<details>
  <summary>LOGIN</summary>
  
  POST /login

  Body:
  ```json
  {
    "email": "testing@hotmail.com",
    "password": "1234567a"
  }
  ```

  Response:
  ```json
  {
    "message": "Bienvenido Fernando Aliaga Pérez",
    "email": "testing@hotmail.com",
    "firstname": "Fernando",
    "lastname": "Aliaga Pérez",
    "role": "AUXILIAR"
  }
  ```

  Validations: 
  - email: requerido, trim, convertido a minúsculas, formato válido de email, máximo 100 caracteres.
  - password: requerida, trim, obligatoria, máximo 100 caracteres.
  - verifica que exista un usuario con el email proporcionado.
  - verifica que la contraseña coincida con el hash almacenado.

  ```json
  {
    "success": false,
    "message": "Usuario y/o contraseña incorrectos",
    "errors": {}
  }
  ```

</details>

<details>
  <summary>LOGOUT</summary>

  POST /logout

  Response:
  ```json
  {
    "message": "Sesión cerrada correctamente"
  }
  ```

  Validations:
  - requiere usuario autenticado.

  Error:
  ```json
  {
    "success": false,
    "message": "Sin autorización",
    "errors": {
      "message": "Sin autorización"
    }
  }
  ```

</details>

### Auxiliar

<details>
  <summary>REGISTER</summary>
  
  POST /auxiliar

  Body:
  ```json
  {
    "firstname": "Fernando", 
    "lastname": "Aliaga Pérez", 
    "email": "testing@hotmail.com", 
    "password": "1234567", 
    "repassword": "1234567"
  }
  ```

  Response:
  ```json
  {
    "idUser": 1,
    "firstname": "Fernando",
    "lastname": "Aliaga Pérez",
    "email": "testing@hotmail.com",
    "role": "AUXILIAR",
    "createdAt": "2026-05-20T17:45:33.123Z",
    "updatedAt": "2026-05-20T17:45:33.123Z"
  }
  ```

  Validations:
  - firstname: requerido, trim, 2–50 caracteres, solo letras y espacios.
  - lastname: requerido, trim, 2–50 caracteres, solo letras y espacios.
  - email: requerido, trim, formato email válido, convertido a minúsculas.
  - password: requerida, trim, 8–100 caracteres, mínimo una letra y un número.
  - repassword: requerida, trim, mínimo 8 caracteres, debe coincidir con password.

  ```json
  {
    "success": false,
    "message": "Error de validación",
    "errors": [
      {
        "field": "password",
        "message": "La contraseña debe tener mínimo 8 caracteres"
      },
      {
        "field": "password",
        "message": "La contraseña debe tener al menos una letra"
      },
      {
        "field": "repassword",
        "message": "La contraseña debe tener mínimo 8 caracteres"
      }, ...
    ]
  }
  ```
</details>

