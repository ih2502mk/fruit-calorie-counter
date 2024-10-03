import { useEffect, useState, useSyncExternalStore } from 'react';
import './App.css';

import { Catalog } from './components/catalog/Catalog';
import { Jar } from './components/jar/Jar';
import { Donut } from './components/donut/Donut';

import jarStore from './components/jar/jar.store';

export const FRUIT_GROUPING_PROPS = ['family', 'order', 'genus'] as const;

export type FruitGroupingProps = typeof FRUIT_GROUPING_PROPS[number];

export type CatalogFruitItem = {
  name: string,
  id: number,
  nutritions: {calories: number}
} & {
  [K in FruitGroupingProps]: string
}

async function getAllFruit() {
  const res = await fetch('/fruit-api/fruit/all');
  const data = await res.json();
  
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

function App() {
  const [fruitItems, setFruitItems] = useState<CatalogFruitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {jarFruitItems} = useSyncExternalStore(jarStore.subscribe, jarStore.getJarState);

  useEffect(() => {
    setLoading(true);
    
    getAllFruit()
      .then((data) => setFruitItems(data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));

 }, []);

  return (
    <>
      <section>
        <h2>Fruit Catalog</h2>
        {
          fruitItems.length > 0 
            ? <Catalog 
                items={fruitItems} 
                onPickItems={(items) => jarStore.addItemsToJar(items)} 
              />
            : <>
                {loading && <p className="message">Loading...</p>}
                {error && <p className="message">Error: {error.message}</p>}
              </>
        }
      </section>
      <section>
        <h2>Fruit Jar</h2>
        {
          jarFruitItems.length > 0 
            ? <><Donut /><Jar /></> 
            : <p className="message">
                No fruit in the jar. Please, add something.
              </p>
        }
      </section> 
    </>
  );
}

export default App;
