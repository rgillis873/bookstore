--Added to make sure addresses with null apt_num values are stil unique
create unique index address_no_apt 
on address (street_num_name, city, province, country, post_code) 
where apt_num is null;