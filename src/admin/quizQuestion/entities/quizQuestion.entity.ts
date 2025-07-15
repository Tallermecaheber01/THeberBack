import { Entity, PrimaryGeneratedColumn, Column, Check } from 'typeorm';

@Entity('quiz_questions')
@Check(`"correct_option" IN ('A','B','C')`)
export class QuizQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { name: 'question_text' })
  question_text: string;

  @Column('varchar', { length: 255, name: 'option_a' })
  option_a: string;

  @Column('varchar', { length: 255, name: 'option_b' })
  option_b: string;

  @Column('varchar', { length: 255, name: 'option_c' })
  option_c: string;

  @Column('char', { length: 1, name: 'correct_option' })
  correct_option: 'A' | 'B' | 'C';
}
