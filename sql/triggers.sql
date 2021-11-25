--When a book's stock falls below 10 books, an order will be placed for the book 
create trigger stock_is_depleted
before update
on book
for each row
execute procedure make_warehouse_order();

--Gets triggered when an order completes
create trigger order_completion
after insert
on store_order
for each row
execute procedure complete_store_order();