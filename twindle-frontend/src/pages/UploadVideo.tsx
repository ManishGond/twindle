import React, { useState, useRef } from "react";
import styles from "../styles/UploadVideo.module.css";
import { uploadVideo } from "../utils/api";

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!title || !file) {
      setMessage("Title and video file are required.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ Please login to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("video", file);

    try {
      setUploading(true);
      await uploadVideo(formData, token);
      setMessage("✅ Upload successful!");
      setTitle("");
      setDescription("");
      setTags("");
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.headerText}>Upload</h2>

      <div className={styles.uploadContainer}>
        <div
          className={styles.leftSection}
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <video src={previewUrl} controls className={styles.preview} />
          ) : (
            <div className={styles.placeholder}>
              Click to upload video<br />
              No video selected.
            </div>
          )}
          <input
            type="file"
            accept="video/mp4"
            ref={fileInputRef}
            onChange={handleFileChange}
            className={styles.hiddenInput}
          />
        </div>

        {/* Form Inputs */}
        <div className={styles.rightSection}>
          <input
            type="text"
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
          />

          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={styles.input}
          />

          <button
            onClick={handleUpload}
            disabled={uploading}
            className={styles.uploadBtn}
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>

          {message && <p className={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;
