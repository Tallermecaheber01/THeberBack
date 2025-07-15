import {
  IsInt,
  Min,
  IsOptional,
  IsString,
  Length,
  IsIn,
} from 'class-validator';

export class UpdateQuizQuestionDto {
  @IsInt()
  @Min(1)
  id: number;

  @IsOptional()
  @IsString()
  question_text?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  option_a?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  option_b?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  option_c?: string;

  @IsOptional()
  @IsIn(['A','B','C'])
  correct_option?: 'A' | 'B' | 'C';
}