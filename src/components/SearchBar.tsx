import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Search, X, TrendingUp, TrendingDown } from 'lucide-react';
import type { MarketIndex, WatchlistItem } from '@/data/mockData';

export interface SearchableAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  type: 'index' | 'stock' | 'crypto';
}

interface SearchBarProps {
  assets: SearchableAsset[];
  onSelectAsset: (asset: SearchableAsset) => void;
}

export function SearchBar({ assets, onSelectAsset }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredAssets = query.trim()
    ? assets.filter(
        (asset) =>
          asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
          asset.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const showDropdown = isFocused && filteredAssets.length > 0;

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  const handleSelect = (asset: SearchableAsset) => {
    onSelectAsset(asset);
    setQuery('');
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev < filteredAssets.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredAssets[highlightedIndex]) {
        handleSelect(filteredAssets[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1 max-w-xs sm:max-w-md lg:max-w-xl">
      <div
        className={cn(
          'relative flex items-center transition-all duration-300',
          isFocused && 'scale-[1.02]'
        )}
      >
        <Search className="absolute left-3 sm:left-4 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full pl-9 sm:pl-11 pr-4 py-2 sm:py-2.5 rounded-xl bg-secondary border border-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-secondary/80 transition-all duration-200'
          )}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in"
        >
          <div className="p-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
              Results
            </span>
          </div>
          <div className="max-h-[320px] overflow-y-auto scrollbar-thin">
            {filteredAssets.map((asset, index) => {
              const isPositive = asset.changePercent >= 0;
              return (
                <button
                  key={asset.id}
                  onClick={() => handleSelect(asset)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 transition-colors duration-150',
                    highlightedIndex === index
                      ? 'bg-accent'
                      : 'hover:bg-accent/50'
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {asset.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {asset.symbol}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground capitalize">
                        {asset.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {asset.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {asset.type === 'stock' ? '₹' : '$'}
                      {asset.price.toLocaleString()}
                    </p>
                    <div
                      className={cn(
                        'flex items-center justify-end gap-1 text-xs font-medium',
                        isPositive ? 'text-profit' : 'text-loss'
                      )}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {isPositive ? '+' : ''}
                      {asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
