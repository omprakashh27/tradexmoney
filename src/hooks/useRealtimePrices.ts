import { useState, useEffect, useCallback, useRef } from 'react';
import type { MarketIndex, WatchlistItem } from '@/data/mockData';

export interface PriceUpdate {
  id: string;
  direction: 'up' | 'down' | 'none';
  timestamp: number;
}

export function useRealtimePrices<T extends { id: string; price: number; change: number; changePercent: number }>(
  initialData: T[],
  updateInterval: number = 2000,
  volatility: number = 0.002
) {
  const [data, setData] = useState<T[]>(initialData);
  const [priceUpdates, setPriceUpdates] = useState<Map<string, PriceUpdate>>(new Map());
  const prevPricesRef = useRef<Map<string, number>>(new Map());

  // Initialize previous prices
  useEffect(() => {
    const map = new Map<string, number>();
    initialData.forEach(item => map.set(item.id, item.price));
    prevPricesRef.current = map;
  }, []);

  const simulatePriceChange = useCallback(() => {
    setData(currentData => {
      const newUpdates = new Map<string, PriceUpdate>();
      
      const newData = currentData.map(item => {
        // Random price movement based on volatility
        const changeMultiplier = (Math.random() - 0.5) * 2 * volatility;
        const priceChange = item.price * changeMultiplier;
        const newPrice = Math.max(0.01, item.price + priceChange);
        
        // Calculate new change values
        const basePrice = item.price - item.change; // Original base price
        const newChange = newPrice - basePrice;
        const newChangePercent = (newChange / basePrice) * 100;
        
        // Determine direction
        const prevPrice = prevPricesRef.current.get(item.id) || item.price;
        const direction: 'up' | 'down' | 'none' = 
          newPrice > prevPrice ? 'up' : 
          newPrice < prevPrice ? 'down' : 'none';
        
        // Store update info
        if (direction !== 'none') {
          newUpdates.set(item.id, {
            id: item.id,
            direction,
            timestamp: Date.now()
          });
        }
        
        // Update previous price ref
        prevPricesRef.current.set(item.id, newPrice);
        
        return {
          ...item,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
        };
      });
      
      // Update the price updates state
      setPriceUpdates(prev => {
        const merged = new Map(prev);
        newUpdates.forEach((value, key) => merged.set(key, value));
        return merged;
      });
      
      return newData;
    });
    
    // Clear old updates after animation duration
    setTimeout(() => {
      setPriceUpdates(new Map());
    }, 500);
  }, [volatility]);

  useEffect(() => {
    const interval = setInterval(simulatePriceChange, updateInterval);
    return () => clearInterval(interval);
  }, [simulatePriceChange, updateInterval]);

  const getUpdateDirection = useCallback((id: string): 'up' | 'down' | 'none' => {
    const update = priceUpdates.get(id);
    if (!update) return 'none';
    // Check if update is recent (within 500ms)
    if (Date.now() - update.timestamp > 500) return 'none';
    return update.direction;
  }, [priceUpdates]);

  return { data, priceUpdates, getUpdateDirection };
}
