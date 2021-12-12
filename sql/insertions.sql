--Insert publisher addresses (add_id, street_num_name, apt_num, city, province, country, post_code)
insert into address values(1,'15 Ruddy Way',null,'New York','New York','USA','K12-6R9');
insert into address values(2,'15 Cornocopia Dr',null,'Manhattan','New York','USA','K3R-7R0');
insert into address values(3,'91 Docel Dr','Floor A','Manhattan','New York','USA','K3R-7P9');
insert into address values(4,'1131 York Ave',null,'Toronto','Ontario','Canada','Q9L-7R0');
insert into address values(5,'9 Dursley Ln.',null,',London','Middlesex','England','P17-7R0');
insert into address values(6,'15 Degrassi St.','Floor 1-5','Toronto','Ontario','Canada','K1Q-7L9');
insert into address values(7,'99 Degrassi St.','Floor 3-5','Toronto','Ontario','Canada','M2L-7L9');
insert into address values(8,'89 Overpriced Dr.',null,'Vancouver','British Columbia','Canada','H0H-0H0');

--Insert publisher information (pub_id, pub_name, add_id, email, bank_account)
insert into publisher values(1,'Andrews McMeel Publishing',1,'mcmeelpub@gmail.com',4591822);
insert into publisher values(2,'Villard',2,'villardpub@gmail.com',2765198);
insert into publisher values(3, 'Hachette Books',3,'hachettepub@gmail.com',2769999);
insert into publisher values(4, 'Random House Canada',4,'randomhousepub@gmail.com',2764599);
insert into publisher values(5, 'Bloomsbury Childrens Books',5,'bloomsburypub@gmail.com',8258255);
insert into publisher values(6, 'Harper Collins Canada',6,'harperpub@gmail.com',9999222);
insert into publisher values(7, 'Scholastic Books',7,'scholasticpub@gmail.com',98989898);
insert into publisher values(8, 'Tundra Books',8,'tundrapub@gmail.com',71717171);

--Add publisher phone numbers (phone_num, pub_id)
insert into phone values('232-717-2688',1);
insert into phone values('613-717-2688',1);
insert into phone values('855-933-2628',2);
insert into phone values('622-712-2288',2);
insert into phone values('850-938-2788',2);
insert into phone values('918-917-9688',3);
insert into phone values('255-773-2699',4);
insert into phone values('444-444-4444',4);
insert into phone values('555-555-5555',5);
insert into phone values('667-667-6677',6);
insert into phone values('777-777-7777',7);
insert into phone values('888-888-8888',8);
insert into phone values('891-723-9873',8);

