import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../database/repositories/user.repository';

@Injectable()
export class MailLogic {
  constructor(private readonly mailerService: MailerService) {}

  async sendRegisterConfirmation(token: string, user: User) {
    const url = `http://localhost:8080/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirm your Email',
      template: './confirmRegistration',
      context: {
        name: user.username,
        url,
      },
    });
  }
}
