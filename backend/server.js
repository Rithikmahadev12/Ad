require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dollartree_secret_key_2024';

const DB_PATH = path.join(__dirname, 'data.json');
const FRONTEND_PATH = path.join(__dirname, '..', 'frontend', 'public');

function readDB() {
  if (!fs.existsSync(DB_PATH)) return null;
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch { return null; }
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
function initDB() {
  if (readDB()) return;
  const owners = [
    { id: 1, username: 'Tejus',   password: bcrypt.hashSync('password', 10) },
    { id: 2, username: 'Alex',    password: bcrypt.hashSync('password', 10) },
    { id: 3, username: 'Tathvik', password: bcrypt.hashSync('password', 10) },
    { id: 4, username: 'Rithik',  password: bcrypt.hashSync('password', 10) },
  ];

  const products = [
    // ── DRINKS ──────────────────────────────────────────────────
    { id:1,  name:"Coca-Cola 20oz",              category:"Drinks", price:1.25, image:"🥤", description:"Ice cold classic Coke" },
    { id:2,  name:"Diet Coke 20oz",              category:"Drinks", price:1.25, image:"🥤", description:"Zero sugar, full flavor" },
    { id:3,  name:"Sprite 20oz",                 category:"Drinks", price:1.25, image:"🫧", description:"Crisp lemon-lime soda" },
    { id:4,  name:"Dr Pepper 20oz",              category:"Drinks", price:1.25, image:"🥤", description:"23 flavors of bold" },
    { id:5,  name:"Mountain Dew 20oz",           category:"Drinks", price:1.25, image:"💚", description:"Original citrus dew" },
    { id:6,  name:"Mountain Dew Code Red",       category:"Drinks", price:1.25, image:"🔴", description:"Cherry citrus blast" },
    { id:7,  name:"Mountain Dew Baja Blast",     category:"Drinks", price:1.25, image:"🌊", description:"Tropical lime storm" },
    { id:8,  name:"Mountain Dew Voltage",        category:"Drinks", price:1.25, image:"⚡", description:"Raspberry citrus charge" },
    { id:9,  name:"Fanta Orange 20oz",           category:"Drinks", price:1.25, image:"🍊", description:"Bright tropical orange" },
    { id:10, name:"Fanta Grape 20oz",            category:"Drinks", price:1.25, image:"🍇", description:"Bold grape soda" },
    { id:11, name:"Fanta Strawberry 20oz",       category:"Drinks", price:1.25, image:"🍓", description:"Sweet strawberry soda" },
    { id:12, name:"Pepsi 20oz",                  category:"Drinks", price:1.25, image:"🥤", description:"Bold refreshing cola" },
    { id:13, name:"Pepsi Zero Sugar",            category:"Drinks", price:1.25, image:"⚫", description:"Zero sugar bold cola" },
    { id:14, name:"Root Beer 20oz",              category:"Drinks", price:1.25, image:"🍺", description:"Classic creamy root beer" },
    { id:15, name:"Orange Crush 20oz",           category:"Drinks", price:1.25, image:"🍊", description:"Bubbly orange soda" },
    { id:16, name:"Grape Crush 20oz",            category:"Drinks", price:1.25, image:"🍇", description:"Bubbly grape soda" },
    { id:17, name:"Starry Lemon Lime",           category:"Drinks", price:1.25, image:"⭐", description:"Crisp lemon lime soda" },
    { id:18, name:"Arizona Green Tea",           category:"Drinks", price:1.25, image:"🍵", description:"Green tea with honey" },
    { id:19, name:"Arizona Iced Tea",            category:"Drinks", price:1.25, image:"🍵", description:"Classic sweet tea" },
    { id:20, name:"Arizona Lemonade",            category:"Drinks", price:1.25, image:"🍋", description:"Real lemon lemonade" },
    { id:21, name:"Arizona Watermelon",          category:"Drinks", price:1.25, image:"🍉", description:"Watermelon juice cocktail" },
    { id:22, name:"Arizona Mucho Mango",         category:"Drinks", price:1.25, image:"🥭", description:"Tropical mango blend" },
    { id:23, name:"Gatorade Fruit Punch",        category:"Drinks", price:1.25, image:"🔴", description:"Fruit punch electrolytes" },
    { id:24, name:"Gatorade Blue Ice",           category:"Drinks", price:1.25, image:"💧", description:"Cool Blue electrolytes" },
    { id:25, name:"Gatorade Lemon-Lime",         category:"Drinks", price:1.25, image:"💛", description:"Original lemon-lime sports" },
    { id:26, name:"Gatorade Orange",             category:"Drinks", price:1.25, image:"🍊", description:"Orange sports hydration" },
    { id:27, name:"Gatorade Grape",              category:"Drinks", price:1.25, image:"🍇", description:"Grape electrolyte fuel" },
    { id:28, name:"Powerade Mountain Berry",     category:"Drinks", price:1.25, image:"🫐", description:"Mountain berry blast" },
    { id:29, name:"Powerade Orange",             category:"Drinks", price:1.25, image:"🟠", description:"Orange ion4 hydration" },
    { id:30, name:"Snapple Peach Tea",           category:"Drinks", price:1.25, image:"🍑", description:"Made from the best stuff" },
    { id:31, name:"Snapple Apple",               category:"Drinks", price:1.25, image:"🍎", description:"Crisp apple juice drink" },
    { id:32, name:"Snapple Lemonade Tea",        category:"Drinks", price:1.25, image:"🍋", description:"Half & half lemonade tea" },
    { id:33, name:"Minute Maid Orange Juice",    category:"Drinks", price:1.25, image:"🟠", description:"Fresh squeezed taste" },
    { id:34, name:"Minute Maid Lemonade",        category:"Drinks", price:1.25, image:"🍋", description:"Classic lemonade blend" },
    { id:35, name:"Minute Maid Fruit Punch",     category:"Drinks", price:1.25, image:"🍹", description:"Mixed fruit punch" },
    { id:36, name:"Tropicana Orange Juice",      category:"Drinks", price:1.25, image:"🍊", description:"100% pure squeezed OJ" },
    { id:37, name:"Hi-C Fruit Punch",            category:"Drinks", price:1.25, image:"🍹", description:"Classic fruit punch" },
    { id:38, name:"Hi-C Orange Lavaburst",       category:"Drinks", price:1.25, image:"🔶", description:"Bursting orange flavor" },
    { id:39, name:"Capri Sun Fruit Punch",       category:"Drinks", price:1.25, image:"🧃", description:"Squeeze pouch juice" },
    { id:40, name:"Capri Sun Wild Cherry",       category:"Drinks", price:1.25, image:"🍒", description:"Wild cherry juice pouch" },
    { id:41, name:"Kool-Aid Jammers Grape",      category:"Drinks", price:1.25, image:"🍇", description:"Grape juice pouch" },
    { id:42, name:"Kool-Aid Jammers Tropical",   category:"Drinks", price:1.25, image:"🌺", description:"Tropical punch pouch" },
    { id:43, name:"Monster Energy Original",     category:"Drinks", price:1.25, image:"⚡", description:"Original green Monster" },
    { id:44, name:"Monster Energy Zero Ultra",   category:"Drinks", price:1.25, image:"🤍", description:"Zero sugar white Monster" },
    { id:45, name:"Monster Energy Lo-Cal",       category:"Drinks", price:1.25, image:"💙", description:"Low calorie blue Monster" },
    { id:46, name:"Red Bull Original",           category:"Drinks", price:1.25, image:"🐂", description:"Gives you wings" },
    { id:47, name:"Red Bull Sugar Free",         category:"Drinks", price:1.25, image:"🐂", description:"Zero sugar wings" },
    { id:48, name:"Celsius Blue Raspberry",      category:"Drinks", price:1.25, image:"❄️", description:"Fitness energy drink" },
    { id:49, name:"Celsius Watermelon",          category:"Drinks", price:1.25, image:"🍉", description:"Watermelon energy boost" },
    { id:50, name:"Bang Energy Cotton Candy",    category:"Drinks", price:1.25, image:"🩷", description:"Cotton candy super fuel" },
    { id:51, name:"Bang Energy Purple Haze",     category:"Drinks", price:1.25, image:"💜", description:"Mixed berry energy" },
    { id:52, name:"Pure Life Water 16oz",        category:"Drinks", price:1.25, image:"💧", description:"Pure purified water" },
    { id:53, name:"Smartwater 20oz",             category:"Drinks", price:1.25, image:"🌊", description:"Vapor distilled water" },
    { id:54, name:"Coconut Water",               category:"Drinks", price:1.25, image:"🥥", description:"Natural electrolytes" },
    { id:55, name:"Lipton Brisk Iced Tea",       category:"Drinks", price:1.25, image:"🫖", description:"Bold brisk tea blend" },
    { id:56, name:"Gold Peak Sweet Tea",         category:"Drinks", price:1.25, image:"🏆", description:"Southern style sweet tea" },
    { id:57, name:"Yoo-hoo Chocolate",           category:"Drinks", price:1.25, image:"🍫", description:"Chocolatey drink box" },
    { id:58, name:"Welch's Grape Juice",         category:"Drinks", price:1.25, image:"🍇", description:"Concord grape goodness" },
    { id:59, name:"Sunny D Tangy Original",      category:"Drinks", price:1.25, image:"☀️", description:"Tangy citrus punch" },
    { id:60, name:"V8 Vegetable Juice",          category:"Drinks", price:1.25, image:"🥕", description:"8 veggie blend" },
    { id:61, name:"Sparkling Water Lemon",       category:"Drinks", price:1.25, image:"🫧", description:"Bubbly lemon water" },
    { id:62, name:"LaCroix Lime",                category:"Drinks", price:1.25, image:"🫧", description:"Naturally essenced lime" },
    { id:63, name:"Honest Kids Apple Juice",     category:"Drinks", price:1.25, image:"🍏", description:"Organic apple juice" },
    { id:64, name:"Nesquik Chocolate Milk",      category:"Drinks", price:1.25, image:"🍫", description:"Creamy chocolate milk" },

    // ── CANDY ───────────────────────────────────────────────────
    { id:65, name:"Reese's Cups",                category:"Candy", price:1.25, image:"🍫", description:"Peanut butter & chocolate" },
    { id:66, name:"Reese's Pieces",              category:"Candy", price:1.25, image:"🟠", description:"Crunchy peanut butter candy" },
    { id:67, name:"Skittles Original",           category:"Candy", price:1.25, image:"🌈", description:"Taste the rainbow" },
    { id:68, name:"Skittles Wild Berry",         category:"Candy", price:1.25, image:"🍓", description:"Wild berry mix" },
    { id:69, name:"Skittles Tropical",           category:"Candy", price:1.25, image:"🌺", description:"Tropical fruit flavors" },
    { id:70, name:"Sour Patch Kids",             category:"Candy", price:1.25, image:"🍬", description:"Sour then sweet" },
    { id:71, name:"Sour Patch Watermelon",       category:"Candy", price:1.25, image:"🍉", description:"Watermelon sour patch" },
    { id:72, name:"Sour Patch Bunnies",          category:"Candy", price:1.25, image:"🐰", description:"Bunny shaped sour patch" },
    { id:73, name:"Starburst Original",          category:"Candy", price:1.25, image:"⭐", description:"Unexplainably juicy" },
    { id:74, name:"Starburst FaveREDs",          category:"Candy", price:1.25, image:"❤️", description:"All the red flavors" },
    { id:75, name:"Starburst Minis Sours",       category:"Candy", price:1.25, image:"🌟", description:"Mini sour chews" },
    { id:76, name:"M&Ms Peanut",                 category:"Candy", price:1.25, image:"🟤", description:"Milk chocolate with peanut" },
    { id:77, name:"M&Ms Original",               category:"Candy", price:1.25, image:"🟡", description:"Classic milk chocolate" },
    { id:78, name:"M&Ms Peanut Butter",          category:"Candy", price:1.25, image:"🥜", description:"Peanut butter center" },
    { id:79, name:"Snickers Bar",                category:"Candy", price:1.25, image:"🍫", description:"Peanuts, caramel, nougat" },
    { id:80, name:"Milky Way Bar",               category:"Candy", price:1.25, image:"🌙", description:"Caramel & milk chocolate" },
    { id:81, name:"Twix Bar",                    category:"Candy", price:1.25, image:"🍪", description:"Cookie caramel chocolate" },
    { id:82, name:"Kit Kat Bar",                 category:"Candy", price:1.25, image:"🍫", description:"Crispy wafer layers" },
    { id:83, name:"Butterfinger Bar",            category:"Candy", price:1.25, image:"🧡", description:"Crispy peanut buttery" },
    { id:84, name:"100 Grand Bar",               category:"Candy", price:1.25, image:"💰", description:"Caramel crispy chocolate" },
    { id:85, name:"Baby Ruth Bar",               category:"Candy", price:1.25, image:"⚾", description:"Peanuts caramel fudge" },
    { id:86, name:"Jolly Ranchers",              category:"Candy", price:1.25, image:"💎", description:"Hard candy assorted" },
    { id:87, name:"Nerds Original",              category:"Candy", price:1.25, image:"🔮", description:"Tiny tangy candy" },
    { id:88, name:"Nerds Rope",                  category:"Candy", price:1.25, image:"🪢", description:"Chewy gummy rope" },
    { id:89, name:"Nerds Gummy Clusters",        category:"Candy", price:1.25, image:"🍇", description:"Crunchy gummy clusters" },
    { id:90, name:"Swedish Fish",                category:"Candy", price:1.25, image:"🐟", description:"Original red fish candy" },
    { id:91, name:"Gummy Bears Assorted",        category:"Candy", price:1.25, image:"🐻", description:"Assorted fruit gummies" },
    { id:92, name:"Trolli Sour Worms",           category:"Candy", price:1.25, image:"🪱", description:"Sour gummy worms" },
    { id:93, name:"Trolli Sour Brite Crawlers",  category:"Candy", price:1.25, image:"🐛", description:"Neon sour gummies" },
    { id:94, name:"Laffy Taffy Banana",          category:"Candy", price:1.25, image:"🍌", description:"Stretchy banana taffy" },
    { id:95, name:"Airheads Assorted",           category:"Candy", price:1.25, image:"🎈", description:"Fruity chewy taffy" },
    { id:96, name:"Airheads Xtremes",            category:"Candy", price:1.25, image:"⚡", description:"Sour rainbow strips" },
    { id:97, name:"Warheads Extreme Sour",       category:"Candy", price:1.25, image:"💥", description:"Extreme sour hard candy" },
    { id:98, name:"Ring Pop Strawberry",         category:"Candy", price:1.25, image:"💍", description:"Wearable lollipop" },
    { id:99, name:"Push Pop Cherry",             category:"Candy", price:1.25, image:"🍒", description:"Push up lollipop" },
    { id:100,name:"Pop Rocks Original",          category:"Candy", price:1.25, image:"🎆", description:"Popping candy experience" },
    { id:101,name:"Dum Dums Lollipops",          category:"Candy", price:1.25, image:"🍭", description:"Assorted mini lollipops" },
    { id:102,name:"Tootsie Pops",                category:"Candy", price:1.25, image:"🍭", description:"Chocolate tootsie center" },
    { id:103,name:"Tootsie Roll Midgees",        category:"Candy", price:1.25, image:"🟫", description:"Classic chewy chocolate" },
    { id:104,name:"Hershey's Milk Chocolate",    category:"Candy", price:1.25, image:"🍫", description:"Classic milk chocolate bar" },
    { id:105,name:"Hershey's Cookies & Cream",   category:"Candy", price:1.25, image:"🍫", description:"Cookie pieces in white choc" },
    { id:106,name:"Almond Joy Bar",              category:"Candy", price:1.25, image:"🥥", description:"Coconut almond chocolate" },
    { id:107,name:"Mounds Bar",                  category:"Candy", price:1.25, image:"🟫", description:"Dark chocolate coconut" },
    { id:108,name:"York Peppermint Pattie",      category:"Candy", price:1.25, image:"🌿", description:"Cool peppermint center" },
    { id:109,name:"Mike and Ike Original",       category:"Candy", price:1.25, image:"🌈", description:"Fruit flavored chewy" },
    { id:110,name:"Hot Tamales",                 category:"Candy", price:1.25, image:"🌶️", description:"Fierce cinnamon chews" },
    { id:111,name:"Good & Plenty",               category:"Candy", price:1.25, image:"🩷", description:"Licorice candy coated" },
    { id:112,name:"Whoppers Malted Milk Balls",  category:"Candy", price:1.25, image:"🟤", description:"Crispy malted milk balls" },

    // ── SNACKS ──────────────────────────────────────────────────
    { id:113,name:"Doritos Nacho Cheese",        category:"Snacks", price:1.25, image:"🌽", description:"Bold nacho cheese chips" },
    { id:114,name:"Doritos Cool Ranch",          category:"Snacks", price:1.25, image:"🤠", description:"Cool ranch flavored chips" },
    { id:115,name:"Doritos Spicy Nacho",         category:"Snacks", price:1.25, image:"🌶️", description:"Extra spicy nacho kick" },
    { id:116,name:"Lay's Classic",               category:"Snacks", price:1.25, image:"🥔", description:"Original potato chips" },
    { id:117,name:"Lay's BBQ",                   category:"Snacks", price:1.25, image:"🔥", description:"Smoky BBQ flavored" },
    { id:118,name:"Lay's Sour Cream & Onion",    category:"Snacks", price:1.25, image:"🧅", description:"Tangy sour cream flavor" },
    { id:119,name:"Cheetos Crunchy",             category:"Snacks", price:1.25, image:"🧡", description:"Crunchy cheese puffs" },
    { id:120,name:"Cheetos Puffs",               category:"Snacks", price:1.25, image:"☁️", description:"Airy puffy cheese snack" },
    { id:121,name:"Cheetos Flamin' Hot",         category:"Snacks", price:1.25, image:"🌶️", description:"Fiery hot cheese puffs" },
    { id:122,name:"Fritos Original",             category:"Snacks", price:1.25, image:"🌽", description:"Corn chip original" },
    { id:123,name:"Fritos Chili Cheese",         category:"Snacks", price:1.25, image:"🌶️", description:"Chili cheese corn chips" },
    { id:124,name:"Pringles Original",           category:"Snacks", price:1.25, image:"🥔", description:"Once you pop, you can't stop" },
    { id:125,name:"Pringles Sour Cream",         category:"Snacks", price:1.25, image:"🧅", description:"Sour cream & onion" },
    { id:126,name:"Pringles Pizza",              category:"Snacks", price:1.25, image:"🍕", description:"Pizza flavored crisps" },
    { id:127,name:"Funyuns Onion Rings",         category:"Snacks", price:1.25, image:"🧅", description:"Crispy onion ring snack" },
    { id:128,name:"Chips Ahoy! Original",        category:"Snacks", price:1.25, image:"🍪", description:"Classic chocolate chip" },
    { id:129,name:"Chips Ahoy! Chewy",           category:"Snacks", price:1.25, image:"🍪", description:"Soft & chewy cookies" },
    { id:130,name:"Oreo Cookies",                category:"Snacks", price:1.25, image:"⚫", description:"America's favorite cookie" },
    { id:131,name:"Golden Oreos",                category:"Snacks", price:1.25, image:"🟡", description:"Golden vanilla wafer" },
    { id:132,name:"Double Stuf Oreos",           category:"Snacks", price:1.25, image:"⚫", description:"Extra creme filling" },
    { id:133,name:"Ritz Crackers",               category:"Snacks", price:1.25, image:"🧀", description:"Buttery round crackers" },
    { id:134,name:"Cheez-It Original",           category:"Snacks", price:1.25, image:"🧡", description:"Real cheese baked in" },
    { id:135,name:"Cheez-It White Cheddar",      category:"Snacks", price:1.25, image:"🧀", description:"Sharp white cheddar" },
    { id:136,name:"Goldfish Cheddar",            category:"Snacks", price:1.25, image:"🐠", description:"Cheddar baked crackers" },
    { id:137,name:"Nutter Butter",               category:"Snacks", price:1.25, image:"🥜", description:"Peanut butter sandwich" },
    { id:138,name:"Nilla Wafers",                category:"Snacks", price:1.25, image:"🟡", description:"Vanilla wafer cookies" },
    { id:139,name:"Famous Amos Choc Chip",       category:"Snacks", price:1.25, image:"🍪", description:"Bite-size cookie classics" },
    { id:140,name:"Grandma's PB Cookies",        category:"Snacks", price:1.25, image:"🥜", description:"Big soft peanut butter" },
    { id:141,name:"Pop-Tarts Strawberry",        category:"Snacks", price:1.25, image:"🍓", description:"Frosted strawberry pastry" },
    { id:142,name:"Pop-Tarts Brown Sugar",       category:"Snacks", price:1.25, image:"🟫", description:"Brown sugar cinnamon" },
    { id:143,name:"Pop-Tarts Blueberry",         category:"Snacks", price:1.25, image:"🫐", description:"Frosted blueberry pastry" },
    { id:144,name:"Rice Krispies Treats",        category:"Snacks", price:1.25, image:"🌾", description:"Marshmallow cereal bar" },
    { id:145,name:"Nature Valley Oats & Honey",  category:"Snacks", price:1.25, image:"🍯", description:"Crunchy granola bar" },
    { id:146,name:"Nutri-Grain Strawberry",      category:"Snacks", price:1.25, image:"🍓", description:"Soft baked cereal bar" },
    { id:147,name:"Planters Peanuts",            category:"Snacks", price:1.25, image:"🥜", description:"Salted cocktail peanuts" },
    { id:148,name:"Planters Mixed Nuts",         category:"Snacks", price:1.25, image:"🌰", description:"Deluxe mixed nut blend" },
    { id:149,name:"Sunflower Seeds",             category:"Snacks", price:1.25, image:"🌻", description:"Salted sunflower seeds" },
    { id:150,name:"Beef Jerky Original",         category:"Snacks", price:1.25, image:"🥩", description:"Smoky original beef jerky" },
    { id:151,name:"Jack Link's Teriyaki",        category:"Snacks", price:1.25, image:"🥩", description:"Sweet teriyaki jerky" },
    { id:152,name:"Slim Jim Original",           category:"Snacks", price:1.25, image:"🌭", description:"Snap into a Slim Jim" },
    { id:153,name:"String Cheese",               category:"Snacks", price:1.25, image:"🧀", description:"Peelable mozzarella stick" },
    { id:154,name:"Welch's Fruit Snacks",        category:"Snacks", price:1.25, image:"🍓", description:"Fruit flavored gummies" },
    { id:155,name:"Mott's Fruit Snacks",         category:"Snacks", price:1.25, image:"🍎", description:"Apple flavored fruit snacks" },
    { id:156,name:"Bugles Original",             category:"Snacks", price:1.25, image:"📯", description:"Crispy corn snack cones" },
    { id:157,name:"Corn Nuts Original",          category:"Snacks", price:1.25, image:"🌽", description:"Crunchy roasted corn" },
    { id:158,name:"Corn Nuts Ranch",             category:"Snacks", price:1.25, image:"🌽", description:"Ranch flavored corn" },
    { id:159,name:"Popcorn Butter",              category:"Snacks", price:1.25, image:"🍿", description:"Classic butter popcorn" },
    { id:160,name:"Smartfood White Cheddar",     category:"Snacks", price:1.25, image:"🧀", description:"White cheddar popcorn" },
    { id:161,name:"Pirates Booty",               category:"Snacks", price:1.25, image:"🏴‍☠️", description:"Puffed rice & corn" },
    { id:162,name:"Takis Fuego",                 category:"Snacks", price:1.25, image:"🌶️", description:"Hot chili lime rolled chips" },
    { id:163,name:"Takis Blue Heat",             category:"Snacks", price:1.25, image:"🔵", description:"Blue hot chili flavor" },
    { id:164,name:"Andy Capp's Hot Fries",       category:"Snacks", price:1.25, image:"🔥", description:"Crispy hot fry snacks" },

    // ── HOUSEHOLD ───────────────────────────────────────────────
    { id:165,name:"Dawn Dish Soap",              category:"Household", price:1.25, image:"🫧", description:"Tough on grease" },
    { id:166,name:"Sponges 3-Pack",              category:"Household", price:1.25, image:"🧽", description:"Heavy duty scrubbing" },
    { id:167,name:"Garbage Bags 10-Pack",        category:"Household", price:1.25, image:"🗑️", description:"Strong and reliable" },
    { id:168,name:"Paper Towels 2-Roll",         category:"Household", price:1.25, image:"🧻", description:"Absorbent and strong" },
    { id:169,name:"All-Purpose Cleaner",         category:"Household", price:1.25, image:"🧴", description:"Cleans any surface" },
    { id:170,name:"Toilet Paper 4-Roll",         category:"Household", price:1.25, image:"🧻", description:"Soft 2-ply comfort" },
    { id:171,name:"Ziploc Sandwich Bags",        category:"Household", price:1.25, image:"🔒", description:"Seal fresh sandwich bags" },
    { id:172,name:"Aluminum Foil",               category:"Household", price:1.25, image:"✨", description:"Heavy duty foil wrap" },

    // ── PERSONAL CARE ───────────────────────────────────────────
    { id:173,name:"Dove Body Wash",              category:"Personal Care", price:1.25, image:"🚿", description:"Moisturizing body wash" },
    { id:174,name:"Colgate Toothpaste",          category:"Personal Care", price:1.25, image:"🦷", description:"Whitening formula" },
    { id:175,name:"Band-Aids 10-Pack",           category:"Personal Care", price:1.25, image:"🩹", description:"Flexible fabric bandages" },
    { id:176,name:"Hand Sanitizer",              category:"Personal Care", price:1.25, image:"🤲", description:"99.9% germ kill" },
    { id:177,name:"Chapstick Original",          category:"Personal Care", price:1.25, image:"💋", description:"Classic lip balm" },
    { id:178,name:"Advil Pain Reliever 10ct",    category:"Personal Care", price:1.25, image:"💊", description:"Fast pain relief" },

    // ── PARTY ───────────────────────────────────────────────────
    { id:179,name:"Birthday Balloons 8-Pack",    category:"Party", price:1.25, image:"🎈", description:"Colorful latex balloons" },
    { id:180,name:"Paper Plates 20-Pack",        category:"Party", price:1.25, image:"🍽️", description:"Sturdy disposable plates" },
    { id:181,name:"Plastic Cups 20-Pack",        category:"Party", price:1.25, image:"🥳", description:"Great for parties" },
    { id:182,name:"Gift Bags Assorted",          category:"Party", price:1.25, image:"🎁", description:"Beautiful gift bags" },
    { id:183,name:"Birthday Candles",            category:"Party", price:1.25, image:"🕯️", description:"Colorful number candles" },
    { id:184,name:"Streamers 3-Pack",            category:"Party", price:1.25, image:"🎊", description:"Crepe paper streamers" },
  ];

  writeDB({ owners, products, orders: [], nextOrderId: 1, nextProductId: 185 });
  console.log('✅ Database initialized with', products.length, 'products');
}
initDB();

app.use(cors({
  origin: ['https://snapshop.b-cdn.net', 'http://localhost:3001', 'http://localhost:5500']
}));
app.use(express.json());
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
if (fs.existsSync(FRONTEND_PATH)) {
  app.use(express.static(FRONTEND_PATH));
  console.log('✅ Serving frontend from', FRONTEND_PATH);
} else {
  console.warn('⚠️  Frontend path not found:', FRONTEND_PATH);
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try { req.owner = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
}

// ── AUTH ──
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const owner = db.owners.find(o => o.username.toLowerCase() === (username||'').toLowerCase());
  if (!owner || !bcrypt.compareSync(password, owner.password))
    return res.status(401).json({ error: 'Invalid username or password' });
  const token = jwt.sign({ id: owner.id, username: owner.username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, username: owner.username });
});

