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