import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export class UserRepository {
  async createUser(name: string) {
    try {
      return await prisma.user.create({
        data: {
          name,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("User with that name already exists");
      }

      throw error;
    }
  }
  async findUserByName(name: string) {
    return prisma.user.findUnique({
      where : {
        name,
      }
    });
  }
}
export const userRepository = new UserRepository();
