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

--Checks if enough stock exists to fill an order.Returns True if there isn't enough.False otherwise
create function cant_fill_order(user_cart_id int)
	returns boolean	
	as 
	$$
	begin
  	return exists (
    	select  1
		from book natural join book_cart
		where cart_id=user_cart_id
		and quantity > stock
  	);
	end
	$$ 
	LANGUAGE plpgsql;

--Trigger function, makes a warehouse order when stock goes below 10 books.
create function make_warehouse_order()
	returns trigger
	language plpgsql
	as
	$$
	declare order_quantity int;
	begin
		select sum(quantity) into order_quantity
		from sale
		where isbn=new.isbn and sale_date > current_date - 30
		group by isbn;
		if new.stock < 10 and new.stock is distinct from old.stock then
			insert into warehouse_order values(default,current_date,order_quantity,
											   new.pub_id,new.isbn);
			new.stock = new.stock+order_quantity;
		end if;
		return new;
	end;
	$$

--Adds items from cart to order items,adds the sales for the items, and deletes the items from the cart
create function complete_store_order()
	returns trigger
	language plpgsql
	as
	$$
	declare user_cart_id int;
	begin
		select cart_id into user_cart_id
		from user_cart
		where username = new.username;
		insert into item (book_name,quantity,order_id)
		select name,quantity,new.order_id
		from get_cart_items
		where cart_id=user_cart_id;
		insert into sale (quantity,sale_date,isbn,order_id)
		select quantity, current_date,isbn,new.order_id
		from get_cart_items
		where cart_id=user_cart_id;
		delete from book_cart where cart_id=user_cart_id;
		return new;
	end;
	$$

create function complete_store_order()
	returns trigger
	language plpgsql
	as
	$$
	declare user_cart_id int;
	begin
		select cart_id into user_cart_id
		from store_user
		where username = new.username;
		insert into item (book_name,quantity,order_id)
		select name,quantity,new.order_id
		from get_cart_items
		where cart_id=user_cart_id;
		insert into sale (quantity,sale_date,isbn,order_id)
		select quantity, current_date,isbn,new.order_id
		from get_cart_items
		where cart_id=user_cart_id;
		insert into expense (exp_date,amount, pub_id,sale_id)
		select sale_date, 
		((quantity*price)::numeric(6,2)*(pub_percent::numeric(6,2)/100))::numeric(6,2),
		pub_id, sale_id
		from sale natural join book
		where order_id=new.order_id;
		delete from book_cart where cart_id=user_cart_id;
		return new;
	end;
	$$