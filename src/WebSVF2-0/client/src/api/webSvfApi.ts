import axios, { AxiosResponse } from 'axios';

export interface IAnalysisProps {
  code: string;
  fileName: string;
}

export interface IWebSvfApi {
  callGraph: (props: IAnalysisProps) => Promise<string>;
  genIcfg: (props: IAnalysisProps) => Promise<string>;
  genPag: (props: IAnalysisProps) => Promise<string>;
  genSvfg: (props: IAnalysisProps) => Promise<string>;
  genVfg: (props: IAnalysisProps) => Promise<string>;
}

const webSvgApiFactory: () => IWebSvfApi = () => {
  const client = axios.create({
    baseURL: 'http://localhost:5001/'
  });

  const webSvgApi: IWebSvfApi = {
    callGraph: async ({ code, fileName }) => {
      const response = await client.post<IAnalysisProps, AxiosResponse<string>>('/analysis/callGraph', {
        code: code,
        fileName: fileName
      });

      return response.data;
    },
    genIcfg: async ({ code, fileName }) => {
      const response = await client.post<IAnalysisProps, AxiosResponse<string>>('/analysis/icfg', {
        code: code,
        fileName: fileName
      });

      return response.data;
    },
    genPag: async ({ code, fileName }) => {
      const response = await client.post<IAnalysisProps, AxiosResponse<string>>('/analysis/pag', {
        code: code,
        fileName: fileName
      });

      return response.data;
    },
    genSvfg: async ({ code, fileName }) => {
      const response = await client.post<IAnalysisProps, AxiosResponse<string>>('/analysis/svfg', {
        code: code,
        fileName: fileName
      });

      return response.data;
    },
    genVfg: async ({ code, fileName }) => {
      const response = await client.post<IAnalysisProps, AxiosResponse<string>>('/analysis/vfg', {
        code: code,
        fileName: fileName
      });

      return response.data;
    }
  };

  return webSvgApi;
};

export default webSvgApiFactory;
