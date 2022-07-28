import { Module } from '@nestjs/common';
import { ExchangeRatesService } from './exchange-rates.service';
import { MailModule } from '../mail/mail.module';
import { DatabaseModule } from '../database/database.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ExchangeRatesController } from './exchange-rates.controller';

@Module({
  imports:[MailModule, DatabaseModule,HttpModule, ConfigModule],
  providers: [ExchangeRatesService ],
  controllers: [ExchangeRatesController]
})
export class ExchangeRatesModule {}
