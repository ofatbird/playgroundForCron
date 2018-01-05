const request = require('axios')

request.get('https://www.javbus.us/ajax/uncledatoolsbyajax.php?gid=35980916990&lang=zh&img=https://pics.javcdn.pw/cover/6c9r_b.jpg&uc=0&floor=855')
  .then(response => console.log(response))
  .catch(err => console.log(err))