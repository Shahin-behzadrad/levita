import styles from "./FileUploadSection.module.scss";

interface FileUploadSectionProps {
  onFileChange: (files: File[]) => void;
}

export function FileUploadSection({ onFileChange }: FileUploadSectionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFileChange(filesArray);
    } else {
      onFileChange([]);
    }
  };

  return (
    <div className={styles.container}>
      <label htmlFor="file-upload" className={styles.label}>
        Upload Lab Results (Optional)
      </label>
      <div className={styles.uploadContainer}>
        <label htmlFor="file-upload" className={styles.uploadLabel}>
          <div className={styles.uploadContent}>
            <svg
              className={styles.uploadIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className={styles.uploadText}>
              <span className={styles.uploadTextBold}>Click to upload</span> or
              drag and drop
            </p>
            <p className={styles.uploadHint}>
              JPG, JPEG, or PNG (MAX. 10MB per file)
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            className={styles.fileInput}
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            multiple
          />
        </label>
      </div>
    </div>
  );
}
