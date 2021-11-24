--Finds the average rating for a book
create function avg_Rating(book_isbn varchar(13))
	returns numeric
as
$$
declare 
	avg_rating numeric(3,2);
begin
	select avg(rating) into avg_rating
	from review
	where isbn=book_isbn;
	
	return avg_rating;
end;
$$
language 'plpgsql';

--Gets the merged quantities of books for two carts
create function merged_rows(cart_one int, cart_two int)
	returns table(
		isbn varchar(13),
		book_sum bigint
	)
	language plpgsql
	as $$
	begin
	return query
		select book_cart.isbn, sum(book_cart.quantity) 
		from book_cart
		where book_cart.cart_id = cart_one or book_cart.cart_id = cart_two
		group by book_cart.isbn;
	end;$$