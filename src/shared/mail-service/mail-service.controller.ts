import { SendMailDto } from './dtos/send-mail.dto';
import { MailServiceService } from './mail-service.service';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseInterceptors(ResponseInterceptor)
@ApiBearerAuth()
@ApiTags('MailService')
@Controller('mail-service')
export class MailServiceController {
  constructor(private readonly mailServiceService: MailServiceService) {}

  @Get('ping')
  async ping() {
    return await this.mailServiceService.ping();
  }

  @Post('send')
  async send(@Body() body: SendMailDto) {
    return await this.mailServiceService.send(body);
  }
}
