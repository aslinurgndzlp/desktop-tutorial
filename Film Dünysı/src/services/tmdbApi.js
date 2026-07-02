import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';

// Get API credentials from environment variables
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN || '';

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: 'application/json',
    ...(ACCESS_TOKEN ? { Authorization: `Bearer ${ACCESS_TOKEN}` } : {}),
  },
});

// Interceptor to inject api_key if Bearer token is not present
tmdbClient.interceptors.request.use((config) => {
  if (!ACCESS_TOKEN && API_KEY) {
    config.params = {
      ...config.params,
      api_key: API_KEY,
    };
  }
  if (!config.params?.language) {
    config.params = {
      ...config.params,
      language: 'tr-TR',
    };
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Check if TMDB API is properly configured by the user
const isApiConfigured = () => {
  const hasKey = API_KEY && API_KEY !== 'your_api_key_here' && API_KEY.trim() !== '';
  const hasToken = ACCESS_TOKEN && ACCESS_TOKEN.trim() !== '';
  return hasKey || hasToken;
};

// ==========================================
// CURATED MOCK MOVIE DATABASE (Trending/Popular/Top Rated)
// ==========================================
const MOCK_MOVIES = [
  {
    id: 101,
    title: 'Inception (Başlangıç)',
    tagline: 'Zihniniz suç mahallidir.',
    overview: 'Çok yetenekli bir hırsız olan Dom Cobb\'un uzmanlık alanı, zihnin en savunmasız olduğu rüya görme anında, bilinçaltının derinliklerindeki değerli sırları çekip çıkarmak ve çalmaktır. Cobb\'un bu ender yeteneği, onu kurumsal casusluğun tehlikeli yeni dünyasında aranan bir oyuncu yapmış ama aynı zamanda kaçak durumuna düşürmüştür.',
    poster_path: '/mock/inception/poster',
    backdrop_path: '/mock/inception/backdrop',
    vote_average: 8.8,
    release_date: '2010-07-16',
    genres: [{ id: 28, name: 'Aksiyon' }, { id: 878, name: 'Bilim Kurgu' }, { id: 12, name: 'Macera' }],
    runtime: 148,
    director: 'Christopher Nolan',
    production_companies: [{ id: 1, name: 'Warner Bros. Pictures' }, { id: 2, name: 'Syncopy' }],
    trailer_key: 'YoHD9XEInc0',
    cast: [
      { id: 501, name: 'Leonardo DiCaprio', character: 'Dom Cobb', profile_path: '/mock/cast/leo' },
      { id: 502, name: 'Joseph Gordon-Levitt', character: 'Arthur', profile_path: '/mock/cast/joseph' },
      { id: 503, name: 'Elliot Page', character: 'Ariadne', profile_path: '/mock/cast/elliot' },
      { id: 504, name: 'Tom Hardy', character: 'Eames', profile_path: '/mock/cast/tom' },
      { id: 505, name: 'Ken Watanabe', character: 'Saito', profile_path: '/mock/cast/ken' },
      { id: 506, name: 'Cillian Murphy', character: 'Robert Fischer', profile_path: '/mock/cast/cillian' }
    ]
  },
  {
    id: 102,
    title: 'Interstellar (Yıldızlararası)',
    tagline: 'İnsanlık Dünya\'da doğdu ama burada ölmek zorunda değil.',
    overview: 'Teknik becerisi yüksek olan eski bir pilot ve çiftçi olan Cooper, ailesiyle birlikte tarım yaparak geçinmektedir. Dünyada artan kuraklık ve toz fırtınaları insanlığı yok olma tehlikesiyle karşı karşıya bırakmıştır. NASA\'nın gizli bir projesinde çalışan bilim insanları, yaşanabilir yeni bir gezegen bulmak amacıyla başka bir galaksiye geçit sağlayan bir solucan deliği keşfederler.',
    poster_path: '/mock/interstellar/poster',
    backdrop_path: '/mock/interstellar/backdrop',
    vote_average: 8.7,
    release_date: '2014-11-05',
    genres: [{ id: 878, name: 'Bilim Kurgu' }, { id: 18, name: 'Dram' }, { id: 12, name: 'Macera' }],
    runtime: 169,
    director: 'Christopher Nolan',
    production_companies: [{ id: 3, name: 'Legendary Pictures' }, { id: 2, name: 'Syncopy' }, { id: 4, name: 'Lynda Obst Productions' }],
    trailer_key: 'zSWdZAeeCgs',
    cast: [
      { id: 511, name: 'Matthew McConaughey', character: 'Cooper', profile_path: '/mock/cast/matthew' },
      { id: 512, name: 'Anne Hathaway', character: 'Brand', profile_path: '/mock/cast/anne' },
      { id: 513, name: 'Jessica Chastain', character: 'Murph', profile_path: '/mock/cast/jessica' },
      { id: 514, name: 'Michael Caine', character: 'Profesör Brand', profile_path: '/mock/cast/caine' },
      { id: 506, name: 'Cillian Murphy', character: 'Yetişkin Tom', profile_path: '/mock/cast/cillian' },
      { id: 515, name: 'Matt Damon', character: 'Dr. Mann', profile_path: '/mock/cast/damon' }
    ]
  },
  {
    id: 103,
    title: 'The Dark Knight (Kara Şövalye)',
    tagline: 'Kaos neden bu kadar ciddi?',
    overview: 'Batman, Teğmen Gordon ve Savcı Harvey Dent\'in yardımıyla Gotham sokaklarını suç örgütlerinden temizlemeye başlar. Bu ortaklık oldukça başarılı sonuçlar vermektedir. Ancak ansızın ortaya çıkan Joker adlı zeki ve acımasız bir suçlu, Gotham halkını terörize ederek Batman\'i adalet ile intikam arasındaki o ince çizgide yürümeye zorlar.',
    poster_path: '/mock/darkknight/poster',
    backdrop_path: '/mock/darkknight/backdrop',
    vote_average: 9.0,
    release_date: '2008-07-16',
    genres: [{ id: 28, name: 'Aksiyon' }, { id: 80, name: 'Suç' }, { id: 18, name: 'Dram' }],
    runtime: 152,
    director: 'Christopher Nolan',
    production_companies: [{ id: 1, name: 'Warner Bros. Pictures' }, { id: 3, name: 'Legendary Pictures' }, { id: 2, name: 'Syncopy' }],
    trailer_key: 'EXeTwQWrcwY',
    cast: [
      { id: 521, name: 'Christian Bale', character: 'Bruce Wayne / Batman', profile_path: '/mock/cast/christian' },
      { id: 522, name: 'Heath Ledger', character: 'Joker', profile_path: '/mock/cast/heath' },
      { id: 523, name: 'Aaron Eckhart', character: 'Harvey Dent / Two-Face', profile_path: '/mock/cast/aaron' },
      { id: 524, name: 'Gary Oldman', character: 'Jim Gordon', profile_path: '/mock/cast/gary' },
      { id: 525, name: 'Maggie Gyllenhaal', character: 'Rachel Dawes', profile_path: '/mock/cast/maggie' },
      { id: 514, name: 'Michael Caine', character: 'Alfred Pennyworth', profile_path: '/mock/cast/caine' }
    ]
  },
  {
    id: 104,
    title: 'Avatar: Suyun Yolu',
    tagline: 'Yeni bir dünya, yeni bir ev.',
    overview: 'İlk filmdeki olayların üzerinden on yıldan fazla bir süre geçmiştir. Jake Sully ve Neytiri bir aile kurmuşlardır ve yuvalarını korumak için birlikte el ele vermektedirler. Ancak eski bir tehdit yarım kalan işi bitirmek için Pandora\'ya geri döndüğünde, Sully ailesi evlerini terk etmek ve Pandora\'nın farklı bölgelerini keşfetmek zorunda kalır.',
    poster_path: '/mock/avatar/poster',
    backdrop_path: '/mock/avatar/backdrop',
    vote_average: 7.6,
    release_date: '2022-12-14',
    genres: [{ id: 878, name: 'Bilim Kurgu' }, { id: 12, name: 'Macera' }, { id: 28, name: 'Aksiyon' }],
    runtime: 192,
    director: 'James Cameron',
    production_companies: [{ id: 5, name: '20th Century Studios' }, { id: 6, name: 'Lightstorm Entertainment' }],
    trailer_key: 'd9MyW72ELq0',
    cast: [
      { id: 531, name: 'Sam Worthington', character: 'Jake Sully', profile_path: '/mock/cast/sam' },
      { id: 532, name: 'Zoe Saldana', character: 'Neytiri', profile_path: '/mock/cast/zoe' },
      { id: 533, name: 'Sigourney Weaver', character: 'Kiri', profile_path: '/mock/cast/sigourney' },
      { id: 534, name: 'Kate Winslet', character: 'Ronal', profile_path: '/mock/cast/kate' }
    ]
  },
  {
    id: 105,
    title: 'The Matrix (Matris)',
    tagline: 'Gerçeklik bir algı illüzyonudur.',
    overview: 'Saygın bir yazılım firmasında çalışan bilgisayar programcısı Thomas Anderson, gecelerini "Neo" takma adıyla hackerlık yaparak geçirir. Kendisini gizemli bir şekilde izleyen Trinity ve Morpheus ile tanıştığında, içinde yaşadığı dünyanın aslında yapay zekaya sahip makineler tarafından insanlığı köleleştirmek için yaratılmış bir simülasyon olduğunu öğrenir.',
    poster_path: '/mock/matrix/poster',
    backdrop_path: '/mock/matrix/backdrop',
    vote_average: 8.7,
    release_date: '1999-03-30',
    genres: [{ id: 878, name: 'Bilim Kurgu' }, { id: 28, name: 'Aksiyon' }],
    runtime: 136,
    director: 'Lana Wachowski',
    production_companies: [{ id: 1, name: 'Warner Bros. Pictures' }, { id: 7, name: 'Village Roadshow Pictures' }],
    trailer_key: 'm8e-FF8MsqU',
    cast: [
      { id: 541, name: 'Keanu Reeves', character: 'Thomas Anderson / Neo', profile_path: '/mock/cast/keanu' },
      { id: 542, name: 'Laurence Fishburne', character: 'Morpheus', profile_path: '/mock/cast/laurence' },
      { id: 543, name: 'Carrie-Anne Moss', character: 'Trinity', profile_path: '/mock/cast/carrie' },
      { id: 544, name: 'Hugo Weaving', character: 'Ajan Smith', profile_path: '/mock/cast/hugo' }
    ]
  },
  {
    id: 106,
    title: 'Dune: Çöl Gezegeni',
    tagline: 'Korku aklın katilidir.',
    overview: 'Asil bir aile olan Atreides Hanedanı, İmparator tarafından galaksinin en değerli maddesi olan "baharat"ın tek kaynağı olan tehlikeli çöl gezegeni Arrakis\'i yönetmekle görevlendirilir. Ancak bu görev, rakip aile Harkonnenlerin hain pusularını ve gezegenin devasa solucanlarının tehlikelerini beraberinde getirecektir. Genç Paul Atreides, halkının geleceğini korumak için çöle kaçmak zorundadır.',
    poster_path: '/mock/dune/poster',
    backdrop_path: '/mock/dune/backdrop',
    vote_average: 7.8,
    release_date: '2021-09-15',
    genres: [{ id: 878, name: 'Bilim Kurgu' }, { id: 12, name: 'Macera' }],
    runtime: 155,
    director: 'Denis Villeneuve',
    production_companies: [{ id: 3, name: 'Legendary Pictures' }],
    trailer_key: '8g18jFHCLWY',
    cast: [
      { id: 551, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: '/mock/cast/timothee' },
      { id: 552, name: 'Rebecca Ferguson', character: 'Lady Jessica Atreides', profile_path: '/mock/cast/rebecca' },
      { id: 553, name: 'Oscar Isaac', character: 'Dük Leto Atreides', profile_path: '/mock/cast/oscar' },
      { id: 554, name: 'Zendaya', character: 'Chani', profile_path: '/mock/cast/zendaya' },
      { id: 555, name: 'Jason Momoa', character: 'Duncan Idaho', profile_path: '/mock/cast/jason' }
    ]
  },
  {
    id: 107,
    title: 'Oppenheimer',
    tagline: 'Dünya sonsuza dek değişecek.',
    overview: 'Amerikalı teorik fizikçi J. Robert Oppenheimer\'ın hayatına ve İkinci Dünya Savaşı sırasında dünyayı kurtarmak (ve aynı zamanda yok etme potansiyeline sahip olmak) amacıyla gizli Los Alamos Laboratuvarı\'nda ilk nükleer silahı geliştiren Manhattan Projesi\'ne liderlik etme sürecine odaklanıyor.',
    poster_path: '/mock/oppenheimer/poster',
    backdrop_path: '/mock/oppenheimer/backdrop',
    vote_average: 8.1,
    release_date: '2023-07-19',
    genres: [{ id: 18, name: 'Dram' }, { id: 36, name: 'Tarih' }],
    runtime: 180,
    director: 'Christopher Nolan',
    production_companies: [{ id: 8, name: 'Universal Pictures' }, { id: 2, name: 'Syncopy' }],
    trailer_key: 'bK6ld50G4n0',
    cast: [
      { id: 506, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', profile_path: '/mock/cast/cillian' },
      { id: 561, name: 'Emily Blunt', character: 'Kitty Oppenheimer', profile_path: '/mock/cast/emily' },
      { id: 562, name: 'Matt Damon', character: 'Leslie Groves', profile_path: '/mock/cast/damon2' },
      { id: 563, name: 'Robert Downey Jr.', character: 'Lewis Strauss', profile_path: '/mock/cast/rdj' },
      { id: 564, name: 'Florence Pugh', character: 'Jean Tatlock', profile_path: '/mock/cast/florence' }
    ]
  },
  {
    id: 108,
    title: 'Gladyatör',
    tagline: 'Bir general köleye dönüştü. Bir köle gladyatör oldu. Bir gladyatör bir imparatora meydan okudu.',
    overview: 'Roma İmparatorluğu\'nun en başarılı generali olan Maximus Decimus Meridius, tahtın varisi hırslı Commodus tarafından ihanete uğrar. Ailesi katledilen ve kendisi köle olarak satılan Maximus, arenalarda dövüşen bir gladyatör olarak yükselerek Roma\'ya döner. Tek amacı imparator Commodus\'tan intikamını almaktır.',
    poster_path: '/mock/gladiator/poster',
    backdrop_path: '/mock/gladiator/backdrop',
    vote_average: 8.2,
    release_date: '2000-05-01',
    genres: [{ id: 28, name: 'Aksiyon' }, { id: 12, name: 'Macera' }, { id: 18, name: 'Dram' }],
    runtime: 155,
    director: 'Ridley Scott',
    production_companies: [{ id: 8, name: 'Universal Pictures' }, { id: 9, name: 'DreamWorks Pictures' }],
    trailer_key: 'P5ieIbInFpg',
    cast: [
      { id: 571, name: 'Russell Crowe', character: 'Maximus Decimus Meridius', profile_path: '/mock/cast/russell' },
      { id: 572, name: 'Joaquin Phoenix', character: 'Commodus', profile_path: '/mock/cast/joaquin' },
      { id: 573, name: 'Connie Nielsen', character: 'Lucilla', profile_path: '/mock/cast/connie' },
      { id: 574, name: 'Oliver Reed', character: 'Proximo', profile_path: '/mock/cast/oliver' }
    ]
  },
  {
    id: 109,
    title: 'Örümcek-Adam: Örümcek Evreninde',
    tagline: 'Maskeyi herkes takabilir.',
    overview: 'Brooklyn\'li genç Miles Morales, bir örümcek tarafından ısırıldıktan sonra süper güçler kazanır ve yeni Örümcek Adam olur. Çoklu evrenlerin kapıları aralandığında, diğer boyutlardan gelen farklı Örümcek kahramanlar (Peter Parker, Gwen Stacy, Spider-Ham vb.) onun evrenine çekilir. Miles, dünyayı yok olmaktan kurtarmak için onlarla birlik olmalıdır.',
    poster_path: '/mock/spiderman/poster',
    backdrop_path: '/mock/spiderman/backdrop',
    vote_average: 8.4,
    release_date: '2018-12-06',
    genres: [{ id: 16, name: 'Animasyon' }, { id: 878, name: 'Bilim Kurgu' }, { id: 28, name: 'Aksiyon' }],
    runtime: 117,
    director: 'Bob Persichetti',
    production_companies: [{ id: 10, name: 'Sony Pictures Animation' }, { id: 11, name: 'Marvel Entertainment' }],
    trailer_key: 'tg52up16eq0',
    cast: [
      { id: 581, name: 'Shameik Moore', character: 'Miles Morales (Ses)', profile_path: '/mock/cast/shameik' },
      { id: 582, name: 'Jake Johnson', character: 'Peter B. Parker (Ses)', profile_path: '/mock/cast/jake' },
      { id: 583, name: 'Hailee Steinfeld', character: 'Gwen Stacy (Ses)', profile_path: '/mock/cast/hailee' },
      { id: 584, name: 'Mahershala Ali', character: 'Uncle Aaron (Ses)', profile_path: '/mock/cast/mahershala' }
    ]
  },
  {
    id: 110,
    title: 'Pulp Fiction (Ucuz Roman)',
    tagline: 'Adalet yoldan çıkınca...',
    overview: 'Birbirinden bağımsız görünen ama yolları kesişen birkaç farklı öykünün anlatıldığı kült bir yapım. İki felsefi tetikçi, boksör Butch, mafya liderinin karısı Mia ve restoran soymaya kalkan aşık bir çiftin yolları ironik, şiddet dolu ve eğlenceli olaylarla birleşir.',
    poster_path: '/mock/pulpfiction/poster',
    backdrop_path: '/mock/pulpfiction/backdrop',
    vote_average: 8.9,
    release_date: '1994-09-10',
    genres: [{ id: 80, name: 'Suç' }, { id: 18, name: 'Dram' }],
    runtime: 154,
    director: 'Quentin Tarantino',
    production_companies: [{ id: 12, name: 'Miramax Films' }, { id: 13, name: 'A Band Apart' }],
    trailer_key: 's7MAto74Gzg',
    cast: [
      { id: 591, name: 'John Travolta', character: 'Vincent Vega', profile_path: '/mock/cast/john' },
      { id: 592, name: 'Samuel L. Jackson', character: 'Jules Winnfield', profile_path: '/mock/cast/samuel' },
      { id: 593, name: 'Uma Thurman', character: 'Mia Wallace', profile_path: '/mock/cast/uma' },
      { id: 594, name: 'Bruce Willis', character: 'Butch Coolidge', profile_path: '/mock/cast/bruce' }
    ]
  }
];

// ==========================================
// DISTINCT MOCK UPCOMING MOVIES DATABASE
// ==========================================
const MOCK_UPCOMING_MOVIES = [
  {
    id: 201,
    title: 'Dune: Bölüm İki',
    tagline: 'İntikam ve yükseliş.',
    overview: 'Paul Atreides, Chani ve Fremenlerle güçlerini birleştirerek hanedanını yok eden komploculardan intikam almak için savaş alanına döner. Hayatının aşkı ile bilinen evrenin kaderi arasında bir seçim yapmak zorunda kalan Paul, yalnızca kendisinin öngörebileceği korkunç bir geleceği engellemeye çalışır.',
    poster_path: '/mock/dune2/poster',
    backdrop_path: '/mock/dune2/backdrop',
    vote_average: 8.3,
    release_date: '2024-03-01',
    genres: [{ id: 878, name: 'Bilim Kurgu' }, { id: 12, name: 'Macera' }],
    runtime: 166,
    director: 'Denis Villeneuve',
    production_companies: [{ id: 3, name: 'Legendary Pictures' }],
    trailer_key: 'Way9DexNyGA',
    cast: [
      { id: 551, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: '/mock/cast/timothee' },
      { id: 554, name: 'Zendaya', character: 'Chani', profile_path: '/mock/cast/zendaya' },
      { id: 552, name: 'Rebecca Ferguson', character: 'Lady Jessica Atreides', profile_path: '/mock/cast/rebecca' },
      { id: 601, name: 'Austin Butler', character: 'Feyd-Rautha Harkonnen', profile_path: '/mock/cast/austin' },
      { id: 602, name: 'Florence Pugh', character: 'Prenses Irulan', profile_path: '/mock/cast/florence' }
    ]
  },
  {
    id: 202,
    title: 'Gladyatör II',
    tagline: 'Roma\'nın geleceği kanla yazılacak.',
    overview: 'Yıllar önce amcası Commodus tarafından öldürülen Maximus\'un kurtardığı Lucius, aradan geçen zamanda büyümüş ve gladyatör olmuştur. Roma İmparatorluğu\'nun yozlaşmış yöneticilerine meydan okumak ve halkını özgürleştirmek için arenalarda dövüşmek zorundadır.',
    poster_path: '/mock/gladiator2/poster',
    backdrop_path: '/mock/gladiator2/backdrop',
    vote_average: 7.2,
    release_date: '2024-11-22',
    genres: [{ id: 28, name: 'Aksiyon' }, { id: 12, name: 'Macera' }, { id: 18, name: 'Dram' }],
    runtime: 148,
    director: 'Ridley Scott',
    production_companies: [{ id: 8, name: 'Universal Pictures' }],
    trailer_key: '1V7sMH-K0lo',
    cast: [
      { id: 611, name: 'Paul Mescal', character: 'Lucius Verus', profile_path: '/mock/cast/paul' },
      { id: 612, name: 'Pedro Pascal', character: 'Marcus Acacius', profile_path: '/mock/cast/pedro' },
      { id: 613, name: 'Denzel Washington', character: 'Macrinus', profile_path: '/mock/cast/denzel' },
      { id: 573, name: 'Connie Nielsen', character: 'Lucilla', profile_path: '/mock/cast/connie' }
    ]
  },
  {
    id: 203,
    title: 'Deadpool & Wolverine',
    tagline: 'Evrenleri kurtarmak ciddi bir iştir (şaka şaka).',
    overview: 'Zaman Değişim Otoritesi (TVA), Deadpool\'u sakin hayatından çekip alarak Marvel Sinematik Evreni\'nin kaderini değiştirecek tehlikeli bir göreve gönderir. Deadpool, bu yolculukta isteksiz de olsa Wolverine\'i kendisine katılmaya ikna etmek zorundadır.',
    poster_path: '/mock/deadpool/poster',
    backdrop_path: '/mock/deadpool/backdrop',
    vote_average: 7.7,
    release_date: '2024-07-26',
    genres: [{ id: 28, name: 'Aksiyon' }, { id: 35, name: 'Komedi' }, { id: 878, name: 'Bilim Kurgu' }],
    runtime: 127,
    director: 'Shawn Levy',
    production_companies: [{ id: 11, name: 'Marvel Studios' }, { id: 14, name: 'Maximum Effort' }],
    trailer_key: '73_1biulkx0',
    cast: [
      { id: 621, name: 'Ryan Reynolds', character: 'Wade Wilson / Deadpool', profile_path: '/mock/cast/ryan' },
      { id: 622, name: 'Hugh Jackman', character: 'Logan / Wolverine', profile_path: '/mock/cast/hugh' },
      { id: 623, name: 'Emma Corrin', character: 'Cassandra Nova', profile_path: '/mock/cast/emma' }
    ]
  },
  {
    id: 204,
    title: 'Joker: İkili Delilik',
    tagline: 'Dünya bir sahnedir.',
    overview: 'Arthur Fleck, işlediği suçlar nedeniyle kapatıldığı Arkham Hastanesi\'nde yargılanmayı beklerken hayatının aşkı Harleen Quinzel (Harley Quinn) ile tanışır. İkili, içlerindeki müziği ve çılgınlığı keşfederek ortak bir kaosa yelken açar.',
    poster_path: '/mock/joker2/poster',
    backdrop_path: '/mock/joker2/backdrop',
    vote_average: 5.6,
    release_date: '2024-10-04',
    genres: [{ id: 18, name: 'Dram' }, { id: 80, name: 'Suç' }, { id: 10402, name: 'Müzik' }],
    runtime: 138,
    director: 'Todd Phillips',
    production_companies: [{ id: 1, name: 'Warner Bros. Pictures' }],
    trailer_key: 'xy8aJw1vYHo',
    cast: [
      { id: 572, name: 'Joaquin Phoenix', character: 'Arthur Fleck / Joker', profile_path: '/mock/cast/joaquin' },
      { id: 631, name: 'Lady Gaga', character: 'Harleen Quinzel / Harley Quinn', profile_path: '/mock/cast/gaga' },
      { id: 632, name: 'Zazie Beetz', character: 'Sophie Dumond', profile_path: '/mock/cast/zazie' }
    ]
  },
  {
    id: 205,
    title: 'Furiosa: Bir Mad Max Destanı',
    tagline: 'Karanlıktan doğdu.',
    overview: 'Dünya çökerken, genç Furiosa Yeşil Diyar\'dan kaçırılır ve Savaş Lordu Dementus liderliğindeki büyük bir Motorcu Sürüsü\'nün eline düşürülür. Çorak Topraklar\'da ilerlerken, Ölümsüz Joe\'nun başkanlık ettiği Kale ile karşılaşırlar. İki Tiran egemenlik için savaşırken, Furiosa eve dönüş yolunu bulmak için hayatta kalmalıdır.',
    poster_path: '/mock/furiosa/poster',
    backdrop_path: '/mock/furiosa/backdrop',
    vote_average: 7.6,
    release_date: '2024-05-24',
    genres: [{ id: 28, name: 'Aksiyon' }, { id: 12, name: 'Macera' }, { id: 878, name: 'Bilim Kurgu' }],
    runtime: 148,
    director: 'George Miller',
    production_companies: [{ id: 1, name: 'Warner Bros. Pictures' }],
    trailer_key: 'XJMuhwVlca4',
    cast: [
      { id: 641, name: 'Anya Taylor-Joy', character: 'Imperator Furiosa', profile_path: '/mock/cast/anya' },
      { id: 642, name: 'Chris Hemsworth', character: 'Dementus', profile_path: '/mock/cast/chris' },
      { id: 643, name: 'Tom Burke', character: 'Praetorian Jack', profile_path: '/mock/cast/burke' }
    ]
  },
  {
    id: 206,
    title: 'The Batman - Bölüm II',
    tagline: 'Gölgeler daha da büyüyecek.',
    overview: 'Gotham City\'nin karanlık sokaklarında adaleti sağlamaya devam eden Bruce Wayne, şehrin yeraltı dünyasındaki yeni güç dengeleriyle ve geçmişin gizli sırlarıyla yüzleşmek zorundadır.',
    poster_path: '/mock/batman2/poster',
    backdrop_path: '/mock/batman2/backdrop',
    vote_average: 0.0,
    release_date: '2026-10-02',
    genres: [{ id: 28, name: 'Aksiyon' }, { id: 80, name: 'Suç' }, { id: 9648, name: 'Gizem' }],
    runtime: 160,
    director: 'Matt Reeves',
    production_companies: [{ id: 1, name: 'Warner Bros. Pictures' }],
    trailer_key: 'dQw4w9WgXcQ',
    cast: [
      { id: 651, name: 'Robert Pattinson', character: 'Bruce Wayne / Batman', profile_path: '/mock/cast/robert' },
      { id: 652, name: 'Andy Serkis', character: 'Alfred Pennyworth', profile_path: '/mock/cast/serkis' },
      { id: 653, name: 'Jeffrey Wright', character: 'James Gordon', profile_path: '/mock/cast/jeffrey' }
    ]
  },
  {
    id: 207,
    title: 'Maymunlar Cehennemi: Yeni İmparatorluk',
    tagline: 'Yeni bir hükümranlık başlıyor.',
    overview: 'Sezar\'ın saltanatından nesiller sonra, maymunlar baskın tür olarak yükselirken insanlar gölgelerde yaşamaya mahkum olmuştur. Yeni ve zalim bir maymun lider kendi imparatorluğunu kurmak için diğer klanları köleleştirirken, genç bir maymun geçmişin sırlarını keşfetmek üzere tehlikeli bir yolculuğa çıkar.',
    poster_path: '/mock/apes/poster',
    backdrop_path: '/mock/apes/backdrop',
    vote_average: 7.1,
    release_date: '2024-05-10',
    genres: [{ id: 878, name: 'Bilim Kurgu' }, { id: 28, name: 'Aksiyon' }, { id: 12, name: 'Macera' }],
    runtime: 145,
    director: 'Wes Ball',
    production_companies: [{ id: 5, name: '20th Century Studios' }],
    trailer_key: 'Kdr5PvJiw-I',
    cast: [
      { id: 661, name: 'Owen Teague', character: 'Noa (Ses)', profile_path: '/mock/cast/owen' },
      { id: 662, name: 'Freya Allan', character: 'Mae / Nova', profile_path: '/mock/cast/freya' },
      { id: 663, name: 'Kevin Durand', character: 'Proximus Caesar (Ses)', profile_path: '/mock/cast/kevin' }
    ]
  }
];

// Helper to filter/find mock results
const getMockMovie = (id) => {
  const allMovies = [...MOCK_MOVIES, ...MOCK_UPCOMING_MOVIES];
  return allMovies.find(m => m.id === Number(id)) || allMovies[0];
};

export const tmdbApi = {
  // Get trending movies for the week
  getTrending: async (page = 1) => {
    if (!isApiConfigured()) {
      // Simulate API lag
      await new Promise(r => setTimeout(r, 300));
      return { results: [...MOCK_MOVIES].sort(() => 0.5 - Math.random()), page: 1, total_pages: 1 };
    }
    
    try {
      const response = await tmdbClient.get('/trending/movie/week', { params: { page } });
      return response.data;
    } catch (error) {
      console.warn("TMDB API request failed, falling back to mock data:", error.message);
      return { results: MOCK_MOVIES, page: 1, total_pages: 1 };
    }
  },

  // Get popular movies
  getPopular: async (page = 1) => {
    if (!isApiConfigured()) {
      await new Promise(r => setTimeout(r, 200));
      return { results: MOCK_MOVIES, page: 1, total_pages: 1 };
    }

    try {
      const response = await tmdbClient.get('/movie/popular', { params: { page } });
      return response.data;
    } catch (error) {
      console.warn("TMDB API request failed, falling back to mock data:", error.message);
      return { results: MOCK_MOVIES, page: 1, total_pages: 1 };
    }
  },

  // Get top rated movies
  getTopRated: async (page = 1) => {
    if (!isApiConfigured()) {
      await new Promise(r => setTimeout(r, 200));
      const sorted = [...MOCK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
      return { results: sorted, page: 1, total_pages: 1 };
    }

    try {
      const response = await tmdbClient.get('/movie/top_rated', { params: { page } });
      return response.data;
    } catch (error) {
      console.warn("TMDB API request failed, falling back to mock data:", error.message);
      return { results: [...MOCK_MOVIES].sort((a, b) => b.vote_average - a.vote_average), page: 1, total_pages: 1 };
    }
  },

  // Get upcoming movies
  getUpcoming: async (page = 1) => {
    if (!isApiConfigured()) {
      await new Promise(r => setTimeout(r, 200));
      const sorted = [...MOCK_UPCOMING_MOVIES].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      return { results: sorted, page: 1, total_pages: 1 };
    }

    try {
      const response = await tmdbClient.get('/movie/upcoming', { params: { page } });
      return response.data;
    } catch (error) {
      console.warn("TMDB API request failed, falling back to mock data:", error.message);
      return { results: MOCK_UPCOMING_MOVIES, page: 1, total_pages: 1 };
    }
  },

  // Search movies
  searchMovies: async (query, page = 1) => {
    if (!query) return { results: [], page: 1, total_pages: 1 };
    const allMovies = [...MOCK_MOVIES, ...MOCK_UPCOMING_MOVIES];
    
    if (!isApiConfigured()) {
      await new Promise(r => setTimeout(r, 300));
      const filtered = allMovies.filter(m => 
        m.title.toLowerCase().includes(query.toLowerCase()) || 
        m.overview.toLowerCase().includes(query.toLowerCase())
      );
      return { results: filtered, page: 1, total_pages: 1, total_results: filtered.length };
    }

    try {
      const response = await tmdbClient.get('/search/movie', {
        params: { query, page },
      });
      return response.data;
    } catch (error) {
      console.warn("TMDB API request failed, falling back to mock data:", error.message);
      const filtered = allMovies.filter(m => 
        m.title.toLowerCase().includes(query.toLowerCase())
      );
      return { results: filtered, page: 1, total_pages: 1, total_results: filtered.length };
    }
  },

  // Get movie details
  getMovieDetails: async (movieId) => {
    const allMovies = [...MOCK_MOVIES, ...MOCK_UPCOMING_MOVIES];
    if (!isApiConfigured() || isNaN(Number(movieId)) || Number(movieId) < 100) {
      await new Promise(r => setTimeout(r, 250));
      const mockMovie = getMockMovie(movieId);
      
      // Construct details structure to match TMDB append_to_response format
      return {
        ...mockMovie,
        genres: mockMovie.genres,
        runtime: mockMovie.runtime,
        tagline: mockMovie.tagline,
        production_companies: mockMovie.production_companies,
        credits: {
          cast: mockMovie.cast,
          crew: [{ id: 999, name: mockMovie.director, job: 'Director' }]
        },
        videos: {
          results: [{ id: 'v1', site: 'YouTube', type: 'Trailer', key: mockMovie.trailer_key }]
        },
        similar: {
          results: allMovies.filter(m => m.id !== Number(movieId)).slice(0, 6)
        }
      };
    }

    try {
      const response = await tmdbClient.get(`/movie/${movieId}`, {
        params: { append_to_response: 'credits,videos,similar' },
      });
      return response.data;
    } catch (error) {
      console.warn("TMDB API request failed, falling back to mock details:", error.message);
      const mockMovie = getMockMovie(movieId);
      return {
        ...mockMovie,
        credits: {
          cast: mockMovie.cast,
          crew: [{ id: 999, name: mockMovie.director, job: 'Director' }]
        },
        videos: {
          results: [{ id: 'v1', site: 'YouTube', type: 'Trailer', key: mockMovie.trailer_key }]
        },
        similar: {
          results: allMovies.filter(m => m.id !== Number(movieId)).slice(0, 6)
        }
      };
    }
  },

  // Get movie credits (cast & crew)
  getCredits: async (movieId) => {
    if (!isApiConfigured() || isNaN(Number(movieId)) || Number(movieId) < 100) {
      const mockMovie = getMockMovie(movieId);
      return {
        cast: mockMovie.cast,
        crew: [{ id: 999, name: mockMovie.director, job: 'Director' }]
      };
    }

    try {
      const response = await tmdbClient.get(`/movie/${movieId}/credits`);
      return response.data;
    } catch (error) {
      const mockMovie = getMockMovie(movieId);
      return {
        cast: mockMovie.cast,
        crew: [{ id: 999, name: mockMovie.director, job: 'Director' }]
      };
    }
  },

  // Get similar movies
  getSimilar: async (movieId, page = 1) => {
    const allMovies = [...MOCK_MOVIES, ...MOCK_UPCOMING_MOVIES];
    if (!isApiConfigured() || isNaN(Number(movieId)) || Number(movieId) < 100) {
      return {
        results: allMovies.filter(m => m.id !== Number(movieId)).slice(0, 6)
      };
    }

    try {
      const response = await tmdbClient.get(`/movie/${movieId}/similar`, { params: { page } });
      return response.data;
    } catch (error) {
      return {
        results: allMovies.filter(m => m.id !== Number(movieId)).slice(0, 6)
      };
    }
  },

  // Get movie videos (trailers)
  getVideos: async (movieId) => {
    if (!isApiConfigured() || isNaN(Number(movieId)) || Number(movieId) < 100) {
      const mockMovie = getMockMovie(movieId);
      return {
        results: [{ id: 'v1', site: 'YouTube', type: 'Trailer', key: mockMovie.trailer_key }]
      };
    }

    try {
      const response = await tmdbClient.get(`/movie/${movieId}/videos`);
      return response.data;
    } catch (error) {
      const mockMovie = getMockMovie(movieId);
      return {
        results: [{ id: 'v1', site: 'YouTube', type: 'Trailer', key: mockMovie.trailer_key }]
      };
    }
  },
  
  // Helper to format image URLs
  getImageUrl: (path, size = 'w500') => {
    if (!path) return 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop';
    
    // Check if it's a mock path, mapping it to Unsplash pictures
    if (path.startsWith('/mock/')) {
      const mapping = {
        '/mock/inception/poster': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop',
        '/mock/interstellar/poster': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop',
        '/mock/darkknight/poster': 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=500&auto=format&fit=crop',
        '/mock/avatar/poster': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop',
        '/mock/matrix/poster': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500&auto=format&fit=crop',
        '/mock/dune/poster': 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?q=80&w=500&auto=format&fit=crop',
        '/mock/oppenheimer/poster': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=500&auto=format&fit=crop',
        '/mock/gladiator/poster': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=500&auto=format&fit=crop',
        '/mock/spiderman/poster': 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=500&auto=format&fit=crop',
        '/mock/pulpfiction/poster': 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop',
        
        // Upcoming Mock Maps
        '/mock/dune2/poster': 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?q=80&w=500&auto=format&fit=crop',
        '/mock/gladiator2/poster': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=500&auto=format&fit=crop',
        '/mock/deadpool/poster': 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=500&auto=format&fit=crop',
        '/mock/joker2/poster': 'https://images.unsplash.com/photo-1501430654243-c934ccd2c190?q=80&w=500&auto=format&fit=crop',
        '/mock/furiosa/poster': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=500&auto=format&fit=crop',
        '/mock/batman2/poster': 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=500&auto=format&fit=crop',
        '/mock/apes/poster': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500&auto=format&fit=crop',

        // Cast avatars
        '/mock/cast/leo': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/joseph': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/elliot': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/tom': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/ken': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/cillian': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/matthew': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/anne': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/jessica': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/caine': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/damon': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/rebecca': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/zendaya': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/joaquin': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/austin': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/florence': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/paul': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/pedro': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/denzel': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/ryan': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/hugh': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/emma': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/gaga': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/zazie': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/anya': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
        '/mock/cast/chris': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop'
      };
      return mapping[path] || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop';
    }

    return `https://image.tmdb.org/t/p/${size}${path}`;
  },
  
  // Helper to format backdrop URLs
  getBackdropUrl: (path, size = 'original') => {
    if (!path) return '';
    
    if (path.startsWith('/mock/')) {
      const mapping = {
        '/mock/inception/backdrop': 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
        '/mock/interstellar/backdrop': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop',
        '/mock/darkknight/backdrop': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
        '/mock/avatar/backdrop': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
        '/mock/matrix/backdrop': 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=1200&auto=format&fit=crop',
        '/mock/dune/backdrop': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
        '/mock/oppenheimer/backdrop': 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200&auto=format&fit=crop',
        '/mock/gladiator/backdrop': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop',
        '/mock/spiderman/backdrop': 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=1200&auto=format&fit=crop',
        '/mock/pulpfiction/backdrop': 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=1200&auto=format&fit=crop',
        
        // Upcoming Mock Backdrops
        '/mock/dune2/backdrop': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
        '/mock/gladiator2/backdrop': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop',
        '/mock/deadpool/backdrop': 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=1200&auto=format&fit=crop',
        '/mock/joker2/backdrop': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
        '/mock/furiosa/backdrop': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
        '/mock/batman2/backdrop': 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop',
        '/mock/apes/backdrop': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop'
      };
      return mapping[path] || '';
    }

    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
};
