import { Injectable } from '@nestjs/common';
import * as webpush from 'web-push';

@Injectable()
export class PushService {
  private subscriptions: any[] = [];

  constructor() {
    const publicVapidKey =
      'BFTdlLFbEIxDwMFnotfrBKdBgFJItSka-wCAISl7moREzUwN-9QEoDvxvmSR63L-T5PAIHblpiBWq5HzD8WFE0M';
    const privateVapidKey = 'HcHv1x-GqBWBs1bFmnBsAQAylDeB_ecxZahrnBCxwwM';

    webpush.setVapidDetails(
      'mailto:20221309@gmail.com',
      publicVapidKey,
      privateVapidKey,
    );
  }

  saveSubscription(subscription: any) {
    this.subscriptions.push(subscription);
    console.log('✅ Suscripción guardada');
  }

  async sendNotification(title: string, body: string) {
    const payload = JSON.stringify({ title, body });

    const results = await Promise.allSettled(
      this.subscriptions.map((sub) =>
        webpush.sendNotification(sub, payload).catch((err) => {
          console.error('❌ Error al enviar:', err);
        }),
      ),
    );

    console.log('📤 Resultados:', results.length);
  }
}
