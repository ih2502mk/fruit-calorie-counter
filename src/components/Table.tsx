import { PropsWithChildren } from "react"


type TableProps = {
    className?: string
}

export function Table({ className, children }: PropsWithChildren<TableProps>) {
    return <table className={className}>
        <thead>
            
        </thead>
        <tbody>{children}</tbody>
    </table>
}

export function TableRow({ children }: { children: React.ReactNode }) {
    return <tr>{children}</tr>
}

export function TableRowHeader({ children }: { children: React.ReactNode }) {
    return <tr>{children}</tr>
}

export function TableRowGroupHeader({ children }: { children: React.ReactNode }) {
    return <tr>{children}</tr>
}