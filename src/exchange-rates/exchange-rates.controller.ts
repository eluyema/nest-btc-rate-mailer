import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { CurrencyNames } from './exchange-rates.enums';
import { ExchangeRatesService } from './exchange-rates.service';

@Controller('/')
export class ExchangeRatesController {
    constructor(private readonly exchangeRatesService: ExchangeRatesService){}
    
    @Post('/subscription')
    async createSubscriber(@Body() dto: CreateSubscriberDto, @Res() response: Response){
        const newSubscriber = await this.exchangeRatesService.addSubscriber(dto);
        if(!newSubscriber){
            response.status(HttpStatus.CONFLICT).send()
        }
        else{
            response.status(HttpStatus.OK).send();
        }
    }

    @Get('/rate')
    async getBTCtoUAHExchangeRate(@Res() response: Response){
        const price = await this.exchangeRatesService.getExchangeRate(CurrencyNames.BTC, CurrencyNames.UAH);
        if(!price){
            response.status(HttpStatus.BAD_REQUEST).send()
        }
        else{
            response.status(HttpStatus.OK).send(price.toString());
        }
    }
}
