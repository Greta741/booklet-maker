"use client";

import Image from "next/image";
import styles from "./page.module.css";
import FileUploader from "@/components/FileUploader";
import React, { useState } from 'react';
import BookletMaker from "@/components/BookletMaker";
import PdfPagesSelector from "@/components/PdfPagesSelector";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Home() {
  const [file, setFile] = useState<File | undefined>();
  const [selectedPagesNumbers, setSelectedPagesNumbers] = useState<(number | undefined)[]>([]);

  return (
    <div className={styles.page}>
      <FileUploader onFileUpload={setFile} />
      {!!file && <PdfPagesSelector file={file} onPagesChange={(pages) => setSelectedPagesNumbers(pages)} />}
      {!!file && <BookletMaker file={file} pagesNumbers={selectedPagesNumbers} />}
    </div>
  );
}
