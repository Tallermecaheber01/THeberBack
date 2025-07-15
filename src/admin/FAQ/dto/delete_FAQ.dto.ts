import { IsInt, Min } from 'class-validator';

export class DeleteFaqDto {
  @IsInt()
  @Min(1)
  id_faq: number;
}
