import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ExchangeRatesModule } from './exchange-rates/exchange-rates.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailModule,
    DatabaseModule,
    ExchangeRatesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
