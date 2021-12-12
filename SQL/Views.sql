--For searching books
create view books_authors as
	select isbn,name,price,genre,cover_image, string_agg(auth_name, ',') as authors
	from book natural join book_auth natural join author
	where book.is_removed = false
	group by isbn;

--For viewing an individual book page
create view book_page as
	select isbn,name,price,genre,cover_image,description,page_num,pub_name, string_agg(auth_name, ',') as authors
	from (((book natural join book_auth) natural join author) natural join publisher)
	group by isbn,pub_name;

--For viewing items in carts
create view get_cart_items as
	select isbn,quantity,name,price,cart_id,pub_percent,pub_id
	from book_cart natural join book;

--For viewing the items from an order
create view order_items as
	select * 
	from store_order natural join item;

--For viewing orders to publisher. Ordered by date (new to old).
create view publisher_orders as
	select wo_date,quantity,pub_name,warehouse_order.isbn,name
	from warehouse_order natural join publisher natural join book
	order by wo_date desc;

--For viewing the sales info of books by isbn, genre, month or year of sale
create view book_genre_sale_info as
	select order_id,sale.isbn,quantity, (quantity*price)::numeric(6,2) as sale_tot,sale_date, name,
	genre,pub_percent,pub_name,bank_account, amount
	from sale natural join expense natural join book natural join publisher
	order by sale_date desc;

--For viewing the sales info by authors of books. Ordered by date (new to old)
create view author_sale_info as
	select order_id,sale.isbn,quantity,auth_name,(quantity*price)::numeric(6,2) as sale_tot,
	sale_date, name, genre,pub_percent,pub_name,bank_account,amount
	from sale natural join expense natural join book natural join book_auth 
	natural join author natural join publisher
	order by sale_date desc;
