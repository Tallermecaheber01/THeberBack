import { IsIn, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateQuizQuestionDto {
  @IsNotEmpty() @IsString()
  question_text: string;

  @IsNotEmpty() @IsString() @Length(1, 255)
  option_a: string;

  @IsNotEmpty() @IsString() @Length(1, 255)
  option_b: string;

  @IsNotEmpty() @IsString() @Length(1, 255)
  option_c: string;

  @IsIn(['A','B','C'])
  correct_option: 'A' | 'B' | 'C';
}
