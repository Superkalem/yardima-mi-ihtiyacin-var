// Seçim sayfasındaki marka / model listesi: dünya pazarındaki benzinli, dizel ve hibrit
// binek ve hafif ticari araçlar. Yalnızca elektrikli modeller listede yok.
// Biçim: "Model:başlangıç-bitiş" ("|" ile ayrılır). Bitiş yılı yoksa model hâlâ üretimde.
// Yıl listesi bu aralıktan (en erken 1995) oluşturulur.
var CAR_DB = {
  "Abarth": "500:2008-2024|595:2016-2024|695:2016|124 Spider:2016-2019|Punto Evo:2010-2015",
  "Acura": "ILX:2012-2022|Integra:1985|MDX:2000|NSX:1990-2022|RDX:2006|RL:1996-2012|TL:1995-2014|TLX:2014|TSX:2003-2014",
  "Alfa Romeo": "145:1994-2001|146:1994-2001|147:2000-2010|155:1992-1998|156:1997-2007|159:2005-2011|166:1998-2007|4C:2013-2020|Brera:2005-2010|Giulia:2015|Giulietta:2010-2020|GT:2003-2010|Junior:2024|MiTo:2008-2018|Spider:1995-2010|Stelvio:2016|Tonale:2022",
  "Alpine": "A110:2017",
  "Aston Martin": "DB7:1994-2004|DB9:2004-2016|DB11:2016-2023|DB12:2023|DBS:2007|DBX:2020|Rapide:2010-2020|Vantage:2005",
  "Audi": "80:1966-1996|100:1968-1994|A1:2010|A2:1999-2005|A3:1996|A4:1994|A5:2007|A6:1994|A7:2010|A8:1994|Q2:2016|Q3:2011|Q5:2008|Q7:2005|Q8:2018|R8:2006-2024|RS3:2011|RS4:1999|RS6:2002|S3:1999|S4:1997|TT:1998-2023",
  "Bentley": "Arnage:1998-2009|Bentayga:2015|Continental GT:2003|Flying Spur:2005|Mulsanne:2010-2020",
  "BMW": "1 Serisi:2004|2 Serisi:2014|2 Serisi Active Tourer:2014|3 Serisi:1975|4 Serisi:2013|5 Serisi:1972|6 Serisi:2003-2018|7 Serisi:1977|8 Serisi:2018|M2:2015|M3:1986|M4:2014|M5:1985|X1:2009|X2:2018|X3:2003|X4:2014|X5:1999|X6:2008|X7:2019|XM:2022|Z3:1995-2002|Z4:2002",
  "Buick": "Enclave:2007|Encore:2012|Envision:2014|Envista:2023|LaCrosse:2004-2019|Regal:1973-2020|Verano:2011-2017",
  "BYD": "Atto 2 DM-i:2025|F0:2008-2015|F3:2005-2016|Han DM:2020|Qin Plus DM-i:2021|S6:2011-2017|Seal 06 DM-i:2024|Seal U DM-i:2024|Sealion 6 DM-i:2024|Song Plus DM-i:2020|Tang DM:2015",
  "Cadillac": "ATS:2012-2019|BLS:2006-2010|CT4:2019|CT5:2019|CT6:2015-2020|CTS:2002-2019|Escalade:1998|SRX:2003-2016|STS:2004-2011|XT4:2018|XT5:2016|XT6:2019",
  "Changan": "Alsvin:2014|CS35:2012|CS55:2017|CS75:2013|CS85:2019|Eado:2012|Hunter:2021|UNI-K:2021|UNI-T:2020",
  "Chery": "Arrizo 5:2016|Arrizo 8:2022|QQ:2003-2015|Tiggo 2:2017|Tiggo 3:2014|Tiggo 4:2017|Tiggo 7:2016|Tiggo 7 Pro:2020|Tiggo 8:2018|Tiggo 8 Pro:2020|Tiggo 9:2023",
  "Chevrolet": "Aveo:2002-2020|Blazer:2019|Camaro:1967-2024|Captiva:2006-2018|Colorado:2004|Corvette:1953|Cruze:2008-2019|Epica:2006-2011|Equinox:2004|Evanda:2004-2006|Impala:1958-2020|Kalos:2002-2008|Lacetti:2002-2009|Malibu:1997-2025|Niva:2002-2020|Onix:2012|Orlando:2010-2018|Silverado:1998|Sonic:2011-2020|Spark:1998-2022|Suburban:1935|Tahoe:1995|Tracker:2019|Trailblazer:2001|Traverse:2008|Trax:2013",
  "Chrysler": "300C:2004-2023|Crossfire:2003-2008|Grand Voyager:2008-2016|Neon:1994-2005|Pacifica:2016|PT Cruiser:2000-2010|Sebring:1995-2010|Voyager:1988-2016",
  "Citroën": "Berlingo:1996|C1:2005-2022|C2:2003-2009|C3:2002|C3 Aircross:2017|C3 Picasso:2009-2017|C4:2004|C4 Cactus:2014-2020|C4 Picasso:2006-2022|C4 X:2022|C5:2001-2017|C5 Aircross:2018|C5 X:2021|C6:2005-2012|C-Crosser:2007-2012|C-Elysée:2012-2022|DS3:2009-2015|DS4:2011-2015|DS5:2011-2015|Jumper:1994|Jumpy:1995|Nemo:2008-2017|Saxo:1996-2004|SpaceTourer:2016|Xantia:1993-2001|Xsara:1997-2006|Xsara Picasso:1999-2012",
  "Cupra": "Ateca:2018|Formentor:2020|Leon:2020|Terramar:2024",
  "Dacia": "Bigster:2025|Dokker:2012-2021|Duster:2010|Jogger:2021|Lodgy:2012-2022|Logan:2004|Sandero:2008|Sandero Stepway:2009|Solenza:2003-2005",
  "Daewoo": "Espero:1990-1999|Kalos:2002-2004|Lacetti:2002-2004|Lanos:1997-2008|Leganza:1997-2002|Matiz:1998-2015|Nexia:1994-2016|Nubira:1997-2002|Tacuma:2000-2004|Tico:1991-2001",
  "Daihatsu": "Charade:1977-2013|Copen:2002|Cuore:1980-2012|Materia:2006-2012|Rocky:1984-2002|Sirion:1998-2015|Terios:1997-2017|YRV:2000-2005",
  "Dodge": "Avenger:2007-2014|Caliber:2006-2012|Challenger:2008-2023|Charger:2005-2023|Dart:2012-2016|Durango:1997|Grand Caravan:1984-2020|Hornet:2022|Journey:2008-2020|Nitro:2007-2012|Viper:1991-2017",
  "DS": "DS 3 Crossback:2019-2022|DS 3:2023|DS 4:2021|DS 5:2015-2018|DS 7:2017|DS 9:2020",
  "Ferrari": "12Cilindri:2024|296:2021|360:1999-2005|458:2009-2015|488:2015-2019|599:2006-2012|612 Scaglietti:2004-2011|812:2017-2024|California:2008-2017|F430:2004-2009|F8:2019-2023|FF:2011-2016|GTC4Lusso:2016-2020|Portofino:2017-2024|Purosangue:2022|Roma:2020|SF90:2019",
  "Fiat": "500:2007|500L:2012-2022|500X:2014|600:2023|Albea:2002-2012|Argo:2017|Barchetta:1995-2005|Brava:1995-2001|Bravo:1995-2014|Coupé:1993-2000|Croma:2005-2011|Cronos:2018|Doblo:2000|Ducato:1981|Egea:2015|Egea Cross:2020|Fastback:2022|Fiorino:2007|Freemont:2011-2016|Fullback:2016-2019|Grande Panda:2025|Idea:2003-2012|Linea:2007-2018|Marea:1996-2007|Multipla:1998-2010|Palio:1996-2018|Panda:1980|Pulse:2021|Punto:1993-2018|Qubo:2008-2019|Scudo:1995|Sedici:2005-2014|Seicento:1998-2010|Siena:1996-2016|Stilo:2001-2010|Strada:1996|Talento:2016-2020|Tempra:1990-1998|Tipo:2015|Toro:2016|Ulysse:1994-2010|Uno:1983-2013",
  "Ford": "B-Max:2012-2017|Bronco:2021|Bronco Sport:2020|C-Max:2003-2019|EcoSport:2003|Edge:2006|Escape:2000|Escort:1968-2004|Everest:2003|Expedition:1996|Explorer:1990|F-150:1975|Fiesta:1976-2023|Figo:2010-2021|Focus:1998-2025|Fusion:2002-2020|Galaxy:1995-2023|Ka:1996-2021|Ka+:2014-2021|Kuga:2008|Maverick:2021|Mondeo:1993-2022|Mustang:1964|Puma:2019|Ranger:1983|S-Max:2006-2023|Taurus:1986-2019|Territory:2004|Tourneo Connect:2002|Tourneo Courier:2014|Tourneo Custom:2012|Transit:1965|Transit Connect:2002|Transit Courier:2014|Transit Custom:2012",
  "Genesis": "G70:2017|G80:2016|G90:2015|GV70:2020|GV80:2020",
  "Geely": "Atlas:2016|Azkarra:2019|Coolray:2018|Emgrand:2009|MK:2006-2016|Monjaro:2021|Okavango:2020|Preface:2020|Tugella:2019",
  "GMC": "Acadia:2006|Canyon:2004|Savana:1995|Sierra:1998|Terrain:2009|Yukon:1991",
  "Great Wall": "Hover:2005-2016|Poer:2019|Steed:2006|Wingle:2006",
  "Haval": "Dargo:2020|F7:2019|H2:2014-2021|H6:2011|H9:2014|Jolion:2020",
  "Honda": "Accord:1976|City:1981|Civic:1972|CR-V:1995|CR-Z:2010-2016|FR-V:2004-2009|HR-V:1998|Insight:1999-2022|Jazz:2001|Legend:1985-2022|NSX:1990-2022|Odyssey:1994|Passport:2019|Pilot:2002|Prelude:1978-2001|Ridgeline:2005|S2000:1999-2009|Shuttle:1994-2022|Stream:2000-2014|WR-V:2017|ZR-V:2022",
  "Hyundai": "Accent:1994-2022|Accent Blue:2011-2018|Accent Era:2006-2012|Atos:1997-2014|Bayon:2021|Coupe:1996-2009|Creta:2014|Elantra:1990|Genesis:2008-2016|Getz:2002-2011|Grandeur:1986|H-1:1997-2021|i10:2007|i20:2008|i30:2007|i40:2011-2019|Ioniq:2016-2022|ix20:2010-2019|ix35:2009-2015|Kona:2017|Matrix:2001-2010|Palisade:2018|Santa Fe:2000|Sonata:1985|Staria:2021|Terracan:2001-2007|Trajet:1999-2008|Tucson:2004|Veloster:2011-2022|Venue:2019",
  "Infiniti": "FX:2003-2013|G:2002-2013|Q30:2015-2019|Q50:2013|Q60:2016-2022|Q70:2013-2019|QX30:2016-2019|QX50:2013|QX60:2012|QX70:2013-2017|QX80:2010",
  "Isuzu": "D-Max:2002|MU-X:2013|Rodeo:1988-2004|Trooper:1981-2005",
  "Jaecoo": "7:2023|8:2024",
  "Jaguar": "E-Pace:2017|F-Pace:2016|F-Type:2013|S-Type:1999-2008|X-Type:2001-2009|XE:2015|XF:2007|XJ:1968-2019|XK:1996-2014",
  "Jeep": "Avenger:2023|Cherokee:1974|Commander:2006-2010|Compass:2006|Gladiator:2019|Grand Cherokee:1992|Liberty:2001-2012|Patriot:2006-2017|Renegade:2014|Wagoneer:2021|Wrangler:1986",
  "Kia": "Carens:1999|Carnival:1998|Ceed:2006|Cerato:2003|Clarus:1996-2001|K5:2019|Magentis:2000-2010|Niro:2016|Opirus:2003-2011|Optima:2000-2020|Picanto:2004|Pregio:1995-2006|Pride:1987-2000|ProCeed:2018|Rio:1999|Seltos:2019|Sephia:1992-2003|Shuma:1996-2004|Sonet:2020|Sorento:2002|Soul:2008|Sportage:1993|Stinger:2017-2023|Stonic:2017|Telluride:2019|Venga:2010-2019|XCeed:2019",
  "KGM / SsangYong": "Actyon:2005|Korando:1983|Kyron:2005-2011|Musso:1993|Rexton:2001|Rodius:2004-2019|Tivoli:2015|Torres:2022|XLV:2016",
  "Lada": "110:1995-2009|Granta:2011|Kalina:2004-2018|Largus:2012|Niva:1977|Niva Travel:2020|Priora:2007-2018|Riva:1980-2012|Samara:1984-2013|Vesta:2015|XRAY:2015-2022",
  "Lamborghini": "Aventador:2011-2022|Gallardo:2003-2013|Huracán:2014-2024|Murciélago:2001-2010|Revuelto:2023|Temerario:2024|Urus:2018",
  "Lancia": "Dedra:1989-1999|Delta:1979-2014|Kappa:1994-2000|Lybra:1999-2005|Musa:2004-2012|Phedra:2002-2010|Thema:2011-2014|Thesis:2002-2009|Voyager:2011-2015|Ypsilon:1985",
  "Land Rover": "Defender:1983|Discovery:1989|Discovery Sport:2014|Freelander:1997-2015|Range Rover:1970|Range Rover Evoque:2011|Range Rover Sport:2005|Range Rover Velar:2017",
  "Lexus": "CT:2010-2022|ES:1989|GS:1993-2020|GX:2002|IS:1998|LBX:2023|LC:2017|LM:2019|LS:1989|LX:1995|NX:2014|RC:2014|RX:1998|UX:2018",
  "Lincoln": "Aviator:2002|Continental:1939-2020|Corsair:2019|MKX:2006-2018|MKZ:2006-2020|Nautilus:2018|Navigator:1997|Town Car:1981-2011",
  "Mahindra": "Bolero:2000|KUV100:2016|Marazzo:2018|Scorpio:2002|Thar:2010|XUV 3XO:2024|XUV300:2019|XUV500:2011-2021|XUV700:2021",
  "Maserati": "Ghibli:2013-2024|GranCabrio:2009|GranTurismo:2007|Grecale:2022|Levante:2016-2024|MC20:2020|Quattroporte:1963",
  "Mazda": "121:1987-2003|2:1996|3:2003|323:1977-2003|5:2005-2018|6:2002|626:1970-2002|BT-50:2006|CX-3:2015|CX-30:2019|CX-5:2012|CX-60:2022|CX-7:2006-2012|CX-80:2024|CX-9:2006-2023|CX-90:2023|MX-30:2020|MX-5:1989|Premacy:1999-2018|RX-8:2003-2012|Tribute:2000-2011",
  "Mercedes-Benz": "A Serisi:1997|AMG GT:2014|B Serisi:2005|C Serisi:1993|Citan:2012|CLA:2013|CLK:1997-2010|CLS:2004-2023|E Serisi:1993|G Serisi:1979|GL:2006-2015|GLA:2013|GLB:2019|GLC:2015|GLE:2015|GLK:2008-2015|GLS:2015|M Serisi:1997-2015|S Serisi:1972|SL:1954|SLC:2016-2020|SLK:1996-2016|Sprinter:1995|T Serisi:2022|V Serisi:1996|Vaneo:2002-2005|Viano:2003-2014|Vito:1996|X Serisi:2017-2020",
  "MG": "HS:2018|MG3:2011|MG5:2012|MG6:2010|MG7:2023|MGF:1995-2002|One:2021|RX5:2016|TF:2002-2011|ZR:2001-2005|ZS:2017|ZT:2001-2005",
  "Mini": "Cabrio:2004|Clubman:2007|Cooper:2001|Countryman:2010|Coupé:2011-2015|Paceman:2012-2016|Roadster:2012-2015",
  "Mitsubishi": "ASX:2010|Attrage:2012|Carisma:1995-2004|Colt:1962|Eclipse Cross:2017|Galant:1969-2012|Grandis:2003-2011|L200:1978|Lancer:1973-2017|Mirage:1978|Outlander:2001|Pajero:1982-2021|Pajero Sport:1996|Space Star:1998|Space Wagon:1983-2004|Xpander:2017",
  "Nissan": "350Z:2002-2009|370Z:2009-2020|Almera:1995|Altima:1992|Armada:2003|Cube:1998-2019|Evalia:2012-2018|Frontier:1997|GT-R:2007|Juke:2010|Kicks:2016|Magnite:2020|Maxima:1981-2023|Micra:1982|Murano:2002|Navara:1997|Note:2004|NV200:2009|NV300:2016-2021|Pathfinder:1985|Patrol:1951|Primastar:2002|Primera:1990-2008|Pulsar:1978-2018|Qashqai:2006|Rogue:2007|Sentra:1982|Sunny:1966-2019|Teana:2003-2020|Terrano:1986-2006|Tiida:2004|Townstar:2021|X-Trail:2000|Z:2022",
  "Omoda": "5:2022|9:2024",
  "Opel": "Adam:2012-2019|Agila:2000-2014|Antara:2006-2015|Astra:1991|Calibra:1989-1997|Cascada:2013-2019|Combo:1986|Corsa:1982|Crossland:2017|Frontera:1991|Grandland:2017|GT:2007-2009|Insignia:2008-2022|Karl:2015-2019|Meriva:2003-2017|Mokka:2012|Movano:1998|Omega:1986-2003|Signum:2003-2008|Tigra:1994-2009|Vectra:1988-2008|Vivaro:2001|Zafira:1999|Zafira Tourer:2011-2019",
  "Perodua": "Alza:2009|Aruz:2019|Ativa:2021|Axia:2014|Bezza:2016|Kancil:1994-2009|Myvi:2005",
  "Peugeot": "1007:2004-2009|106:1991-2003|107:2005-2014|108:2014-2021|2008:2013|205:1983-1998|206:1998-2012|207:2006-2014|208:2012|301:2012-2023|306:1993-2002|307:2001-2011|308:2007|3008:2008|405:1987-1997|406:1995-2004|407:2004-2011|408:2010|4007:2007-2012|4008:2012-2017|508:2010|5008:2009|605:1989-1999|607:1999-2010|806:1994-2002|807:2002-2014|Bipper:2008-2017|Boxer:1994|Expert:1995|Landtrek:2020|Partner:1996|RCZ:2010-2015|Rifter:2018|Traveller:2016",
  "Porsche": "911:1963|Boxster:1996|Cayenne:2002|Cayman:2005|Macan:2014|Panamera:2009",
  "Proton": "Exora:2009|Gen-2:2004-2012|Iriz:2014|Persona:1993|Preve:2012-2021|Saga:1985|Wira:1993-2009|X50:2020|X70:2018",
  "RAM": "1500:2009|2500:2009|3500:2009|ProMaster:2013|ProMaster City:2015-2022",
  "Renault": "12 Toros:1971-2000|19:1988-2000|9:1981-2000|Arkana:2019|Austral:2022|Captur:2013|Clio:1990|Duster:2010|Espace:1984|Express:2021|Fluence:2009-2016|Grand Scenic:2004-2022|Kadjar:2015-2022|Kangoo:1997|Kiger:2021|Koleos:2006|Kwid:2015|Laguna:1993-2015|Latitude:2010-2015|Master:1980|Megane:1995|Modus:2004-2012|Rafale:2024|Safrane:1992-2000|Scenic:1996|Symbol:1999|Talisman:2015-2022|Taliant:2021|Trafic:1980|Twingo:1992-2024|Vel Satis:2002-2009",
  "Rolls-Royce": "Cullinan:2018|Dawn:2015-2023|Ghost:2009|Phantom:2003|Wraith:2013-2023",
  "Rover": "200:1984-1999|25:1999-2005|400:1990-1999|45:1999-2005|600:1993-1999|75:1998-2005",
  "Saab": "900:1978-1998|9000:1984-1998|9-3:1998-2014|9-5:1997-2012",
  "Seat": "Alhambra:1996-2020|Altea:2004-2015|Arona:2017|Arosa:1997-2004|Ateca:2016|Cordoba:1993-2009|Exeo:2008-2013|Ibiza:1984|Leon:1999|Mii:2011-2019|Tarraco:2018|Toledo:1991-2019",
  "Skoda": "Citigo:2011-2020|Fabia:1999|Felicia:1994-2001|Kamiq:2019|Karoq:2017|Kodiaq:2016|Kushaq:2021|Octavia:1996|Rapid:2012-2019|Roomster:2006-2015|Scala:2019|Slavia:2021|Superb:2001|Yeti:2009-2017",
  "Smart": "Forfour:2004-2019|Fortwo:1998-2019|Roadster:2003-2005",
  "Subaru": "BRZ:2012|Forester:1997|Impreza:1992|Justy:1984-2011|Legacy:1989|Levorg:2014|Outback:1994|Tribeca:2005-2014|WRX:2014|XV:2011",
  "Suzuki": "Across:2020|Alto:1979|Baleno:1995|Celerio:2008|Ciaz:2014|Dzire:2008|Ertiga:2012|Fronx:2023|Grand Vitara:1998|Ignis:2000|Jimny:1970|Kizashi:2009-2016|Liana:2001-2007|Samurai:1981-2004|S-Cross:2013|Splash:2008-2015|Swace:2020|Swift:1983|SX4:2006|Vitara:1988|Wagon R:1993",
  "Tata": "Altroz:2020|Harrier:2019|Hexa:2017-2020|Indica:1998-2018|Indigo:2002-2018|Nexon:2017|Punch:2021|Safari:1998|Sumo:1994-2019|Tiago:2016|Tigor:2017|Xenon:2006-2020",
  "Tofaş": "Doğan:1985-2002|Kartal:1985-2002|Şahin:1981-2002",
  "Toyota": "4Runner:1984|Auris:2006-2018|Avalon:1994-2022|Avensis:1997-2018|Aygo:2005-2022|Aygo X:2022|C-HR:2016|Camry:1982|Carina:1970-2001|Celica:1970-2006|Corolla:1966|Corolla Cross:2020|Corolla Verso:2001-2009|Crown:1955|Fortuner:2005|GR Yaris:2020|GT86:2012|Hiace:1967|Highlander:2000|Hilux:1968|Innova:2004|Land Cruiser:1951|Land Cruiser Prado:1990|Matrix:2002-2014|Previa:1990-2019|Prius:1997|Prius+:2011-2021|Proace:2013|Proace City:2019|RAV4:1994|Sequoia:2000|Sienna:1997|Starlet:1973-1999|Supra:1978|Tacoma:1995|Tundra:1999|Urban Cruiser:2008-2016|Venza:2008|Verso:2009-2018|Vios:2002|Yaris:1999|Yaris Cross:2020",
  "Volkswagen": "Amarok:2010|Arteon:2017-2024|Atlas:2017|Atlas Cross Sport:2019|Beetle:1997-2019|Bora:1998-2005|Caddy:1980|California:1988|Caravelle:1990|CC:2008-2016|Crafter:2006|Eos:2006-2015|Fox:2003-2021|Golf:1974|Golf Plus:2005-2014|Golf Sportsvan:2014-2020|Jetta:1979|Lupo:1998-2005|Multivan:1985|Passat:1973|Phaeton:2002-2016|Polo:1975|Polo Sedan:2010-2020|Scirocco:1974-2017|Sharan:1995-2022|T-Cross:2019|T-Roc:2017|Taigo:2021|Taos:2021|Tera:2024|Tiguan:2007|Tiguan Allspace:2017-2024|Touareg:2002|Touran:2003|Transporter:1950|Up:2011-2023|Vento:1991|Virtus:2017",
  "Volvo": "850:1991-1997|C30:2006-2013|C70:1996-2013|S40:1995-2012|S60:2000|S80:1998-2016|S90:2016|V40:1995-2019|V50:2004-2012|V60:2010|V70:1996-2016|V90:2016|XC40:2017|XC60:2008|XC70:1997-2016|XC90:2002"
};

