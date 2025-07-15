import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class MercadoPagoService {
    private mp = new MercadoPagoConfig({
        accessToken: 'APP_USR-3031384509086196-060312-fd1bf321e91364839d61d223b5db6d4f-2473231577',
    });

    async createOrder(orden: CreateOrderDto) {  // <-- sin parámetro
        const preference = new Preference(this.mp);

        // Estructura estática que quieres usar
        /*const orden = {
            id: 18,
            servicio: ["Cambio de aceite", "Chips de fresas"],
            totalFinal: "1400.00",
        };*/

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: String(orden.id),
                        title: orden.servicio.join(", "), // concatenar servicios
                        quantity: 1,
                        unit_price: parseFloat(orden.totalFinal),
                        currency_id: 'MXN',
                    },
                ],
                back_urls: {
                    success: 'https://localhost:3000/mercado-pago/success',
                    failure: 'https://localhost:3000/mercado-pago/failure',
                    pending: 'https://localhost:3000/mercado-pago/pending',
                },
                //notification_url: 'https://867b-200-68-183-172.ngrok-free.app/mercado-pago/webhook',
            },
        });

        return result;
    }

    async obtenerPago(paymentId: string) {
        const payment = new Payment(this.mp);
        const response = await payment.get({ id: paymentId });
        return response;
    }
}
