import { ReactNode, useEffect, useState } from "react";
import { CatalogFruitItem, FRUIT_GROUPING_PROPS, FruitGroupingProps } from "../App"
import { List, ListItem } from "./List"
import { Table, TableHeaderRow, TableRow, TableRowGroupHeader } from "./Table";

const COLUMN_KEYS = ['name', 'family', 'order', 'genus'];
const COLUMN_HEADERS = {
    name: 'Name',
    family: 'Family',
    order: 'Order',
    genus: 'Genus',
    calories: 'Calories',
    actions: ''
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

type GroupedItems = Record<string, CatalogFruitItem[]>;

function groupItems(items: CatalogFruitItem[], grouping: FruitGroupingProps) {
    
    const uniqueGroups = [...(new Set(items.map(item => item[grouping])))]; 

    const groupedItems = uniqueGroups.reduce((acc, group) => {
        const groupItems = items.filter(item => item[grouping] === group);
        acc[group] = groupItems;
        return acc;
    }, {} as GroupedItems);

    return groupedItems
}

function isGroupedItems(items: CatalogFruitItem[] | GroupedItems): items is GroupedItems {
    return !Array.isArray(items);
}

type CatalogProps = {
    items: CatalogFruitItem[],
    onPickItems: (items: CatalogFruitItem[]) => void
}

export function Catalog({ items, onPickItems }: CatalogProps) {
    const [displayItems, setDisplayItems] = useState<
        | CatalogFruitItem[]
        | GroupedItems
    >(items);
    const [grouping, setGrouping] = useState<FruitGroupingProps | 'none'>('none');
    const [viewMode, setViewMode] = useState<'list' | 'table'>('list');

    useEffect(() => {
        if (grouping === 'none') {
            setDisplayItems(items);
        } else {
            setDisplayItems(groupItems(items, grouping));
        }
    }, [grouping, items])

    let catalogOutput: ReactNode;

    const addToJarButton = (items: CatalogFruitItem[], group = false) => (
        group 
            ? <button onClick={() => onPickItems(items)}>Add {items.length} fruit to Jar</button>
            : <button onClick={() => onPickItems(items)}>Add to Jar</button>
        )

    if (viewMode === 'list' && isGroupedItems(displayItems)) {

        catalogOutput = <List className="catalog">
            {Object.entries<CatalogFruitItem[]>(displayItems).map(([group, groupItems]) => 
                <ListItem key={group}>
                    {group}
                    {addToJarButton(groupItems, true)}
                    <List className="catalog-group">
                        {groupItems.map(item => 
                            <ListItem key={item.id}>
                                {item.name} ({item.nutritions.calories}) 
                                {addToJarButton([item])}
                            </ListItem>
                        )}
                    </List>
                </ListItem>
            )}
        </List>
        
    } else if (viewMode === 'list' && !isGroupedItems(displayItems)) {

        catalogOutput = <List className="catalog">
            {items.map(item => 
                <ListItem key={item.id}>
                    {item.name} ({item.nutritions.calories}) 
                    {addToJarButton([item])}
                </ListItem>
            )}
        </List>

    } else if (viewMode === 'table' && isGroupedItems(displayItems)) {
        const rows: ReactNode[] = [];

        rows.push(<TableHeaderRow
            key={`header-row`}
            columnKeys={[...COLUMN_KEYS, 'calories', 'actions']}
            columnHeaders={COLUMN_HEADERS}
        />)

        for (const [group, groupItems] of Object.entries<CatalogFruitItem[]>(displayItems)) {
            rows.push(<TableRowGroupHeader 
                key={`group-header-${group}`}
                columnKeys={[...COLUMN_KEYS, 'calories', 'actions']} 
                groupItem={{ 
                    name: group, 
                    actions: () => addToJarButton(groupItems, true)
                }}
            />)

            for (const item of groupItems) {
                rows.push(<TableRow 
                    key={item.id} 
                    item={item} 
                    columnKeys={[
                        ...COLUMN_KEYS, 
                        () => item.nutritions.calories,
                        () => addToJarButton([item])
                    ]} 
                    idKey='id'
                />)
            }
        }
        
        catalogOutput = <Table>{rows}</Table>
    } else {
        const rows: ReactNode[] = [];

        rows.push(<TableHeaderRow
            key={`header-row`}
            columnKeys={[...COLUMN_KEYS, 'calories', 'actions']}
            columnHeaders={COLUMN_HEADERS}
        />)

        for (const item of displayItems as CatalogFruitItem[]) {
            rows.push(<TableRow 
                key={`row-${item.id}`}
                item={item} 
                columnKeys={[
                    ...COLUMN_KEYS, 
                    () => item.nutritions.calories,
                    () => addToJarButton([item])
                ]}
                idKey='id'
            />)
        }
        catalogOutput = <Table>{rows}</Table>
    }
    
    return <>
        <label>
            Group by:&nbsp;
            <select 
                name="grouping" 
                value={grouping} 
                onChange={(e) => 
                    setGrouping(e.target.value as FruitGroupingProps | 'none')}
            >
                <option value="none">None</option>
                {FRUIT_GROUPING_PROPS.map(p => 
                    <option value={p} key={p}>{capitalize(p)}</option>
                )}
            </select>
        </label>
        <div>
            View as:&nbsp;
            <label>    
                List 
                <input 
                    type="radio" 
                    name="view" 
                    value="list" 
                    checked={viewMode === 'list'}
                    onChange={(e) => setViewMode(e.target.value as 'list' | 'table')}
                />
            </label>
            &nbsp;
            <label>
                Table
                <input 
                    type="radio"
                    name="view"
                    value="table"
                    checked={viewMode === 'table'} 
                    onChange={(e) => setViewMode(e.target.value as 'list' | 'table')}
                />
            </label>
        </div>
        <div className="container">
            {catalogOutput}
        </div>
    </>
}
