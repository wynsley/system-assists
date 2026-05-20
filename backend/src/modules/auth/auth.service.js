
import { prisma } from "../../config/prisma.js"

const authService = {
  getCredentials: async ({ email }) => {
    const queryResult = await prisma.user.findUnique({
      where: { email },
      select: {
        idUser: true,
        firstname: true,
        lastname: true,
        email: true,
        passwordHash: true,
        role: true
      }
    })
    return queryResult
  }
}

export { authService }
