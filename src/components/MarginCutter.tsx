import React, { useCallback, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { debounce } from "@mui/material";
import PdfService from "./PdfService";
import LoadingButton from '@mui/lab/LoadingButton';

interface MarginCutterProps {
    margin: number;
    topMarginModifier: number;
    file: File;
    onMarginChange: (margin: number) => void;
    onTopMarginModifierChange: (margin: number) => void;
    onFileMarginChange: (file: File) => void;
}

const MarginCutter = ({ margin, topMarginModifier, file, onMarginChange, onTopMarginModifierChange, onFileMarginChange, }: MarginCutterProps) => {
    const [internalMargin, setInternalMargin] = useState(margin);
    const [internalTopMarginModifier, setInternalTopMarginModifier] = useState(topMarginModifier);
    const [loading, setLoading] = useState(false);

    const adjustMargins = useCallback(async (newMargin: number, newTopMarginModifier: number) => {
        onMarginChange(newMargin);
        onTopMarginModifierChange(newTopMarginModifier);
        if (newMargin > 0) {
            setLoading(true);
            const updatedFile = await PdfService.reduceMargins(file, newMargin, newTopMarginModifier)
            onFileMarginChange(updatedFile)
            setLoading(false);
        } else {
            onFileMarginChange(file)
        }
    }, [onFileMarginChange, onMarginChange, onTopMarginModifierChange, file])

    const debouncedChangeHandler = useCallback(
        debounce((newMargin: number, newTopMarginModifier: number) => {
            adjustMargins(newMargin, newTopMarginModifier);
        }, 500),
        []
    );

    const handleMarginChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newMargin = +event.target.value;
        setInternalMargin(newMargin);
        debouncedChangeHandler(newMargin, internalTopMarginModifier);
    }, [internalTopMarginModifier, file, onMarginChange]);

    const handleTopMarginModifierChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTopMarginModifier = +event.target.value;
        setInternalTopMarginModifier(newTopMarginModifier);
        debouncedChangeHandler(internalMargin, newTopMarginModifier);
    }, [internalMargin, file, onMarginChange]);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                    maxWidth: 350,
                    margin: "auto",
                }}
            >
                <TextField
                    label="Margin (px)"
                    variant="outlined"
                    value={internalMargin}
                    onChange={handleMarginChange}
                    type="number"
                    fullWidth
                />
                <LoadingButton loading={loading} />
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                    maxWidth: 350,
                    margin: "auto",
                }}
            >
                <TextField
                    label="Top margin modifier (px)"
                    variant="outlined"
                    value={internalTopMarginModifier}
                    onChange={handleTopMarginModifierChange}
                    type="number"
                    fullWidth
                />
                <LoadingButton loading={loading} />
            </Box>
        </>
    );
};

export default MarginCutter;