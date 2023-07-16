import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from '@modules/auth/auth.service';
import { BaseController } from '@modules/common/BaseController';
import { CreateCurrencyDto } from '@modules/currency/dto/create-currency.dto';
import { CurrencyService } from '@modules/currency/currency.service';
import { UpdateCurrencyDto } from '@modules/currency/dto/update-currency.dto';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    private readonly currencyService: CurrencyService,
  ) {
    super(authService);
  }

  @ApiBearerAuth('jwt')
  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currencyService.create(createCurrencyDto);
  }

  @ApiBearerAuth('jwt')
  @Get()
  findAll() {
    return this.currencyService.findAll();
  }

  @ApiBearerAuth('jwt')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyService.findOne(id);
  }

  @ApiBearerAuth('jwt')
  @Put()
  update(@Req() req: Request, @Body() updateCurrencyDto: UpdateCurrencyDto) {
    return this.currencyService.update(this.getUserId(req), updateCurrencyDto);
  }

  @ApiBearerAuth('jwt')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currencyService.remove(id);
  }
}
