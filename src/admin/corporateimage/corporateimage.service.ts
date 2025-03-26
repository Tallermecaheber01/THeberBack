import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorporateImage } from '../corporateimage/entities/corporateimage.entity';
import { UpdateCorporateImageDto } from '../corporateimage/dto/update-corporateimage.dto';
import { LogEntity } from 'src/log/entity/log.entity';

@Injectable()
export class CorporateimageService {
  constructor(
    @InjectRepository(CorporateImage)
    private corporateImageRepository: Repository<CorporateImage>,

    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) { }

  private async saveLog(level: string, message: string, extraInfo?: string) {
    await this.logRepository.save({
      level,
      message,
      extraInfo,
      timestamp: new Date(),
    });
  }

  // Método para actualizar el título y la descripción de una CorporateImage
  async update(id: number, updateDto: UpdateCorporateImageDto): Promise<CorporateImage> {
    const corporateImage = await this.corporateImageRepository.findOne({ where: { id } });
    if (!corporateImage) {
      // Log de error cuando no se encuentra la imagen
      await this.saveLog('ERROR', 'CorporateImage no encontrada para actualizar', `ID: ${id}`);
      throw new NotFoundException(`CorporateImage con id ${id} no fue encontrada`);
    }
    // Actualizamos los campos recibidos en el DTO
    Object.assign(corporateImage, updateDto);
    return await this.corporateImageRepository.save(corporateImage);
  }

  async findAll(): Promise<CorporateImage[]> {
    return this.corporateImageRepository.find();
  }

  // Método para obtener un CorporateImage por id
  async findOneById(id: number): Promise<CorporateImage> {
    const corporateImage = await this.corporateImageRepository.findOne({ where: { id } });

    if (!corporateImage) {
       // Log de error cuando no se encuentra la imagen
      await this.saveLog('ERROR', 'CorporateImage no encontrada', `ID: ${id}`);
      throw new NotFoundException(`CorporateImage con id ${id} no fue encontrada`);
    }

    return corporateImage;
  }
}
