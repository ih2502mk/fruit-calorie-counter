import { useCallback, useEffect, useState } from 'react';
import { Catalog } from './components/Catalog';
import { Jar } from './components/Jar';

import './App.css';

export const FRUIT_GROUPING_PROPS = ['family', 'order', 'genus'] as const;

export type FruitGroupingProps = typeof FRUIT_GROUPING_PROPS[number];

export type CatalogFruitItem = {
  name: string,
  id: number,
  nutritions: {calories: number}
} & {
  [K in FruitGroupingProps]: string
}

export class JarItem {
  constructor(
    public name: string, 
    public count: number, 
    public fruitItemId: CatalogFruitItem['id']
  ) {}
}

function getAllFruit() {
  return fetch('/fruit-api/fruit/all')
    .then((response) => response.json())
    .then((data) => data);
}

function App() {
  const [fruitItems, setFruitItems] = useState<CatalogFruitItem[]>([]);
  const [jarItems, setJarItems] = useState<JarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const addItemsToJar = useCallback((items: CatalogFruitItem[]) => {
    const fruitIdsInTheJar = jarItems.map(jarItem => jarItem.fruitItemId);
    let updatedJarItems = [...jarItems];

    for (const item of items) {
      if (fruitIdsInTheJar.includes(item.id)) {
        const jarItem = updatedJarItems.find(jarItem => jarItem.fruitItemId === item.id);
        jarItem && jarItem.count++;
      } else {
        updatedJarItems.push(new JarItem(item.name, 1, item.id)); 
      }
    }
    setJarItems(updatedJarItems)
  }, [jarItems])
  
  useEffect(() => {
    setLoading(true);
    
    getAllFruit()
      .then((data) => setFruitItems(data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));

 }, []);

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <section>
        <h2>Fruit Catalog</h2>
        <Catalog 
          items={fruitItems} 
          onPickItems={(items) => addItemsToJar(items)} 
        />
      </section>
      <section>
        <h2>Fruit Jar</h2>
        <Jar items={jarItems} />
      </section> 
    </>
  );
}

export default App;
