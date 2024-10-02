import { useEffect, useState } from "react";
import { CatalogFruitItem, FRUIT_GROUPING_PROPS, FruitGroupingProps } from "../App"
import { List, ListItem } from "./List"

type CatalogProps = {
    items: CatalogFruitItem[],
    onPickItems: (items: CatalogFruitItem[]) => void
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

type GroupedItems = Record<string, CatalogFruitItem[]>;

function groupItemsBy(items: CatalogFruitItem[], grouping: FruitGroupingProps) {
    
    const uniqueGroups = [...(new Set(items.map(item => item[grouping])))]; 

    const groupedItems = uniqueGroups.reduce((acc, group) => {
        const groupItems = items.filter(item => item[grouping] === group);
        acc[group] = groupItems;
        return acc;
    }, {} as GroupedItems);

    return groupedItems
}

function groupingPredicate(items: CatalogFruitItem[] | GroupedItems): items is GroupedItems {
    return !Array.isArray(items);
}

export function Catalog({ items, onPickItems }: CatalogProps) {
    const [displayItems, setDisplayItems] = useState<
        | CatalogFruitItem[]
        | GroupedItems
    >(items);
    const [grouping, setGrouping] = useState<FruitGroupingProps | 'none'>('none');

    useEffect(() => {
        if (grouping === 'none') {
            setDisplayItems(items);
        } else {
            setDisplayItems(groupItemsBy(items, grouping));
        }
    }, [grouping, items])

    let list: React.ReactNode;

    if (groupingPredicate(displayItems)) {

        list = <List className="catalog">
            {Object.entries<CatalogFruitItem[]>(displayItems).map(([group, groupItems]) => 
                <ListItem key={group}>
                    {group}
                    <button 
                        onClick={() => onPickItems(groupItems)}
                    >Add {groupItems.length} fruit to Jar</button>
                    <List className="catalog-group">
                        {groupItems.map(item => 
                            <ListItem key={item.id}>
                                {item.name} ({item.nutritions.calories}) 
                                <button onClick={() => onPickItems([item])}>Add to Jar</button>
                            </ListItem>
                        )}
                    </List>
                </ListItem>
            )}
        </List>
        
    } else {

        list = <List className="catalog">
            {items.map(item => 
                <ListItem key={item.id}>
                    {item.name} ({item.nutritions.calories}) 
                    <button onClick={() => onPickItems([item])}>Add to Jar</button>
                </ListItem>
            )}
        </List>
    }
    
    return <>
        <label>
            Group by:&nbsp;
            <select 
                name="grouping" 
                value={grouping} 
                onChange={(e) => setGrouping(e.target.value as FruitGroupingProps)}
            >
                <option value="none">None</option>
                {FRUIT_GROUPING_PROPS.map(p => 
                    <option value={p} key={p}>{capitalize(p)}</option>
                )}
            </select>
        </label>
        <div className="container">
            {list}
        </div>
    </>
}
