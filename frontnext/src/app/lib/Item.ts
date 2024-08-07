import type { NextApiRequest, NextApiResponse } from 'next'

type Item = {
  id: number,
  품명: string,
  가격: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Item[] | { error: string }>) {
  try {
    const response = await fetch('http://127.0.0.1:8000/items')
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }
    const items: Item[] = await response.json()
    res.status(200).json(items)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
