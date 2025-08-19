import {NotificationMicroservice} from '@app/common';
import {Controller} from '@nestjs/common';
import {SendPaymentNotificationDto} from './dto/send-payment-notification.dto';
import {NotificationService} from './notification.service';

@Controller()
export class NotificationController
  implements NotificationMicroservice.NotificationServiceController
{
  constructor(private readonly notificationService: NotificationService) {}

  //오류?
  async sendPaymentNotification(request: SendPaymentNotificationDto) {
    const resp = (
      await this.notificationService.sendPaymentNotification(request)
    )?.toJSON();

    return {
      ...resp,
      status: resp?.status.toString(),
    };
  }
}
