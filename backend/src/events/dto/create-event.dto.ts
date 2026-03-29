import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  store_id: string;

  @IsString()
  @IsNotEmpty()
  event_type: string;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}
