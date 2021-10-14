import axios, { AxiosResponse } from 'axios';
import { IProject } from '../models/project';

export enum GraphType {
  Callgraph = 'callgraph',
  Icfg = 'icfg',
  Pag = 'pag',
  Svfg = 'svfg',
  Vfg = 'vfg'
}

export interface IAnalyseProps {
  graphName: GraphType;
  fileName: string;
  code: string;
}

export interface IWebSvfApi {
  analyse: (props: IAnalyseProps) => Promise<string>;
  analyseAll: ({ fileName, code }: { fileName: string; code: string }) => Promise<Record<GraphType, string>>;
  getProjects: () => Promise<IProject[]>;
}

export const webSvfApiFactory: () => IWebSvfApi = () => {
  const client = axios.create({
    baseURL: 'https://api.websvftechnology.com'
  });

  const webSvgApi: IWebSvfApi = {
    analyse: async ({ graphName, fileName, code }) => {
      const response = await client.post<IAnalyseProps, AxiosResponse<any>>('/analysis/' + graphName, {
        code: code,
        fileName: fileName
      });

      return response.data[graphName] as string;
    },
    analyseAll: async ({ fileName, code }) => {
      const response = await client.post<IAnalyseProps, AxiosResponse<Record<GraphType, string>>>('/analysis/all', {
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
