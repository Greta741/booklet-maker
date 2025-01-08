"use client";

import React, { useCallback, useEffect, useState } from 'react';
import BookletService from './BookletService'

const generateFileUrl = (bytes: Uint8Array) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });

    return URL.createObjectURL(blob);
}

interface BookletMakerProps {
    file: File;
};

const BookletMaker: React.FC<BookletMakerProps> = ({ file }) => {
    const [bookletUrl, setBookletUrl] = useState<string | undefined>();

    const makeBooklet = useCallback(async () => {
        const bookletBytes = await BookletService.make(file);
        if (bookletBytes) {
            const url = generateFileUrl(bookletBytes);
            setBookletUrl(url);
        }
    }, [file])

    useEffect(() => {
        makeBooklet();
    }, [makeBooklet])


    return <div>
        <a href={bookletUrl} download='booklet.pdf'>Download</a>
    </div>
};

export default BookletMaker;
