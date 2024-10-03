import { PropsWithChildren, ReactNode } from "react"


type TableProps = {
    className?: string
}

export function Table({ className, children }: PropsWithChildren<TableProps>) {
    return <table className={className}>
        <thead></thead>
        <tbody>{children}</tbody>
    </table>
}

function getItemValueByColumnKey(columnKey: string | ((item: any) => string | ReactNode), item: any) {
    if (typeof columnKey === 'function') {
        return columnKey(item);
    } else {
        return item[columnKey];
    }
}

type TableRowItem<IdKey extends string = 'id'> = 
    & { [key: string]: any } 
    & { [id in IdKey]: number | string };

export type TableRowProps<
    IdKey extends string = 'id', 
    T extends TableRowItem<IdKey> = TableRowItem<IdKey>
> = {
    item: T,
    columnKeys: Array<string | ((item:T) => string | ReactNode)>, 
    idKey?: IdKey
}

export function TableRow<
    T extends TableRowItem, 
    IdKey extends string = 'id'
>({ item, columnKeys, idKey }: TableRowProps<IdKey, T>) {
    if (!idKey) {
        return <tr >
            {columnKeys.map(k => <td>{getItemValueByColumnKey(k, item)}</td>)}
        </tr>
    } else {
        return <tr key={item[idKey]}>
            {columnKeys.map(k => <td key={`${item[idKey]}-${k}`}>
                {getItemValueByColumnKey(k, item)}
            </td>)}
        </tr>
    }
}

export type TableHeaderRowProps = {
    columnKeys: string[],
    columnHeaders: { [key in TableHeaderRowProps['columnKeys'][number]]: string }
}

export function TableHeaderRow({ columnKeys, columnHeaders }:TableHeaderRowProps) {
    return <tr>
        {columnKeys.map(key => <th key={`${key}-header`}>{columnHeaders[key]}</th>)}
    </tr>
}

export type TableRowGroupHeaderProps = {
    columnKeys: string[],
    groupItem: { name: string, 'actions'?: () => string | ReactNode }
}

export function TableRowGroupHeader({columnKeys, groupItem}: TableRowGroupHeaderProps) {
    let span = columnKeys.length;
    let cells = [];
    if (columnKeys.includes('actions') && groupItem.actions) { 
        cells.push(<td key={`actions-${groupItem.name}`}>{groupItem.actions()}</td>);
        span--;
    }
    cells = [
        <td key={`group-header-${groupItem.name}`} colSpan={span}>{groupItem.name}</td>, 
        ...cells
    ];
    return <tr>{cells}</tr>
}
