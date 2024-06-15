import { Controller, Get, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  public async getLeads(@Query('query') query?: string | null) {
    return this.leadsService.findAll(query);
  }
}
