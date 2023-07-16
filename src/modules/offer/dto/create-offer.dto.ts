import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDto {
  @ApiProperty()
  sourceId: string;

  @ApiProperty()
  targetId: string;

  @ApiProperty()
  deposit: number;
}
