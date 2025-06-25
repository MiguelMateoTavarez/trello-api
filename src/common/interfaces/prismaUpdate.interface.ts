import { Prisma } from '@prisma/client';

export interface PrismaUpdate {
  where: Prisma.UserWhereUniqueInput;
  data: Prisma.UserUpdateInput;
}
