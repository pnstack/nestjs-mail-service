import { SendMailDto } from './dtos/send-mail.dto';
import { MailService } from './mail.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(protected readonly mailService: MailService) {}

  @Post('send')
  async send(@Body() body: SendMailDto) {
    return await this.mailService.sendMail(body);
  }
}
