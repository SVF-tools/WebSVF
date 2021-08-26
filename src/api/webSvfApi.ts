import axios, { AxiosResponse } from 'axios';
import { IProject } from '../models/project';

export type GraphNameType = 'callgraph' | 'icfg' | 'pag' | 'svfg' | 'vfg';

export interface IAnalyseProps {
  graphName: GraphNameType;
  fileName: string;
  code: string;
}

export interface IWebSvfApi {
  analyse: (props: IAnalyseProps) => Promise<string>;
  getProjects: () => Promise<IProject[]>;
}

export const webSvfApiFactory: () => IWebSvfApi = () => {
  const client = axios.create({
    baseURL: 'https://api.websvftechnology.com'
  });

  const webSvgApi: IWebSvfApi = {
    analyse: async ({ graphName, fileName, code }) => {
      const response = await client.post<IAnalyseProps, AxiosResponse<string>>('/analysis/' + graphName, {
        code: code,
        fileName: fileName
      });

      return response.data;
    },
    getProjects: async () => {
      const response = await client.get<IAnalyseProps, AxiosResponse<IProject[]>>('/projects');

      return response.data;
    }
  };

  return webSvgApi;
};
