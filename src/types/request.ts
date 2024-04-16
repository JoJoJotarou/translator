interface ApiRequest<T> {
    method: string;
    path: string;
    headers: { [key: string]: string };
    params: { [key: string]: string };
    body?: T;
}

class ApiRequestBuilder<T> {
    private request: ApiRequest<T>;

    constructor() {
        this.request = {
            method: 'GET',
            path: '/',
            headers: {},
            params: {}
        };
    }

    setMethod(method: string): ApiRequestBuilder<T> {
        this.request.method = method;
        return this;
    }

    setPath(path: string): ApiRequestBuilder<T> {
        this.request.path = path;
        return this;
    }

    setHeaders(headers: { [key: string]: string }): ApiRequestBuilder<T> {
        this.request.headers = headers;
        return this;
    }

    setParams(params: { [key: string]: string }): ApiRequestBuilder<T> {
        this.request.params = params;
        return this;
    }

    setBody(body: T): ApiRequestBuilder<T> {
        this.request.body = body;
        return this;
    }

    build(): ApiRequest<T> {
        return this.request;
    }
}

interface TextTranslationRequestBody {
    /**
     * 目标语言
     */
    targetLanguage: string;

    /**
     * 待翻译的文本列表
     * 
     * @description 列表长度不超过16, 总文本长度不超过5000字符. see the [volc text translation API](https://www.volcengine.com/docs/4640/65067)
     */
    textList: string[];
}

export {
    ApiRequest,
    ApiRequestBuilder,
    TextTranslationRequestBody
};