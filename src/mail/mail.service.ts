import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendExchangeRates(
        emails: string[],
        firstCurrencyName: string,
        secondCurrencyName: string,
        uah: number
    ) {
      for(let i =0;i< emails.length;i++){
        await this.mailerService.sendMail({
          to: emails[i],
          subject: `Current Exchange Rates ${firstCurrencyName} to ${secondCurrencyName}`,
          template: path.join(__dirname,'./templates/exchange-rates'),
          context: {
            firstCurrencyName,
            secondCurrencyName,
            uah: uah.toFixed(2)
          },
        })
      }
      // const result = await Promise.allSettled(promises);

      return [];
  }
}