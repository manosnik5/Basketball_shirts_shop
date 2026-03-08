export const PAYMENT_METHODS = [
  {
    name: "Visa",
    img: "/payment/visa.svg",
  },
  {
    name: "Mastercard",
    img: "/payment/mastercard.svg",
  },
  {
    name: "PayPal",
    img: "/payment/paypal.svg",
  },
];

export const NAV_LINKS = [
  {
    label: "Home", href: "/",
  },
  {
    label: "Jerseys", href: "/shirts",
  },
  {
    label: "Teams", href: "/#teams",
  },
  {
    label: "Contact", href: "/#contact",
  },
] as const;

export const footerColumns = [
  {
    title: "Customer service",
    links: ["FAQ's", "Order & payments", "Delivery", "Returns & exchanges"],
  },
  {
    title: "Information",
    links: ["📞 +1 234 567 890", "✉️ courtstyle@gmail.com", "📍 Athens, Greece"],
  },
  {
    title: "About us",
    links: ["Privacy Policy", "Terms & Conditions", "Cookies Policy"],
    href: ["/privacy-policy", "accessibility "]
  },
] 

export const socialLinks = [
  { name: "Facebook", href: "#", icon: "/facebook.png" },
  { name: "Instagram", href: "#", icon: "/instagram.png" },
  { name: "Twitter", href: "#", icon: "/x.png" },
]

export const OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Featured", value: "featured" },
  { label: "Price (High → Low)", value: "price_desc" },
  { label: "Price (Low → High)", value: "price_asc" },
]

export const POSITIONS = [
  "Point Guard",
  "Shooting Guard",
  "Small Forward",
  "Power Forward",
  "Center"
]

export const BRANDS = [
  "Nike",
  "Adidas", 
] 

export const LEAGUES = [
  "NBA", 
  "EuroLeague"
] 

export const TEAMS = [
  "Atlanta Hawks",
  "Boston Celtics",
  "Brooklyn Nets",
  "Charlotte Hornets",
  "Chicago Bulls",
  "Cleveland Cavaliers",
  "Dallas Mavericks",
  "Denver Nuggets",
  "Detroit Pistons",
  "Golden State Warriors",
  "Houston Rockets",
  "Indiana Pacers",
  "Los Angeles Clippers",
  "Los Angeles Lakers",
  "Memphis Grizzlies",
  "Miami Heat",
  "Milwaukee Bucks",
  "Minnesota Timberwolves",
  "New Orleans Pelicans",
  "New York Knicks",
  "Oklahoma City Thunder",
  "Orlando Magic",
  "Philadelphia 76ers",
  "Phoenix Suns",
  "Portland Trail Blazers",
  "Sacramento Kings",
  "San Antonio Spurs",
  "Toronto Raptors",
  "Utah Jazz",
  "Washington Wizards",
  "Anadolu Efes",
  "AS Monaco",
  "Baskonia",
  "Bayern Munich",
  "Crvena Zvezda",
  "Barcelona",
  "Fenerbahce",
  "Partizan Mozzart",
  "Maccabi Tel Aviv",
  "Olympiacos",
  "Panathinaikos",
  "Real Madrid",
  "Valencia Basket",
  "Virtus Bologna",
  "Zalgiris Kaunas",
  "Armani Milano",
  "ASVEL Villeurbanne",
  "Hapoel IBI Tel Aviv",
  "Paris Basketball",
  "Dubai Basketball"
];

export const POSITION_SLUG: Record<string, string> = {
  "Point Guard": "pg",
  "Shooting Guard": "sg",
  "Small Forward": "sf",
  "Power Forward": "pf",
  "Center": "c",
}

export const IMAGE_VARIANTS = ["main", "front", "back"];

export const TEAM_SLUGS: Record<string, string> = {
  "Atlanta Hawks": "hawks",
  "Boston Celtics": "celtics",
  "Chicago Bulls": "bulls",
  "Cleveland Cavaliers": "cavaliers",
  "Dallas Mavericks": "mavericks",
  "Denver Nuggets": "nuggets",
  "Detroit Pistons": "pistons",
  "Golden State Warriors": "warriors",
  "Houston Rockets": "rockets",
  "Indiana Pacers": "pacers",
  "Los Angeles Clippers": "clippers",
  "Los Angeles Lakers": "lakers",
  "Memphis Grizzlies": "grizzlies",
  "Miami Heat": "heat",
  "Milwaukee Bucks": "bucks",
  "Minnesota Timberwolves": "timberwolves",
  "New Orleans Pelicans": "pelicans",
  "New York Knicks": "knicks",
  "Oklahoma City Thunder": "thunder",
  "Orlando Magic": "magic",
  "Philadelphia 76ers": "sixers",
  "Phoenix Suns": "suns",
  "Portland Trail Blazers": "blazers",
  "Sacramento Kings": "kings",
  "San Antonio Spurs": "spurs",
  "Toronto Raptors": "raptors",
  "Utah Jazz": "jazz",
  "Washington Wizards": "wizards",
   "Anadolu Efes": "efes",
  "AS Monaco": "monaco",
  "Baskonia": "baskonia",
  "Bayern Munich": "bayern",
  "Crvena Zvezda": "crvena zvezda",
  "Barcelona": "barcelona",
  "Fenerbahce": "fenerbahce",
  "Partizan Mozzart": "partizan",
  "Maccabi Tel Aviv": "maccabi",
  "Olympiacos": "olympiacos",
  "Panathinaikos": "panathinaikos",
  "Real Madrid": "real",
  "Valencia Basket": "valencia",
  "Virtus Bologna": "virtus",
  "Zalgiris Kaunas": "zalgiris",
  "Armani Milano": "armani",
  "ASVEL Villeurbanne": "villeurbanne",
  "Hapoel IBI Tel Aviv": "hapoel",
  "Paris Basketball": "paris",
  "Dubai Basketball": "dubai",
};

export const LEAGUE_SLUGS: Record<string, string> = {
  "NBA": "nba",
  "EuroLeague": "euroleague",
};

export const BRAND_SLUGS: Record<string, string> = {
  "Nike": "nike",
  "Adidas": "adidas",
  "Puma": "puma",
};


export const SIZES = [
  "S", 
  "M", 
  "L", 
  "XL"
] 

export const PRICES = [
  { id: "0-50", label: "$0 - $50" },
  { id: "50-100", label: "$50 - $100" },
  { id: "100-150", label: "$100 - $150" },
  { id: "150-", label: "Over $150" },
] 

export const COUNTRIES = [
  "Albania",
  "Andorra",
  "Armenia",
  "Austria",
  "Azerbaijan",
  "Belarus",
  "Belgium",
  "Bosnia and Herzegovina",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Kazakhstan",
  "Kosovo",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Moldova",
  "Monaco",
  "Montenegro",
  "Netherlands",
  "North Macedonia",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "San Marino",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Turkey",
  "Ukraine",
  "United Kingdom",
  "Vatican City"
];

