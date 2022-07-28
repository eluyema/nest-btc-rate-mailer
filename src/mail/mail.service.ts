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
      const promises = emails.map(email=>(this.mailerService.sendMail({
          to: email,
          subject: `Current Exchange Rates ${firstCurrencyName} to ${secondCurrencyName}`,
          template: path.join(__dirname,'./templates/exchange-rates'),
          context: {
            firstCurrencyName,
            secondCurrencyName,
            uah: uah.toFixed(2)
          },
        })
      ));

      const result = await Promise.allSettled(promises);
      const rejectedEmail = emails.filter((email, i)=>result[i].status==='rejected')

      return rejectedEmail;
  }
}