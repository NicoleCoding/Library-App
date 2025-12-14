import { useState } from "react";
import { useQuery } from "react-query";
import SearchBar from "../components/SearchBar";
import ResultOverview from '../components/ResultOverview';
import DetailsView from '../components/DetailsView';
import axios from "axios";
import { Link } from "react-router-dom";

export default function SearchPage() {
    // States for the search result, the query and the book which is selected by the user.
    const [query, setQuery] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);

    // Matches the query state with the value entered in the input.
    function changeContent(event) {
        setQuery(event.target.value);
    }
    
    // Definition of function used to fetch data from the API.
    const fetchBooks = async (query) => {
        const { data } = await axios.get(`https://openlibrary.org/search.json?title=${query}`);
        return data.docs;
    }

    // React Query handles the API request when the user searches.
    const { data: result = [], isLoading, isError } = useQuery(
        ['books', query], // Key to identify the query.
        () => fetchBooks(query),
        {
            enabled: query.length > 0, // Query run only when search input is valid.
        }
    );

    function displaySelectedBook(index) {
        setSelectedBook(result[index]);
    }

    return (
        <>
            <section className="page-intro-section">
                <h2 className="page-heading">Find Your Next Favorite Book</h2>
                <p className="page-intro">Use the search bar to find books by title. Whether you are looking for a specific book or exploring new reads, this is where your reading journet begins. Once you find a book you like, you can add it to your <Link className="link" to="/collection">personal collection</Link> for future reading</p>
            </section>
            <SearchBar search={() => {}} changeContent={changeContent} query={query}/>
            <ResultOverview data={result} displaySelectedBook={displaySelectedBook} fetchBooks={fetchBooks} />
            <DetailsView selectedBook={selectedBook}/>
        </>
        
    );
    
}