--Add Books
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Calvin and Hobbes', '0836220889', 240, 25.99, 'Comic Book', 'https://i.ebayimg.com/thumbs/images/g/FlUAAOSwMOJf~vnF/s-l200.jpg', 'This is the first collection of the classic comic strip that features Calvin, a rambunctious 6-year-old boy, and his stuffed tiger, Hobbes, who comes charmingly to life.',10,1);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Yukon Ho', '0836218353', 220, 23.99, 'Comic Book', 'https://images-na.ssl-images-amazon.com/images/I/61arTIn8exS._SX258_BO1,204,203,200_.jpg', 'The spirit of childhood leaps to life again with boundless energy and magic in Yukon Ho!, a collection of adventures featuring rambunctious six-year-old Calvin and his co-conspirator tiger-chum, Hobbes.Yukon Ho! is a delight!', 11,1);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('The Revenge of the Baby-Sat', '0836218663', 180, 18.99, 'Comic Book', 'https://images-na.ssl-images-amazon.com/images/I/915BKn57eRL.jpg', 'With keen insight, Bill Watterson depicted life through the eyes of a child in Calvin and Hobbes—with all the inherent fun and frustrations.',10,1);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('It''s a Magical World', '0740777963', 200, 24.99, 'Comic Book', 'https://images-na.ssl-images-amazon.com/images/I/81RZYNKqJ-L.jpg', 'It''s a Magical World delivers all the satisfaction of visiting its characters once more. Calvin fans will be able to see their favorite mischief maker stir it up with his furry friend.',12,1);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Into the Wild', '0307387178', 224, 17.99, 'Biography', 'https://images-na.ssl-images-amazon.com/images/I/51jGs2yyXgL.jpg', 'In April 1992 a young man from a well-to-do family hitchhiked to Alaska and walked alone into the wilderness north of Mt. McKinley. His name was Christopher Johnson McCandless.',12,2);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Scar Tissue', '1401307450', 480, 15.99, 'Biography', 'https://images-na.ssl-images-amazon.com/images/I/71WwOBbOEzL.jpg', 'Scar Tissue is Anthony Kiedis'' searingly honest memoir of a life spent in the fast lane. In 1983, four self-described "knuckleheads" burst out of the mosh-pitted mosaic of the neo-punk rock scene in L.A. with their own unique brand of cosmic hardcore mayhem funk.',13,3);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Shake Hands with the Devil','0679311726', 584, 25.99, 'Biography', 'https://m.media-amazon.com/images/I/51upJt0yTNL.jpg', 'A brave, unforgettable first-hand account of the Rwandan genocide by a man almost literally haunted by the dead and by the spectre of his mission''s failure. Marking the twenty-fifth anniversary of this horrific event, this edition includes a new note from Roméo Dallaire.',12,4);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Michael Jordan: The Life', '031619476X', 720, 15.99, 'Biography', 'https://images-na.ssl-images-amazon.com/images/I/5106FvUkQyL._SX323_BO1,204,203,200_.jpg', 'Drawing on personal relationships with Jordan''s coaches; countless interviews with friends, teammates, family members, and Jordan himself; and decades in the trenches covering Jordan in college and the pros.',10,3);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Cash: The Autobiography', '0060727535', 320, 20.99, 'Biography', 'https://images-na.ssl-images-amazon.com/images/I/51XBK2K2xTL._SX331_BO1,204,203,200_.jpg', 'He was the "Man in Black," a country music legend, and the quintessential American troubadour. He was an icon of rugged individualism who had been to hell and back, telling the tale as never before. In his unforgettable autobiography.',15,3);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Robin', '1250214815', 560, 12.99,'Biography', 'https://images-na.ssl-images-amazon.com/images/I/51XBK2K2xTL._SX331_BO1,204,203,200_.jpg', 'From New York Times culture reporter Dave Itzkoff, the definitive biography of Robin Williams – a compelling portrait of one of America’s most beloved and misunderstood entertainers.',9,4);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Dilbert: Random Acts of Management','9780752271743', 128, 10.99, 'Comic Book', 'https://m.media-amazon.com/images/P/0740704532.01._SCLZZZZZZZ_SX500_.jpg', 'In Random Acts of Management, cartoonist Scott Adams offers sardonic glimpses once again into the lunatic office life of Dilbert, Dogbert, Wally, and others, as they work in an all-too-believably ludicrous setting.',5,1);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Dilbert: Another Day in Cubicle Paradise', '0740721941', 128, 5.98, 'Comic Book', 'https://m.media-amazon.com/images/P/0740721941.01._SCLZZZZZZZ_SX500_.jpg', 'In Another Day in Cubicle Paradise Dilbert and his cohorts, Dogbert, Catbert, Ratbert, and the pointy-haired boss, once again entertain with their cubicle humor.',6,1);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Dilbert: Eagerly Awaiting Your Irrational Response', '1524860719', 144, 19.79, 'Comic Book', 'https://www.amazon.ca/images/I/51+xnqupxpL._SX470_BO1,204,203,200_.jpg', 'The office culture in Dilbert abounds with hazards, from risky re-orgs and ergonomic ball chair disasters to Wally’s flying toenail clippings. After a colleague suggests planning a huddle to ideate around an opportunity, Dilbert suffers an acute bout of jargon poisoning.',5,1);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Adulthood is a Myth: A Sarah''s Scribbles Collection', '9781449474195', 112, 7.99, 'Graphic Novel', 'https://images-na.ssl-images-amazon.com/images/I/51xv2F-geoL._SX404_BO1,204,203,200_.jpg', 'These casually drawn, perfectly on-point comics by the hugely popular young artist Sarah Andersen are for the rest of us. They document the wasting of entire beautiful weekends on the internet, the unbearable agony of holding hands on the street with a gorgeous guy, and dreaming all day of getting',15,1);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Crack of Noon: A Zits Treasury', '0740756842', 248, 8.24, 'Comic Book', 'https://images-na.ssl-images-amazon.com/images/I/51FAu7yqPfL._SY388_BO1,204,203,200_.jpg', 'I am Jeremy and I am, unfortunately, 15 years old. A high school freshman with, thank God, four good friends but other than that a seriously boring life in a seriously boring town made livable only by the knowledge that someday in the far-off future at least this will all be over and I''ll turn 16 and get a driver''s license.',15,1);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Not Sparking Joy: A Zits Treasury', '1524851760', 208, 10.99, 'Comic Book', 'https://images-na.ssl-images-amazon.com/images/I/61kjM0-l28L._SY389_BO1,204,203,200_.jpg', 'Sixteen-year-old Jeremy Duncan is a high school freshman and an aspiring musician. He daydreams about the day when his band, Goat Cheese Pizza, records their first monster hit single and they all pile into his van for their cross-country, sold-out concert tour. Between naps, study hall, and band practice, Jeremy still manage',15,1);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('The Perks of Being a Wallflower', '9781451696196', 248, 6.46, 'Fiction', 'https://images-na.ssl-images-amazon.com/images/I/41CiEb1Qx2L._SX355_BO1,204,203,200_.jpg', 'The critically acclaimed debut novel from Stephen Chbosky, Perks follows observant “wallflower” Charlie as he charts a course through the strange world between adolescence and adulthood. First dates, family drama, and new friends. Sex, drugs, and The Rocky Horror Picture Show. Devastating loss, young love, and life on the fringes.',15,1);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Harry Potter and the Philosopher''s Stone', '9781408855652', 352, 14.84, 'Fantasy', 'https://www.amazon.ca/images/I/5160dwNeqSL._SX323_BO1,204,203,200_.jpg', 'Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry''s eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid burst',15,5);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Harry Potter and the Chamber of Secrets', '1408855666', 384, 12.38, 'Fantasy', 'https://www.amazon.ca/images/I/51F7MMxbhOL._SX324_BO1,204,203,200_.jpg', 'Harry Potter''s summer has included the worst birthday ever, doomy warnings from a house-elf called Dobby, and rescue from the Dursleys by his friend Ron Weasley in a magical flying car! Back at Hogwarts School of Witchcraft and Wizardry for his second year, Harry hears strange whispers echo through empty corridors - and then the attacks start.',15,5);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Harry Potter and the Prisoner of Azkaban', '1408855674', 480, 12.38, 'Fantasy', 'https://www.amazon.ca/images/I/51WMfnxFXaL._SX322_BO1,204,203,200_.jpg', 'When the Knight Bus crashes through the darkness and screeches to a halt in front of him, it''s the start of another far from ordinary year at Hogwarts for Harry Potter. Sirius Black, escaped mass-murderer and follower of Lord Voldemort, is on the run - and they say he is coming after Harry.',15,5);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Harry Potter and the Goblet of Fire', '1408855682', 640, 15.84, 'Fantasy', 'https://www.amazon.ca/images/I/516SzpxSeML._SX332_BO1,204,203,200_.jpg', 'The Triwizard Tournament is to be held at Hogwarts. Only wizards who are over seventeen are allowed to enter - but that doesn''t stop Harry dreaming that he will win the competition. Then at Hallowe''en, when the Goblet of Fire makes its selection, Harry is amazed to find his name is one of those that the magical cup picks out.',15,5);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Harry Potter and the Order of the Phoenix', '9781408855690', 816, 15.84, 'Fantasy', 'https://www.amazon.ca/images/I/51OIe2p9vhL._SX320_BO1,204,203,200_.jpg', 'Dark times have come to Hogwarts. After the Dementors'' attack on his cousin Dudley, Harry Potter knows that Voldemort will stop at nothing to find him. There are many who deny the Dark Lord''s return, but Harry is not alone: a secret order gathers at Grimmauld Place to fight against the Dark forces.',15,5);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Harry Potter and the Half-Blood Prince', '0439785960', 652, 16.35, 'Fantasy', 'https://www.amazon.ca/images/I/51nRdIU2qHL._SX336_BO1,204,203,200_.jpg', 'When Dumbledore arrives at Privet Drive one summer night to collect Harry Potter, his wand hand is blackened and shrivelled, but he does not reveal why. Secrets and suspicion are spreading through the wizarding world, and Hogwarts itself is not safe. Harry is convinced that Malfoy bears the Dark Mark: there is a Death Eater amongst them.',15,5);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Harry Potter and the Deathly Hallows', '1408855712', 640, 17.82, 'Fantasy', 'https://www.amazon.ca/images/I/51l4+BTDxsL._SX323_BO1,204,203,200_.jpg', 'As he climbs into the sidecar of Hagrid''s motorbike and takes to the skies, leaving Privet Drive for the last time, Harry Potter knows that Lord Voldemort and the Death Eaters are not far behind. The protective charm that has kept Harry safe until now is now broken, but he cannot keep hiding.',15,5);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Lord of the Rings: The Fellowship of the Ring', '9780261102354', 448, 10.88, 'Fantasy', 'https://www.amazon.ca/images/I/41tA1m6+5dL._SX308_BO1,204,203,200_.jpg', 'Sauron, the Dark Lord, has gathered to him all the Rings of Power – the means by which he intends to rule Middle-earth. All he lacks in his plans for dominion is the One Ring – the ring that rules them all – which has fallen into the hands of the hobbit, Bilbo Baggins.',13,6);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Lord of the Rings: The Two Towers', '0261102362', 464, 10.99, 'Fantasy', 'https://www.amazon.ca/images/I/31hpHUdg3OL._SX310_BO1,204,203,200_.jpg', 'Frodo and the Companions of the Ring have been beset by danger during their quest to prevent the Ruling Ring from falling into the hands of the Dark Lord by destroying it in the Cracks of Doom. They have lost the wizard, Gandalf, in the battle with an evil spirit in the Mines of Moria; and at the Falls of Rauros, Boromir, seduced by the power of the Ring, tried to seize it by force.',13,6);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Lord of the Rings: The Return of the King', '0261102370', 464, 10.88, 'Fantasy', 'https://www.amazon.ca/images/I/31XN2DM92xL._SX310_BO1,204,203,200_.jpg', 'The armies of the Dark Lord Sauron are massing as his evil shadow spreads even wider. Men, Dwarves, Elves and Ents unite forces to do battle against the Dark. Meanwhile, Frodo and Sam struggle further into Mordor, guided by the treacherous creature Gollum, in their heroic quest to destroy the One Ring…',13,6);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('The Night They Stole the Stanley Cup', '1770494146', 176, 10.88, 'Mystery', 'https://www.amazon.ca/images/I/51G4awbpGLL._SX331_BO1,204,203,200_.jpg', 'Someone is out to steal the Stanley Cup - and only the Screech Owls stand between the thieves and their prize!',8,8);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Mystery at Lake Placid', '1770494138', 272, 10.88, 'Mystery', 'https://www.amazon.ca/images/I/51dnDUXpdfL._SX331_BO1,204,203,200_.jpg', 'Travis Lindsay, his best friend, Nish, and all their pals on the Screech Owls hockey team, are on their way to New York for an international peewee tournament. Excitement builds in the team van on the way to Lake Placid. First there are the entertaining antics of their trainer, Mr. Dillinger - then there''s the prospect of playing on an Olympic rink, in a huge arena, knowing there will be scouts in the stands.',8,8);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('The Princess Bride', '9780156035217', 512, 15.83, 'Fantasy', 'https://www.amazon.ca/images/I/510yzqD6ukL._SX302_BO1,204,203,200_.jpg', 'William Goldman''s modern fantasy classic is a simple, exceptional story about quests—for riches, revenge, power, and, of course, true love—that''s thrilling and timeless.',11,4);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Matilda', '0142410373', 240, 8.99, 'Fantasy', 'https://www.amazon.ca/images/I/51vHLdb4CYL._SX323_BO1,204,203,200_.jpg', 'Matilda is a sweet, exceptional young girl, but her parents think she''s just a nuisance. She expects school to be different but there she has to face Miss Trunchbull, a kid-hating terror of a headmistress. When Matilda is attacked by the Trunchbull she suddenly discovers she has a remarkable power with which to fight back. It''ll take a superhuman genius to give Miss Trunchbull what she deserves and Matilda may be just the one to do it!',14,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Home Alone: The Classic Illustrated Storybook', '1594748586', 40, 19.41, 'Fiction', 'https://www.amazon.ca/images/I/61UIhZ+NRAL._SX409_BO1,204,203,200_.jpg', 'Eight-year-old Kevin McCallister wished his family would disappear. He never thought his wish would come true! The classic movie you know and love is now an illustrated storybook for the whole family—complete with bumbling burglars, brilliant booby traps, and a little boy named Kevin who’s forced to fend for himself. Can he keep the crooks from entering his house? And will his family return in time for Christmas?',20,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Peter Pan and Wendy', '0147508657', 206, 8.90, 'Fiction', 'https://www.amazon.ca/images/I/61LaLTEV19L._SX360_BO1,204,203,200_.jpg', 'One starry night, Peter Pan and Tinker Bell lead the three Darling children over the rooftops of London and away to Neverland - the island where lost boys play, mermaids splash and fairies make mischief. But a villainous-looking gang of pirates lurk in the docks, led by the terrifying Captain James Hook.',30,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('The Jungle Book', '1947844679', 186, 15.79, 'Fiction', 'https://www.amazon.ca/images/I/51YlWldykwL._SX302_BO1,204,203,200_.jpg', 'The Jungle Books are best known for the `Mowgli'' stories; the tale of a baby abandoned and brought up by wolves, educated in the ways and secrets of the jungle by Kaa the python, Baloo the bear, and Bagheera the black panther. The stories, a mixture of fantasy, myth, and magic, are underpinned by Kipling''s abiding preoccupation with the theme of self-discovery, and the nature of the Law.',10,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('From Anna', '1443113425', 224, 8.99, 'Fiction', 'https://www.amazon.ca/images/I/416OU-HYLKL._SX320_BO1,204,203,200_.jpg', 'Nine-year-old Anna has always been the clumsy one in the family ― somehow she can never do anything right. She bumps into tables, and she can''t read the chalkboard at school. Her perfect brothers and sisters call her "Awkward Anna." When Papa announces that the family is moving from Germany to Canada ― he''s worried about what the Nazis'' rise to power will bring ― Anna''s heart sinks. How can she learn English when she can''t even read German properly?',16,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('The King''s Daughter', '0888992181', 232, 12.82, 'Romance', 'https://www.amazon.ca/images/I/51qPpER9+vL._SX328_BO1,204,203,200_.jpg', 'Jeanne Chatel has always dreamed of adventure. So when the eighteen-year-old orphan is summoned to sail from France to the wilds of North America to become a king''s daughter and marry a French settler, she doesn''t hesitate.',18,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Alanna: The First Adventure', '1442426411', 288, 12.86, 'Fantasy', 'https://www.amazon.ca/images/I/51m7fBMoLxL._SX331_BO1,204,203,200_.jpg', 'In a time when girls are forbidden to be warriors, Alanna of Trebond wants nothing more than to be a knight of the realm of Tortall. So she finds a way to switch places with her twin brother, Thom. Disguised as a boy, Alanna begins her training as a page at the palace of King Roald. But the road to knighthood, as she discovers, is not an easy one.',12,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Lady Knight', '0375829083', 464, 14.84, 'Adventure', 'https://www.amazon.ca/images/I/51fhB6vuAkL._SX321_BO1,204,203,200_.jpg', 'Keladry of Mindelan has finally achieved her lifelong dream of becoming a knight—but it’s not quite what she imagined. In the midst of a brutal war, Kel has been assigned to oversee a refugee camp.',10,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Squire', '0375829067', 432, 14.84, 'Adventure', 'https://www.amazon.ca/images/I/51xJFXU9hLL._SX321_BO1,204,203,200_.jpg', 'Keladry of Mindelan dreams of becoming squire to the famous female knight Alanna the Lioness, but she worries that she will not be selected by her hero—perhaps not by any knight master. When Kel is picked instead by the legendary Lord Raoul, the unexpected honor shocks her enemies across the realm. Kel must quickly prove herself up to the task, mastering her fighting and leadership skills while discovering what it takes to be part of the royal guard.',15,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('The Will of the Empress', '0439441722', 560, 13.83, 'Adventure', 'https://www.amazon.ca/images/I/511EAERF41L._SX334_BO1,204,203,200_.jpg', 'For years the Empress of Namorn has pressed her young cousin, Lady Sandrilene fa Toren, to visit her vast lands within the Empire´s borders. Sandry has avoided the invitation for as long as it was possible. Now Sandry has agreed to pay that overdue visit. Sandry´s uncle promises guards to accompany her.',18,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Shatterglass', '059039696X', 368, 11.87, 'Adventure', 'https://www.amazon.ca/images/I/41Tej+sSRxL._SX306_BO1,204,203,200_.jpg', 'Kethlun Warder was a gifted glassmaker until his world was shattered in a freak accident. Now his remaining glass magic is mixed with lightning, and Tris must teach him to control it (if she can teach him to control his temper first). But there''s more at stake than Keth''s education. With his strange magic, he creates glass balls that reflect the immediate past and expose the work of a murderer.',19,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Trickster''s Choice', '0375828796', 448, 14.84, 'Adventure', 'https://www.amazon.ca/images/I/516BogF3KRL._SX331_BO1,204,203,200_.jpg', 'Aly is from a family known for great deeds. She is the daughter of Alanna, the famed knight and King’s Champion of Tortall. But even though she is bold and brave, like her mother, her true talents lie on her father’s side, in the art of spying.',10,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Trickster''s Queen', '0375828788', 496, 14.99, 'Adventure', 'https://www.amazon.ca/images/I/51d06QufUxL._SX331_BO1,204,203,200_.jpg', 'No longer a slave, Aly has risen through the ranks of the rebellion to become a master of spies. And just in time, she is brought out of exile and into the heart of the snakes’ den that is the Copper Isles royal court.',10,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Bunnicula: The Celery Stalks at Midnight', '9781416928140', 144, 10.99, 'Fiction', 'https://www.amazon.ca/images/I/517EPWhMP9L._SX334_BO1,204,203,200_.jpg', 'Bunnicula is missing! Chester is convinced all the world''s vegetables are in danger of being drained of their life juices and turned into zombies. Soon he has Harold and Howie running around sticking toothpicks through hearts of lettuce and any other veggie in sight. Of course, Chester has been known to be wrong before...',14,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Bunnicula Strikes Again!', '1416939687', 144, 7.91, 'Fiction', 'https://www.amazon.ca/images/I/51XxuZxhgpL._SX334_BO1,204,203,200_.jpg', 'The Monroes'' kitchen is littered with the remains of vegetables drained of all color. To Chester it''s obvious that Bunnicula, the vampire rabbit, is up to his old tricks. But Harold is more frightened for Bunnicula than of him. The poor bunny doesn''t look too good. Is he sick? Or just unhappy? Or has Chester finally gone too far in his attempt to make the world safe for veggies?',15,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Howliday Inn', '1416928154', 224, 10.88, 'Fiction', 'https://www.amazon.ca/images/I/51qlsHwciJL._SX334_BO1,204,203,200_.jpg', 'The Monroes have gone on vacation, leaving Harold and Chester at Chateau Bow-Wow -- not exactly a four-star hotel. On the animals'' very first night there, the silence is pierced by a peculiar wake-up call -- an unearthly howl that makes Chester observe that the place should be called Howliday Inn.',7,4);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('The Case of the Twin Teddy Bears', '0671793020', 160, 7.99, 'Mystery', 'https://www.amazon.ca/images/I/51Nc9rI4qFL._SX364_BO1,204,203,200_.jpg', 'Bess is working during the Christmas rush at Beary Wonderful, a toy and teddy bear shop, when the holiday season takes a sudden scary turn. The owner''s prized collection of antique teddy bears -- cute, cuddly, and worth a bundle -- has been ripped off. But the break-in is only the beginning of a much bigger and more brazen teddy bear caper.',7,4);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Crime in the Queen''s Court', '0671792989', 160, 8.99, 'Mystery', 'https://www.amazon.ca/images/I/51x9eA5BG1L._SX338_BO1,204,203,200_.jpg', 'Nancy joins an Elizabethan troupe as a lady to the queen’s court. There are performances and feasts, but the true drama unfolds when Nancy learns that she, the queen, and the entire festival have been targeted for sabotage.',19,7);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('Murder on the Line', '0553540947', 214, 8.61, 'Mystery', 'https://www.amazon.ca/images/I/41JJQHoTV8L._SX259_BO1,204,203,200_.jpg', 'Jessica and Elizabeth Wakefield are looking forward to another summer as interns at the Sweet Valley News. Elizabeth can''t wait to get to work as a reporter; Jessica can''t wait to spend time with the gorgeous new editor. Jessica is even more excited when she discovers that a crossed telephone line allows her to eavesdrop on other people''s conversations. She loves listening in on the private lives of Sweet Valley -- until she overhears plans for a murder!',15,4);
insert into book(name, isbn,page_num, price, genre, cover_image, description, pub_percent, pub_id) values('R for Revenge', '0553570722', 240, 6.57, 'Mystery', 'https://www.amazon.ca/images/I/51Y2F4M0BSL._SX292_BO1,204,203,200_.jpg', 'Was that a cheer ...  or a scream? The Sweet Valley High cheerleaders have been kidnapped! Co-captains Jessica Wakefield and Heather Mallone thought they''d found the perfect faculty advisor for their cheer squad in Nancy Swanson.  But the cheerleaders don''t know about the dark secret in Nancy''s past.',15,4);

