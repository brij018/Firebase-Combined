import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { deleteFile } from "./storage";

const COLLECTION_NAME = "tasks";

export const tasksCollectionRef = collection(db, COLLECTION_NAME);

/**
 * Subscribe to real-time updates for tasks
 * @param {Function} onSuccess Callback with updated tasks array
 * @param {Function} onError Callback with error object
 * @returns {Function} Unsubscribe listener function
 */
export const subscribeToTasks = (onSuccess, onError) => {
  const q = query(tasksCollectionRef, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      onSuccess(tasks);
    },
    (err) => {
      console.error("Firestore subscription error:", err);
      if (onError) onError(err);
    }
  );
};

/**
 * Add a new task document to Firestore
 * @param {Object} taskData
 * @param {Object} user
 */
export const addTask = async (taskData, user) => {
  return await addDoc(tasksCollectionRef, {
    title: taskData.title,
    description: taskData.description || "",
    category: taskData.category || "General",
    priority: taskData.priority || "Medium",
    status: "pending",
    attachment: taskData.attachment || null,
    userId: user?.uid || null,
    userEmail: user?.email || user?.displayName || "Anonymous",
    createdAt: serverTimestamp(),
  });
};

/**
 * Update an existing task document in Firestore
 * @param {string} id
 * @param {Object} updatedFields
 */
export const updateTask = async (id, updatedFields) => {
  const taskRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(taskRef, {
    ...updatedFields,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Toggle task status between 'pending' and 'completed'
 * @param {string} id
 * @param {string} currentStatus
 */
export const toggleTaskStatus = async (id, currentStatus) => {
  const nextStatus = currentStatus === "completed" ? "pending" : "completed";
  const taskRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(taskRef, {
    status: nextStatus,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a task document from Firestore and remove any associated Storage file
 * @param {string} id
 * @param {string} [storagePath]
 */
export const deleteTask = async (id, storagePath) => {
  if (storagePath) {
    await deleteFile(storagePath);
  }
  const taskRef = doc(db, COLLECTION_NAME, id);
  return await deleteDoc(taskRef);
};
