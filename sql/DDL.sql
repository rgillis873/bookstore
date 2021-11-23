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
	primary key(username)
);

create table user_cart(
	cart_id int not null,
	username varchar(30) not null,
	primary key(cart_id),
	foreign key(cart_id) references cart(cart_id),
	foreign key(username) references store_user(username)
);

create table store_order(
	order_id serial,
	ord_date date,
	ord_cost int not null,
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
	isbn varchar(10) not null,
	order_id int not null,
	primary key(sale_id),
	foreign key(isbn) references book(isbn),
	foreign key(order_id) references store_order(order_id)
);

create table delivery(
	delivery_id serial,
	cur_city varchar(30) not null,
	cur_province varchar(30) not null,
	cur_country varchar(30) not null,
	eta int not null,
	primary key(delivery_id)
);

create table track_order(
	order_id int not null,
	delivery_id int not null,
	primary key(order_id),
	foreign key(order_id) references store_order(order_id),
	foreign key(delivery_id) references delivery(delivery_id) 
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
	primary key(bill_id)
);

create table order_bill(
	order_id int not null,
	bill_id int not null,
	primary key(order_id),
	foreign key(order_id) references store_order(order_id),
	foreign key(bill_id) references billing(bill_id)
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
	primary key(ship_id)
);

create table order_ship(
	order_id int not null,
	ship_id int not null,
	primary key(order_id),
	foreign key(order_id) references store_order(order_id),
	foreign key(ship_id) references shipping(ship_id)
);

--For searching books
create view booksAuthors as
	select isbn,name,price,genre,cover_image, string_agg(auth_name, ',') as authors
	from book natural join book_auth natural join author
	group by isbn;

--For viewing an individual book page
create view bookPage as
	select isbn,name,price,genre,cover_image,description,page_num,pub_name, string_agg(auth_name, ',') as authors
	from (((book natural join book_auth) natural join author) natural join publisher)
	group by isbn,pub_name;