export interface MarketIndex {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
  percentage: number;
}

export interface Order {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  quantity: number;
  price: number;
  status: 'completed' | 'pending' | 'cancelled';
  timestamp: string;
}

export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
  allocation: number;
}

export const marketIndices: MarketIndex[] = [
  {
    id: '1',
    name: 'NIFTY 50',
    symbol: 'NIFTY',
    price: 24532.15,
    change: 156.80,
    changePercent: 0.64,
    sparkline: [24200, 24280, 24320, 24400, 24350, 24420, 24480, 24532],
  },
  {
    id: '2',
    name: 'SENSEX',
    symbol: 'SENSEX',
    price: 80542.25,
    change: -234.50,
    changePercent: -0.29,
    sparkline: [80800, 80720, 80650, 80580, 80620, 80550, 80500, 80542],
  },
  {
    id: '3',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 98542.80,
    change: 2341.50,
    changePercent: 2.43,
    sparkline: [96000, 96500, 97200, 97800, 97500, 98200, 98400, 98542],
  },
  {
    id: '4',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3456.72,
    change: 87.25,
    changePercent: 2.59,
    sparkline: [3350, 3380, 3420, 3400, 3450, 3440, 3470, 3456],
  },
];

export const watchlistData: WatchlistItem[] = [
  { id: '1', symbol: 'RELIANCE', name: 'Reliance Industries', price: 2847.50, change: 45.20, changePercent: 1.61, volume: '12.5M' },
  { id: '2', symbol: 'TCS', name: 'Tata Consultancy', price: 4125.30, change: -28.40, changePercent: -0.68, volume: '8.2M' },
  { id: '3', symbol: 'INFY', name: 'Infosys Ltd', price: 1892.75, change: 12.80, changePercent: 0.68, volume: '15.1M' },
  { id: '4', symbol: 'HDFC', name: 'HDFC Bank', price: 1654.20, change: -8.50, changePercent: -0.51, volume: '9.8M' },
  { id: '5', symbol: 'ICICI', name: 'ICICI Bank', price: 1245.60, change: 18.90, changePercent: 1.54, volume: '11.2M' },
  { id: '6', symbol: 'WIPRO', name: 'Wipro Ltd', price: 542.35, change: 7.45, changePercent: 1.39, volume: '6.5M' },
  { id: '7', symbol: 'BHARTI', name: 'Bharti Airtel', price: 1678.90, change: -15.30, changePercent: -0.90, volume: '7.8M' },
  { id: '8', symbol: 'SBIN', name: 'State Bank of India', price: 812.45, change: 22.60, changePercent: 2.86, volume: '18.4M' },
];

export const buyOrders: OrderBookEntry[] = [
  { price: 98540.50, quantity: 1.245, total: 122682.92, percentage: 95 },
  { price: 98538.20, quantity: 0.856, total: 84348.70, percentage: 82 },
  { price: 98535.80, quantity: 2.134, total: 210315.40, percentage: 75 },
  { price: 98532.10, quantity: 0.542, total: 53404.40, percentage: 65 },
  { price: 98530.00, quantity: 1.876, total: 184843.28, percentage: 58 },
  { price: 98527.50, quantity: 0.923, total: 90940.88, percentage: 48 },
  { price: 98524.30, quantity: 1.456, total: 143451.38, percentage: 40 },
  { price: 98520.80, quantity: 0.678, total: 66797.10, percentage: 32 },
];

export const sellOrders: OrderBookEntry[] = [
  { price: 98545.20, quantity: 0.892, total: 87902.32, percentage: 92 },
  { price: 98548.50, quantity: 1.567, total: 154426.49, percentage: 85 },
  { price: 98552.30, quantity: 0.456, total: 44939.85, percentage: 78 },
  { price: 98556.80, quantity: 2.345, total: 231115.70, percentage: 70 },
  { price: 98560.10, quantity: 0.789, total: 77763.92, percentage: 60 },
  { price: 98564.50, quantity: 1.234, total: 121628.59, percentage: 52 },
  { price: 98568.20, quantity: 0.567, total: 55888.17, percentage: 42 },
  { price: 98572.80, quantity: 1.890, total: 186302.59, percentage: 35 },
];

export const recentOrders: Order[] = [
  { id: 'ORD001', symbol: 'BTC/USDT', type: 'buy', orderType: 'market', quantity: 0.5, price: 98432.50, status: 'completed', timestamp: '2024-01-15 14:32:15' },
  { id: 'ORD002', symbol: 'ETH/USDT', type: 'sell', orderType: 'limit', quantity: 2.5, price: 3445.80, status: 'pending', timestamp: '2024-01-15 14:28:42' },
  { id: 'ORD003', symbol: 'RELIANCE', type: 'buy', orderType: 'market', quantity: 50, price: 2845.20, status: 'completed', timestamp: '2024-01-15 14:15:33' },
  { id: 'ORD004', symbol: 'TCS', type: 'sell', orderType: 'limit', quantity: 25, price: 4130.00, status: 'cancelled', timestamp: '2024-01-15 13:58:21' },
  { id: 'ORD005', symbol: 'BTC/USDT', type: 'buy', orderType: 'limit', quantity: 0.25, price: 98200.00, status: 'pending', timestamp: '2024-01-15 13:45:10' },
  { id: 'ORD006', symbol: 'INFY', type: 'buy', orderType: 'market', quantity: 100, price: 1888.50, status: 'completed', timestamp: '2024-01-15 13:32:48' },
];

export const portfolioAssets: PortfolioAsset[] = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', quantity: 1.5, avgPrice: 85000, currentPrice: 98542.80, value: 147814.20, pnl: 20314.20, pnlPercent: 15.93, allocation: 45 },
  { id: '2', symbol: 'ETH', name: 'Ethereum', quantity: 12, avgPrice: 3200, currentPrice: 3456.72, value: 41480.64, pnl: 3080.64, pnlPercent: 8.02, allocation: 20 },
  { id: '3', symbol: 'RELIANCE', name: 'Reliance', quantity: 100, avgPrice: 2650, currentPrice: 2847.50, value: 284750, pnl: 19750, pnlPercent: 7.45, allocation: 15 },
  { id: '4', symbol: 'TCS', name: 'TCS', quantity: 50, avgPrice: 3980, currentPrice: 4125.30, value: 206265, pnl: 7265, pnlPercent: 3.65, allocation: 12 },
  { id: '5', symbol: 'INFY', name: 'Infosys', quantity: 80, avgPrice: 1750, currentPrice: 1892.75, value: 151420, pnl: 11420, pnlPercent: 8.16, allocation: 8 },
];

export const portfolioSummary = {
  totalInvestment: 652450,
  currentValue: 731729.84,
  totalPnL: 79279.84,
  totalPnLPercent: 12.15,
  dayPnL: 4523.50,
  dayPnLPercent: 0.62,
};

export const chartData = [
  { time: '09:15', price: 98200, volume: 1250 },
  { time: '09:30', price: 98350, volume: 1450 },
  { time: '09:45', price: 98280, volume: 980 },
  { time: '10:00', price: 98420, volume: 1650 },
  { time: '10:15', price: 98380, volume: 1120 },
  { time: '10:30', price: 98520, volume: 1890 },
  { time: '10:45', price: 98480, volume: 1340 },
  { time: '11:00', price: 98560, volume: 2100 },
  { time: '11:15', price: 98620, volume: 1780 },
  { time: '11:30', price: 98542, volume: 1560 },
];
