import { Controller, Get, Param } from '@nestjs/common';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService){}

    //Endpoint para obtener la informacion del usuaio por id
    @Get(':id')
    async getUserInfo(@Param('id') id: number){
        return this.clientService.getClientById(id);
    }
}
