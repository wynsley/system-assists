export const menuByRole = {
  ADMIN: [
    {
      text: "Asistencia",
      submenu: [
        {
          text: 'Estudiante',
          href: 'attendance-student'
        },
        {
          text: 'Auxiliar',
          href: '/attendance-control'
        }
      ]
    },
    { 
      text: "Comportamiento",
      submenu: [
        {
          text: 'Estudiante',
          href: '/behavior-student'
        },
        {
          text: 'Auxiliar',
          href: '/behavior-control'
        },
      ]
    },
    {
      text: "Institución",
      href: "/institution",
    },
    {
      text: "Admin",
      submenu: [
        {
          text: "Registrar Estudiantes",
          href: "/admin/register-student",
        },
        {
          text: "Registrar Usuarios",
          href: "/admin/register-user",
        },
        {
          text: "Gestión Académica",
          href: "/admin/academic-management",
        },
      ],
    },
  ],

  
AUXILIAR: [
    {
      text: "Asistencia",
      href: "/attendance-control",
    },
    {
      text: "Comportamiento",
      href: "/behavior-control",
    },
    {
      text: "Institución",
      href: "/institution",
    },
  ],

  PARENT: [
    {
      text: "Asistencia",
      href: "/attendance-student",
    },
    {
      text: "Comportamiento",
      href: "/behavior-student",
    },
    {
      text: "Institución",
      href: "/institution",
    },
  ],
}