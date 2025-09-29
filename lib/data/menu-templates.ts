import {
  Apple,
  Beef,
  ChefHat,
  Coffee,
  Cookie,
  Fish,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  Utensils,
  Wheat,
  Wine,
} from "lucide-react";

export interface MenuItemTemplate {
  name: string;
  description: string;
  defaultPrice: string;
  image?: string;
  isVegetarian?: boolean; // Optional field to avoid breaking existing templates
}

export interface CategoryTemplate {
  id: string;
  name: string;
  icon: any;
  description: string;
  items: MenuItemTemplate[];
}

export const CATEGORY_TEMPLATES: CategoryTemplate[] = [
  {
    id: "starters",
    name: "Starters & Appetizers",
    icon: Utensils,
    description: "Light bites and appetizers to start the meal",
    items: [
      {
        name: "French Fries",
        description: "Crispy golden potato fries",
        defaultPrice: "120",
        image: "/default-food-img.png",
        isVegetarian: true,
      },
      {
        name: "Chicken Wings",
        description: "Spicy buffalo wings with dip",
        defaultPrice: "280",
        image: "/default-food-img.png",
        isVegetarian: false,
      },
      {
        name: "Spring Rolls",
        description: "Crispy vegetable spring rolls",
        defaultPrice: "180",
        image: "/default-food-img.png",
        isVegetarian: true,
      },
      {
        name: "Momo (Steamed)",
        description: "Traditional steamed dumplings",
        defaultPrice: "150",
        image: "/default-food-img.png",
        // Note: Momo can be veg or non-veg, leaving undefined for user choice
      },
      {
        name: "Crispy Chili Potatoes",
        description: "Spicy Indo-Chinese potato appetizer",
        defaultPrice: "160",
        image: "/default-food-img.png",
        isVegetarian: true,
      },
      {
        name: "Cheese Balls",
        description: "Deep fried cheese balls with herbs",
        defaultPrice: "200",
        image: "/default-food-img.png",
        isVegetarian: true,
      },
      {
        name: "Chicken Satay",
        description: "Grilled chicken skewers with peanut sauce",
        defaultPrice: "220",
        image: "/default-food-img.png",
        isVegetarian: false,
      },
      {
        name: "Garlic Bread",
        description: "Toasted bread with garlic butter",
        defaultPrice: "140",
        image: "/default-food-img.png",
        isVegetarian: true,
      },
      {
        name: "Nachos",
        description: "Tortilla chips with cheese and jalapeños",
        defaultPrice: "190",
        image: "/default-food-img.png",
        isVegetarian: true,
      },
      {
        name: "Onion Rings",
        description: "Crispy battered onion rings",
        defaultPrice: "130",
        image: "/default-food-img.png",
        isVegetarian: true,
      },
    ],
  },
  {
    id: "bhutanese",
    name: "Bhutanese Cuisine",
    icon: ChefHat,
    description: "Authentic traditional Bhutanese dishes",
    items: [
      {
        name: "Ema Datshi",
        description: "Traditional chili with cheese curry",
        defaultPrice: "180",
        image: "/default-food-img.png",
        isVegetarian: true,
      },
      {
        name: "Phaksha Paa",
        description: "Pork with radish and chili",
        defaultPrice: "220",
        image: "/default-food-img.png",
        isVegetarian: false,
      },
      {
        name: "Jasha Maru",
        description: "Spicy chicken curry with vegetables",
        defaultPrice: "200",
        image: "/default-food-img.png",
        isVegetarian: false,
      },
      {
        name: "Shakam Paa",
        description: "Dried beef with chilies and radish",
        defaultPrice: "250",
        image: "/default-food-img.png",
        isVegetarian: false,
      },
      {
        name: "Kewa Datshi",
        description: "Potato curry with cheese",
        defaultPrice: "160",
        image: "/default-food-img.png",
        isVegetarian: true,
      },
      {
        name: "Red Rice",
        description: "Traditional Bhutanese red rice",
        defaultPrice: "80",
        image: "/default-food-img.png",
        isVegetarian: true,
      },
      {
        name: "Sikam Paa",
        description: "Dried pork with chili and radish",
        defaultPrice: "240",
        image: "/default-food-img.png",
        isVegetarian: false,
      },
      {
        name: "Shamu Datshi",
        description: "Mushroom with cheese curry",
        defaultPrice: "170",
        image: "/default-food-img.png",
      },
      {
        name: "Goep",
        description: "Tripe cooked with chili and spices",
        defaultPrice: "200",
        image: "/default-food-img.png",
      },
      {
        name: "Buckwheat Pancakes",
        description: "Traditional buckwheat pancakes",
        defaultPrice: "120",
        image: "/default-food-img.png",
      },
    ],
  },
  {
    id: "soups",
    name: "Soups",
    icon: Soup,
    description: "Warm and comforting soups",
    items: [
      {
        name: "Chicken Soup",
        description: "Clear chicken broth with vegetables",
        defaultPrice: "140",
        image: "/default-food-img.png",
      },
      {
        name: "Vegetable Soup",
        description: "Mixed vegetable soup",
        defaultPrice: "120",
        image: "/default-food-img.png",
      },
      {
        name: "Mushroom Soup",
        description: "Creamy mushroom soup",
        defaultPrice: "160",
        image: "/default-food-img.png",
      },
      {
        name: "Sweet Corn Soup",
        description: "Sweet corn with egg drops",
        defaultPrice: "130",
        image: "/default-food-img.png",
      },
      {
        name: "Hot & Sour Soup",
        description: "Spicy and tangy soup",
        defaultPrice: "150",
        image: "/default-food-img.png",
      },
      {
        name: "Tomato Soup",
        description: "Classic tomato soup with herbs",
        defaultPrice: "110",
        image: "/default-food-img.png",
      },
      {
        name: "Lentil Soup",
        description: "Nutritious lentil soup",
        defaultPrice: "100",
        image: "/default-food-img.png",
      },
      {
        name: "Wonton Soup",
        description: "Dumplings in clear broth",
        defaultPrice: "180",
        image: "/default-food-img.png",
      },
    ],
  },
  {
    id: "salads",
    name: "Salads",
    icon: Salad,
    description: "Fresh and healthy salads",
    items: [
      {
        name: "Garden Salad",
        description: "Mixed greens with seasonal vegetables",
        defaultPrice: "180",
        image: "/default-food-img.png",
      },
      {
        name: "Caesar Salad",
        description: "Romaine lettuce with caesar dressing",
        defaultPrice: "220",
        image: "/default-food-img.png",
      },
      {
        name: "Chicken Salad",
        description: "Grilled chicken with mixed greens",
        defaultPrice: "250",
        image: "/default-food-img.png",
      },
      {
        name: "Greek Salad",
        description: "Tomatoes, olives, feta cheese",
        defaultPrice: "240",
        image: "/default-food-img.png",
      },
      {
        name: "Fruit Salad",
        description: "Fresh seasonal fruits",
        defaultPrice: "160",
        image: "/default-food-img.png",
      },
      {
        name: "Coleslaw",
        description: "Cabbage and carrot salad",
        defaultPrice: "120",
        image: "/default-food-img.png",
      },
      {
        name: "Cucumber Salad",
        description: "Fresh cucumber with herbs",
        defaultPrice: "100",
        image: "/default-food-img.png",
      },
      {
        name: "Potato Salad",
        description: "Boiled potatoes with dressing",
        defaultPrice: "140",
        image: "/default-food-img.png",
      },
    ],
  },
  {
    id: "main-course",
    name: "Main Course",
    icon: Utensils,
    description: "Hearty main dishes and entrees",
    items: [
      {
        name: "Fried Rice",
        description: "Wok-fried rice with vegetables",
        defaultPrice: "180",
        image: "/default-food-img.png",
      },
      {
        name: "Chicken Curry",
        description: "Spicy chicken curry with rice",
        defaultPrice: "220",
        image: "/default-food-img.png",
      },
      {
        name: "Vegetable Curry",
        description: "Mixed vegetable curry",
        defaultPrice: "160",
        image: "/default-food-img.png",
      },
      {
        name: "Chow Mein",
        description: "Stir-fried noodles with vegetables",
        defaultPrice: "170",
        image: "/default-food-img.png",
      },
      {
        name: "Dal Bhat",
        description: "Rice with lentil curry and pickles",
        defaultPrice: "150",
        image: "/default-food-img.png",
      },
      {
        name: "Butter Chicken",
        description: "Creamy tomato chicken curry",
        defaultPrice: "280",
        image: "/default-food-img.png",
      },
      {
        name: "Fish Curry",
        description: "Fresh fish in spicy curry",
        defaultPrice: "260",
        image: "/default-food-img.png",
      },
      {
        name: "Beef Stir Fry",
        description: "Beef with vegetables and sauce",
        defaultPrice: "300",
        image: "/default-food-img.png",
      },
      {
        name: "Pork Curry",
        description: "Tender pork in traditional curry",
        defaultPrice: "240",
        image: "/default-food-img.png",
      },
      {
        name: "Biryani",
        description: "Aromatic rice with meat/vegetables",
        defaultPrice: "320",
        image: "/default-food-img.png",
      },
    ],
  },
  {
    id: "pizza-pasta",
    name: "Pizza & Pasta",
    icon: Pizza,
    description: "Italian favorites - pizzas and pasta dishes",
    items: [
      {
        name: "Margherita Pizza",
        description: "Tomato sauce, mozzarella, basil",
        defaultPrice: "350",
        image: "/default-food-img.png",
      },
      {
        name: "Pepperoni Pizza",
        description: "Pepperoni with mozzarella cheese",
        defaultPrice: "400",
        image: "/default-food-img.png",
      },
      {
        name: "Vegetarian Pizza",
        description: "Mixed vegetables with cheese",
        defaultPrice: "380",
        image: "/default-food-img.png",
      },
      {
        name: "Chicken Pizza",
        description: "Grilled chicken with BBQ sauce",
        defaultPrice: "420",
        image: "/default-food-img.png",
      },
      {
        name: "Spaghetti Bolognese",
        description: "Pasta with meat sauce",
        defaultPrice: "280",
        image: "/default-food-img.png",
      },
      {
        name: "Carbonara",
        description: "Creamy pasta with bacon",
        defaultPrice: "300",
        image: "/default-food-img.png",
      },
      {
        name: "Penne Arrabbiata",
        description: "Spicy tomato pasta",
        defaultPrice: "260",
        image: "/default-food-img.png",
      },
      {
        name: "Lasagna",
        description: "Layered pasta with meat and cheese",
        defaultPrice: "340",
        image: "/default-food-img.png",
      },
    ],
  },
  {
    id: "sandwiches",
    name: "Sandwiches & Wraps",
    icon: Sandwich,
    description: "Quick bites and handheld meals",
    items: [
      {
        name: "Club Sandwich",
        description: "Triple-layered sandwich with chicken",
        defaultPrice: "220",
        image: "/default-food-img.png",
      },
      {
        name: "Grilled Cheese",
        description: "Melted cheese sandwich",
        defaultPrice: "160",
        image: "/default-food-img.png",
      },
      {
        name: "Chicken Wrap",
        description: "Grilled chicken in tortilla wrap",
        defaultPrice: "200",
        image: "/default-food-img.png",
      },
      {
        name: "Veggie Wrap",
        description: "Fresh vegetables in wrap",
        defaultPrice: "180",
        image: "/default-food-img.png",
      },
      {
        name: "BLT Sandwich",
        description: "Bacon, lettuce, and tomato",
        defaultPrice: "190",
        image: "/default-food-img.png",
      },
      {
        name: "Fish Burger",
        description: "Fried fish fillet burger",
        defaultPrice: "240",
        image: "/default-food-img.png",
      },
      {
        name: "Chicken Burger",
        description: "Grilled chicken breast burger",
        defaultPrice: "260",
        image: "/default-food-img.png",
      },
      {
        name: "Veggie Burger",
        description: "Plant-based patty burger",
        defaultPrice: "220",
        image: "/default-food-img.png",
      },
    ],
  },
  {
    id: "seafood",
    name: "Seafood",
    icon: Fish,
    description: "Fresh fish and seafood dishes",
    items: [
      {
        name: "Grilled Fish",
        description: "Fresh fish grilled with herbs",
        defaultPrice: "320",
        image: "/default-food-img.png",
      },
      {
        name: "Fish & Chips",
        description: "Battered fish with french fries",
        defaultPrice: "280",
        image: "/default-food-img.png",
      },
      {
        name: "Prawn Curry",
        description: "Prawns in spicy coconut curry",
        defaultPrice: "350",
        image: "/default-food-img.png",
      },
      {
        name: "Fish Tikka",
        description: "Marinated fish grilled in tandoor",
        defaultPrice: "300",
        image: "/default-food-img.png",
      },
      {
        name: "Seafood Platter",
        description: "Mixed seafood selection",
        defaultPrice: "450",
        image: "/default-food-img.png",
      },
      {
        name: "Fish Momos",
        description: "Fish dumplings steamed/fried",
        defaultPrice: "200",
        image: "/default-food-img.png",
      },
      {
        name: "Grilled Prawns",
        description: "Prawns grilled with garlic",
        defaultPrice: "380",
        image: "/default-food-img.png",
      },
    ],
  },
  {
    id: "meat-grills",
    name: "Meat & Grills",
    icon: Beef,
    description: "Grilled and roasted meat dishes",
    items: [
      {
        name: "Grilled Chicken",
        description: "Herb-marinated grilled chicken",
        defaultPrice: "280",
        image: "/default-food-img.png",
      },
      {
        name: "BBQ Ribs",
        description: "Pork ribs with BBQ sauce",
        defaultPrice: "380",
        image: "/default-food-img.png",
      },
      {
        name: "Beef Steak",
        description: "Grilled beef steak with sides",
        defaultPrice: "450",
        image: "/default-food-img.png",
      },
      {
        name: "Chicken Tikka",
        description: "Marinated chicken in tandoor",
        defaultPrice: "260",
        image: "/default-food-img.png",
      },
      {
        name: "Pork Chops",
        description: "Grilled pork chops with sauce",
        defaultPrice: "340",
        image: "/default-food-img.png",
      },
      {
        name: "Lamb Curry",
        description: "Tender lamb in aromatic curry",
        defaultPrice: "400",
        image: "/default-food-img.png",
      },
      {
        name: "Mixed Grill",
        description: "Assorted grilled meats",
        defaultPrice: "500",
        image: "/default-food-img.png",
      },
      {
        name: "Sausages",
        description: "Grilled sausages with mustard",
        defaultPrice: "220",
        image: "/default-food-img.png",
      },
    ],
  },
  {
    id: "cold-beverages",
    name: "Cold Beverages",
    icon: Coffee,
    description: "Refreshing cold drinks and juices",
    items: [
      {
        name: "Coca Cola",
        description: "Classic cola soft drink",
        defaultPrice: "60",
        image: "/default-food-img.png",
      },
      {
        name: "Sprite",
        description: "Lemon-lime soda",
        defaultPrice: "60",
        image: "/default-food-img.png",
      },
      {
        name: "Fresh Lime Soda",
        description: "Refreshing lime drink",
        defaultPrice: "80",
        image: "/default-food-img.png",
      },
      {
        name: "Iced Coffee",
        description: "Cold brewed coffee with ice",
        defaultPrice: "120",
        image: "/default-food-img.png",
      },
      {
        name: "Mango Juice",
        description: "Fresh mango juice",
        defaultPrice: "100",
        image: "/default-food-img.png",
      },
      {
        name: "Orange Juice",
        description: "Fresh orange juice",
        defaultPrice: "90",
        image: "/default-food-img.png",
      },
      {
        name: "Apple Juice",
        description: "Fresh apple juice",
        defaultPrice: "90",
        image: "/default-food-img.png",
      },
      {
        name: "Mineral Water",
        description: "Pure drinking water",
        defaultPrice: "40",
        image: "/default-food-img.png",
      },
      {
        name: "Iced Tea",
        description: "Chilled tea with lemon",
        defaultPrice: "70",
        image: "/default-food-img.png",
      },
      {
        name: "Energy Drink",
        description: "Caffeine energy drink",
        defaultPrice: "80",
        image: "/default-food-img.png",
      },
      {
        name: "Smoothie",
        description: "Mixed fruit smoothie",
        defaultPrice: "140",
        image: "/default-food-img.png",
      },
      {
        name: "Lassi",
        description: "Yogurt-based drink",
        defaultPrice: "80",
        image: "/default-food-img.png",
      },
    ],
  },
  {
    id: "hot-beverages",
    name: "Hot Beverages",
    icon: Coffee,
    description: "Warm and comforting hot drinks",
    items: [
      {
        name: "Black Coffee",
        description: "Pure black coffee",
        defaultPrice: "80",
        image: "/default-food-img.png",
      },
      {
        name: "Milk Coffee",
        description: "Coffee with fresh milk",
        defaultPrice: "100",
        image: "/default-food-img.png",
      },
      {
        name: "Cappuccino",
        description: "Espresso with steamed milk foam",
        defaultPrice: "120",
        image: "/default-food-img.png",
      },
      {
        name: "Latte",
        description: "Espresso with steamed milk",
        defaultPrice: "130",
        image: "/default-food-img.png",
      },
      {
        name: "Espresso",
        description: "Strong concentrated coffee",
        defaultPrice: "90",
        image: "/default-food-img.png",
      },
      {
        name: "Black Tea",
        description: "Traditional black tea",
        defaultPrice: "60",
        image: "/default-food-img.png",
      },
      {
        name: "Milk Tea",
        description: "Tea with fresh milk",
        defaultPrice: "80",
        image: "/default-food-img.png",
      },
      {
        name: "Green Tea",
        description: "Healthy antioxidant green tea",
        defaultPrice: "70",
        image: "/default-food-img.png",
      },
      {
        name: "Masala Chai",
        description: "Spiced tea with milk",
        defaultPrice: "90",
        image: "/default-food-img.png",
      },
      {
        name: "Hot Chocolate",
        description: "Rich chocolate drink with cream",
        defaultPrice: "120",
        image: "/default-food-img.png",
      },
      {
        name: "Herbal Tea",
        description: "Caffeine-free herbal infusion",
        defaultPrice: "80",
        image: "/default-food-img.png",
      },
      {
        name: "Ginger Tea",
        description: "Warming ginger tea",
        defaultPrice: "70",
        image: "/default-food-img.png",
      },
    ],
  },
  {
    id: "alcoholic-beverages",
    name: "Alcoholic Beverages",
    icon: Wine,
    description: "Beers, wines, and spirits",
    items: [
      {
        name: "Local Beer",
        description: "Bhutanese local beer",
        defaultPrice: "180",
        image: "/default-food-img.png",
      },
      {
        name: "Imported Beer",
        description: "International beer brands",
        defaultPrice: "220",
        image: "/default-food-img.png",
      },
      { name: "Red Wine", description: "House red wine", defaultPrice: "300" },
      {
        name: "White Wine",
        description: "House white wine",
        defaultPrice: "300",
        image: "/default-food-img.png",
      },
      {
        name: "Whiskey",
        description: "Premium whiskey shot",
        defaultPrice: "250",
        image: "/default-food-img.png",
      },
      {
        name: "Vodka",
        description: "Premium vodka shot",
        defaultPrice: "220",
        image: "/default-food-img.png",
      },
      {
        name: "Rum",
        description: "Dark/White rum shot",
        defaultPrice: "200",
        image: "/default-food-img.png",
      },
      {
        name: "Local Wine",
        description: "Bhutanese local wine",
        defaultPrice: "250",
        image: "/default-food-img.png",
      },
      {
        name: "Cocktail",
        description: "House special cocktail",
        defaultPrice: "280",
        image: "/default-food-img.png",
      },
      {
        name: "Chang",
        description: "Traditional fermented beverage",
        defaultPrice: "150",
        image: "/default-food-img.png",
      },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    icon: Cookie,
    description: "Sweet treats and desserts",
    items: [
      {
        name: "Vanilla Ice Cream",
        description: "Creamy vanilla ice cream",
        defaultPrice: "120",
        image: "/default-food-img.png",
      },
      {
        name: "Chocolate Ice Cream",
        description: "Rich chocolate ice cream",
        defaultPrice: "120",
        image: "/default-food-img.png",
      },
      {
        name: "Chocolate Cake",
        description: "Rich chocolate cake slice",
        defaultPrice: "180",
        image: "/default-food-img.png",
      },
      {
        name: "Cheesecake",
        description: "New York style cheesecake",
        defaultPrice: "200",
        image: "/default-food-img.png",
      },
      {
        name: "Fruit Salad",
        description: "Fresh seasonal fruits",
        defaultPrice: "140",
        image: "/default-food-img.png",
      },
      {
        name: "Apple Pie",
        description: "Classic apple pie with crust",
        defaultPrice: "160",
        image: "/default-food-img.png",
      },
      {
        name: "Tiramisu",
        description: "Italian coffee-flavored dessert",
        defaultPrice: "220",
        image: "/default-food-img.png",
      },
      {
        name: "Brownie",
        description: "Chocolate brownie with nuts",
        defaultPrice: "150",
        image: "/default-food-img.png",
      },
      {
        name: "Pancakes",
        description: "Fluffy pancakes with syrup",
        defaultPrice: "170",
        image: "/default-food-img.png",
      },
      {
        name: "Custard",
        description: "Creamy vanilla custard",
        defaultPrice: "100",
        image: "/default-food-img.png",
      },
      {
        name: "Rice Pudding",
        description: "Traditional rice pudding",
        defaultPrice: "110",
        image: "/default-food-img.png",
      },
      {
        name: "Mango Pudding",
        description: "Fresh mango pudding",
        defaultPrice: "130",
        image: "/default-food-img.png",
      },
    ],
  },
  {
    id: "breakfast",
    name: "Breakfast",
    icon: Apple,
    description: "Morning breakfast options",
    items: [
      {
        name: "English Breakfast",
        description: "Eggs, bacon, sausage, beans, toast",
        defaultPrice: "280",
        image: "/default-food-img.png",
      },
      {
        name: "Scrambled Eggs",
        description: "Fluffy scrambled eggs",
        defaultPrice: "140",
        image: "/default-food-img.png",
      },
      {
        name: "Fried Eggs",
        description: "Sunny side up or over easy",
        defaultPrice: "120",
        image: "/default-food-img.png",
      },
      {
        name: "Omelette",
        description: "Cheese or vegetable omelette",
        defaultPrice: "160",
        image: "/default-food-img.png",
      },
      {
        name: "Toast",
        description: "Buttered toast with jam",
        defaultPrice: "80",
        image: "/default-food-img.png",
      },
      {
        name: "Cereals",
        description: "Breakfast cereals with milk",
        defaultPrice: "100",
        image: "/default-food-img.png",
      },
      {
        name: "Porridge",
        description: "Warm oatmeal porridge",
        defaultPrice: "90",
        image: "/default-food-img.png",
      },
      {
        name: "Bacon",
        description: "Crispy bacon strips",
        defaultPrice: "120",
        image: "/default-food-img.png",
      },
      {
        name: "Sausages",
        description: "Breakfast sausages",
        defaultPrice: "140",
        image: "/default-food-img.png",
      },
      {
        name: "Hash Browns",
        description: "Crispy potato hash browns",
        defaultPrice: "100",
        image: "/default-food-img.png",
      },
    ],
  },
  {
    id: "snacks",
    name: "Snacks & Light Bites",
    icon: Wheat,
    description: "Quick snacks and light meals",
    items: [
      {
        name: "Samosa",
        description: "Crispy fried pastry with filling",
        defaultPrice: "80",
        image: "/default-food-img.png",
      },
      {
        name: "Pakora",
        description: "Vegetable fritters",
        defaultPrice: "100",
        image: "/default-food-img.png",
      },
      {
        name: "Chips",
        description: "Potato chips with dip",
        defaultPrice: "90",
        image: "/default-food-img.png",
      },
      {
        name: "Nuts Mix",
        description: "Roasted mixed nuts",
        defaultPrice: "120",
        image: "/default-food-img.png",
      },
      {
        name: "Popcorn",
        description: "Buttered or salted popcorn",
        defaultPrice: "60",
        image: "/default-food-img.png",
      },
      {
        name: "Cookies",
        description: "Assorted cookies",
        defaultPrice: "80",
        image: "/default-food-img.png",
      },
      {
        name: "Crackers",
        description: "Salted crackers",
        defaultPrice: "70",
        image: "/default-food-img.png",
      },
      {
        name: "Trail Mix",
        description: "Nuts, dried fruits mix",
        defaultPrice: "140",
        image: "/default-food-img.png",
      },
    ],
  },
];

// Helper function to get templates by category type
export const getTemplatesByType = (
  type: "food" | "beverage" | "all" = "all"
): CategoryTemplate[] => {
  const beverageCategories = [
    "cold-beverages",
    "hot-beverages",
    "alcoholic-beverages",
  ];
  const foodCategories = CATEGORY_TEMPLATES.filter(
    (cat) => !beverageCategories.includes(cat.id)
  ).map((cat) => cat.id);

  switch (type) {
    case "food":
      return CATEGORY_TEMPLATES.filter((cat) =>
        foodCategories.includes(cat.id)
      );
    case "beverage":
      return CATEGORY_TEMPLATES.filter((cat) =>
        beverageCategories.includes(cat.id)
      );
    default:
      return CATEGORY_TEMPLATES;
  }
};

// Helper function to get popular templates (commonly used)
export const getPopularTemplates = (): CategoryTemplate[] => {
  const popularIds = [
    "starters",
    "main-course",
    "cold-beverages",
    "hot-beverages",
    "desserts",
  ];
  return CATEGORY_TEMPLATES.filter((cat) => popularIds.includes(cat.id));
};

// Helper function to get templates by business type
export const getTemplatesByBusinessType = (
  businessType: string
): CategoryTemplate[] => {
  const businessTypeMapping: Record<string, string[]> = {
    restaurant: [
      "starters",
      "bhutanese",
      "soups",
      "salads",
      "main-course",
      "seafood",
      "meat-grills",
      "desserts",
      "cold-beverages",
      "hot-beverages",
    ],
    cafe: [
      "breakfast",
      "sandwiches",
      "snacks",
      "desserts",
      "cold-beverages",
      "hot-beverages",
    ],
    bar: [
      "snacks",
      "starters",
      "alcoholic-beverages",
      "cold-beverages",
      "hot-beverages",
    ],
    bakery: [
      "breakfast",
      "desserts",
      "snacks",
      "hot-beverages",
      "cold-beverages",
    ],
    "fast-food": [
      "starters",
      "sandwiches",
      "pizza-pasta",
      "snacks",
      "cold-beverages",
    ],
  };

  const categoryIds =
    businessTypeMapping[businessType.toLowerCase()] ||
    CATEGORY_TEMPLATES.map((cat) => cat.id);
  return CATEGORY_TEMPLATES.filter((cat) => categoryIds.includes(cat.id));
};
