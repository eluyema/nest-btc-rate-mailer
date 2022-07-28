import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CollectionNames } from '../database/database.enums';
import { DatabaseService } from '../database/database.service';
import { MailService } from '../mail/mail.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { CurrencyNames } from './exchange-rates.enums';
import { CurrencyNameToCurrencyCode } from './exchange-rates.maps';
import { ExchangeRateResponse, SubscriberModel } from './exchange-rates.models';

@Injectable()
export class ExchangeRatesService {
    private readonly THIRD_PARTY_API_BASE_URL: string;

    constructor(
        private mailService: MailService,
        private databaseService: DatabaseService,
        private httpService: HttpService,
        private configService: ConfigService) {
            this.THIRD_PARTY_API_BASE_URL = configService.get('THIRD_PARTY_API_BASE_URL');
        }

    async addSubscriber(dto: CreateSubscriberDto): Promise<SubscriberModel|null>{
        const newSubscriber: Omit<SubscriberModel,'_id'> = {...dto}
        const alreadyExistedSubscriber =  Boolean(await this.databaseService.findEq(CollectionNames.SUBSCRIBERS, 'email', dto.email));
        if(alreadyExistedSubscriber){
            return null;
        }
        return this.databaseService.createDocument(CollectionNames.SUBSCRIBERS, newSubscriber);
    }

    async getExchangeRate(
        firstCurrencyName: CurrencyNames,
        secondCurrencyName: CurrencyNames,
        ): Promise<number | null>
    {
        const currencyCodeFrom = CurrencyNameToCurrencyCode[firstCurrencyName];
        const currencyCodeTo = CurrencyNameToCurrencyCode[secondCurrencyName];
        try{
            const { data } = await this.httpService.get<ExchangeRateResponse>(this.THIRD_PARTY_API_BASE_URL + currencyCodeFrom + currencyCodeTo).toPromise();
            return Number(data.price);
        }catch(err){
            Logger.error(err);
            return null;
        }
    }
    async sendEmailExchangeRate(
        firstCurrencyName: CurrencyNames,
        secondCurrencyName: CurrencyNames,
        ){
            const price = await this.getExchangeRate(firstCurrencyName,secondCurrencyName);
            if(price===null)
                return null;
            const subscribers = await this.databaseService.findAll<SubscriberModel>(CollectionNames.SUBSCRIBERS);
            const emails = subscribers.map(subscriber=>subscriber.email)
            if(!Array.isArray(emails)||!emails.length)
                return null;
            const rejectedEmails = await this.mailService.sendExchangeRates(emails, firstCurrencyName, secondCurrencyName, price);
            return rejectedEmails;
        }
}
