import app from './app.js'
import SharePointService from './services/sharepoint.service.js';

const PORT = 5000;

app.get('/', function (req, res) {
  res.send({ success: true, message: 'Hello World!' });
});

app.listen(PORT, function () {
  SharePointService.getPlanePrevisions(5)
  console.log(`App listening on port ${PORT}!`);
});