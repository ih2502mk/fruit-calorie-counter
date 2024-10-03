import * as d3 from "d3";
import { CatalogFruitItem } from "../../App";

export class JarItem {
    public fruitItemId: CatalogFruitItem['id'];
    
    constructor(
        public name: string, 
        public count: number, 
        public fruitItem: CatalogFruitItem,
        public color: string = 'transparent'
    ) {
        this.fruitItemId = fruitItem.id
    }
  }

const subscribers = new Set<() => void>();

export type JarState = {
    jarFruitItems: JarItem[]
    totalCalories: number
    highlightedItem: JarItem | null
    highlightedItemCalories: number | null
}

let jarState: JarState = {
    jarFruitItems: [],
    totalCalories: 0,
    highlightedItem: null,
    highlightedItemCalories: null
}

function countTotalCalories(items: JarItem[]) {
    return items.reduce((acc, jarItem) => 
        (acc + jarItem.fruitItem.nutritions.calories * jarItem.count), 0)
}

function countItemCalories(item: JarItem | null) {
    return item ? item.fruitItem.nutritions.calories * item.count : null;
}

function updateItemsColors(items: JarItem[]) {
    const color = items.length > 1 
        ? d3.scaleOrdinal<string, string>()
            .domain(items.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), items.length).reverse())
        : () => 'rgb(66, 136, 181)';

    items.forEach(item => item.color = color(item.name));
}


const store = {

    getJarState() {
        return jarState
    },

    subscribe(callback: () => void) {
        subscribers.add(callback);
        return () => subscribers.delete(callback);
    },

    addItemsToJar(items: CatalogFruitItem[]) {
        const fruitIdsInTheJar = jarState.jarFruitItems.map(jarItem => jarItem.fruitItemId);
        let updatedJarItems = [...jarState.jarFruitItems];
    
        for (const item of items) {
          if (fruitIdsInTheJar.includes(item.id)) {
            const jarItem = updatedJarItems.find(jarItem => jarItem.fruitItemId === item.id);
            if (jarItem) { jarItem.count++; }
          } else {
            updatedJarItems.push(new JarItem(item.name, 1, item)); 
          }
        }

        const totalCalories = countTotalCalories(updatedJarItems);
        updateItemsColors(updatedJarItems);

        jarState = {...jarState, jarFruitItems: updatedJarItems, totalCalories};
        subscribers.forEach((callback) => callback());
    },

    removeItemFromJar(item: JarItem) {
        const updatedJarItems = jarState.jarFruitItems
            .filter(jarItem => jarItem.fruitItemId !== item.fruitItemId);
        
        const totalCalories = countTotalCalories(updatedJarItems);
        updateItemsColors(updatedJarItems);

        jarState = {...jarState, jarFruitItems: updatedJarItems, totalCalories};
        subscribers.forEach((callback) => callback());
    },

    updateJarItemCount(item: JarItem, diff: number) {
        const updatedJarItems = jarState.jarFruitItems
            .map(jarItem => {
                if (jarItem.fruitItemId === item.fruitItemId) {
                    const count = jarItem.count + diff;
                    if (count <= 0) { return null; }
                    return new JarItem(
                        jarItem.name, 
                        jarItem.count + diff, 
                        jarItem.fruitItem,
                        jarItem.color
                    );
                } else {
                    return jarItem;
                }
            }).filter(jarItem => !!jarItem);

        const totalCalories = countTotalCalories(updatedJarItems);
        updateItemsColors(updatedJarItems);

        jarState = {...jarState, jarFruitItems: updatedJarItems, totalCalories};
        subscribers.forEach((callback) => callback());
    },

    highlightItem(item: JarItem | null) {
        const highlightedItemCalories = countItemCalories(item);
        jarState = {...jarState, highlightedItem: item, highlightedItemCalories};
        subscribers.forEach((callback) => callback());
    }

};

export default store;