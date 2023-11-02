import messages_en from "../lang/en.json";
import messages_de from "../lang/de.json";

export const messages = {
  'en': messages_en,
  'de': {...messages_en, ...messages_de}
};

export const language = 'de';
