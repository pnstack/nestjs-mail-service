import { sleep } from '@/utils/index';
import { Body, Controller, Post } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { SendMailDto } from './dtos/send-mail.dto';
import { MailService } from './mail.service';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(protected readonly mailService: MailService) {}

  @Post('send')
  async sendTest(@Body() body: SendMailDto) {
    return await this.mailService.sendMail(body);
  }

  @Post('add-queue')
  async addQueue(@Body() body: SendMailDto) {
    return await this.mailService.addMail(body);
  }

  @MessagePattern('ping')
  async ping(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    console.log(`Pattern: ${context.getPattern()}`, data);
    await sleep(100);
    channel.ack(originalMsg);
    console.log(`DONE: ${context.getPattern()}`, data);

    return 'pong';
  }

  @MessagePattern('send')
  async send(@Payload() data: SendMailDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    await this.mailService.sendMail(data);
    // Make message ack
    channel.ack(originalMsg);
  }
}
