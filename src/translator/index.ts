import configuration from "../config/configuration";
import VolcTranslationService from "./volc/service";
import { VolcEngineInfo } from "./volc/engine";
import { AbstractTranslationService } from "../types/service";

class TranslationServiceFactory {
    public static create(): AbstractTranslationService {
        switch (configuration.engine) {
            case 'volc': {
                if (!configuration.volc.accessKey || !configuration.volc.secretKey) {
                    throw new Error('Access key or secret key is missing');
                }
                const engineInfo = new VolcEngineInfo(configuration.volc.accessKey, configuration.volc.secretKey);
                return VolcTranslationService.getInstance(engineInfo);
            }
            default:
                throw new Error('Unsupported engine');
        }
    }
}

export default TranslationServiceFactory;
