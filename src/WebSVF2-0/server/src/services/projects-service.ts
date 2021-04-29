import mongoose from 'mongoose';
import { DocumentsConstants } from '../documents/DocumentsConstants';
import { fileSchema, IFileDocument } from '../documents/FileDocument';
import { folderSchema, IFolderDocument } from '../documents/FolderDocument';
import { IProjectDocument, projectSchema } from '../documents/ProjectDocument';
import { IFile } from '../models/File';
import { IFolder } from '../models/Folder';
import { IProject } from '../models/Project';

const projectsCollection = mongoose.model<IProjectDocument>(DocumentsConstants.ProjectDocument, projectSchema);
const foldersCollection = mongoose.model<IFolderDocument>(DocumentsConstants.FolderDocument, folderSchema);
const filesCollection = mongoose.model<IFileDocument>(DocumentsConstants.FileDocument, fileSchema);

const buildFileModel = (fileDoc: IFileDocument) => {
  const file: IFile = {
    id: fileDoc._id?.toHexString() ?? '',
    folderId: fileDoc.folder.toHexString(),
    name: fileDoc.name,
    content: fileDoc.content
  };

  return file;
};

const buildFolderModel = (folderDoc: IFolderDocument, files: IFile[]) => {
  const folder: IFolder = {
    id: folderDoc._id?.toHexString() ?? '',
    projectId: folderDoc.project.toHexString(),
    name: folderDoc.name,
    files: files
  };

  return folder;
};

const buildProjectModel = (projectDoc: IProjectDocument, folders: IFolder[]) => {
  const project: IProject = {
    id: projectDoc._id?.toHexString() ?? '',
    name: projectDoc.name,
    folders: folders
  };

  return project;
};

export interface IProjectsService {
  getProjects: () => Promise<IProject[]>;
  getProject: (id: string) => Promise<IProject | undefined>;
  getFolders: (projectId: string) => Promise<IFolder[]>;
  getFoldersByProjectIds: (projectIds: string[]) => Promise<IFolder[]>;
  getFiles: (folderId: string) => Promise<IFile[]>;
  getFilesByFolderIds: (folderIds: string[]) => Promise<IFile[]>;
}

export const projectsServiceFactory: () => IProjectsService = () => {
  const projectsService: IProjectsService = {
    getProjects: async () => {
      const projectDocs = await projectsCollection.find();
      const projectIds = projectDocs.map((x) => x._id?.toHexString() ?? '');

      const folders = await projectsService.getFoldersByProjectIds(projectIds);

      return projectDocs.map((projectDoct) => {
        const projectFolders = folders.filter((folder) => folder.projectId === projectDoct._id?.toHexString());

        return buildProjectModel(projectDoct, projectFolders);
      });
    },
    getProject: async (id) => {
      const projectDoc = await projectsCollection.findById(id);
      if (projectDoc) {
        const projectFolders = await projectsService.getFolders(id);
        return buildProjectModel(projectDoc, projectFolders);
      }

      return undefined;
    },
    getFolders: async (projectId) => {
      return await projectsService.getFoldersByProjectIds([projectId]);
    },
    getFoldersByProjectIds: async (projectIds) => {
      const folderDocs = await foldersCollection.find({ project: { $in: projectIds } });
      const folderIds = folderDocs.map((x) => x._id?.toHexString() ?? '');
      const files = await projectsService.getFilesByFolderIds(folderIds);

      return folderDocs.map((folderDoc) => {
        const folderFiles = files.filter((file) => file.folderId === folderDoc._id?.toHexString());

        return buildFolderModel(folderDoc, folderFiles);
      });
    },
    getFiles: async (folderId) => {
      return projectsService.getFilesByFolderIds([folderId]);
    },
    getFilesByFolderIds: async (folderIds) => {
      const fileDocs = await filesCollection.find({ folder: { $in: folderIds } });

      return fileDocs.map((x) => buildFileModel(x));
    }
  };

  return projectsService;
};
