import crypto from "crypto";

import { AbstractTranslationService } from "../../types/service";
import { EngineInfo, TranslationEngine } from "../../types/engine";
import { ApiRequest, ApiRequestBuilder, TextTranslationRequestBody } from "../../types/request";
import { VolcTranslationEngine } from "./engine";


class VolcTranslationService extends AbstractTranslationService {
    private static instance: VolcTranslationService | null = null;

    private constructor(engineInfo: EngineInfo) {
        super(new VolcTranslationEngine(engineInfo));
    }

    public static getInstance(engineInfo: EngineInfo): VolcTranslationService {
        if (this.instance === null) {
            this.instance = new VolcTranslationService(engineInfo);
        }
        return this.instance;
    }

    translateText(targetLanguage: string, textList: string[]): Promise<any> {

        let requestData: ApiRequest<TextTranslationRequestBody> = new ApiRequestBuilder<TextTranslationRequestBody>()
            .setMethod('POST')
            .setHeaders({
                'X-Date': VolcHelper.getDateTimeNow(),
            })
            .setParams({
                'Action': 'TranslateText',
                'Version': '2020-06-01',
            })
            .setBody({
                'targetLanguage': targetLanguage,
                'textList': textList
            })
            .build();
        requestData.headers['Authorization'] = VolcHelper.getAuthorization(this.translationEngine.engineInfo, requestData);

        return this.translationEngine.translateText(requestData);
    }

}

class VolcHelper {

    static getDateTimeNow(): string {
        const now = new Date();
        return now.toISOString().replace(/[:-]|\.\d{3}/g, ''); // YYYYMMDD'T'HHMMSS'Z'
    }

    // ref: https://www.volcengine.com/docs/6369/67269
    static getAuthorization(engineInfo: EngineInfo, requestData: ApiRequest<TextTranslationRequestBody>) {
        const date = requestData.headers['X-Date'];

        const [signedHeaders, canonicalHeaders] = VolcHelper.getSignHeaders(requestData.headers);

        // 构建规范请求字符串
        const canonicalRequest = [
            requestData.method,
            requestData.path,
            VolcHelper.canonicalQueryString(requestData.params),
            canonicalHeaders,
            signedHeaders,
            this.hash(requestData.body ? JSON.stringify(requestData.body) : ''),
        ].join('\n');

        const credentialScope = `${date.substring(0, 8)}/${engineInfo.credentials.region}/${engineInfo.credentials.serviceName}/request`;

        const toSignString = ["HMAC-SHA256", date, credentialScope, VolcHelper.hash(canonicalRequest)].join('\n');

        // 计算签名密钥
        const kDate = VolcHelper.hmacSha256(Buffer.from(engineInfo.credentials.secretKey), date.substring(0, 8)); // YYYYMMDD)
        const kRegion = VolcHelper.hmacSha256(kDate, engineInfo.credentials.region);
        const kServiceName = VolcHelper.hmacSha256(kRegion, engineInfo.credentials.serviceName);
        const kSigning = VolcHelper.hmacSha256(kServiceName, "request");

        // 计算签名
        const signature = VolcHelper.hmacSha256(kSigning, toSignString).toString('hex');

        // 构建 Authorization
        return [
            "HMAC-SHA256",
            `Credential=${engineInfo.credentials.accessKey}/${credentialScope},`,
            `SignedHeaders=${signedHeaders},`,
            `Signature=${signature}`,
        ].join(' ');
    }

    static canonicalQueryString(params: { [key: string]: string }) {

        return Object.keys(params)
            .sort()
            .map((key) => {
                const val = params[key];
                if (typeof val === 'undefined' || val === null) {
                    return undefined;
                }
                const escapedKey = VolcHelper.uriEscape(key);
                if (!escapedKey) {
                    return undefined;
                }
                if (Array.isArray(val)) {
                    return `${escapedKey}=${val.map(VolcHelper.uriEscape).sort().join(`&${escapedKey}=`)}`;
                }
                return `${escapedKey}=${VolcHelper.uriEscape(val)}`;
            })
            .filter((v) => v)
            .join('&');
    }

    static uriEscape(str: string) {
        try {
            return encodeURIComponent(str)
                // .replace(/[^A-Za-z0-9_.~\-%]+/g, encodeURIComponent)
                .replace(/[*]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`);
        } catch (e) {
            return '';
        }
    }

    static getSignHeaders(originHeaders: { [key: string]: string }, needSignHeaders: [] = []) {
        /**
         * 不参与加签过程的 header key
         */
        const HEADER_KEYS_TO_IGNORE = new Set([
            "authorization",
            "content-type",
            "content-length",
            "user-agent",
            "presigned-expires",
            "expect",
        ]);

        function trimHeaderValue(header: any) {
            return header.toString?.().trim().replace(/\s+/g, ' ') ?? '';
        }

        let h = Object.keys(originHeaders);
        // 根据 needSignHeaders 过滤
        if (Array.isArray(needSignHeaders)) {
            const needSignSet = new Set([...needSignHeaders, 'x-date', 'host'].map((k) => k.toLowerCase()));
            h = h.filter((k) => needSignSet.has(k.toLowerCase()));
        }
        // 根据 ignore headers 过滤
        h = h.filter((k) => !HEADER_KEYS_TO_IGNORE.has(k.toLowerCase()));
        const signedHeaderKeys = h
            .slice()
            .map((k) => k.toLowerCase())
            .sort()
            .join(';');
        const canonicalHeaders = h
            .sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1))
            .map((k) => `${k.toLowerCase()}:${trimHeaderValue(originHeaders[k])}`)
            .join('\n');
        return [signedHeaderKeys, canonicalHeaders];
    }


    static hmacSha256(secret: Buffer, str: string) {
        return crypto.createHmac('sha256', secret).update(str, 'utf8').digest();
    }

    static hash(s: string) {
        return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
    }
}

export default VolcTranslationService;