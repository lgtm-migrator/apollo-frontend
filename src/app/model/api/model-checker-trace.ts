import { TranslationDTO } from '../dto/translation.dto';

export interface ModelCheckerTrace {
  formula: string;
  description: TranslationDTO;
  isModel: boolean;
  children: ModelCheckerTrace[];
}
