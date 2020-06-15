const express = require('express')
const router = express.Router()
const axios = require('axios')
const parseString = require('xml2js').parseString;
const us_state_abbrev = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'District of Columbia': 'DC',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Northern Mariana Islands':'MP',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Palau': 'PW',
  'Pennsylvania': 'PA',
  'Puerto Rico': 'PR',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virgin Islands': 'VI',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
}
const us_state_abbrev1 = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AS": "American Samoa",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "DC": "District Of Columbia",
  "FM": "Federated States Of Micronesia",
  "FL": "Florida",
  "GA": "Georgia",
  "GU": "Guam",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MH": "Marshall Islands",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "MP": "Northern Mariana Islands",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PW": "Palau",
  "PA": "Pennsylvania",
  "PR": "Puerto Rico",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VI": "Virgin Islands",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming"
}
//getting all

//getting one
router.get('/forcastof',(req,res)=>{
  var street = req.query.street
  var city = req.query.city
  var state = req.query.state
  var imagestate = state;
  var jsonData1
  var jsonData2
  if(state.length != 2){
    state = us_state_abbrev[state];
  }
  if(imagestate.length == 2){
    imagestate = us_state_abbrev1[imagestate];
  }
  try{
    axios.get('https://maps.googleapis.com/maps/api/geocode/json?address='+street+','+city+','+state+'&key=AIzaSyAK5SfXrMZAhnFRgidHlBN3aJss6VwfNPc')
  .then(response => {
    if(response.data.status != "ZERO_RESULTS"){
      var lat = response.data.results[0].geometry.location.lat;
      var lng = response.data.results[0].geometry.location.lng;
      axios.get('https://api.darksky.net/forecast/1fc18c8c3eb5159fbfe1debaaef12c85/'+lat+','+lng+'')
      .then(response1 =>{
        jsonData1 = response1.data
        axios.get('https://www.googleapis.com/customsearch/v1?q=Seal%20of%20state%20'+imagestate+'&cx=004455887364921238698:hf2tfehrbec&num=1&searchType=image&key=AIzaSyAK5SfXrMZAhnFRgidHlBN3aJss6VwfNPc')
        .then(response2=>{
          jsonData2 = response2.data.items[0].link
          res.send(JSON.stringify({"WeatherData":jsonData1,"StateSeal":jsonData2}))
        })
        .catch(error =>{
          res.send({"WeatherData":"No Data"})
        })
      .catch(error => {
        res.send({"WeatherData":"No Data"})
      });
      })
    }
    else{
      res.send({"WeatherData":0})
    }
  })
  }
  catch(e){
    res.send({"WeatherData":"No Data"})
  }
  
  
})
router.get('/modaldata',(req,res)=>{
    var stmp = req.query.stmp;
    var lat = req.query.lat;
    var long = req.query.long;
    console.log(`${lat}, ${long}, ${stmp}`)
    axios.get('https://api.darksky.net/forecast/1fc18c8c3eb5159fbfe1debaaef12c85/'+lat+','+long+','+stmp)
    .then(response => {
      // console.log(response)
    res.send({ "res": response.data })
  })
  .catch(error => {
    console.log(error);
  });
})

router.get('/autocomplete',(req,res)=>{
  // res.send(req.body.city)
  axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+req.query.city+'&types=(cities)&language=en&key=AIzaSyAK5SfXrMZAhnFRgidHlBN3aJss6VwfNPc')
  .then(response => {
    data = []
    for( var i =0; i<response.data.predictions.length;i++){
        data.push(response.data.predictions[i].structured_formatting.main_text)
    }
  res.send({"0":data})
  })
  .catch(error => {
    res.send({"Error":202})
  });
})

router.get('/dark',(req,res)=>{
  console.log("In dark")
  axios.get('https://api.darksky.net/forecast/1fc18c8c3eb5159fbfe1debaaef12c85/'+req.query.lat+','+req.query.lng+'')
      .then(response1 =>{
        jsonData1 = response1.data
        axios.get('https://www.googleapis.com/customsearch/v1?q='+req.query.state+'%20State%20Seal&cx=004455887364921238698:hf2tfehrbec&imgSize=huge&imgType=news&num=1&searchType=image&key=AIzaSyAK5SfXrMZAhnFRgidHlBN3aJss6VwfNPc')
        .then(response2=>{
          jsonData2 = response2.data.items[0].link
          res.send(JSON.stringify({"WeatherData":jsonData1,"StateSeal":jsonData2}))
        })
        .catch(error =>{
          console.log(error);
        })
      });
})
module.exports = router
