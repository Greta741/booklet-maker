import React, { useCallback, useEffect, useState } from 'react';
import PdfService from './PdfService'
import { Button } from '@mui/material';
import styled from 'styled-components';

const StyledWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding-top: 30px;
    margin-bottom: 50px;

    a {
        color: white;
    }
`;


const generateFileUrl = (bytes: Uint8Array) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });

    return URL.createObjectURL(blob);
}

interface BookletMakerProps {
    file: File;
    pagesNumbers: (number | undefined)[];
};

const BookletMaker: React.FC<BookletMakerProps> = ({ file, pagesNumbers }) => {
    const [bookletUrl, setBookletUrl] = useState<string | undefined>();
    const [name, setName] = useState(file.name);

    const makeBooklet = useCallback(async () => {
        const pages = PdfService.calculatePages(pagesNumbers);
        const bookletBytes = await PdfService.makeBooklet(file, pages);
        if (bookletBytes) {
            const url = generateFileUrl(bookletBytes);
            setBookletUrl(url);
        }
    }, [file, pagesNumbers])

    useEffect(() => {
        makeBooklet();
    }, [makeBooklet])

    useEffect(() => {
        const [name, extention] = file.name.split('.');
        setName(`${name} Booklet.${extention}`);
    }, [file])


    return <StyledWrapper>
        <Button variant="contained" component="label">
            <a href={bookletUrl} download={name}>Download</a>
        </Button>
    </StyledWrapper>
};

export default BookletMaker;
