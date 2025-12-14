import { useState } from "react";
import BooksDisplay from "../components/BooksDisplay";
import Form from "../components/Form";
import Button from "../components/Button";
import { useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

export default function CollectionPage() {
    const [library, setLibrary] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Fetch books from the backend when the component mounts
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/books");
                setLibrary(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchBooks();
    }, []);

    // Add a new book to the backend
    const addBook = async (title, author, genre, publishedYear, pages, read) => {
        const newBook = { title, author, genre, publishedYear, pages, read };
        try {
            const response = await axios.post("http://localhost:5000/api/books", newBook);
            setLibrary([...library, response.data]);
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };

    // Toggle read status in the backend
    const toggleReadStatus = async (id) => {
        const book = library.find((b) => b._id === id); // Find the book by ID
        if (!book) return; // Exit if the book is not found
    
        try {
            const newReadStatus = book.readStatus === 'read' ? 'unread' : 'read'; // Toggle between 'read' and 'unread'
            const response = await axios.put(`http://localhost:5000/api/books/${id}`, { readStatus: newReadStatus }); // Send updated status to backend
            const updatedLibrary = library.map((b) =>
                b._id === id ? response.data : b // Update the book in the library
            );
            setLibrary(updatedLibrary); // Update the state with the new library
        } catch (error) {
            console.error("Error updating read status:", error);
        }
    };

    // Remove a book from the backend
    const removeBook = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/books/${id}`); // Ensure the URL is correct
            setLibrary(library.filter((b) => b._id !== id)); // Remove the book from the library
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    return (
        <>
            <section className="page-intro-section">
                <h2 className="page-heading">Your Book Collection</h2>
                <p className="page-intro">This is where your favorite books live! Browse through your collection, track what you have already read, and keep tabs on books you want to read next. You can also remove books that you no longer want in your collection. Not sure what to add? You can find books on the <Link className="link" to="/search">search page</Link>.
                </p>
            <div id="button-container">
                <Button className="primary-button" onClick={() => setShowForm(!showForm)} text={showForm ? 'Hide form' : 'Add new book'} />
            </div>  
            </section>
            <section id="collection-container">
                <div className={`form-slide-in ${showForm ? 'form-active' : ''}`}>
                    {showForm && <Form onAddBook={addBook} />}
                </div>
                <BooksDisplay
                    books={library}
                    onToggleReadStatus={toggleReadStatus}
                    onRemove={removeBook}
                />
            </section>
        </>
    );
    
}