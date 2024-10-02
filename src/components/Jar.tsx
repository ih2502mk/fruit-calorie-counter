import { JarItem } from "../App"
import { List, ListItem } from "./List"

type JarProps = {
    items: JarItem[]
}

export function Jar({ items }: JarProps) {



    return <div className="container">
        <List className="jar">
            {items.map(item => 
                <ListItem key={item.fruitItemId}>
                    {item.name} 
                    {/* <button onClick={() => console.log('remove item')}>-</button> */}
                    ({item.count})
                    {/* <button onClick={() => console.log('remove item')}>+</button> */}
                    {/* <button onClick={() => console.log('remove item')}>Remove All</button> */}
                </ListItem>
            )}
        </List>
    </div>
}
