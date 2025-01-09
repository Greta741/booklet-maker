import React, { useCallback, useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import BookletService from "./BookletService";
import styled from "styled-components";

const StyledDocumentWrapper = styled.div`
    .react-pdf__Document {
        display: flex;
        flex-flow: row;
        max-width: 100vw;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
    }
`;

const StyledPageWrapper = styled.div<{ selected?: boolean }>`
    border: 3px solid lightgray;
    cursor: pointer;

    &:hover {
        border-width: 4px;
        border-color: lightBlue;
    }

    ${(props) => {
        if (props.selected) {
            return 'border: 4px solid #4f7ccd;'
        }

        return '';
    }}
`;

const StyledRenderFirstPageEmpty = styled.div`
    display: flex;
    gap: 10px;
    padding: 10px;
    justify-content: center;
`;

interface PdfPagesSelectorProps {
    file: File;
    onPagesChange: (pages: (number | undefined)[]) => void;
}

const PdfPagesSelector = ({ file, onPagesChange }: PdfPagesSelectorProps) => {
    const [totalPages, setTotalPages] = useState<number>(0);
    const [selectedPages, setSelectedPages] = useState<{ [pageNumber: string]: boolean }>({});

    const getPageNumbers = useCallback(async () => {
        const total = await BookletService.getPageNumbers(file);
        setTotalPages(total)
    }, [file]);

    const togglePage = useCallback((pageNumner: string) => {
        setSelectedPages((currentSelectedPages) => {
            return {
                ...currentSelectedPages,
                [pageNumner]: !currentSelectedPages[pageNumner]
            }
        });
    }, []);

    useEffect(() => {
        getPageNumbers();
    }, [getPageNumbers]);

    useEffect(() => {
        const tempSelectedPages: { [pageNumber: string]: boolean } = {};

        for (let i = 1; i <= totalPages; i++) {
            tempSelectedPages[i] = true;
        }

        setSelectedPages(tempSelectedPages);
    }, [totalPages])

    useEffect(() => {
        const selectedPagesArray: (number | undefined)[] = [];

        if (selectedPages.renderFirstPageEmpty) {
            selectedPagesArray.push(undefined);
        }

        const tempSelectedPages = { ...selectedPages };
        delete tempSelectedPages.renderFirstPageEmpty;
        const tempSelectedPagesArray = Object.keys(tempSelectedPages)
            .filter((pageNumber) => selectedPages[pageNumber])
            .map((pageNumber) => +pageNumber)
            .sort((a, b) => a - b);

        selectedPagesArray.push(...tempSelectedPagesArray);

        onPagesChange(selectedPagesArray);
    }, [selectedPages])

    return (
        <StyledDocumentWrapper>
            <StyledRenderFirstPageEmpty>
                <input id='renderFirstPageEmpty' name='renderFirstPageEmpty' type="checkbox" checked={selectedPages.renderFirstPageEmpy} onChange={() => togglePage('renderFirstPageEmpty')} />
                <label htmlFor='renderFirstPageEmpty'>Render First page empty</label>
            </StyledRenderFirstPageEmpty>
            <Document
                file={file}
                loading="Loading PDF..."
            >
                {Array.from(new Array(totalPages), (el, index) => (
                    <StyledPageWrapper key={`pageWrapper_${index + 1}`} selected={selectedPages[index + 1]} onClick={() => togglePage((index + 1).toString())}>
                        <Page
                            scale={0.3}
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            renderTextLayer={false}
                        />
                    </StyledPageWrapper>
                ))}
            </Document>
        </StyledDocumentWrapper>
    );
};

export default PdfPagesSelector;