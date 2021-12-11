**MAY NOT NEED THESE 3**
--Used to fix the serial number values for author,publisher and review relations
SELECT setval(pg_get_serial_sequence('author', 'auth_id'), MAX(auth_id)) FROM author;
SELECT setval(pg_get_serial_sequence('publisher', 'pub_id'), MAX(pub_id)) FROM publisher;
SELECT setval(pg_get_serial_sequence('review', 'review_id'), MAX(review_id)) FROM review;


--Get list of book genres
SELECT distinct genre FROM book;
        
--Get list of authors
SELECT auth_name FROM author; 
        
--Get list of books
const allBooks = await pool.query(bookSearch);
        