"use client";

import Image from "next/image";
import styles from "./page.module.css";
import FileUploader from "@/components/FileUploader";
import React, { useState } from 'react';
import BookletMaker from "@/components/BookletMaker";

export default function Home() {
  const [file, setFile] = useState<File | undefined>();

  return (
    <div className={styles.page}>
      <FileUploader onFileUpload={setFile} />
      {!!file && <BookletMaker file={file} />}
    </div>
  );
}
