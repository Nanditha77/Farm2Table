import { useState, useEffect , useMemo} from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = useMemo(() => debounce(async (searchText) => {
  if (!searchText) return setSuggestions([]);
  try {
    const res = await axios.get(`https://farm2table-production.up.railway.app/api/products?title=${searchText}`);
    console.log('Products:', res.data.products);  
    setSuggestions(res.data.products);
  } catch (error) {
    console.error('Search error:', error);
  }
}, 300), []);

  useEffect(() => {
    fetchSuggestions(query);
    return () => fetchSuggestions.cancel();
  }, [query]);

  return (
    <div className="relative w-full max-w-md z-[9999] md:z-[9999]">
      <input
        type="text"
        className="w-full border p-2 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 z-[99999] bg-white border w-full rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto md:z-[99999]">
          {suggestions.map((product) => (
            <li
              key={product._id}
              className="px-4 z-[99999] py-2 hover:bg-gray-100 cursor-pointer md:z-[99999]"
              onClick={() => {
                onSelect(product);
                setQuery(product.title);
                setSuggestions([]);
              }}
            >
              {product.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
