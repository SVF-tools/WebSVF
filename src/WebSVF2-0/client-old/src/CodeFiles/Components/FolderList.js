import React, { useState } from "react";
// import {
//   Typography,
//   IconButton,
//   Grid,
//   List,
//   ListItemIcon,
//   ListItemText,
//   ListItem,
//   // Button,
//   Menu,
//   MenuItem,
//   Box,
// } from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import FolderIcon from "@material-ui/icons/Folder";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";

import websvf from "../../api/websvf";

const FolderList = (props) => {
  var i = 0;

  return (
    <div>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {props.userCode.map((value) => {
          return (
            <div>
              <TreeItem nodeId={i++} label={value.folderName}>
                <TreeItem
                  nodeId={i++}
                  label={value.files.map((file) => {
                    return file.fileName;
                  })}
                  onClick={() => {}}
                />
              </TreeItem>
            </div>
          );
        })}
      </TreeView>
    </div>
  );
};

export default FolderList;
