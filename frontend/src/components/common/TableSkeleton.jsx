import { Skeleton, TableCell, TableRow } from "@mui/material";

function TableSkeleton({ columns, rows = 5 }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                    {Array.from({ length: columns }).map((__, colIndex) => (
                        <TableCell key={colIndex}>
                            <Skeleton variant="text" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}

export default TableSkeleton;
