import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tallermecanicoheber@gmail.com',
                pass: "l e d e q s p o b k f s w a u f", // Contraseña o token de aplicación
            },
        });
    }

    // Método para enviar un correo de rechazo de cita
    async sendRejectionEmail(to: string, clientName: string, appointmentDetails: any) {
        const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cita Rechazada</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f7f7f7;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #c0392b;
          border-radius: 8px;
          background-color: #ffffff;
        }
        h2 {
          color: #c0392b;
        }
        p {
          color: #333;
        }
        .highlight {
          color: #e67e22;
          font-weight: bold;
        }
        .image-container {
          text-align: center;
          margin-bottom: 20px;
        }
        img {
          width: 150px;
          height: auto;
          max-width: 100%;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="image-container">
          <img src="https://taller-backend-two.vercel.app/images/latest" alt="Logo Taller" />
        </div>
        <h2>Cita Rechazada</h2>
        <p>Hola <strong>${clientName}</strong>,</p>
        <p>Lamentamos informarte que tu cita programada para el día <span class="highlight">${appointmentDetails.fecha}</span> a las <span class="highlight">${appointmentDetails.hora}</span> ha sido <strong>rechazada</strong>.</p>
        <p><strong>Motivo:</strong> ${appointmentDetails.motivo}</p>
        <p>Si tienes dudas o necesitas más información, no dudes en contactarnos.</p>
        <p style="margin-top: 20px;">Atentamente,<br><strong>Taller Mecánico Heber</strong></p>
      </div>
    </body>
    </html>
    `;

        const mailOptions = {
            from: '"Taller Mecánico Heber" <tallermecanicoheber@gmail.com>',
            to,
            subject: 'Tu cita ha sido rechazada',
            html: htmlContent,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Correo de rechazo enviado a ${to}`);
        } catch (error) {
            this.logger.error(`Error al enviar el correo de rechazo: ${error.message}`);
            throw error;
        }
    }

    // Método para enviar un correo de asignacion de cita
    async sendAppointmentAsignationEmail(
        to: string,
        clientName: string,
        appointmentDetails: {
            fecha: string;
            hora: string;
            marca: string;
            modelo: string;
            servicios: string[];
            total: number;
        }
    ) {
        const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Confirmación de Cita</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      padding: 20px;
      color: #333333; /* Color general para todo el texto */
    }
    .container {
      max-width: 600px;
      margin: auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #0056b3;
    }
    h2 {
      color: #0056b3;
    }
    p {
      color: #333333; /* Aseguramos que los párrafos usen este color */
      line-height: 1.5;
      margin: 8px 0;
    }
    .image-container {
      text-align: center;
      margin-bottom: 20px;
    }
    img {
      width: 150px;
      max-width: 100%;
      height: auto;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="image-container">
      <img src="https://taller-backend-two.vercel.app/images/latest" alt="Logo Taller" />
    </div>
    <h2>Cita Asignada</h2>
    <p>Hola <strong>${clientName}</strong>, tu cita ha sido registrada exitosamente.</p>
    <p><strong>Fecha:</strong> ${appointmentDetails.fecha}</p>
    <p><strong>Hora:</strong> ${appointmentDetails.hora}</p>
    <p><strong>Vehículo:</strong> ${appointmentDetails.marca} - ${appointmentDetails.modelo}</p>
    <p><strong>Servicios:</strong></p>
    <ul>
      ${appointmentDetails.servicios.map(s => `<li>${s}</li>`).join('')}
    </ul>
    <p><strong>Total estimado:</strong> $${appointmentDetails.total}</p>
    <p>¡Gracias por confiar en nosotros!</p>
    <p style="margin-top: 20px;">Atentamente,<br><strong>Taller Mecánico Heber</strong></p>
  </div>
</body>
</html>
`;


        const mailOptions = {
            from: '"Taller Mecánico Heber" <tallermecanicoheber@gmail.com>',
            to,
            subject: 'Confirmación de tu cita',
            html: htmlContent,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Correo de confirmación enviado a ${to}`);
        } catch (error) {
            this.logger.error(`Error al enviar correo de cita: ${error.message}`);
            throw error;
        }
    }

    //Metodo para enviar un correo de confirmación de cita
    async sendAppointmentConfirmationEmail(
        to: string,
        clientName: string,
        appointmentDetails: {
            fecha: string;
            hora: string;
            empleadoNombre: string;
            total: number;
            estado: string;
        }
    ) {
        const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Confirmación de Cita Actualizada</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      padding: 20px;
      color: #333333 !important;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #0056b3;
      color: #333333 !important;
    }
    h2 {
      color: #0056b3;
    }
    p {
      line-height: 1.5;
      margin: 8px 0;
      color: #333333 !important;
    }
    .image-container {
      text-align: center;
      margin-bottom: 20px;
    }
    img {
      width: 150px;
      max-width: 100%;
      height: auto;
    }
    .highlight {
      font-weight: bold;
      color: #27ae60 !important;
    }
    span {
      color: #333333 !important;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="image-container">
      <img src="https://taller-backend-two.vercel.app/images/latest" alt="Logo Taller" />
    </div>
    <h2>Cita Confirmada</h2>
    <p>Hola <strong>${clientName}</strong>, tu cita ha sido actualizada y confirmada con éxito.</p>
    <p><strong>Fecha:</strong> ${appointmentDetails.fecha}</p>
    <p><strong>Hora:</strong> ${appointmentDetails.hora}</p>
    <p><strong>Empleado asignado:</strong> ${appointmentDetails.empleadoNombre}</p>
    <p><strong>Total estimado:</strong> $${appointmentDetails.total}</p>
    <p>Estado de la cita: <span class="highlight">${appointmentDetails.estado}</span></p>
    <p>¡Gracias por confiar en nosotros!</p>
    <p style="margin-top: 20px;">Atentamente,<br /><strong>Taller Mecánico Heber</strong></p>
  </div>
</body>
</html>
`;


        const mailOptions = {
            from: '"Taller Mecánico Heber" <tallermecanicoheber@gmail.com>',
            to,
            subject: 'Confirmación de tu cita actualizada',
            html: htmlContent,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Correo de confirmación enviado a ${to}`);
        } catch (error) {
            this.logger.error(`Error al enviar correo de confirmación: ${error.message}`);
            throw error;
        }
    }


}
