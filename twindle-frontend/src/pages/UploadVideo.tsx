import React, { useState, useRef } from "react";
import styles from "../styles/UploadVideo.module.css";
import { uploadVideo } from "../utils/api";
import { getAuth } from "../utils/auth";
import { useDispatch } from "react-redux";
import { addVideo } from "../features/videos/videosSlice"; // ✅ Added import
import type { AppDispatch } from "../store/store";

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbPreviewUrl, setThumbPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setThumbnail(selected);
      setThumbPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!title || !file) {
      setMessage("❌ Title and video file are required.");
      return;
    }

    const auth = getAuth();
    const token = auth?.token;

    if (!token) {
      setMessage("❌ Please login to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("video", file);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      setUploading(true);
      const newVideo = await uploadVideo(formData, token);

      // ✅ Add the new video to Redux store
      dispatch(addVideo(newVideo));

      setMessage("✅ Upload successful!");

      // Reset form
      setTitle("");
      setDescription("");
      setTags("");
      setFile(null);
      setPreviewUrl(null);
      setThumbnail(null);
      setThumbPreviewUrl(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.headerText}>Upload</h2>

      <div className={styles.uploadContainer}>
        {/* Left: Video Upload */}
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

        {/* Right: Form + Thumbnail */}
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

          {/* Thumbnail Upload */}
          <div
            className={styles.thumbnailUpload}
            onClick={() => thumbInputRef.current?.click()}
          >
            {thumbPreviewUrl ? (
              <img
                src={thumbPreviewUrl}
                alt="Thumbnail"
                className={styles.thumbPreview}
              />
            ) : (
              <div className={styles.thumbPlaceholder}>
                Click to upload thumbnail<br />
                (optional)
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={thumbInputRef}
              onChange={handleThumbChange}
              className={styles.hiddenInput}
            />
          </div>

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
