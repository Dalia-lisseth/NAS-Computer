import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [QuotesController],
  providers: [QuotesService],
  exports: [QuotesService]
})
export class QuotesModule {}
