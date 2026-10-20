import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Upload a file to Firebase Storage
 * @param {File} file The file to upload
 * @param {string} folder Target folder name in storage
 * @returns {Promise<{ url: string, name: string, size: number, type: string, path: string }>}
 */
export const uploadFile = async (file, folder = "tasks") => {
  if (!file) return null;

  // Sanitize file name and prefix with timestamp for uniqueness
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${folder}/${Date.now()}_${sanitizedName}`;
  const storageRef = ref(storage, storagePath);

  // Upload file bytes
  const snapshot = await uploadBytes(storageRef, file);

  // Retrieve public download URL
  const downloadUrl = await getDownloadURL(snapshot.ref);

  return {
    name: file.name,
    url: downloadUrl,
    size: file.size,
    type: file.type,
    path: storagePath,
  };
};

/**
 * Delete a file from Firebase Storage
 * @param {string} storagePath
 */
export const deleteFile = async (storagePath) => {
  if (!storagePath) return;
  try {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
  } catch (err) {
    console.warn("Could not delete file from storage (might already be removed):", err);
  }
};