// Türkiye'de en çok aranan markalar listenin başında ayrıca gösterilir.
var POPULAR_BRANDS = ["Fiat", "Renault", "Volkswagen", "Toyota", "Ford", "Hyundai", "Peugeot", "Opel", "Dacia", "Honda", "Citroën", "Skoda", "BMW", "Mercedes-Benz", "Kia", "Nissan", "Audi", "Seat"];

var CAR_MIN_YEAR = 1995;

function carBrands() {
  return Object.keys(CAR_DB).sort(function (a, b) { return a.localeCompare(b, "tr"); });
}

// [{ name, from, to }] — yalnızca 1995 ve sonrası üretilenler, ada göre sıralı.
var carModelCache = {};
function carModels(brand) {
  if (!carModelCache[brand]) {
    carModelCache[brand] = CAR_DB[brand].split("|").map(function (s) {
      var m = s.match(/^(.*):(\d{4})(?:-(\d{4}))?$/);
      return { name: m[1], from: +m[2], to: m[3] ? +m[3] : null };
    }).filter(function (m) {
      return !m.to || m.to >= CAR_MIN_YEAR;
    }).sort(function (a, b) {
      return a.name.localeCompare(b.name, "tr", { numeric: true });
    });
  }
  return carModelCache[brand];
}
