export const initialMockData = {
  users: [
    {
      id: "1",
      name: "Ali",
      surname: "Yılmaz",
      email: "user@foodhub.com",
      password: "password123",
      phone: "05555555555",
      role: "user",
      status: "active",
      address: "Kadıköy Merkez, İstanbul"
    },
    {
      id: "2",
      name: "Mehmet",
      surname: "Demir",
      email: "business@foodhub.com",
      password: "password123",
      phone: "05555555556",
      role: "business",
      status: "active",
      address: "Beşiktaş Çarşı, İstanbul"
    },
    {
      id: "3",
      name: "Ayşe",
      surname: "Kaya",
      email: "admin@foodhub.com",
      password: "password123",
      phone: "05555555557",
      role: "admin",
      status: "active",
      address: "Şişli, İstanbul"
    }
  ],
  restaurants: [
    {
      id: "1",
      name: "Burger House",
      ownerId: "2",
      rating: 4.8,
      deliveryTime: 25,
      minOrderPrice: 150,
      deliveryFee: 0,
      logo: "🍔",
      coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
      address: "Beşiktaş, İstanbul",
      phone: "02122223344",
      email: "burgerhouse@foodhub.com",
      workingHours: "09:00 - 22:00"
    },
    {
      id: "2",
      name: "Pizza Time",
      ownerId: "2",
      rating: 4.5,
      deliveryTime: 30,
      minOrderPrice: 180,
      deliveryFee: 25,
      logo: "🍕",
      coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop",
      address: "Kadıköy, İstanbul",
      phone: "02163334455",
      email: "pizzatime@foodhub.com",
      workingHours: "10:00 - 23:00"
    },
    {
      id: "3",
      name: "Kebap Sarayı",
      ownerId: "2",
      rating: 4.9,
      deliveryTime: 35,
      minOrderPrice: 200,
      deliveryFee: 15,
      logo: "🥙",
      coverImage: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop",
      address: "Mecidiyeköy, İstanbul",
      phone: "02124445566",
      email: "kebapsarayi@foodhub.com",
      workingHours: "11:00 - 23:00"
    },
    {
      id: "4",
      name: "Salata Dünyası",
      ownerId: "2",
      rating: 4.6,
      deliveryTime: 20,
      minOrderPrice: 120,
      deliveryFee: 0,
      logo: "🥗",
      coverImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
      address: "Kadıköy, İstanbul",
      phone: "02164447788",
      email: "salatadunyasi@foodhub.com",
      workingHours: "09:00 - 21:00"
    },
    {
      id: "5",
      name: "Sushi Master",
      ownerId: "2",
      rating: 4.7,
      deliveryTime: 40,
      minOrderPrice: 250,
      deliveryFee: 30,
      logo: "🍣",
      coverImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop",
      address: "Etiler, İstanbul",
      phone: "02125556677",
      email: "sushimaster@foodhub.com",
      workingHours: "12:00 - 22:00"
    },
    {
      id: "6",
      name: "Pasta Bella",
      ownerId: "2",
      rating: 4.4,
      deliveryTime: 30,
      minOrderPrice: 160,
      deliveryFee: 20,
      logo: "🍝",
      coverImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop",
      address: "Nişantaşı, İstanbul",
      phone: "02127778899",
      email: "pastabella@foodhub.com",
      workingHours: "11:00 - 22:00"
    }
  ],
  categories: [
    { id: "1", name: "Burger" },
    { id: "2", name: "Pizza" },
    { id: "3", name: "Tatlı" },
    { id: "4", name: "İçecek" },
    { id: "5", name: "Kebap" },
    { id: "6", name: "Salata" },
    { id: "7", name: "Sushi" },
    { id: "8", name: "Makarna" }
  ],
  products: [
    // Burger House (restaurantId = "1")
    {
      id: "1",
      restaurantId: "1",
      categoryId: "1",
      name: "Klasik Burger",
      description: "150g dana köfte, marul, domates, turşu, özel sos",
      price: 180,
      stock: 50,
      image: "🍔",
      preparationTime: 15,
      isActive: true
    },
    {
      id: "2",
      restaurantId: "1",
      categoryId: "1",
      name: "Cheeseburger",
      description: "150g dana köfte, cheddar peyniri, karamelize soğan, sos",
      price: 200,
      stock: 40,
      image: "🧀",
      preparationTime: 15,
      isActive: true
    },
    {
      id: "3",
      restaurantId: "1",
      categoryId: "1",
      name: "Barbekü Burger",
      description: "150g dana köfte, füme et, karamelize soğan, barbekü sos",
      price: 210,
      stock: 30,
      image: "🥓",
      preparationTime: 18,
      isActive: true
    },
    {
      id: "4",
      restaurantId: "1",
      categoryId: "4",
      name: "Coca Cola 330ml",
      description: "Soğuk kutu kola",
      price: 40,
      stock: 100,
      image: "🥤",
      preparationTime: 5,
      isActive: true
    },
    {
      id: "5",
      restaurantId: "1",
      categoryId: "4",
      name: "Ayran 250ml",
      description: "Doğal yayık ayranı",
      price: 25,
      stock: 80,
      image: "🥛",
      preparationTime: 5,
      isActive: true
    },

    // Pizza Time (restaurantId = "2")
    {
      id: "6",
      restaurantId: "2",
      categoryId: "2",
      name: "Margarita Pizza",
      description: "Mozzarella peyniri, domates sosu, fesleğen",
      price: 220,
      stock: 30,
      image: "🍕",
      preparationTime: 20,
      isActive: true
    },
    {
      id: "7",
      restaurantId: "2",
      categoryId: "2",
      name: "Karışık Pizza",
      description: "Sucuk, sosis, salam, mantar, mısır, zeytin",
      price: 260,
      stock: 25,
      image: "🍕",
      preparationTime: 20,
      isActive: true
    },
    {
      id: "8",
      restaurantId: "2",
      categoryId: "2",
      name: "Dört Peynirli Pizza",
      description: "Cheddar, mozzarella, rokfor, parmesan peynirleri",
      price: 280,
      stock: 20,
      image: "🍕",
      preparationTime: 20,
      isActive: true
    },
    {
      id: "9",
      restaurantId: "2",
      categoryId: "3",
      name: "Sufle",
      description: "Çikolatalı sıcak sufle",
      price: 90,
      stock: 15,
      image: "🧁",
      preparationTime: 10,
      isActive: true
    },
    {
      id: "10",
      restaurantId: "2",
      categoryId: "3",
      name: "Tiramisu",
      description: "Espresso ve mascarpone peynirli İtalyan tatlısı",
      price: 110,
      stock: 12,
      image: "🍰",
      preparationTime: 5,
      isActive: true
    },

    // Kebap Sarayı (restaurantId = "3")
    {
      id: "11",
      restaurantId: "3",
      categoryId: "5",
      name: "Adana Kebap",
      description: "Zırh kıyması, lavaş, közlenmiş biber ve domates ile",
      price: 280,
      stock: 45,
      image: "🍢",
      preparationTime: 20,
      isActive: true
    },
    {
      id: "12",
      restaurantId: "3",
      categoryId: "5",
      name: "Urfa Kebap",
      description: "Acısız zırh kıyması, lavaş, mezelerle birlikte",
      price: 280,
      stock: 35,
      image: "🍢",
      preparationTime: 20,
      isActive: true
    },
    {
      id: "13",
      restaurantId: "3",
      categoryId: "5",
      name: "Beyti Sarma",
      description: "Lavaşa sarılı kebap, tereyağı, domates sosu ve yoğurt ile",
      price: 320,
      stock: 20,
      image: "🌯",
      preparationTime: 25,
      isActive: true
    },
    {
      id: "14",
      restaurantId: "3",
      categoryId: "3",
      name: "Künefe",
      description: "Hatay peynirli, şerbetli sıcak künefe",
      price: 120,
      stock: 15,
      image: "🥞",
      preparationTime: 15,
      isActive: true
    },
    {
      id: "15",
      restaurantId: "3",
      categoryId: "4",
      name: "Şalgam Suyu 330ml",
      description: "Acılı veya acısız Adana şalgamı",
      price: 30,
      stock: 60,
      image: "🍷",
      preparationTime: 3,
      isActive: true
    },

    // Salata Dünyası (restaurantId = "4")
    {
      id: "16",
      restaurantId: "4",
      categoryId: "6",
      name: "Sezar Salata",
      description: "Izgara tavuk göğsü, marul, kruton ekmek, parmesan, sezar sos",
      price: 160,
      stock: 30,
      image: "🥗",
      preparationTime: 12,
      isActive: true
    },
    {
      id: "17",
      restaurantId: "4",
      categoryId: "6",
      name: "Akdeniz Salatası",
      description: "Beyaz peynir, zeytin, domates, salatalık, zeytinyağlı limon sos",
      price: 140,
      stock: 40,
      image: "🥗",
      preparationTime: 10,
      isActive: true
    },
    {
      id: "18",
      restaurantId: "4",
      categoryId: "6",
      name: "Kinoa Salatası",
      description: "Kinoa, avokado, ceviz, nar ekşili sos",
      price: 170,
      stock: 20,
      image: "🥗",
      preparationTime: 12,
      isActive: true
    },
    {
      id: "19",
      restaurantId: "4",
      categoryId: "4",
      name: "Taze Sıkma Portakal Suyu",
      description: "100% doğal taze sıkılmış portakal suyu",
      price: 60,
      stock: 30,
      image: "🍊",
      preparationTime: 5,
      isActive: true
    },

    // Sushi Master (restaurantId = "5")
    {
      id: "20",
      restaurantId: "5",
      categoryId: "7",
      name: "California Roll (8 Adet)",
      description: "Yengeç, avokado, salatalık, tobiko",
      price: 240,
      stock: 25,
      image: "🍣",
      preparationTime: 22,
      isActive: true
    },
    {
      id: "21",
      restaurantId: "5",
      categoryId: "7",
      name: "Philadelphia Roll (8 Adet)",
      description: "Somon, krem peyniri, salatalık, avokado",
      price: 270,
      stock: 20,
      image: "🍣",
      preparationTime: 22,
      isActive: true
    },
    {
      id: "22",
      restaurantId: "5",
      categoryId: "7",
      name: "Salmon Nigiri (2 Adet)",
      description: "Pirinç yatağında taze somon dilimleri",
      price: 130,
      stock: 30,
      image: "🍣",
      preparationTime: 15,
      isActive: true
    },
    {
      id: "23",
      restaurantId: "5",
      categoryId: "3",
      name: "Mochi Tatlısı (3 Adet)",
      description: "Hindistan cevizli ve çilekli Japon pirinç keki tatlısı",
      price: 110,
      stock: 15,
      image: "🍡",
      preparationTime: 8,
      isActive: true
    },

    // Pasta Bella (restaurantId = "6")
    {
      id: "24",
      restaurantId: "6",
      categoryId: "8",
      name: "Fettuccine Alfredo",
      description: "Tavuk dilimleri, mantar, krema sosu, parmesan",
      price: 190,
      stock: 35,
      image: "🍝",
      preparationTime: 18,
      isActive: true
    },
    {
      id: "25",
      restaurantId: "6",
      categoryId: "8",
      name: "Spaghetti Bolognese",
      description: "Kıymalı İtalyan sosu, fesleğen ve parmesan ile",
      price: 190,
      stock: 30,
      image: "🍝",
      preparationTime: 18,
      isActive: true
    },
    {
      id: "26",
      restaurantId: "6",
      categoryId: "8",
      name: "Penne Arabbiata",
      description: "Acılı domates sosu, dilim siyah zeytin, fesleğen",
      price: 170,
      stock: 40,
      image: "🍝",
      preparationTime: 15,
      isActive: true
    },
    {
      id: "27",
      restaurantId: "6",
      categoryId: "4",
      name: "Limonata 330ml",
      description: "Ev yapımı taze naneli limonata",
      price: 45,
      stock: 50,
      image: "🍋",
      preparationTime: 5,
      isActive: true
    }
  ],
  orders: [],
  favorites: [],
  notifications: [],
  logs: []
};

// Helper: load mock database in memory to support registration even if API is offline
export const getLocalDB = () => {
  try {
    const db = localStorage.getItem('localDB');
    if (!db) {
      localStorage.setItem('localDB', JSON.stringify(initialMockData));
      return initialMockData;
    }
    return JSON.parse(db);
  } catch (e) {
    return initialMockData;
  }
};

export const saveLocalDB = (data) => {
  try {
    localStorage.setItem('localDB', JSON.stringify(data));
  } catch (e) {
    // ignore
  }
};
