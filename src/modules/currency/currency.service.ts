import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService, CustomException, ErrorMessages } from '@modules/common';
import { CreateCurrencyDto } from '@modules/currency/dto/create-currency.dto';
import { Currency } from '@modules/currency/entities/currency.entity';
import { CurrencyResponseViewModel } from '@modules/currency/response-models/currency.response';
import { UpdateCurrencyDto } from '@modules/currency/dto/update-currency.dto';

@Injectable()
export class CurrencyService extends BaseService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {
    super();
  }
  async create(
    createCurrencyDto: CreateCurrencyDto,
  ): Promise<CurrencyResponseViewModel> {
    const { currencyCode, name } = createCurrencyDto;
    const currencyInDB = await this.currencyRepository.findOne({
      where: [
        { currencyCode: createCurrencyDto.currencyCode },
        { name: createCurrencyDto.name },
      ],
    });
    if (currencyInDB) throw new CustomException(ErrorMessages.AlreadyExists);

    const currency = await this.currencyRepository.save({
      currencyCode,
      name,
    });

    return this.mapSourceToTarget<Currency, CurrencyResponseViewModel>(
      currency,
      CurrencyResponseViewModel,
    ) as CurrencyResponseViewModel;
  }

  async findAll(): Promise<CurrencyResponseViewModel[]> {
    const currencies = await this.currencyRepository.find();
    return this.mapSourceToTarget<Currency[], CurrencyResponseViewModel>(
      currencies,
      CurrencyResponseViewModel,
    ) as CurrencyResponseViewModel[];
  }

  async findOne(id: string): Promise<CurrencyResponseViewModel> {
    const currency = await this.currencyRepository.findOneBy({ id });
    if (!currency) throw new CustomException(ErrorMessages.CouldNotFound);
    return this.mapSourceToTarget<Currency, CurrencyResponseViewModel>(
      currency,
      CurrencyResponseViewModel,
    ) as CurrencyResponseViewModel;
  }

  async update(
    requesterUserId: string,
    updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<CurrencyResponseViewModel> {
    const { currencyCode, id, name } = updateCurrencyDto;

    const currencyInDB = await this.currencyRepository.findOne({
      where: { id },
    });
    let updatedCurrency: Record<string, unknown> = { ...currencyInDB }; //{ id, name: userInDB.name };

    if (currencyCode && currencyInDB.currencyCode !== currencyCode) {
      const isCurrencyCodeExists = await this.currencyRepository.findOne({
        where: { currencyCode },
      });
      if (isCurrencyCodeExists !== undefined)
        throw new CustomException(ErrorMessages.AlreadyExists);

      updatedCurrency = { ...updatedCurrency, currencyCode };
    }

    if (!!name && currencyInDB.name !== name)
      updatedCurrency = { ...updatedCurrency, name };

    const currency = await this.currencyRepository.save(updatedCurrency);

    return this.mapSourceToTarget<Currency, CurrencyResponseViewModel>(
      currency,
      CurrencyResponseViewModel,
    ) as CurrencyResponseViewModel;
  }

  async remove(id: string): Promise<boolean> {
    await this.currencyRepository.save({ id: id, isDeleted: true });

    return true;
  }
}
