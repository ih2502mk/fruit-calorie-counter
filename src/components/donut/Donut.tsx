import * as d3 from "d3";
import { useSyncExternalStore } from "react";
import './Donut.css'

import jarStore, { JarItem, JarState } from "../jar/jar.store"

export function Donut() {

    const {
        jarFruitItems:items, 
        highlightedItem, 
        totalCalories, 
        highlightedItemCalories
    } = useSyncExternalStore<JarState>(jarStore.subscribe, jarStore.getJarState);

    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const arc = d3.arc<d3.PieArcDatum<JarItem>>()
      .innerRadius(radius * 0.58)
      .outerRadius(radius - 10);

    const pie = d3.pie<JarItem>()
      .padAngle(0)
      .sort(null)
      .value(d => d.count * d.fruitItem.nutritions.calories);

    const pieSectors = pie(items).map((d) => <path 
        key={d.data.fruitItemId} 
        d={arc(d) as string} 
        fill={d.data.color}
        style={d.data.fruitItemId === highlightedItem?.fruitItemId 
            ? {filter: 'url(#inset-shadow)'} 
            : {}
        }
        onMouseOver={() => jarStore.highlightItem(d.data)}
        onMouseOut={() => jarStore.highlightItem(null)}
    />)

    const highlightedInfo = highlightedItem && highlightedItemCalories
        ? <>
            <hr />
            <span className="hl-name">{highlightedItem.name}</span>
            <span className="hl-value">
                {highlightedItemCalories}
                &nbsp;&bull;&nbsp;
                {Math.round(highlightedItemCalories / totalCalories * 100)}%
            </span>
        </>
        : null;

    return <div className="donut-wrapper">
        <svg 
            width={width} 
            height={height} 
            viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
            style={{ maxWidth: '100%', height: 'auto'}} 
        >
            <g>{pieSectors}</g>
        </svg>
        <div className={["donut-label", highlightedInfo ? 'has-highlight' : ''].join(' ')}>
            <span className="total-text">Total Calories</span>
            <span className="total-value">{totalCalories}</span>
            {highlightedInfo}
        </div>
    </div>
}