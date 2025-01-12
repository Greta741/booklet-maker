import { PDFDocument } from "pdf-lib";

interface Page {
    number: number;
    left?: number;
    right?: number;
}

const indexIsInBoundary = (index: number, lenght: number): boolean => index < lenght;

const calculatePages = (pageNumbers: (number | undefined)[]): Page[] => {
    const pageNumbersLength = pageNumbers.length;
    const pages = Math.ceil(pageNumbersLength / 4);
    const maxPagesToFit = pages * 4;

    const pagesA = [];
    const pagesB = [];
    for (let i = 0; i < pages; i++) {
        const pageALeftIndex = maxPagesToFit - (i * 2) - 1;
        const pageARightIndex = (i * 2);
        const pageBLeftIndex = (i * 2) + 1;
        const pageBRightIndex = maxPagesToFit - (i * 2) - 2;

        const pageA = {
            number: i,
            left: indexIsInBoundary(pageALeftIndex, pageNumbersLength) ? pageNumbers[pageALeftIndex] : undefined,
            right: indexIsInBoundary(pageARightIndex, pageNumbersLength) ? pageNumbers[pageARightIndex] : undefined,
        }

        const pageB = {
            number: pages + i,
            left: indexIsInBoundary(pageBLeftIndex, pageNumbersLength) ? pageNumbers[pageBLeftIndex] : undefined,
            right: indexIsInBoundary(pageBRightIndex, pageNumbersLength) ? pageNumbers[pageBRightIndex] : undefined,
        }

        pagesA.push(pageA);
        pagesB.push(pageB);
    }

    return [...pagesA, ...pagesB];
}

const reduceMargins = async (file: File, margin: number, topMarginModifier: number = 0): Promise<File> => {
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const newPdfDoc = await PDFDocument.create();

    const tempPage = pdfDoc.getPage(0);
    const { width, height } = tempPage.getSize();

    // Loop through all pages
    const pages = pdfDoc.getPages();
    for (const page of pages) {
        const newPage = newPdfDoc.addPage([width - (margin * 2), height - (margin * 2)]);

        const embeddedPage = await newPdfDoc.embedPage(page)

        newPage.drawPage(embeddedPage, { x: -margin, y: -margin + topMarginModifier });
    }

    // Serialize the PDF to bytes
    const modifiedPdfBytes = await newPdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: file.type });
    return new File([blob], file.name);
}


const makeBooklet = async (file: File, pages: Page[]) => {
    const arrayBuffer = await file.arrayBuffer();

    try {
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const tempBookletDoc = await PDFDocument.create();

        const tempPage = pdfDoc.getPage(0);
        const { width, height } = tempPage.getSize();

        for (let i = 0; i < pages.length; i++) {
            const pageInfo = pages[i];

            // Create a new landscape page
            const newPage = tempBookletDoc.addPage([width * 2, height]);

            // Copy content of the first page
            if (!!pageInfo.left) {
                const [copiedFirstPage] = await tempBookletDoc.copyPages(pdfDoc, [pageInfo.left - 1]);
                const embededFirstPage = await tempBookletDoc.embedPage(copiedFirstPage)

                newPage.drawPage(embededFirstPage, { x: 0, y: 0 });
            }

            // Copy content of the second page, if it exists
            if (!!pageInfo.right) {
                const [copiedSecondPage] = await tempBookletDoc.copyPages(pdfDoc, [pageInfo.right - 1]);
                const embededSecondPage = await tempBookletDoc.embedPage(copiedSecondPage)
                newPage.drawPage(embededSecondPage, { x: width, y: 0 });
            }
        }

        const bookletPdfBytes = await tempBookletDoc.save();

        return bookletPdfBytes;
    } catch (error) {
        console.log(error);
    }
};


const getPageNumbers = async (file: File): Promise<number> => {
    const arrayBuffer = await file.arrayBuffer();

    try {
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        return pdfDoc.getPageCount();
    }
    catch (error) {
        console.log(error)
    }

    return 0;
}

export default { makeBooklet, calculatePages, getPageNumbers, reduceMargins };