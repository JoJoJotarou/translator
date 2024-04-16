import { TranslationEngine } from "./engine";

abstract class AbstractTranslationService {

    translationEngine: TranslationEngine;

    constructor(translationEngine: TranslationEngine) {
        this.translationEngine = translationEngine;
    }

    abstract translateText(targetLanguage: string, textList: string[]): Promise<any>;
}

export {
    AbstractTranslationService
};