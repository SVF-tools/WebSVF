
module.exports = (app) => {
  app.get('/', async (req, res) => {
    //console.log(req.body);
    res.send('You have Reached localhost:5001/');
  });
};
