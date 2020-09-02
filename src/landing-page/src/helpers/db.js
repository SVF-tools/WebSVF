import { db } from "../services/firebase";

export function readChats() {
  let abc = [];
  db.ref("chats").on("value", (snapshot) => {
    snapshot.forEach((snap) => {
      abc.push(snap.val());
    });
    return abc;
  });
}

export function writeChats(message) {
  return db.ref("chats").push({
    content: message.content,
    timestamp: message.timestamp,
    uid: message.uid,
  });
}

export async function createTaskboard(userId, groupId) {
  const taskboard = await db.ref(`taskboards/${groupId}`).push({
    name: "New Taskboard",
    description: "This is a new taskboard",
    createdBy: userId,
    createdTimestamp: Date.now(),
  });
  return taskboard.getKey();
}

export function deleteTaskboard(groupId, taskboardId) {
  return db.ref(`taskboards/${groupId}/${taskboardId}`).remove();
}

export function updateTaskboard(groupId, taskboardId, taskboard) {
  return db.ref(`taskboards/${groupId}/${taskboardId}`).update(taskboard);
}

/**
 * Create a new column in the database.
 * The return value is void in all cases.
 * @param {string} columnsKey - The unique key that all columns are created under
 * @param {string} name - The name of the column
 */
export function createTaskColumn(boardId, name) {
  return db.ref(`columns/${boardId}`).push({
    name,
    createdTimestamp: Date.now(),
  });
}

export function deleteTaskColumn(boardId, id) {
  return db.ref(`columns/${boardId}/${id}`).update({
    deletedTimestamp: Date.now(),
  });
}

export function deleteTask(columnId, taskId) {
  return db.ref(`tasks/${columnId}/${taskId}`).update({
    deletedTimestamp: Date.now(),
  });
}

export function createTask(columnId, task) {
  return db.ref(`tasks/${columnId}`).push(task);
}

export function addMember(columnId, taskId, member) {
  return db.ref(`tasks/${columnId}/${taskId}/members`).push(member);
}

export function deleteMember(columnId, taskId, memberId) {
  return db.ref(`tasks/${columnId}/${taskId}/members/${memberId}`).remove();
}

export function createTaskTodo(columnId, taskId, todo) {
  return db.ref(`tasks/${columnId}/${taskId}/todos`).push(todo);
}

export function updateTaskTodoStatus(columnId, taskId, todoId, isComplete) {
  return db.ref(`tasks/${columnId}/${taskId}/todos/${todoId}`).update({
    isComplete: isComplete,
  });
}

export function deleteTaskTodo(columnId, taskId, todoId) {
  return db.ref(`tasks/${columnId}/${taskId}/todos/${todoId}`).remove();
}

export async function updateTaskColumn(newColumnId, oldColumnId, taskId) {
  try {
    //TODO: Make this logic more sound when second operation fails need to undo first
    let task = await db.ref(`tasks/${oldColumnId}/${taskId}`).once("value");
    await db.ref(`tasks/${newColumnId}/${taskId}`).update(task.val());
    await db.ref(`tasks/${oldColumnId}/${taskId}`).remove();
  } catch (error) {
    throw error;
  }
}

export function updateTask(columnId, taskId, updatedFields) {
  return db.ref(`tasks/${columnId}/${taskId}`).update(updatedFields);
}

export function createComment(taskId, comment) {
  return db.ref(`taskComments/${taskId}`).push(comment);
}

export function deleteComment(taskId, commentId) {
  return db.ref(`taskComments/${taskId}/${commentId}`).remove();
}

export async function getUserById(userId) {
  return db.ref(`users/${userId}`).once("value");
}
