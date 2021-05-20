import React, { useEffect } from 'react';
import styled from 'styled-components';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import FolderIcon from '@material-ui/icons/Folder';
import DescriptionIcon from '@material-ui/icons/Description';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, selectedFileUpdated } from '../../store/actionts';
import { IStore } from '../../store/store';
import { IProject } from '../../models/project';
import { IFolder } from '../../models/folder';
import { IFile } from '../../models/file';
import { SvgIconProps } from '@material-ui/core';
import { IThemeProps } from '../../themes/theme';
import Typography from '@material-ui/core/Typography';

const StyledTreeItemContent = styled.div`
  color: ${({ theme }: IThemeProps) => theme.palette.text.secondary};
  display: flex;
  padding: ${({ theme }: IThemeProps) => theme.spacing(1)};

  &:hover {
    background-color: ${({ theme }: IThemeProps) => theme.palette.action.hover};
  }

  &:focus {
    background-color: var(--tree-view-bg-color, ${({ theme }: IThemeProps) => theme.palette.grey[400]});
  }
  & > p {
    flex-grow: 1;
    padding-left: ${({ theme }: IThemeProps) => theme.spacing(1)};
  }
`;

const StyledTreeItem = styled(TreeItem)`
  --tree-view-color: #1a73e8;
  --tree-view-bg-color: #e8f0fe;
`;

interface ICustomTreeItem extends Omit<TreeItemProps, 'label'> {
  labelIcon: React.ReactElement<SvgIconProps>;
  labelText: string;
  labelInfo?: string;
}

const CustomTreeItem: React.FC<ICustomTreeItem> = ({ labelIcon, labelText, labelInfo, ...rest }) => {
  return (
    <StyledTreeItem
      label={
        <StyledTreeItemContent>
          {labelIcon}
          <Typography variant='body2'>{labelText}</Typography>
          <Typography variant='caption' color='inherit'>
            {labelInfo}
          </Typography>
        </StyledTreeItemContent>
      }
      {...rest}
    />
  );
};

interface IFileTreeItemProps {
  file: IFile;
}

const FileTreeItem: React.FC<IFileTreeItemProps> = ({ file }) => {
  return <CustomTreeItem nodeId={file.id} labelText={file.name} labelIcon={<DescriptionIcon />} />;
};

interface IFolderTreeItemProps {
  folder: IFolder;
}

const FolderTreeItem: React.FC<IFolderTreeItemProps> = ({ folder }) => {
  return (
    <CustomTreeItem nodeId={folder.id} labelText={folder.name} labelIcon={<FolderIcon />}>
      {folder.files.map((file) => (
        <FileTreeItem key={file.id} file={file} />
      ))}
    </CustomTreeItem>
  );
};

interface IProjectTreeItemProps {
  project: IProject;
}
const ProjectTreeItem: React.FC<IProjectTreeItemProps> = ({ project }) => {
  return (
    <CustomTreeItem nodeId={project.id} labelText={project.name} labelIcon={<AccountTreeIcon />}>
      {project.folders.map((folder) => (
        <FolderTreeItem key={folder.id} folder={folder} />
      ))}
    </CustomTreeItem>
  );
};

export const ProjectsTreeView: React.FC = () => {
  const projects = useSelector((store: IStore) => store.projects);
  const selectedFile = useSelector((store: IStore) => store.selectedFile);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!projects) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects]);

  useEffect(() => {
    if (projects && !selectedFile) {
      const file = projects[0].folders[0].files[0];
      dispatch(selectedFileUpdated(file));
    }
  }, [dispatch, projects, selectedFile]);

  return projects && projects.length > 0 ? (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={[projects[0].id, projects[0].folders[0].id, projects[0].folders[0].files[0].id]}
      onNodeSelect={(event: React.SyntheticEvent, nodeId: string) => console.log(nodeId)}>
      {projects?.map((project) => (
        <ProjectTreeItem key={project.id} project={project} />
      ))}
    </TreeView>
  ) : (
    <></>
  );
};
