import {Module} from '@nestjs/common';
import {ProductController} from './product.controller';
import {ProductService} from './product.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Product} from './entity/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), // Product 엔티티를 TypeORM 모듈에 등록
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
