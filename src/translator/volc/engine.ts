
import {
    EngineInfo,
    Credential,
    AbstractTranslationEngine,
} from "../../types/engine";
import { ApiRequest, TextTranslationRequestBody } from "../../types/request";
import axiosUtils from "../../utils/AxiosUtils";


class VolcEngineInfo implements EngineInfo {
    host: string;
    credentials: Credential;

    constructor(accessKey: string, secretKey: string) {
        this.host = 'https://translate.volcengineapi.com';
        this.credentials = {
            accessKey: accessKey,
            secretKey: secretKey,
            serviceName: 'translate',
            region: 'cn-north-1'
        };
    }
}

class VolcTranslationEngine extends AbstractTranslationEngine {
    constructor(engineInfo: EngineInfo) {
        super(engineInfo);
    }

    translateText(requestData: ApiRequest<TextTranslationRequestBody>) {
        if (requestData.path === "" || requestData.path === undefined || requestData.path === null) {
            requestData.path = "/";
        }

        return axiosUtils.request(requestData);
    }
}

export {
    VolcEngineInfo,
    VolcTranslationEngine
};