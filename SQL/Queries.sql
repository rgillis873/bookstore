--Used to fix the serial number sequences for author,publisher, review, address relations,
--as they were thrown off by the initial insertions into the db
SELECT setval(pg_get_serial_sequence('author', 'auth_id'), MAX(auth_id)) FROM author;
SELECT setval(pg_get_serial_sequence('publisher', 'pub_id'), MAX(pub_id)) FROM publisher;
SELECT setval(pg_get_serial_sequence('review', 'review_id'), MAX(review_id)) FROM review;
SELECT setval(pg_get_serial_sequence('address', 'add_id'), MAX(add_id)) FROM address;


--Get list of book genres
SELECT distinct genre 
FROM book;
        
--Get list of authors
SELECT auth_name 
FROM author; 
        
--Get list of books matching search criteria (2 examples)
--1. Relative search for books of the fantasy genre with the word Rings in the title written by J.R.R. Tolkien with a price of 
--100 dollars or less
SELECT * 
from books_authors 
where Lower(name) LIKE Lower('%Rings%') 
and genre = 'Fantasy' 
and authors LIKE '%J.R.R. Tolkien%' 
and price <= 100;

--2. Search for books from the Comic Book genre written by Bill Watterson, costing $20 or less
SELECT * 
from books_authors 
where genre = 'Comic Book' 
and authors LIKE '%Bill Watterson%' 
and price <= 20;

--Get the book details for a book page (value for isbn is substitutable)
SELECT * 
FROM book_page 
where isbn= '0836220889';
        
--Get the reviews for the book (value for isbn is substitutable)
SELECT * 
FROM review 
where isbn='0836220889';
        
--Determine the average rating for the book. Isbn is passed to function. (value for isbn is substitutable)
SELECT * 
FROM avg_rating('0836220889');

--Add a review to the review relation (values are all substitutable)
insert into review(name,comment,rating,isbn) 
values('tj123','This book was good',4,'0836220889');

--Create cart for the user or guest
insert into cart 
values(default) 
returning cart_id;

--Add the user to the store_user relation (first_name, last_name, email, username, user_pass, cart_id are substitutable)
Insert into store_user(first_name, last_name, email, username, user_pass, cart_id) 
values('Calvin', 'Hobbes', 'ch@gmail.com','spacemanspiff32', 'Susie', 10);

--Move items into the assigned cart for the user if there were any while registering (cart_id's are substitutable)
update book_cart 
set cart_id=10 
where cart_id=9;
            
--If unsuccessful registering or user is signing in, delete the cart (cart_id is substitutable)
delete 
from cart 
where cart_id=10;

--Check for a matching username and password in the db for signing in (username and user_pass are substitutable)
SELECT * 
FROM store_user 
where username='spacemanspiff32' 
and user_pass='Susie';

--Get the merged cart values from guest cart and user cart. Function takes in two substitutable cart_id values
select * 
from merged_rows(10,9);

--Update the cart quantities (isbn,user_cart_id,quantity are substitutable)
insert into book_cart 
values('0836220889',10,3) 
on conflict (cart_id,isbn) 
do update set quantity=3;
            
--Delete the old, not logged in cart items (cart_id is substitutable)
delete 
from book_cart 
where cart_id=9;

--Get contents of a cart (cart_id is substitutable)
SELECT * 
FROM get_cart_items 
where cart_id=10;

--Check if there is enough stock to fill the order. Passing in a cart_id to the function
select * 
from cant_fill_order(10);

--Get the items in the user's cart. Only isbns and cart_ids are stored in this relation. (cart_id is substitutable)
select * 
from book_cart 
where cart_id=10

--Create the order. Returns the order_id (cost and username are substitutable)
insert into store_order 
values(default, current_date,52.45,'spacemanspiff32') 
returning order_id;
            
--Update the stock number for each book in the cart (quantity,isbn are substitutable)
update book 
set stock=book.stock-2 
where isbn='0836220889';

--Add address if it doesn't already exist. Get id of the address whether it existed or not 
--(street_num_name, apt, city, province, country, post_code are all substitutable)
select * 
from insert_or_return_address('13 Deadend Dr.',null,'Eeerie','Indiana','USA','KL5-2N1');

--Add credit card to db if it wasn't already there (credit_num, expiry, cvv are all substitutable)
insert into credit_card 
values('323444444','9/23','111') 
on conflict do nothing;

--Add billing info to db (first_name,last_name, phone_num, add_id,email,credit_num, order_id are all substitutable)
insert into billing 
values(default, 'Calvin', 'Hobbes', '613-613-6133', 32, 'ch@gmail.com', '323444444', 17);

--Add shipping info to db first_name,last_name, phone_num, add_id,email, order_id are all substitutable)
insert into shipping 
values(default,'Calvin', 'Hobbes', '613-613-6133', 32, 'ch@gmail.com', 17); 

--Add the delivery to the db (order_id is substitutable)
insert into delivery 
values(default,'Toronto','Ontario','Canada',3,17);

