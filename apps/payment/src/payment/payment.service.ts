import {NOTIFICATION_SERVICE, NotificationMicroservice} from '@app/common';
import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {ClientGrpc} from '@nestjs/microservices';
import {InjectRepository} from '@nestjs/typeorm';
import {lastValueFrom} from 'rxjs';
import {Repository} from 'typeorm';
import {MakePaymentDto} from './dto/make-payment.dto';
import {Payment, PaymentStatus} from './entity/payment.entity';

@Injectable()
export class PaymentService implements OnModuleInit {
  notificationService: NotificationMicroservice.NotificationServiceClient;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationMicroService: ClientGrpc,
    //private readonly notificationService: ClientProxy,
  ) {}
  onModuleInit() {
    this.notificationService =
      this.notificationMicroService.getService<NotificationMicroservice.NotificationServiceClient>(
        'NotificationService',
      );
  }
  async makePayment(payload: MakePaymentDto) {
    let paymentId;

    try {
      const result = await this.paymentRepository.save(payload);
      paymentId = result.id;
      await this.processPayment();
      await this.updatePaymentStatus(result.id, PaymentStatus.approved);

      //notification 보내기
      this.sendNotification(payload.orderId, payload.userEmail);

      return this.paymentRepository.findOneBy({id: result.id});
    } catch (e) {
      if (paymentId) {
        await this.updatePaymentStatus(paymentId, PaymentStatus.rejected);
      }
      throw e;
    }
  }

  async processPayment() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async updatePaymentStatus(id: string, status: PaymentStatus) {
    await this.paymentRepository.update(
      {
        id,
      },
      {
        paymentStatus: status,
      },
    );
  }
  async sendNotification(orderId: string, to: string) {
    const resp = await lastValueFrom(
      this.notificationService.sendPaymentNotification({
        to,
        orderId,
      }),
    );
  }
}
