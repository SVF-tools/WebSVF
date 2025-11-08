import React, { useState } from 'react';
import './sessionsSidebar.css';
import { Session } from '../sessionManager';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmationDialog from '../confirmationDialog/confirmationDialog';
import ShareIcon from '@mui/icons-material/Share';

interface SessionsSidebarProps {
  sessions: Session[];
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onDeleteSession: (sessionId: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  onShareSession: (sessionId: string) => void;
}

const SessionsSidebar: React.FC<SessionsSidebarProps> = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  onRenameSession,
  onDeleteSession,
  isOpen,
  toggleSidebar,
  onShareSession,
}) => {
  const [editSessionId, setEditSessionId] = useState<string | null>(null);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const handleEditClick = (sessionId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditSessionId(sessionId);
    setNewSessionTitle(currentTitle);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSessionTitle(e.target.value);
  };

  const handleTitleSave = (sessionId: string) => {
    if (newSessionTitle.trim()) {
      onRenameSession(sessionId, newSessionTitle);
    }
    setEditSessionId(null);
  };

  const handleShareClick = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onShareSession(sessionId);
  };

  const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sessionToDelete) {
      onDeleteSession(sessionToDelete);
      setDeleteConfirmOpen(false);
      setSessionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setSessionToDelete(null);
  };

  return (
    <div className={`sessions-sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <div className="sessions-sidebar-header">
        <h3>Projects</h3>
        <div className="icon-container new-session-container">
          <button
            className="new-session-btn"
            onClick={onNewSession}
            aria-label="Create new project"
            title="New Project"
          >
            <AddIcon fontSize="medium" />
          </button>
          <span className="tooltip">New Project</span>
        </div>
        <div className="sessions-sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? '≪' : '≫'}
        </div>
      </div>

      <div className="sessions-list">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`session-item ${session.id === currentSessionId ? 'active' : ''}`}
            onClick={() => onSessionSelect(session.id)}
          >
            {editSessionId === session.id ? (
              <div className="session-edit" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={newSessionTitle}
                  onChange={handleTitleChange}
                  autoFocus
                  onBlur={() => handleTitleSave(session.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSave(session.id)}
                />
              </div>
            ) : (
              <>
                <div className="session-info">
                  <div className="session-title">{session.title || 'Untitled Project'}</div>
                  <div className="session-date">
                    {`${new Date(session.lastUpdated).toLocaleDateString()} ${new Date(
                      session.lastUpdated
                    ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </div>
                </div>
                <div className="session-actions">
                  <div
                    className="session-language"
                    title={`Language: ${session.language === 'cpp' ? 'C++' : 'C'}`}
                    aria-label={`Language: ${session.language === 'cpp' ? 'C++' : 'C'}`}
                  >
                    {session.language === 'cpp' ? 'C++' : 'C'}
                  </div>
                  <span title="Rename project">
                    <EditIcon
                      titleAccess="Rename project"
                      fontSize="small"
                      className="edit-icon"
                      onClick={(e) => handleEditClick(session.id, session.title, e)}
                    />
                  </span>
                  <span title="Share project">
                    <ShareIcon
                      titleAccess="Share project"
                      fontSize="small"
                      className="share-icon"
                      onClick={(e) => handleShareClick(session.id, e)}
                    />
                  </span>
                  <span title="Delete project">
                    <DeleteIcon
                      titleAccess="Delete project"
                      fontSize="small"
                      className="delete-icon"
                      onClick={(e) => handleDeleteClick(session.id, e)}
                    />
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <ConfirmationDialog
        open={deleteConfirmOpen}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default SessionsSidebar;
