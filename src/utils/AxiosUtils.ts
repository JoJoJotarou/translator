import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class AxiosUtils {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create();
        this.axiosInstance.defaults.timeout = 2500;
        this.axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
        this.addInterceptors();
    }

    private addInterceptors() {
        /* this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
            // 在这里添加请求拦截器的逻辑
            return config;
        });

        this.axiosInstance.interceptors.response.use((response: AxiosResponse) => {
            // 在这里添加响应拦截器的逻辑
            return response;
        }); */
    }

    public get(url: string, config?: AxiosRequestConfig) {
        return this.axiosInstance.get(url, config);
    }

    public post(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.axiosInstance.post(url, data, config);
    }

    public request(config: AxiosRequestConfig) {
        return this.axiosInstance.request(config);
    }

    // 在这里添加其他方法，如 put、delete 等
}

export default new AxiosUtils();