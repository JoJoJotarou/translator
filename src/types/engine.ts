import { TextTranslationRequestBody, ApiRequest } from './request';

interface EngineInfo {
    host: string;
    // headers: { [key: string]: string };
    credentials: Credential;
    // connectTimeout: number;
    // readTimeout: number;
}

// Credential for accessing the translation engine
interface Credential {
    readonly accessKey: string;
    readonly secretKey: string;
    readonly serviceName: string;
    readonly region: string;
}

interface TranslationEngine {
    engineInfo: EngineInfo;
    /**
     * 翻译文本
     * 
     * @param requestData 翻译请求参数
     */
    translateText(requestData: ApiRequest<TextTranslationRequestBody>): Promise<any>;
}

abstract class AbstractTranslationEngine implements TranslationEngine {
    engineInfo: EngineInfo;

    constructor(engineInfo: EngineInfo) {
        this.engineInfo = engineInfo;
    }

    abstract translateText(requestData: ApiRequest<TextTranslationRequestBody>): Promise<any>;
}

export {
    EngineInfo,
    Credential,
    TranslationEngine,
    AbstractTranslationEngine
};