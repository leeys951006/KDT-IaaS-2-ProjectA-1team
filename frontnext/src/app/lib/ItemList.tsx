'use client'

import React, { useEffect, useState } from 'react'

type Item = {
  id: number,
  품명: string,
  가격: number
}

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/items')
        if (!res.ok) {
          throw new Error(`Failed to fetch items: ${res.statusText}`)
        }
        const data = await res.json()
        setItems(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchItems()
  }, [])

  return (
    <div>
      <h1>Items</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.품명} - {item.가격}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ItemList
