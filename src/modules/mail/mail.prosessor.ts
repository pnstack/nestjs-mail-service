import { Processor, Process, OnQueueActive } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import {
  CONFIRM_REGISTRATION,
  MAIL_QUEUE,
  MAIL_REGISTRATION,
} from 'src/common/constants';

import { MailService } from './mail.service';

@Injectable()
@Processor(MAIL_QUEUE)
export class MailProcessor {
  public constructor(private mailService: MailService) {}
  @Process(CONFIRM_REGISTRATION)
  async processSendEmail(job: Job) {
    console.log(job);
    this.mailService.sendMail(job.data);
  }

  @Process(MAIL_REGISTRATION)
  async processRegisterEmail(job: Job) {
    console.log(job);
    this.mailService.sendMail(job.data);
  }

  @OnQueueActive()
  onActive(job: Job) {}
}
