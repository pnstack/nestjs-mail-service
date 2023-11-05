import { SendMailDto } from './dtos/send-mail.dto';
import { MailServiceService } from './mail-service.service';
import { JwtGuard } from '@/common/guards';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
