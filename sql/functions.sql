--Finds and returns the average rating for a book based on
--its reviews
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

--Gets the merged quantities of books for two carts. Returns table
--of merged quantities
create function merged_rows(cart_one int, cart_two int)
	returns table(
		isbn varchar(13),
		book_sum bigint
	)
	as 
	$$
	begin
	return query
		select book_cart.isbn, sum(book_cart.quantity) 
		from book_cart
		where book_cart.cart_id = cart_one or book_cart.cart_id = cart_two
		group by book_cart.isbn;
	end;
	$$
	language 'plpgsql';

--Checks if enough stock exists to fill an order.
--Returns True if there isn't enough.False otherwise
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
	end;
	$$ 
	language 'plpgsql';

--Trigger function, makes a warehouse order when stock goes below 10 books.
create function make_warehouse_order()
	returns trigger
	as
	$$
	declare order_quantity int;
	begin
		--Get the sales for the book in the last 30 days
		select sum(quantity) into order_quantity
		from sale
		where isbn=new.isbn and sale_date > current_date - 30
		group by isbn;

		--If stock will fall below 10 books, order more
		if new.stock < 10 and new.stock is distinct from old.stock then
			insert into warehouse_order values(default,current_date,order_quantity,
											   new.pub_id,new.isbn);
			new.stock = new.stock+order_quantity;
		end if;
		
		return new;
	end;
	$$
	language 'plpgsql';

--Trigger function, executes when order goes through.
--Adds items from cart to order items,adds the sales and expenses for the items,
--and then deletes the items from the cart
create function complete_store_order()
	returns trigger
	as
	$$
	declare user_cart_id int;
	begin
		--Get the cart id for the user
		select cart_id into user_cart_id
		from store_user
		where username = new.username;

		--Add the order items from the cart
		insert into item (book_name,quantity,order_id)
		select name,quantity,new.order_id
		from get_cart_items
		where cart_id=user_cart_id;
		
		--Add the sale info for each item in the order
		insert into sale (quantity,sale_date,isbn,order_id)
		select quantity, current_date,isbn,new.order_id
		from get_cart_items
		where cart_id=user_cart_id;
		
		--Add the expense info for each item in the order
		insert into expense (exp_date,amount, pub_id,sale_id)
		select sale_date, 
		((quantity*price)::numeric(6,2)*(pub_percent::numeric(6,2)/100))::numeric(6,2),
		pub_id, sale_id
		from sale natural join book
		where order_id=new.order_id;
		
		--Delete the items from the user's cart
		delete from book_cart where cart_id=user_cart_id;
		return new;
	end;
	$$
	language 'plpgsql';

--Function to either add a new address if it doesn't already exists. Returns the add_id of the newly added address
--or the pre-existing address if it was already in the database
create function insert_or_return_address(street varchar(30), apt varchar(20),
	new_city varchar(30), new_prov varchar(30),new_country varchar(30), new_post varchar(7))
		returns int	
		as
		$$
		declare address_id int;
		begin
		
		--Try to add the new address, if it's already there, it won't be added. This query
		--returns the add_id of the address if it was added
		insert into address 
		values(default, street, apt, new_city, new_prov, new_country, new_post)
		on conflict do nothing
		returning add_id into address_id;

		--If the address already existed, get the add_id of it
		if address_id is null then
			select add_id into address_id
			from address
			where street_num_name = street and (apt_num = apt or apt_num is null) 
			and city = new_city and province = new_prov and country = new_country
			and post_code = new_post;
		end if;

		return address_id;
		end;
		$$ 
		language 'plpgsql';