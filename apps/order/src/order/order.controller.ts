import {RpcInterceptor} from '@app/common';
import {Controller, UseInterceptors} from '@nestjs/common';
import {EventPattern, Payload} from '@nestjs/microservices';
import {DeliveryStartedDto} from './dto/delivery-started.dto';
import {OrderStatus} from './entity/order.entity';
import {OrderService} from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // @Post()
  // @UsePipes(ValidationPipe)
  // async createOrder(
  //   @Authorization() token: string,
  //   @Body() createOrderDto: CreateOrderDto,
  // ) {
  //   return this.orderService.createOrder(createOrderDto, token);
  // }

  @EventPattern({cmd: 'delivery_started'})
  @UseInterceptors(RpcInterceptor)
  async deliveryStarted(@Payload() payload: DeliveryStartedDto) {
    await this.orderService.changeOrderStatus(
      payload.id,
      OrderStatus.deliveryStarted,
    );
  }
}
