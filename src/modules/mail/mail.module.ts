import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailLogic } from './mail.logic';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.RELAY_HOST,
          port: process.env.RELAY_PORT,
          secure: process.env.RELAY_SECURE,
          auth: {
            user: process.env.RELAY_USER,
            pass: process.env.RELAY_PASSWORD,
          },
        },
        defaults: {
          from: '"No Reply <noreply@boilerplate.com>"',
        },
        template: {
          dir: join(__dirname, '/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailLogic],
  exports: [MailLogic],
})
export class MailModule {}