// ── PRODUCTS ──
app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json([...db.products].sort((a,b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)));
});

app.put('/api/products/:id', authMiddleware, (req, res) => {
  const db = readDB();
  const p = db.products.find(p => p.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ error: 'Product not found' });
  p.price = parseFloat(req.body.price);
  writeDB(db);
  res.json({ success: true });
});

app.post('/api/products', authMiddleware, (req, res) => {
  const { name, category, price, image, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const db = readDB();
  const np = { id: db.nextProductId++, name, category: category||'Other', price: parseFloat(price)||1.25, image: image||'🛍️', description: description||'' };
  db.products.push(np);
  writeDB(db);
  res.json({ id: np.id });
});

app.delete('/api/products/:id', authMiddleware, (req, res) => {
  const db = readDB();
  db.products = db.products.filter(p => p.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ success: true });
});

// ── ORDERS ──
app.post('/api/orders', (req, res) => {
  const { email, items, total } = req.body;
  if (!email || !items?.length || !total) return res.status(400).json({ error: 'Missing required fields' });
  const db = readDB();
  const order = { id: db.nextOrderId++, customer_email: email, items, total, status: 'pending', created_at: new Date().toISOString() };
  db.orders.push(order);
  writeDB(db);
  res.json({ id: order.id, message: 'Order placed!' });
});

app.get('/api/orders', authMiddleware, (req, res) => {
  const db = readDB();
  res.json([...db.orders].reverse());
});

app.put('/api/orders/:id/status', authMiddleware, (req, res) => {
  const db = readDB();
  const o = db.orders.find(o => o.id === parseInt(req.params.id));
  if (!o) return res.status(404).json({ error: 'Order not found' });
  o.status = req.body.status;
  writeDB(db);
  res.json({ success: true });
});

// ── FALLBACK ──
app.get('*', (req, res) => {
  const idx = path.join(FRONTEND_PATH, 'index.html');
  if (fs.existsSync(idx)) res.sendFile(idx);
  else res.status(404).send('Frontend not found. Make sure the frontend/public folder exists.');
});

app.listen(PORT, () => console.log(`🛒 SnapShop running on http://localhost:${PORT}`));
