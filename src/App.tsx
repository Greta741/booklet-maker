import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import BookletMaker from './components/BookletMaker';
import PdfPagesSelector from './components/PdfPagesSelector';
import { pdfjs } from 'react-pdf';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { Card } from '@mui/material';
import styled from 'styled-components';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import MarginCutter from './components/MarginCutter';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const StyledContentWrapper = styled.div`
  max-width: 1200px;
  padding: 20px 50px;
  margin: auto;
`;

const StyledBox = styled(Box)`
  padding: 20px;

  .MuiStepper-root {
    margin-bottom: 20px;
  }
`;

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [margin, setMargin] = useState(0);
  const [topMarginModifier, setTopMarginModifier] = useState(0);
  const [file, setFile] = useState<File | undefined>();
  const [adjustedMarginFile, setAdjustedMarginFile] = useState<File | undefined>();
  const [selectedPagesNumbers, setSelectedPagesNumbers] = useState<(number | undefined)[]>([]);

  const handleNext = useCallback(() => {
    setActiveStep((current) => current + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((current) => current - 1);
  }, []);

  const handleSetFile = useCallback((file: File) => {
    setFile(file);
    setAdjustedMarginFile(file);
  }, []);

  useEffect(() => {
    if (file) {
      handleNext();
    }
  }, [file])

  return (
    <StyledContentWrapper>
      <Card variant="outlined">
        <StyledBox>
          <Stepper activeStep={activeStep}>
            <Step>
              <StepLabel>Upload File</StepLabel>
            </Step>
            <Step>
              <StepLabel>Reduce margin</StepLabel>
            </Step>
            <Step>
              <StepLabel>Select pages</StepLabel>
            </Step>
            <Step>
              <StepLabel>Download</StepLabel>
            </Step>
          </Stepper>
          {activeStep === 0 &&
            <div>
              <FileUploader fileName={file?.name} onFileUpload={handleSetFile} />
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button endIcon=<ArrowForward /> disabled={!file} onClick={handleNext}>Next</Button>
              </Box>
            </div>
          }


          {activeStep === 1 &&
            <div>
              {!!file && <MarginCutter
                margin={margin}
                topMarginModifier={topMarginModifier}
                file={file}
                onMarginChange={setMargin}
                onTopMarginModifierChange={setTopMarginModifier}
                onFileMarginChange={setAdjustedMarginFile} />}
              {!file && 'No file selected'}

              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                  startIcon=<ArrowBack />
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button endIcon=<ArrowForward /> disabled={!file} onClick={handleNext}>Next</Button>
              </Box>
            </div>
          }

          {activeStep === 2 &&
            <div>
              {!!adjustedMarginFile && <PdfPagesSelector file={adjustedMarginFile} onPagesChange={setSelectedPagesNumbers} />}
              {!adjustedMarginFile && 'No file selected'}
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                  startIcon=<ArrowBack />
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button endIcon=<ArrowForward /> disabled={!file} onClick={handleNext}>Next</Button>
              </Box>
            </div>
          }

          {activeStep === 3 &&
            <div>
              {!!adjustedMarginFile && <BookletMaker file={adjustedMarginFile} pagesNumbers={selectedPagesNumbers} />}
              {!adjustedMarginFile && 'No file selected'}
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  sx={{ mr: 1 }}
                  onClick={handleBack}
                  startIcon=<ArrowBack />
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
              </Box>
            </div>
          }
        </StyledBox>
      </Card>
    </StyledContentWrapper>
  );
}

export default App;
