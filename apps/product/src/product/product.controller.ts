import {ProductMicroservice} from '@app/common';
import {Controller} from '@nestjs/common';
import {GetProductsInfo} from './dto/get-products-info.dto';
import {ProductService} from './product.service';

@Controller('product')
@ProductMicroservice.ProductServiceControllerMethods()
export class ProductController
  implements ProductMicroservice.ProductServiceController
{
  constructor(private readonly productService: ProductService) {}

  async createSamples() {
    const resp = await this.productService.createSamples();
    return {
      success: resp,
    };
  }

  async getProductsInfo(request: GetProductsInfo) {
    const resp = await this.productService.getProductsInfo(request.productIds);
    return {
      products: resp,
    };
  }
}
