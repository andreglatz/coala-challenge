import { Controller, Inject, Param, Get, NotFoundException, Req } from '@nestjs/common';

import { Tokens } from '@/books/settings/tokens';
import { GetBookByIdService } from '@/books/services/books/get-book-by-id';

import * as GetBookByIdDTO from './get-book-by-id.dto';
import { request } from 'http';

@Controller('/books')
export class GetBookByIdController {
  constructor(@Inject(Tokens.GetBookByIdService) private readonly getBookByIdService: GetBookByIdService) {}

  @Get('/:id')
  async create(@Req() request, @Param('id') id: string): Promise<GetBookByIdDTO.Response> {
    try {
      return await this.getBookByIdService.getById({ userId: request.user.id, id });
    } catch (error) {
      if (error.name === 'NotFoundError') throw new NotFoundException();
      throw error;
    }
  }
}