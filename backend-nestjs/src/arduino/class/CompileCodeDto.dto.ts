import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CompileCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  // FQBN (Fully Qualified Board Name) ví dụ: "arduino:avr:uno"
  // Regex này để hạn chế các ký tự nguy hiểm, ngăn ngừa command injection.
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_:]+$/, {
    message: 'Board FQBN contains invalid characters.',
  })
  board: string;
}