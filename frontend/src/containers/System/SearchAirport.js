import React, { useState, useEffect } from 'react';

; const Search = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length === 0) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await fetch(`/v1/airport/search?query=${query}`);
                const data = await response.json(); setSuggestions(data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        };
        fetchSuggestions();
    }, [query]);
    // return (
    //     <div>
    //         <input className="departure"
    //             type="text"
    //             value={query}
    //             onChange={(e) => setQuery(e.target.value)}
    //             placeholder="Enter airport name or code" />
    //         <ul>
    //             {suggestions.map((suggestion, index) => (
    //                 <li key={index}>
    //                     {suggestion.name} ({suggestion.code})
    //                 </li>))}
    //         </ul>
    //     </div>
    // );
};

export default Search