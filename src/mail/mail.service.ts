import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendExchangeRates(
        emails: string[],
        firstCurrencyName: string,
        secondCurrencyName: string,
        firstCurrencySymbol: string = '',
        secondCurrencySymbol: string = '',
        uah: number
    ) {
    await this.mailerService.sendMail({
      to: emails,
      subject: `Current Exchange Rates ${firstCurrencyName} to ${secondCurrencyName}`,
      template: './exchange-rates',
      context: {
        firstCurrencyName,
        firstCurrencySymbol,
        secondCurrencyName,
        secondCurrencySymbol,
        uah: uah.toFixed(2)
      },
    });
  }
}