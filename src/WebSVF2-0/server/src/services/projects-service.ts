import mongoose from 'mongoose';
import { DocumentsConstants } from '../documents/DocumentsConstants';
import { fileSchema, IFileDocument } from '../documents/FileDocument';
import { folderSchema, IFolderDocument } from '../documents/FolderDocument';
import { IProjectDocument, projectSchema } from '../documents/ProjectDocument';
import { IFile, ISaveFile } from '../models/File';
import { IFolder } from '../models/Folder';
import { IProject } from '../models/Project';

const defaultFileName = 'example.c';
const defaultFileContent = `#include <math.h>
#include <stdio.h>
int main() {
    double a, b, c, discriminant, root1, root2, realPart, imagPart;
    printf("Enter coefficients a, b and c: ");
    scanf("%lf %lf %lf", &a, &b, &c);
    discriminant = b * b - 4 * a * c;
    // condition for real and different roots
    if (discriminant > 0) {
        root1 = (-b + sqrt(discriminant)) / (2 * a);
        root2 = (-b - sqrt(discriminant)) / (2 * a);
        printf("root1 = %.2lf and root2 = %.2lf", root1, root2);
    }
    // condition for real and equal roots
    else if (discriminant == 0) {
        root1 = root2 = -b / (2 * a);
        printf("root1 = root2 = %.2lf;", root1);
    }
    // if roots are not real
    else {
        realPart = -b / (2 * a);
        imagPart = sqrt(-discriminant) / (2 * a);
        printf("root1 = %.2lf+%.2lfi and root2 = %.2f-%.2fi", realPart, imagPart, realPart, imagPart);
    }
    return 0;
} `;

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

export interface ISaveFileProps {
  id?: string;
  data: ISaveFile;
}

const createDefaultProject = async () => {
  const project = await projectsCollection.create({
    name: 'Default'
  });

  return project;
};

const createDefaultFolder = async (projectId: string) => {
  const folder = await foldersCollection.create({
    project: projectId,
    name: 'Default'
  });

  return folder;
};

const createFile = async (folderId: string, name: string, content: string) => {
  const file = await filesCollection.create({
    folder: folderId,
    name: name,
    content: content
  });

  return file;
};

export interface IProjectsService {
  getProjects: () => Promise<IProject[]>;
  getProject: (id: string) => Promise<IProject | undefined>;
  getFolders: (projectId: string) => Promise<IFolder[]>;
  getFoldersByProjectIds: (projectIds: string[]) => Promise<IFolder[]>;
  getFiles: (folderId: string) => Promise<IFile[]>;
  getFilesByFolderIds: (folderIds: string[]) => Promise<IFile[]>;
  saveFile: (props: ISaveFileProps) => Promise<IFile | undefined>;
  createDefaultProject: () => Promise<IProject>;
}

export const projectsServiceFactory: () => IProjectsService = () => {
  const projectsService: IProjectsService = {
    getProjects: async () => {
      const projectDocs = await projectsCollection.find();
      const projectIds = projectDocs.map((x) => x._id?.toHexString() ?? '');

      const folders = await projectsService.getFoldersByProjectIds(projectIds);

      const projects = projectDocs.map((projectDoct) => {
        const projectFolders = folders.filter((folder) => folder.projectId === projectDoct._id?.toHexString());

        return buildProjectModel(projectDoct, projectFolders);
      });

      if (projects.length < 1) {
        projects.push(await projectsService.createDefaultProject());
      }

      return projects;
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
    },
    saveFile: async ({ id, data }) => {
      if (id) {
        const file = await filesCollection.findById(id);
        if (!file) {
          throw new Error('File not found with id ' + id);
        }

        file.name = data.name;
        file.content = data.content;
        file.save();

        return {
          id: file._id?.toHexString() ?? '',
          folderId: file.folder.toHexString(),
          name: file.name,
          content: file.content
        };
      }

      let folderId = data.folderId;
      if (!folderId) {
        const project = (await projectsCollection.findOne()) ?? (await createDefaultProject());

        const folder = (await foldersCollection.findOne({ project: project._id })) ?? (await createDefaultFolder(project._id?.toHexString() ?? ''));

        folderId = folder._id?.toHexString();
      }

      const file = await createFile(folderId ?? '', data.name, data.content);

      return {
        id: file._id?.toHexString() ?? '',
        folderId: file.folder.toHexString(),
        name: file.name,
        content: file.content
      };
    },
    createDefaultProject: async () => {
      const project = await createDefaultProject();

      const folder = await createDefaultFolder(project._id?.toHexString() ?? '');

      const file = await createFile(folder._id?.toHexString() ?? '', defaultFileName, defaultFileContent);

      return buildProjectModel(project, [buildFolderModel(folder, [buildFileModel(file)])]);
    }
  };

  return projectsService;
};
