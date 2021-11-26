--Gets triggered when a book's stock falls below 10 books.
--An order will be placed for the book to the publisher 
create trigger stock_is_depleted
before update
on book
for each row
execute procedure make_warehouse_order();

--Gets triggered when an order completes and is inserted in the
--store_order relation
create trigger order_completion
after insert
on store_order
for each row
execute procedure complete_store_order();