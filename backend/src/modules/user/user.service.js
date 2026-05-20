import { prisma } from "../../config/prisma.js"

const userService = {
  createUser: async ({ firstname, lastname, email, passwordHash }) => {
    const USER_SELECT = {
      idUser: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
    const queryResult = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: { firstname, lastname, email, passwordHash, role: 'AUXILIAR'},
        select: USER_SELECT
      })
      console.log(passwordHash)
      return { user }
    })
    return queryResult
  }
}

export { userService }
