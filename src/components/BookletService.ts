import { PDFDocument } from "pdf-lib";

const make = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();

    try {
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const tempBookletDoc = await PDFDocument.create();

        const pageCount = pdfDoc.getPageCount();
        for (let i = 0; i < pageCount - 2; i += 2) {
            const firstPage = pdfDoc.getPage(i);
            const secondPage = i + 1 < pageCount ? pdfDoc.getPage(i + 1) : null;

            const { width, height } = firstPage.getSize();

            // Create a new landscape page
            const newPage = tempBookletDoc.addPage([width * 2, height]);

            // Copy content of the first page
            const [copiedFirstPage] = await tempBookletDoc.copyPages(pdfDoc, [i]);
            const embededFirstPage = await tempBookletDoc.embedPage(copiedFirstPage)
            newPage.drawPage(embededFirstPage, { x: 0, y: 0 });

            // Copy content of the second page, if it exists
            if (secondPage) {
                const [copiedSecondPage] = await tempBookletDoc.copyPages(pdfDoc, [i + 1]);
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

export default { make };