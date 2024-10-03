import { PropsWithChildren } from "react"

type ListProps = {
    className?: string
}

export function List({ className, children }: PropsWithChildren<ListProps>) {
    return <ul className={className}>{children}</ul>
}

type ListItemProps = {
    className?: string
    onMouseOver?: () => void
    onMouseOut?: () => void
}

export function ListItem({ className, onMouseOver, onMouseOut, children }: PropsWithChildren<ListItemProps>) {
    return <li 
        className={className}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
    >{children}</li>
}
