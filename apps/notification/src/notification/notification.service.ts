import {ORDER_SERVICE, OrderMicroservice} from '@app/common';
import {Metadata} from '@grpc/grpc-js';
import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {ClientGrpc} from '@nestjs/microservices';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {SendPaymentNotificationDto} from './dto/send-payment-notification.dto';
import {Notification, NotificationStatus} from './entity/notification.entity';

@Injectable()
export class NotificationService implements OnModuleInit {
  orderService: OrderMicroservice.OrderServiceClient;

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @Inject(ORDER_SERVICE)
    private readonly orderMicroService: ClientGrpc,
  ) {}
  onModuleInit() {
    this.orderService =
      this.orderMicroService.getService<OrderMicroservice.OrderServiceClient>(
        'OrderService',
      );
  }
  async sendPaymentNotification(
    data: SendPaymentNotificationDto,
    metadata: Metadata,
  ) {
    const notification = await this.createNotification(data.to);

    await this.sendEmail();
    await this.updateNotificationStatus(
      (notification._id as any).toString(),
      NotificationStatus.sent,
    );

    this.sendDeliveryStartedMessage(data.orderId, metadata);

    return this.notificationModel.findById(notification._id);
  }

  sendDeliveryStartedMessage(id: string, metadata: Metadata) {
    this.orderService.deliveryStarted({
      id,
    });
  }

  async updateNotificationStatus(id: string, status: NotificationStatus) {
    return this.notificationModel.findByIdAndUpdate(id, {status});
  }

  async sendEmail() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async createNotification(to: string) {
    return this.notificationModel.create({
      from: 'jc@codefactory.ai',
      to: to,
      subject: '배송이 시작됐습니다!',
      content: `${to}님! 주문하신 물건이 배송이 시작됏습니다.`,
    });
  }
}
