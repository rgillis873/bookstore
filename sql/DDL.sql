create table publisher(
	pub_id serial,
	pub_name varchar(50) not null,
	street_num_name varchar(30) not null,
	office_num varchar(20),
	city varchar(30) not null,
	province varchar(30) not null,
	country varchar(30) not null,
	post_code varchar(7) not null,
	email varchar(50) not null,
	bank_account int,
	primary key(pub_id)
);

create table phone(
	phone_num varchar(13) not null,
	pub_id int,
	primary key(phone_num),
	foreign key(pub_id) references publisher(pub_id)
	
);

create table book(
	isbn varchar(13) not null,
	name varchar(100) not null,
	genre varchar(15),
	price numeric(5,2) not null,
	description varchar(500),
	cover_image varchar(500),
	page_num int not null,
	stock int default 20,
	pub_id int not null,
	pub_percent int not null,
	isRemoved boolean default FALSE,
	primary key(isbn),
	foreign key(pub_id) references publisher(pub_id)
);

create table author(
	auth_id serial,
	auth_name varchar(50) not null,
	primary key(auth_id)
);

create table book_auth(
	auth_id int not null,
	isbn varchar(13) not null,
	primary key(auth_id, isbn),
	foreign key(auth_id) references author(auth_id),
	foreign key(isbn) references book(isbn)
);

create table review(
	review_id serial,
	name varchar(30) not null,
	comment varchar(300) not null,
	rating int not null,
	isbn varchar(13) not null,
	primary key(review_id),
	foreign key(isbn) references book(isbn)
);

create table warehouse_order(
	wo_id serial,
	wo_date date,
	quantity int not null,
	pub_id int not null,
	isbn varchar(13) not null,
	primary key(wo_id),
	foreign key(pub_id) references publisher(pub_id),
	foreign key(isbn) references book(isbn)
);

create table cart(
	cart_id serial,
	primary key(cart_id)	
);

create table book_cart(
	isbn varchar(13) not null,
	cart_id int not null,
	quantity int not null,
	primary key(isbn,cart_id),
	foreign key(isbn) references book(isbn),
	foreign key(cart_id) references cart(cart_id)
);


create table store_user(
	username varchar(30) not null,
	first_name varchar(30) not null,
	last_name varchar(30) not null,
	email varchar(50) not null,
	user_pass varchar(20) not null,
	cart_id int not null,
	primary key(username),
	foreign key (cart_id) references cart(cart_id)
);

create table store_order(
	order_id serial,
	ord_date date,
	ord_cost numeric(6,2) not null,
	username varchar(30) not null,
	primary key(order_id),
	foreign key(username) references store_user(username)
);

create table item(
	item_id serial,
	book_name varchar(100) not null,
	quantity int not null,
	order_id int not null,
	primary key(item_id),
	foreign key(order_id) references store_order(order_id)
);

create table sale(
	sale_id serial not null,
	quantity int not null,
	sale_date date,
	isbn varchar(13) not null,
	order_id int not null,
	primary key(sale_id),
	foreign key(isbn) references book(isbn),
	foreign key(order_id) references store_order(order_id)
);

create table expense(
	exp_id serial not null,
	exp_date date not null,
	amount numeric(6,2) not null,
	pub_id int not null,
	sale_id int not null,
	primary key(exp_id),
	foreign key(pub_id) references publisher(pub_id),
	foreign key(sale_id) references sale(sale_id)
);

create table delivery(
	delivery_id serial,
	cur_city varchar(30) not null,
	cur_province varchar(30) not null,
	cur_country varchar(30) not null,
	eta int not null,
	order_id int not null,
	primary key(delivery_id),
	foreign key (order_id) references store_order(order_id)
);

create table billing(
	bill_id serial,
	first_name varchar(30) not null,
	last_name varchar(30) not null,
	phone_num varchar(13) not null,
	street_num_name varchar(30) not null,
	apt_num varchar(20),
	city varchar(30) not null,
	province varchar(30) not null,
	country varchar(30) not null,
	post_code varchar(7) not null,
	email varchar(50) not null,
	credit_num varchar(16) not null,
	credit_expiry varchar(5) not null,
	credit_cvv varchar(3) not null,
	order_id int not null,
	primary key(bill_id),
	foreign key (order_id) references store_order(order_id)
);

create table shipping(
	ship_id serial,
	first_name varchar(30) not null,
	last_name varchar(30) not null,
	phone_num varchar(13) not null,
	street_num_name varchar(30) not null,
	apt_num varchar(20),
	city varchar(30) not null,
	province varchar(30) not null,
	country varchar(30) not null,
	post_code varchar(7) not null,
	email varchar(50) not null,
	order_id int not null,
	primary key(ship_id),
	foreign key (order_id) references store_order(order_id)
);



--For searching books
create view booksAuthors as
	select isbn,name,price,genre,cover_image, string_agg(auth_name, ',') as authors
	from book natural join book_auth natural join author
	where book.isremoved = false
	group by isbn;

--For viewing an individual book page
create view bookPage as
	select isbn,name,price,genre,cover_image,description,page_num,pub_name, string_agg(auth_name, ',') as authors
	from (((book natural join book_auth) natural join author) natural join publisher)
	group by isbn,pub_name;

--For viewing items in carts
create view get_cart_items as
	select isbn,quantity,name,price,cart_id,pub_percent,pub_id
	from book_cart natural join book

--For viewing tracking for an order
create view delivery_for_order as
select * 
from track_order natural join delivery

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

