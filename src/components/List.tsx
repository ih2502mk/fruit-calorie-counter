import { PropsWithChildren } from "react"


type ListProps = {
    className?: string
}

export function List({ className, children }: PropsWithChildren<ListProps>) {
    return <ul className={className}>{children}</ul>
}

export function ListItem({ children }: { children: React.ReactNode }) {
    return <li>{children}</li>
}
