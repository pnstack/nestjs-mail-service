import { SendMailDto } from './dtos/send-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from 'src/common/constants';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  /**
   * The function sends an email using the mailer service with the provided data.
   * @param {SendMailDto} data - The `data` parameter is an object of type `SendMailDto` which contains
   * the following properties:
   * @returns The `sendMail` function is returning the result of the `mailerService.sendMail` method.
   */
  async sendMail(data: SendMailDto) {
    return await this.mailerService.sendMail({
      to: data.to,
      subject: data.subject,
      html: data.html,
      ...(data.from && { from: data.from }),
    });
  }
}
