import { ApiProperty } from '@nestjs/swagger';
import { EnvironmentVariables } from '@config/environment/EnvironmentVariables';

export class LoginDto {
  @ApiProperty({ default: 'obiwankenobi@jedicouncil.com' })
  email: string;

  @ApiProperty({ default: 123 })
  password: string;
}
