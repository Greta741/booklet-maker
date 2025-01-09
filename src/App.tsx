import React, { useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import BookletMaker from './components/BookletMaker';
import PdfPagesSelector from './components/PdfPagesSelector';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function App() {
  const [file, setFile] = useState<File | undefined>();
  const [selectedPagesNumbers, setSelectedPagesNumbers] = useState<(number | undefined)[]>([]);

  return (
    <div>
      <FileUploader onFileUpload={setFile} />
      {!!file && <PdfPagesSelector file={file} onPagesChange={setSelectedPagesNumbers} />}
      {!!file && <BookletMaker file={file} pagesNumbers={selectedPagesNumbers} />}
    </div>
  );
}

export default App;