--Add authors (auth_id, auth_name)
insert into author values(1,'Bill Watterson');
insert into author values(2,'Jon Krakauer');
insert into author values(3,'Anthony Kiedis');
insert into author values(4,'Romeo Dallaire');
insert into author values(5,'Johnny Cash');
insert into author values(6,'Dave Itzkoff');
insert into author values(7,'Scott Adams');
insert into author values(8,'Sarah Andersen');
insert into author values(9,'Jim Borgman');
insert into author values(10,'Jerry Scott');
insert into author values(11,'Stephen Chbosky');
insert into author values(12,'J.K. Rowling');
insert into author values(13, 'J.R.R. Tolkien');
insert into author values(14, 'Roy MacGregor');
insert into author values(15, 'William Goldman');
insert into author values(16, 'Roald Dahl');
insert into author values(17, 'Kim Smith');
insert into author values(18, 'J.M. Barrie');
insert into author values(19, 'Rudyard Kipling');
insert into author values(20, 'Jean Little');
insert into author values(21, 'Suzanne Martel');
insert into author values(22, 'Tamora Pierce');
insert into author values(23, 'James Howe');
insert into author values(24, 'Carolyn Keene');
insert into author values(25, 'Francine Pascal');

--Assign authors to books (auth_id, isbn)
insert into book_auth values(1,'0836220889');
insert into book_auth values(1,'0836218353');
insert into book_auth values(1,'0836218663');
insert into book_auth values(1,'0740777963');
insert into book_auth values(2,'0307387178');
insert into book_auth values(3,'1401307450');
insert into book_auth values(4,'0679311726');
insert into book_auth values(5,'0060727535');
insert into book_auth values(6,'1250214815');
insert into book_auth values(7,'9780752271743');
insert into book_auth values(7,'0740721941');
insert into book_auth values(7,'1524860719');
insert into book_auth values(8,'9781449474195');
insert into book_auth values(9,'0740756842');
insert into book_auth values(10,'0740756842');
insert into book_auth values(9,'1524851760');
insert into book_auth values(10,'1524851760');
insert into book_auth values(11,'9781451696196');
insert into book_auth values(12,'9781408855652');
insert into book_auth values(12,'1408855666');
insert into book_auth values(12,'1408855674');
insert into book_auth values(12,'1408855682');
insert into book_auth values(12,'9781408855690');
insert into book_auth values(12,'0439785960');
insert into book_auth values(12,'1408855712');
insert into book_auth values(13, '9780261102354');
insert into book_auth values(13, '0261102362');
insert into book_auth values(13, '0261102370');
insert into book_auth values(14, '1770494146');
insert into book_auth values(14, '1770494138');
insert into book_auth values(15, '9780156035217');
insert into book_auth values(16, '0142410373');
insert into book_auth values(17, '1594748586');
insert into book_auth values(18, '0147508657');
insert into book_auth values(19, '1947844679');
insert into book_auth values(20, '1443113425');
insert into book_auth values(21, '0888992181');
insert into book_auth values(22, '1442426411');
insert into book_auth values(22, '0375829083');
insert into book_auth values(22, '0375829067');
insert into book_auth values(22, '0439441722');
insert into book_auth values(22, '059039696X');
insert into book_auth values(22, '0375828796');
insert into book_auth values(22, '0375828788');
insert into book_auth values(23, '9781416928140');
insert into book_auth values(23, '1416939687');
insert into book_auth values(23, '1416928154');
insert into book_auth values(24, '0671793020');
insert into book_auth values(24, '0671792989');
insert into book_auth values(25, '0553540947');
insert into book_auth values(25, '0553570722');