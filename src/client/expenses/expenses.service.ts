import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expenses.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  // Obtener todos los gastos
  async obtenerTodos(): Promise<Expense[]> {
    return this.expenseRepository.find();
  }

  // Obtener gastos por cliente
  async obtenerPorCliente(idCliente: number): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { idCliente },
    });
  }

  // Crear un gasto
  async crear(expense: Partial<Expense>): Promise<Expense> {
    const nuevoGasto = this.expenseRepository.create(expense);
    return this.expenseRepository.save(nuevoGasto);
  }

  // Actualizar un gasto por id
  async actualizar(id: number, datos: Partial<Expense>): Promise<Expense> {
    await this.expenseRepository.update(id, datos);
    return this.expenseRepository.findOne({ where: { id } });
  }

  // Eliminar un gasto por id
  async eliminar(id: number): Promise<void> {
    await this.expenseRepository.delete(id);
  }
}
