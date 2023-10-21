import { SendMailDto } from './dtos/send-mail.dto';
import { MAIL_PROCESSOR, MAIL_QUEUE } from '@/common/constants';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectQueue(MAIL_QUEUE) private mailQueue: Queue
  ) {}

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

  /**
   * The `addMail` function is an asynchronous function that adds a mail to a mail queue for processing.
   * @param {SendMailDto} data - The `data` parameter is of type `SendMailDto`, which is an object
   * containing the necessary information to send an email. It likely includes properties such as the
   * recipient's email address, the subject of the email, the body of the email, and any attachments or
   * additional options.
   */
  async addMail(data: SendMailDto): Promise<any> {
    try {
      await this.mailQueue.add(MAIL_PROCESSOR.SEND_MAIL, data, {});
    } catch (error) {
      console.log(error);
    }
  }
}
