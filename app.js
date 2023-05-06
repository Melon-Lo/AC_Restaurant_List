// declare server variables
const express = require('express')
const app = express()
const port = 3000

// require express-handlebars
const exphbs = require('express-handlebars')

// require restaurant data
const restaurantList = require('./restaurant.json')

// express template engine: handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set static files
app.use(express.static('public'))

// routes settings
// set root directory, render home page
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

// set 'show', render restaurant's information
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.filter(restaurant => {
    return restaurant.id === Number(req.params.restaurant_id)
  })
  res.render('show', { restaurant: restaurant[0] })
})

// set searchbar, render restaurant by keyword
app.get('/search', (req, res) => {

  const keyword = req.query.keyword

  // if there's no keyword, return to homepage
  if (!keyword.length) {
    return res.redirect('/')
  }

  const restaurants = restaurantList.results.filter(restaurant => {
    // restaurant.name or restaurant.category include req.query.keyword
    return restaurant.name.toLocaleLowerCase().trim().includes(keyword.toLowerCase().trim())
      || restaurant.category.toLocaleLowerCase().trim().includes(keyword.toLowerCase().trim())
  })

  res.render('index', { restaurants: restaurants, keyword: keyword })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Listening on localhost:${port}`)
})