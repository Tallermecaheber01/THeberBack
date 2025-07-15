import { IsInt, Min } from 'class-validator';

export class DeleteQuizQuestionDto {
  @IsInt() @Min(1)
  id: number;
}
