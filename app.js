const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

app.get("/",function(req,res){
res.sendFile(__dirname+"/index.html");
})

app.post("/",function(req,res){
  var city = req.body.cityName;
  var query = req.body.cityName;
  const unit = "metric";
  const appKey = "e3931e70d7ce0b0cf2d28fef4fc32464";
  const url ="https://api.openweathermap.org/data/2.5/find?appid="+appKey+"&q="+query+"&units="+unit+" ";
  https.get(url,function(response){
    //console.log(response.statusCode);
    if(response.statusCode == 200)
    {
      response.on("data",function(data){
        const weatherData = JSON.parse(data);
        var sta = weatherData.count;
        if(sta!=0)
        {
          const temp = weatherData.list[0].main.temp;
          const humid = weatherData.list[0].main.humidity;
          var speed = weatherData.list[0].wind.speed *3.6;
          const details=weatherData.list[0].name;
          const des=weatherData.list[0].weather[0].description;
          speed = speed.toFixed(2);
          const icon = weatherData.list[0].weather[0].icon;
          const imageURL = "http://openweathermap.org/img/wn/" + icon + "@4x.png";
          //res.write("<h1> Weather in "+query+" is currently <mark>"+des+"</mark> </h1>");
          //res.write("<img src="+imageURL+">");
          //res.write("<br>");
          //res.write("<h2> Temperature <mark>"+temp+" degree celcius </mark> </h2>");
          //res.write("<h2> Humidity <mark>"+humid+"%</mark> </h2>");
          //res.write("<h2> Wind Speed <mark>"+speed+" Kilometer per hour </mark> </h2>");
          //res.send();
          res.render("success",{cityquery:query, citydes:des, weatherImageURL:imageURL, cityTemp:temp, cityHumid:humid, citySpeed:speed});
        }
        else {
              //res.write("<h1> Please check the city name</h1>");
              //res.write("<h1> Not able to find this city "+query+" ? </h1>");
              //res.send();
              res.render("fail",{cityquery:query});
          }
    })
  }else {
        //res.write("<h1> Please check city name </h1>");
        //res.send();
        res.render("fail",{cityquery:query});
    }
   })
 })

 app.post("/success",function(req,res){
   res.redirect("/");
 })

app.listen(process.env.PORT||3000,function(){
  console.log("Server is running on port 3000");
})
