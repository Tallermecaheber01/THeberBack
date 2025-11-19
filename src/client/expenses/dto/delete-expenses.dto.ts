import { IsNotEmpty, IsInt } from 'class-validator';

export class DeleteExpenseDto {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
