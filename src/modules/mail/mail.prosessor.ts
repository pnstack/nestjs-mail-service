import { MailService } from './mail.service';
import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { MAIL_PROCESSOR, MAIL_QUEUE } from 'src/common/constants';

@Injectable()
@Processor(MAIL_QUEUE)
export class MailProcessor {
  public constructor(private mailService: MailService) {}

  /**
   * The function "processSendEmail" asynchronously sends an email using the data provided in the "job"
   * parameter.
   * @param {Job} job - The job parameter is an object that contains the data needed to send an email.
   * It is passed to the processSendEmail function.
   */
  @Process(MAIL_PROCESSOR.SEND_MAIL)
  async processSendEmail(job: Job) {
    this.mailService.sendMail(job.data);
  }

  @OnQueueActive()
  onActive(job: Job) {}
}
