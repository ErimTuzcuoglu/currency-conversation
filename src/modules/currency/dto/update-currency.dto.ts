import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCurrencyDto } from '@modules/currency/dto/create-currency.dto';

export class UpdateCurrencyDto extends PartialType(CreateCurrencyDto) {
  @ApiProperty()
  id: string;
}
