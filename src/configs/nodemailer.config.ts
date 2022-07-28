import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const getNodemailerConfig = async (config: ConfigService) => ({
    transport: {
      host: config.get('MAIL_HOST'),
      secure: false,
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASSWORD'),
      },
    },
    defaults: {
      from: `"No Reply" <${config.get('MAIL_FROM')}>`,
    },
    template: {
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  });