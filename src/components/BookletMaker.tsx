"use client";

import React, { useCallback, useEffect, useState } from 'react';
import BookletService from './BookletService'
import { Button } from '@mui/material';

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

    const makeBooklet = useCallback(async () => {
        const pages = BookletService.calculatePages(pagesNumbers);
        const bookletBytes = await BookletService.make(file, pages);
        if (bookletBytes) {
            const url = generateFileUrl(bookletBytes);
            setBookletUrl(url);
        }
    }, [file, pagesNumbers])

    useEffect(() => {
        makeBooklet();
    }, [makeBooklet])


    return <div>
        <Button variant="contained" component="label">
            <a href={bookletUrl} download='booklet.pdf'>Download</a>
        </Button>

    </div>
};

export default BookletMaker;
