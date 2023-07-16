import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BaseController } from '@modules/common/BaseController';
import { AuthService } from '@modules/auth/auth.service';
import { CreateOfferDto } from '@modules/offer/dto/create-offer.dto';
import { OfferService } from '@modules/offer/offer.service';

@ApiTags('Offer')
@Controller('offer')
export class OfferController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    private readonly offerService: OfferService,
  ) {
    super(authService);
  }

  @ApiBearerAuth('jwt')
  @Post('createOffer')
  createOffer(@Req() req: Request, @Body() createOfferDto: CreateOfferDto) {
    return this.offerService.createOffer(createOfferDto, this.getUserId(req));
  }

  @ApiBearerAuth('jwt')
  @Post('acceptOffer/:id')
  acceptOffer(@Req() req: Request, @Param('id') id: string) {
    return this.offerService.acceptOffer(id, this.getUserId(req));
  }

  @ApiBearerAuth('jwt')
  @Get()
  findAll() {
    return this.offerService.findAll();
  }

  @ApiBearerAuth('jwt')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offerService.findOne(id);
  }
}
