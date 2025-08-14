import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {OrderService} from './order.service';

import {CreateOrderDto} from './dto/create-order.dto';
import {Authorization} from '../../../user/src/auth/decorator/authorization.decorator';
import {EventPattern, MessagePattern, Payload} from '@nestjs/microservices';
import {RpcInterceptor} from '@app/common';
import {DeliveryStartedDto} from './dto/delivery-started.dto';
import {OrderStatus} from './entity/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(
    @Authorization() token: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(createOrderDto, token);
  }

  @EventPattern({cmd: 'delivery_started'})
  @UseInterceptors(RpcInterceptor)
  async deliveryStarted(@Payload() payload: DeliveryStartedDto) {
    await this.orderService.changeOrderStatus(
      payload.id,
      OrderStatus.deliveryStarted,
    );
  }
}
