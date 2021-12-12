--Table for storing addresses for shipping,billing or publishers
create table address(
	add_id serial,
	street_num_name varchar(30) not null,
	apt_num varchar(20),
	city varchar(30) not null,
	province varchar(30) not null,
	country varchar(30) not null,
	post_code varchar(7) not null,
	primary key(add_id),
	unique (street_num_name, apt_num, city, province, country, post_code)
);

--Table for storing publisher info
create table publisher(
	pub_id serial,
	pub_name varchar(50) not null,
	add_id int not null,
	email varchar(50) not null unique,
	bank_account int not null unique,
	primary key(pub_id),
	foreign key(add_id) references address(add_id)
);

--Table for storing publisher phone numbers
create table phone(
	phone_num varchar(13) not null,
	pub_id int,
	primary key(phone_num),
	foreign key(pub_id) references publisher(pub_id)
	
);

--Table for storing book info
create table book(
	isbn varchar(13) not null,
	name varchar(100) not null,
	genre varchar(15) not null,
	price numeric(5,2) not null,
	description varchar(500),
	cover_image varchar(500),
	page_num int not null,
	stock int default 20,
	pub_id int not null,
	pub_percent int not null,
	is_removed boolean default FALSE,
	primary key(isbn),
	foreign key(pub_id) references publisher(pub_id)
);

--Table for storing author names and ids
create table author(
	auth_id serial,
	auth_name varchar(50) not null unique,
	primary key(auth_id)
);

--Table linking authors to books
create table book_auth(
	auth_id int not null,
	isbn varchar(13) not null,
	primary key(auth_id, isbn),
	foreign key(auth_id) references author(auth_id),
	foreign key(isbn) references book(isbn)
);

--Table for storing book reviews
create table review(
	review_id serial,
	name varchar(30) not null,
	comment varchar(300) not null,
	rating int not null,
	isbn varchar(13) not null,
	primary key(review_id),
	foreign key(isbn) references book(isbn)
);

--Table for storing orders made for more books from publishers
create table warehouse_order(
	wo_id serial,
	wo_date date not null,
	quantity int not null,
	pub_id int not null,
	isbn varchar(13) not null,
	primary key(wo_id),
	foreign key(pub_id) references publisher(pub_id),
	foreign key(isbn) references book(isbn)
);

--Table for storing user cart ids
create table cart(
	cart_id serial,
	primary key(cart_id)	
);

--Table for storing cart items
create table book_cart(
	isbn varchar(13) not null,
	cart_id int not null,
	quantity int not null,
	primary key(isbn,cart_id),
	foreign key(isbn) references book(isbn),
	foreign key(cart_id) references cart(cart_id)
);

--Table for storing registered users of the store
create table store_user(
	username varchar(30) not null,
	first_name varchar(30) not null,
	last_name varchar(30) not null,
	email varchar(50) not null unique,
	user_pass varchar(20) not null,
	cart_id int not null,
	primary key(username),
	foreign key (cart_id) references cart(cart_id)
);

--Table for storing orders made by users of the store
create table store_order(
	order_id serial,
	ord_date date,
	ord_cost numeric(6,2) not null,
	username varchar(30) not null,
	primary key(order_id),
	foreign key(username) references store_user(username)
);

--Table for storing items from orders
create table item(
	item_id serial,
	book_name varchar(100) not null,
	quantity int not null,
	order_id int not null,
	primary key(item_id),
	foreign key(order_id) references store_order(order_id)
);

--Table storing sales from store orders
create table sale(
	sale_id serial not null,
	quantity int not null,
	sale_date date not null,
	isbn varchar(13) not null,
	order_id int not null,
	primary key(sale_id),
	foreign key(isbn) references book(isbn),
	foreign key(order_id) references store_order(order_id)
);

--Table storing expenses for sales
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

--Table storing delivery info for orders
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

--Table for storing credit card numbers used for the store orders
create table credit_card(
	credit_num varchar(16),
	credit_expiry varchar(5) not null,
	credit_cvv varchar(3) not null,
	primary key(credit_num)
);

--Table for storing the billing info from store orders
create table billing(
	bill_id serial,
	first_name varchar(30) not null,
	last_name varchar(30) not null,
	phone_num varchar(13) not null,
	add_id int not null,
	email varchar(50) not null,
	credit_num varchar(16) not null,
	order_id int not null,
	primary key(bill_id),
	foreign key (add_id) references address(add_id),
	foreign key (credit_num) references credit_card(credit_num),
	foreign key (order_id) references store_order(order_id)
);

--Table for storing the shipping info from store orders
create table shipping(
	ship_id serial,
	first_name varchar(30) not null,
	last_name varchar(30) not null,
	phone_num varchar(13) not null,
	add_id int not null,
	email varchar(50) not null,
	order_id int not null,
	primary key(ship_id),
	foreign key (add_id) references address(add_id),
	foreign key (order_id) references store_order(order_id)
);

