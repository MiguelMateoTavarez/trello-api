import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @MinLength(4)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  shortName?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
