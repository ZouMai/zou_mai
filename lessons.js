/* Compatible avec index.html actuel de ZouMai/zou_mai. Seules les illustrations changent. */
const LESSONS = [
  {
    "id": 1,
    "title": "Back to school",
    "subtitle": "School supplies",
    "icon": "./assets/01_back_to_school.png",
    "audio": "./back-to-school/bd/",
    "games": "https://zoumai.github.io/the-method/lessons/back-to-school/",
    "image": "./bd-images/01.jpg",
    "viewer": "./bd.html?id=1"
  },
  {
    "id": 2,
    "title": "On the plane",
    "subtitle": "Drinks",
    "icon": "./assets/02_on_the_plane.png",
    "audio": "./drinks/bd/",
    "games": "https://zoumai.github.io/the-method/lessons/drinks/",
    "image": "./bd-images/02.jpg",
    "viewer": "./bd.html?id=2"
  },
  {
    "id": 3,
    "title": "At the airport",
    "subtitle": "What’s your name?",
    "icon": "./assets/03_at_the_airport.png",
    "audio": "./at-the-airport/bd/",
    "games": "https://zoumai.github.io/the-method/lessons/at-the-airport/",
    "image": "./bd-images/03.jpg",
    "viewer": "./bd.html?id=3"
  },
  {
    "id": 4,
    "title": "The train to London",
    "subtitle": "Directions",
    "icon": "./assets/04_the_train_to_london.png",
    "audio": "./the-train-to-london/bd/",
    "games": "",
    "image": "./bd-images/04.jpg",
    "viewer": "./bd.html?id=4"
  },
  {
    "id": 5,
    "title": "At the hotel",
    "subtitle": "Hotel and numbers",
    "icon": "./assets/05_at_the_hotel.png",
    "audio": "./at-the-hotel/bd/",
    "games": "",
    "image": "./bd-images/05.jpg",
    "viewer": "./bd.html?id=5"
  },
  {
    "id": 6,
    "title": "Halloween: Trick or treat",
    "subtitle": "Halloween and costumes",
    "icon": "./assets/06_halloween_trick_or_treat.png",
    "audio": "./halloween-trick-or-treat/bd/",
    "games": "",
    "image": "./bd-images/06.jpg",
    "viewer": "./bd.html?id=6"
  },
  {
    "id": 7,
    "title": "Nationalities",
    "subtitle": "Countries and nationalities",
    "icon": "./assets/07_nationalities.png",
    "audio": "./nationalities/bd/",
    "games": "",
    "image": "./bd-images/07.jpg",
    "viewer": "./bd.html?id=7"
  },
  {
    "id": 8,
    "title": "Visiting monuments",
    "subtitle": "Monuments and localisation",
    "icon": "./assets/08_visiting_monuments.png",
    "audio": "./visiting-monuments/bd/",
    "games": "",
    "image": "./bd-images/08.jpg",
    "viewer": "./bd.html?id=8"
  },
  {
    "id": 9,
    "title": "Simon says",
    "subtitle": "Instructions",
    "icon": "./assets/09_simon_says.png",
    "audio": "./simon-says/bd/",
    "games": "",
    "image": "./bd-images/09.jpg",
    "viewer": "./bd.html?id=9"
  },
  {
    "id": 10,
    "title": "Merry Christmas!",
    "subtitle": "Christmas and rooms of the house",
    "icon": "./assets/10_merry_christmas.png",
    "audio": "./merry-christmas/bd/",
    "games": "",
    "image": "./bd-images/10.jpg",
    "viewer": "./bd.html?id=10"
  },
  {
    "id": 11,
    "title": "Happy New Year!",
    "subtitle": "Greetings",
    "icon": "./assets/11_happy_new_year.png",
    "audio": "",
    "games": "",
    "image": "./bd-images/11.jpg",
    "viewer": "./bd.html?id=11"
  },
  {
    "id": 12,
    "title": "At the zoo — Part 1",
    "subtitle": "Age and numbers",
    "icon": "./assets/12_at_the_zoo_part_1.png",
    "audio": "",
    "games": "",
    "image": "./bd-images/12.jpg",
    "viewer": "./bd.html?id=12"
  },
  {
    "id": 13,
    "title": "At the zoo — Part 2",
    "subtitle": "Animals and likes",
    "icon": "./assets/13_at_the_zoo_part_2.png",
    "audio": "",
    "games": "",
    "image": "./bd-images/13.jpg",
    "viewer": "./bd.html?id=13"
  },
  {
    "id": 14,
    "title": "At the gift shop",
    "subtitle": "Money and prices",
    "icon": "./assets/14_at_the_gift_shop.png",
    "audio": "",
    "games": "",
    "image": "./bd-images/14.jpg",
    "viewer": "./bd.html?id=14"
  },
  {
    "id": 15,
    "title": "At the clothing shop",
    "subtitle": "Clothes",
    "icon": "./assets/15_at_the_clothing_shop.png",
    "audio": "",
    "games": "",
    "image": "./bd-images/15.jpg",
    "viewer": "./bd.html?id=15"
  },
  {
    "id": 16,
    "title": "At the restaurant",
    "subtitle": "Food",
    "icon": "./assets/16_at_the_restaurant.png",
    "audio": "",
    "games": "",
    "image": "./bd-images/16.jpg",
    "viewer": "./bd.html?id=16"
  },
  {
    "id": 17,
    "title": "Saint Patrick’s Day",
    "subtitle": "Feelings",
    "icon": "./assets/17_saint_patricks_day.png",
    "audio": "",
    "games": "",
    "image": "./bd-images/17.jpg",
    "viewer": "./bd.html?id=17"
  },
  {
    "id": 18,
    "title": "A board game",
    "subtitle": "Play together",
    "icon": "./assets/18_a_board_game.png",
    "audio": "",
    "games": "",
    "image": "./bd-images/18.jpg",
    "viewer": "./bd.html?id=18"
  },
  {
    "id": 19,
    "title": "Visiting Aunt Suzie",
    "subtitle": "Family and house",
    "icon": "./assets/19_visiting_aunt_suzie.png",
    "audio": "",
    "games": "",
    "image": "./bd-images/19.jpg",
    "viewer": "./bd.html?id=19"
  },
  {
    "id": 20,
    "title": "Talking about sports",
    "subtitle": "Sports and preferences",
    "icon": "./assets/20_talking_about_sports.png",
    "audio": "",
    "games": "",
    "image": "./bd-images/20.jpg",
    "viewer": "./bd.html?id=20"
  },
  {
    "id": 21,
    "title": "Britain’s got talent",
    "subtitle": "Can / abilities",
    "icon": "./assets/21_britains_got_talent.png",
    "audio": "",
    "games": "",
    "image": "./bd-images/21.jpg",
    "viewer": "./bd.html?id=21"
  },
  {
    "id": 22,
    "title": "Cook a recipe",
    "subtitle": "Recipe",
    "icon": "./assets/22_cook_a_recipe.png",
    "audio": "",
    "games": "",
    "image": "./bd-images/22.jpg",
    "viewer": "./bd.html?id=22"
  }
];
