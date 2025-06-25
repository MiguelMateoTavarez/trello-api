import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkspaceDto: CreateWorkspaceDto, userId: number) {
    const existingWorkspace = await this.prisma.workspace.findFirst({
      where: { name: createWorkspaceDto.name },
    });

    if (existingWorkspace) {
      throw new ConflictException('The workspace already exists');
    }

    return await this.prisma.workspace.create({
      data: {
        ...createWorkspaceDto,
        shortName: createWorkspaceDto.shortName,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findAll(userId: number) {
    return await this.prisma.workspace.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id, userId },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    return workspace;
  }

  async update(
    id: number,
    updateWorkspaceDto: UpdateWorkspaceDto,
    userId: number,
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    if (workspace.userId !== userId) {
      throw new ForbiddenException('You can update only your workspaces');
    }

    return this.prisma.workspace.update({
      where: { id },
      data: updateWorkspaceDto,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    if (workspace.userId !== userId) {
      throw new ForbiddenException('You can delete only your workspaces');
    }

    return this.prisma.workspace.delete({
      where: { id },
    });
  }
}