--Delete the book from the cart (isbn and cart_id are substitutable)
delete 
from book_cart 
where isbn='0836220889' 
and cart_id=10

--Add the book to the cart. May be adding more to a book that is already in the cart (isbn, cart_id and quantity are substitutable)
insert into book_cart 
values('0836220889',10,4) 
on conflict (cart_id,isbn) 
do update set quantity=book_cart.quantity+4;

--Update the quantity of the book in the cart (isbn, cart_id and quantity are substitutable)
update book_cart 
set quantity=4 
where isbn='0836220889' 
and cart_id=10;

--Check for the order in the db (order_id is substitutable)
SELECT * 
FROM delivery 
where order_id=17;
        
--Get items of the order (order_id is substitutable)
SELECT * 
FROM order_items 
where order_id=17;

--Get list of books for reports
SELECT isbn,name 
FROM book;

--Seperate view for getting reports for authors (2 examples)
--1. Get sales/expenses from Bill Watterson books from the year 2021
select * 
from author_sale_info 
where auth_name='Bill Watterson' 
and EXTRACT(year FROM sale_date) = 2021;

--2. Get sales/expenses from Bill Watterson books from the December 2021
select * 
from author_sale_info 
where auth_name='Bill Watterson' 
and EXTRACT(year FROM sale_date) = 2021 
and EXTRACT(month FROM sale_date) = 12;

--View for getting reports not related to authors (2 examples)
--1. Get sales/expenses from all fantasy genre books
select * 
from book_genre_sale_info 
where genre='Fantasy';

--2. Get sales/expenses from the Comic Book genre book with the matching isbn
select * 
from book_genre_sale_info 
where genre='Comic Book' 
and isbn = '0836220889';

--Query seperate view for getting report totals for authors (2 examples)
--1. Get sales/expenses totals from Bill Watterson books from the year 2021
select sum(quantity) as tot_quantity, sum(sale_tot) as tot_sales, sum(amount) as tot_expense 
from author_sale_info 
where auth_name='Bill Watterson' 
and EXTRACT(year FROM sale_date) = 2021;

--2. Get sales/expenses totals from Bill Watterson books from the December 2021
select sum(quantity) as tot_quantity, sum(sale_tot) as tot_sales, sum(amount) as tot_expense 
from author_sale_info
where auth_name='Bill Watterson' 
and EXTRACT(year FROM sale_date) = 2021 
and EXTRACT(month FROM sale_date) = 12;
              
--Query for all other report totals (2 examples)
--1. Get sales/expenses totals from all fantasy genre books
select sum(quantity) as tot_quantity, sum(sale_tot) as tot_sales, sum(amount) as tot_expense 
from book_genre_sale_info 
where genre='Fantasy';

--.2 Get sales/expenses totals from the Comic Book genre book with the matching isbn
select sum(quantity) as tot_quantity, sum(sale_tot) as tot_sales, sum(amount) as tot_expense 
from book_genre_sale_info 
where genre='Comic Book' 
and isbn = '0836220889';

 --Get list of orders from publishers
SELECT * 
FROM publisher_orders;

--Check if book already exists (isbn is substitutable)
select * 
from book 
where isbn= '0836220889';
         
--Remove book from store (isbn is substitutable)
update book 
set is_removed=FALSE 
where isbn='0836220889';

--Check if publisher already exists (pub_name and email are substitutable)
select pub_id 
from publisher 
where pub_name='Pendant Publishing' 
and email='pendpub@gmail.com';
         
--Add new publisher (pub_name,add_id,email,bank_account are all substitutable). Return the pub_id
insert into publisher(pub_name, add_id,email,bank_account) 
values('Pendant Publishing',32,'pendpub@gmail.com',4591822) 
returning pub_id;

--Add publisher phone numbers (phone_num, and pub_id are substitutable)
insert into phone 
values('613-613-6133',32);

--Insert the book into the book relation (isbn,book_name,genre, price,description, cover_image, pub_id,pub_percent,page_num are substitutable)
insert into book(isbn,name,genre,price,description,cover_image,pub_id,pub_percent,page_num) 
values('0836220889', 'Calvin and Hobbes', 'Comic Book', 12.85, 'A boy and his tiger',null,32,15,245);
             
--Check for pre-existing author (auth_name is substitutable)   
select auth_id 
from author 
where auth_name='Bill Watterson';
                 
--Add new author (auth_name is substitutable). Return the auth_id
insert into author(auth_name) 
values('Bill Watterson') 
returning auth_id;

--Add link between the author and the book (auth_id and isbn is substitutable)
insert into book_auth 
values(25, '0836220889');

--Get list of books with their isbn,name and removed status
SELECT name,isbn,is_removed 
from book;

--Set the is_removed boolean for the book store to true when a book is removed (isbn is substitutable)
UPDATE book 
SET is_removed=TRUE 
WHERE isbn= '0836220889';