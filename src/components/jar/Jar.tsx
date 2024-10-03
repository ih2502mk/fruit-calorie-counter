import { useSyncExternalStore } from "react";
import { List, ListItem } from "../list/List"
import jarStore, { JarState } from "./jar.store";
import './Jar.css'

export function Jar() {

    const {jarFruitItems, totalCalories, highlightedItem} = useSyncExternalStore<JarState>(
        jarStore.subscribe, 
        jarStore.getJarState
    );

    return <div className="container">
        <List className="jar">
            {jarFruitItems.map(item =>
                <ListItem 
                    key={item.fruitItemId}
                    className={
                        highlightedItem?.fruitItemId === item.fruitItemId 
                            ? 'highlighted' 
                            : ''
                        }
                    onMouseOver={() => jarStore.highlightItem(item)}
                    onMouseOut={() => jarStore.highlightItem(null)}
                >
                    <div className="swatch" style={{backgroundColor: item.color}}></div>
                    {item.name}
                    <div className="actions">
                        <button onClick={() => jarStore.updateJarItemCount(item, -1)}>-</button>
                        <span className="count">{item.count}</span>
                        <button onClick={() => jarStore.updateJarItemCount(item, +1)}>+</button>
                        <button onClick={() => jarStore.removeItemFromJar(item)}>Remove All</button>
                    </div>
                </ListItem>
            )}
        </List>
    </div>
}
