import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { BookRepository, TradeRepository } from '@/repositories';
import { Book, Trade } from '@/domain/entities';

import { TradeBookService } from './trade-book.service';
import { TradeBook } from './trade-book.interface';
import { TradeStatus } from '@/domain/types';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn().mockReturnValue('bc5c8e33-a815-4c77-9268-6363ee95529a'),
}));

describe('TradeBookService', () => {
  let sut: TradeBookService;
  let bookRepository: BookRepository;
  let tradeRepository: TradeRepository;

  let params: TradeBook.Params;
  let trade: Trade;
  let book: Book;

  beforeEach(async () => {
    book = new Book({
      id: faker.string.uuid(),
      title: faker.lorem.words(),
      publisher: faker.lorem.words(),
      author: faker.person.fullName(),
      year: faker.number.int({ min: 1900, max: 2023 }),
      description: faker.lorem.paragraph(),
      image: faker.image.url(),
    });

    trade = new Trade({
      message: faker.lorem.sentence(),
      status: TradeStatus.PENDING,
      book,
    });

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        TradeBookService,
        {
          provide: 'BookRepository',
          useValue: { getById: jest.fn().mockResolvedValue(book) },
        },
        {
          provide: 'TradeRepository',
          useValue: { create: jest.fn().mockResolvedValue(trade) },
        },
      ],
    }).compile();

    sut = app.get<TradeBookService>(TradeBookService);
    bookRepository = app.get<BookRepository>('BookRepository');
    tradeRepository = app.get<TradeRepository>('TradeRepository');

    params = {
      bookId: book.id,
      message: trade.message,
    };
  });

  it('should call the book repository with a book id', async () => {
    await sut.trade(params);

    expect(bookRepository.getById).toHaveBeenCalledWith(params.bookId);
  });

  it('should throw a not found error if the book does not exist', async () => {
    jest.spyOn(bookRepository, 'getById').mockResolvedValueOnce(undefined);
    await expect(sut.trade(params)).rejects.toThrowError('Book not found');
  });

  it('should call the trade repository with a trade', async () => {
    await sut.trade(params);

    expect(tradeRepository.create).toHaveBeenCalledWith(trade);
  });

  it('should return the trade', async () => {
    const got = await sut.trade(params);

    const expected = {
      message: trade.message,
      status: trade.status,
      book: {
        id: trade.book.id,
        title: trade.book.title,
        publisher: trade.book.publisher,
        author: trade.book.author,
        year: trade.book.year,
        description: trade.book.description,
        image: trade.book.image,
      },
    };

    expect(got).toEqual(expected);
  });
});
