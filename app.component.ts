import { Component, ViewChild } from '@angular/core';
import { ApiService } from './api.service';
import { BaseChartDirective } from 'ng2-charts';
import CanvasJS from '../assets/canvasjs.min.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(BaseChartDirective, {static: false}) chart: BaseChartDirective;

  title = 'HW8-angular';
  constructor(private apiService:ApiService){
    if (!localStorage.hasOwnProperty("HW8")){
      localStorage.setItem("HW8",JSON.stringify([]))
    }
  }
  street:string = "";
  city:string = "";
  lat:any;
  long:any;
  state:string = 'state';
  process_bar = false;
  invalid_street = false;
  invalid_city = false;
  invalid_state = false;
  tabledata:any = [];
  ischeck:boolean=false;
  viewdata = false;
  viewtable = false;
  autofill:any;
  url:string
  chartof:string = 'temperature';
  tempData:any =[];
  presData:any = [];
  humiData:any = [];
  ozoData:any = [];
  visiData:any = [];
  windData:any = [];
  currentData={};
  sealURL:string;
  tempdiff:any =[];
  time:any = [];
  timestmp:any =[];
  model_date:string;
  modal_temp:any;
  modal_sum:string;
  modal_pre:any;
  modal_cor:any;
  modal_windspeed:any;
  modal_hum:any;
  modal_vis: any;
  modal_icon:any;
  twitter_msg:any;
  iplat:any;
  iplng:any;
  showresult:boolean = true;
  ipstate:any;
  ipcity:any;
  isfav=false;
  isresult = true;
  norec = false;
  favis = false;
  nohumi = false;
  novis = false;
  nopre = false;
  noozo = false;
  novcc = false;
  nows = false;
  nodata=false;
  isdata = false;
  is_no_data = false;
  us_state_abbrev = {
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
  
  public barChartLabels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [] , label: '', backgroundColor:'rgba(136, 184, 219, 1)', hoverBackgroundColor: '#a5d0ee', borderColor: '#a5d0ee', hoverBorderColor: '#a5d0ee'}
  ];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      onClick:(e) => e.stopPropagation()
    },
    scales: { yAxes : [{scaleLabel:{display:true,labelString: "Fahrenheit" },
    ticks: {stepSize:2}
  }],
    xAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Time difference from current hour'
      },
    }]}
  };
  onKey() { 
    let url ='http://cscihw8-env.t2bppczw6s.us-east-2.elasticbeanstalk.com/autocity/autocomplete?city='+this.city;
    this.apiService.getData(url).subscribe((adata) =>{
      this.autofill = adata["0"];
    });
  }
  checkIs(){
    if(this.ischeck == true){
      this.invalid_city = false;
      this.invalid_street = false;
    }
    else{
      this.invalid_city = false;
      this.invalid_street = false;
    }
  }
  clearAll(){
    this.process_bar = false;
    this.state = "state";
    this.street = "";
    this.city = "";
    this.viewdata = false;
    this.isresult = true;
    this.favis = false;
    this.nodata = false;
    this.viewtable = false;
    this.norec = false;
    this.ischeck = false;
    this.invalid_city = false;
    this.invalid_street = false;
    this.isdata = false;
    this.is_no_data = false;
  }
  isdisable(){
    if((this.street.trim() ==''|| this.city.trim() == ''|| this.state == 'state') && !this.ischeck){
      return true;
    }
    else{
      return false;
    }
  }
  onSubmit(){
    this.process_bar = true;
    this.viewdata = false;
    this.viewtable = false;
    this.isresult = true;
    this.favis = false;
    this.nodata = false;
    this.tempData =[];
    this.presData = [];
    this.humiData = [];
    this.ozoData = [];
    this.visiData = [];
    this.windData = [];
    if(this.ischeck){
      this.isfav = false;
      this.apiService.getData("http://ip-api.com/json").subscribe((ipdata) =>{
        this.is_no_data = false;
        this.iplat = ipdata["lat"];
        this.iplng = ipdata["lon"];
        this.ipstate = ipdata["regionName"];
        this.ipcity = ipdata["city"];
        this.apiService.getData("http://cscihw8-env.t2bppczw6s.us-east-2.elasticbeanstalk.com/autocity/dark?lat="+this.iplat+"&lng="+this.iplng+"&state="+encodeURIComponent(this.ipstate)).subscribe((data1)=>{
        this.sealURL = data1["StateSeal"];
        this.lat = data1["WeatherData"]["latitude"];
        this.long = data1["WeatherData"]["longitude"];
        this.currentData={
        "city":this.ipcity,
        "state":this.ipstate,
        "timezone":data1["WeatherData"]["timezone"],
        "temperature":Math.round(data1["WeatherData"]["currently"]["temperature"]),
        "summary":data1["WeatherData"]["currently"]["summary"]
        }
        if(data1["WeatherData"]["currently"].hasOwnProperty("humidity")==true && data1["WeatherData"]["currently"]["humidity"] != 0){
          this.currentData["humidity"]=data1["WeatherData"]["currently"]["humidity"]
        }
        else{
          this.nohumi = true;
        }
        if(data1["WeatherData"]["currently"].hasOwnProperty("pressure")==true && data1["WeatherData"]["currently"]["pressure"] != 0){
          this.currentData["pressure"]=data1["WeatherData"]["currently"]["pressure"]
        }
        else{
          this.nopre = true;
        }
        if(data1["WeatherData"]["currently"].hasOwnProperty("windSpeed")==true && data1["WeatherData"]["currently"]["windSpeed"] != 0){
          this.currentData["windspeed"]=data1["WeatherData"]["currently"]["windSpeed"]
        }
        else{
          this.nows = true;
        }
        if(data1["WeatherData"]["currently"].hasOwnProperty("visibility")==true && data1["WeatherData"]["currently"]["visibility"] != 0){
          this.currentData["visibility"]=data1["WeatherData"]["currently"]["visibility"]
        }
        else{
          this.novis = true;
        }
        if(data1["WeatherData"]["currently"].hasOwnProperty("cloudCover")==true && data1["WeatherData"]["currently"]["cloudCover"] != 0){
          this.currentData["cloudcover"]=data1["WeatherData"]["currently"]["cloudCover"]
        }
        else{
          this.novcc = true;
        }
        if(data1["WeatherData"]["currently"].hasOwnProperty("ozone")==true && data1["WeatherData"]["currently"]["ozone"] != 0){
          this.currentData["ozone"]=data1["WeatherData"]["currently"]["ozone"]
        }
        else{
          this.noozo = true;
        }   
        this.twitter_msg = "https://twitter.com/intent/tweet?text="+encodeURIComponent("The current temperature at "+this.ipcity+" is "+data1["WeatherData"]["currently"]["temperature"]+"°F. The weather conditions are "+data1["WeatherData"]["currently"]["summary"]+". #CSCI571WeatherSearch")
        let tdata = data1["WeatherData"]["hourly"]["data"];
      for (let i = 0; i<tdata.length; i++){
        this.tempData.push(tdata[i]["temperature"]);
        this.presData.push(tdata[i]["pressure"]);
        this.humiData.push(tdata[i]["humidity"]*100);
        this.ozoData.push(tdata[i]["ozone"]);
        this.visiData.push(tdata[i]["visibility"]);
        this.windData.push(tdata[i]["windSpeed"]);
      }
      let key=this.currentData["city"]+this.us_state_abbrev[this.currentData["state"]];
      let ldata = localStorage.getItem('HW8');
      let ldata1 = JSON.parse(ldata);
      for( let i=0;i<ldata1.length;i++){
        if(ldata1[i]["id"] === key){
          this.isfav = true;
        }
      }
      let ddata = data1["WeatherData"]["daily"]["data"];
      this.timestmp=[];
      this.tempdiff = [];
      this.time = [];
      for (let i = 0; i<ddata.length;i++){
        this.timestmp.push(ddata[i]["time"])
        this.tempdiff.push([ddata[i]["temperatureLow"],ddata[i]["temperatureHigh"]])
        this.time.push(ddata[i]["time"]*1000)
      }
      this.process_bar = false;
      this.viewdata = true;
      this.viewtable = false;
      this.isdata = true;
        })
      });
      
    }
    else{
      this.process_bar = true;
      this.isfav = false;
      this.url = 'http://cscihw8-env.t2bppczw6s.us-east-2.elasticbeanstalk.com/autocity/forcastof?street='+encodeURIComponent(this.street)+'&city='+encodeURIComponent(this.city)+'&state='+encodeURIComponent(this.state);
      this.apiService.getData(this.url).subscribe((data1) =>{
      if(data1["WeatherData"]== 0){
        this.nodata = true;
        this.is_no_data = true;
        this.process_bar = false;
        this.isdata = false;
      }
      else{
      this.is_no_data = false;
      this.sealURL = data1["StateSeal"];
      this.lat = data1["WeatherData"]["latitude"];
      this.long = data1["WeatherData"]["longitude"];
      this.currentData={
        "city":this.city,
        "state":this.state,
        "timezone":data1["WeatherData"]["timezone"],
        "temperature":Math.round(data1["WeatherData"]["currently"]["temperature"]),
        "summary":data1["WeatherData"]["currently"]["summary"],
      }
        if(data1["WeatherData"]["currently"].hasOwnProperty("humidity")==true && data1["WeatherData"]["currently"]["humidity"] != 0){
          this.currentData["humidity"]=data1["WeatherData"]["currently"]["humidity"]
        }
        else{
          this.nohumi = true;
        }
        if(data1["WeatherData"]["currently"].hasOwnProperty("pressure")==true && data1["WeatherData"]["currently"]["pressure"] != 0){
          this.currentData["pressure"]=data1["WeatherData"]["currently"]["pressure"]
        }
        else{
          this.nopre = true;
        }
        if(data1["WeatherData"]["currently"].hasOwnProperty("windSpeed")==true && data1["WeatherData"]["currently"]["windSpeed"] != 0){
          this.currentData["windspeed"]=data1["WeatherData"]["currently"]["windSpeed"]
        }
        else{
          this.nows = true;
        }
        if(data1["WeatherData"]["currently"].hasOwnProperty("visibility")==true && data1["WeatherData"]["currently"]["visibility"] != 0){
          this.currentData["visibility"]=data1["WeatherData"]["currently"]["visibility"]
        }
        else{
          this.novis = true;
        }
        if(data1["WeatherData"]["currently"].hasOwnProperty("cloudCover")==true && data1["WeatherData"]["currently"]["cloudCover"] != 0){
          this.currentData["cloudcover"]=data1["WeatherData"]["currently"]["cloudCover"]
        }
        else{
          this.novcc = true;
        }
        if(data1["WeatherData"]["currently"].hasOwnProperty("ozone")==true && data1["WeatherData"]["currently"]["ozone"] != 0){
          this.currentData["ozone"]=data1["WeatherData"]["currently"]["ozone"]
        }
        else{
          this.noozo = true;
        }   
      let key=this.currentData["city"]+this.us_state_abbrev[this.currentData["state"]];
      let ldata = localStorage.getItem('HW8');
      let ldata1 = JSON.parse(ldata);
      for( let i=0;i<ldata1.length;i++){
        if(ldata1[i]["id"] === key){
          this.isfav = true;
        }
      }
      this.twitter_msg = "https://twitter.com/intent/tweet?text="+encodeURIComponent("The current temperature at "+this.city+" is "+data1["WeatherData"]["currently"]["temperature"]+"°F. The weather conditions are "+data1["WeatherData"]["currently"]["summary"]+". #CSCI571WeatherSearch")
      let tdata = data1["WeatherData"]["hourly"]["data"];
      for (let i = 0; i<tdata.length; i++){
        this.tempData.push(tdata[i]["temperature"]);
        this.presData.push(tdata[i]["pressure"]);
        this.humiData.push(tdata[i]["humidity"]*100);
        this.ozoData.push(tdata[i]["ozone"]);
        this.visiData.push(tdata[i]["visibility"]);
        this.windData.push(tdata[i]["windSpeed"]);
      }
      let ddata = data1["WeatherData"]["daily"]["data"];
      this.timestmp=[];
      this.tempdiff = [];
      this.time = [];
      for (let i = 0; i<ddata.length;i++){
        this.timestmp.push(ddata[i]["time"])
        this.tempdiff.push([ddata[i]["temperatureLow"],ddata[i]["temperatureHigh"]])
        this.time.push(ddata[i]["time"]*1000)
      }
      this.process_bar = false;
      this.viewdata = true;
      this.viewtable = false;
      this.isdata = true;
      }
    });
    }
    this.barChartData[0]= {data: this.tempData ,label: 'temperature', backgroundColor:'rgba(136, 184, 219, 1)', hoverBackgroundColor: '#a5d0ee', borderColor: '#a5d0ee', hoverBorderColor: '#a5d0ee'} ;
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        legend: {
          onClick:(e) => e.stopPropagation()
        },
        scales: { yAxes : [{scaleLabel:{display:true, labelString: "Fahrenheit" },
        ticks: {stepSize:2}}],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time difference from current hour'
          },
        }]}
      };
  }
  changechart(event){
    const value = event.target.value;
    if(value == 'temperature'){
      this.barChartData[0]= {data: this.tempData ,label: 'temperature', backgroundColor:'rgba(136, 184, 219, 1)', hoverBackgroundColor: '#a5d0ee', borderColor: '#a5d0ee', hoverBorderColor: '#a5d0ee'} ;
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        legend: {
          onClick:(e) => e.stopPropagation()
        },
        scales: { yAxes : [{scaleLabel:{display:true, labelString: "Fahrenheit" },
        ticks: {stepSize:2}}],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time difference from current hour'
          },
        }]}
      };
      this.chart.chart.update();
    }
    else if(value == 'pressure'){
      this.barChartData[0]={data: this.presData ,label: 'pressure', backgroundColor:'rgba(136, 184, 219, 1)', hoverBackgroundColor: '#a5d0ee', borderColor: '#a5d0ee', hoverBorderColor: '#a5d0ee'};
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        legend: {
          onClick:(e) => e.stopPropagation()
        },
        scales: { yAxes : [{scaleLabel:{display:true,labelString: "Milibars" },
        ticks: {stepSize:2}}],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time difference from current hour'
          },
        }]}
      };
      this.chart.chart.update();
    }
    else if(value == 'humidity'){
      this.barChartData[0] = {data: this.humiData ,label: 'humidity', backgroundColor:'rgba(136, 184, 219, 1)', hoverBackgroundColor: '#a5d0ee', borderColor: '#a5d0ee', hoverBorderColor: '#a5d0ee'};
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        legend: {
          onClick:(e) => e.stopPropagation()
        },
        scales: { yAxes : [{scaleLabel:{display:true,labelString: "% Humidity" },
        ticks: {stepSize:5}
      }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time difference from current hour'
          },
        }]}
      };
      this.chart.chart.update();
    }
    else if(value == 'ozone'){
      this.barChartData[0] = {data: this.ozoData ,label: 'ozone', backgroundColor:'rgba(136, 184, 219, 1)', hoverBackgroundColor: '#a5d0ee', borderColor: '#a5d0ee', hoverBorderColor: '#a5d0ee'};
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        legend: {
          onClick:(e) => e.stopPropagation()
        },
        scales: { yAxes : [{scaleLabel:{display:true,labelString: "Dobson Unit" },
        ticks: {stepSize:5}}],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time difference from current hour'
          },
        }]}
      };
      this.chart.chart.update();
    }
    else if( value == 'visibility'){
      this.barChartData[0] = {data: this.visiData ,label: 'visibility', backgroundColor:'rgba(136, 184, 219, 1)', hoverBackgroundColor: '#a5d0ee', borderColor: '#a5d0ee', hoverBorderColor: '#a5d0ee'};
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        legend: {
          onClick:(e) => e.stopPropagation()
        },
        scales: { yAxes : [{scaleLabel:{display:true,labelString: "Miles (Maximum 10)" },
        ticks: {stepSize:1}}],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time difference from current hour'
          },
        }]}
      };
      this.chart.chart.update();
    }else if(value == 'windspeed'){
      this.barChartData[0] = {data: this.windData ,label: 'windspeed', backgroundColor:'rgba(136, 184, 219, 1)', hoverBackgroundColor: '#a5d0ee', borderColor: '#a5d0ee', hoverBorderColor: '#a5d0ee'};
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        legend: {
          onClick:(e) => e.stopPropagation()
        },
        scales: { yAxes : [{scaleLabel:{display:true,labelString: "Miles per hour" },
        ticks: {stepSize:1}}],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time difference from current hour'
          },
        }]}
      };
      this.chart.chart.update();
    }
  
  }
  validStreet(){
    
    if(this.street == null || this.street.trim() == "" || this.street == undefined){
      this.invalid_street = true;
    }
    else{
      this.invalid_street = false;
    }
  }
  validCity(){
    
    if(this.city == null || this.city.trim() == "" || this.city == undefined){
      this.invalid_city = true;
    }
    else{
      this.invalid_city = false;
    }
  }
  onWeekly(){
    let weekdata = [];
    for(let i=this.tempdiff.length-1;i>=0;i--){
      let t = new Date(this.time[i]);
      let wt = t.getDate()+'/'+(t.getMonth()+1)+'/'+t.getFullYear();
      weekdata.push({stmp:this.timestmp[i],label: wt, y:this.tempdiff[i]})
    }
    CanvasJS.addColorSet("shades",["#a5d0ee"])
    let chart = new CanvasJS.Chart("chartContainer",
	  {
		title: {
			text: "Weekly Weather"
    },
    colorSet:"shades",
		axisY: {
			includeZero: false,
			interval: 10,
      valueFormatString: "#0",
      gridThickness: 0,
      title:"temperature in Fahrenheit"
    },
    animationEnabled : true,
    legend:{
      horizontalAlign : "center",
      verticalAlign: "top"
    },
		axisX: {
			interval: 1,
      valueFormatString: "DD-MM-YYYY",
      title:"Days"
		},
		toolTip: {
			content: "<b>{label}<b>:  {y[0]} to {y[1]}"
    },
    dataPointWidth: 14,
		data: [
		{
			type: "rangeBar",
      yValueFormatString: "#0",
      showInLegend: true,
      legendText: "Days wise temperature range",
      click: (e) => {
        let modalurl = "http://cscihw8-env.t2bppczw6s.us-east-2.elasticbeanstalk.com/autocity/modaldata?stmp="+encodeURIComponent(e.dataPoint.stmp)+"&lat="+this.lat+"&long="+this.long;
        this.apiService.getData(modalurl).subscribe((modaldata) =>{
          let modalData = modaldata["res"]["currently"];
          let d = new Date(modalData["time"]*1000);
          let wt = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear();
          this.model_date = wt;
          this.modal_temp = Math.round(modalData["temperature"]);
          this.modal_sum = modalData["summary"];
          let icon = modalData["icon"];
          if(icon == "clear-day" || icon == "clear-night"){
            this.modal_icon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
          }
          else if(icon == "rain"){
            this.modal_icon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png";
          }
          else if(icon == "snow"){  
            this.modal_icon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png";
          }
          else if(icon == "sleet"){
            this.modal_icon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png";
          }
          else if(icon == "wind"){
            this.modal_icon = "https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png";
          }
          else if(icon == "fog"){
            this.modal_icon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png";
          }
          else if(icon == "cloudy"){
            this.modal_icon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png";
          }
          else if(icon == "partly-cloudy-day" || icon == "partly-cloudy-night"){
            this.modal_icon = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png";
          }
          if(modalData.hasOwnProperty("precipIntensity")==true){
            this.modal_pre = Math.round(modalData["precipIntensity"]*100)/100;  
          }
          else{
            this.modal_pre = "NA"
          }
          if(modalData.hasOwnProperty("precipProbability")==true){
            this.modal_cor = Math.round(modalData["precipProbability"]*100);
          }
          else{
            this.modal_cor = "NA"
          }
          if(modalData.hasOwnProperty("windSpeed") == true){
            this.modal_windspeed = Math.round(modalData["windSpeed"]*100)/100;
          }
          else{
            this.modal_windspeed = "NA"
          }
          if(modalData.hasOwnProperty("humidity") == true){
            this.modal_hum = Math.round(modalData["humidity"]*100);
          }
          else{
            this.modal_hum = "NA"
          }
          if(modalData.hasOwnProperty("visibility") == true){
            this.modal_vis = Math.round(modalData["visibility"]*100)/100;
          }
          else{
            this.modal_vis = "NA"
          }
        });
      },
			indexLabel: "{y[#index]}",
      indexLabelFontSize: 14,
      dataPoints: weekdata 
		}
		]
  });
  setTimeout(function(){ chart.render(); }, 500);
  }    
  fav(){
    let city:any,state:any;
    this.isfav=true;
    if (this.city != ""){
      city = this.city;
      if(this.state.length ==2){
        state = this.state;
      }
      else{
        state = this.us_state_abbrev[this.state];
      }
      
    }
    else{
      city = this.ipcity;
      if(this.ipstate.length == 2){
        state = this.ipstate;
      }
      else{
        state = this.us_state_abbrev[this.ipstate];
      }
      
    }
    if(window.localStorage){
      let favData = {
        "seal" : this.sealURL,
        "data": [city,state],
      }
      let id = city.trim()+state.trim();
      let ldata = localStorage.getItem('HW8')
      let ldata1 = JSON.parse(ldata);
      ldata1.push({id,favData});
      localStorage.setItem("HW8",JSON.stringify(ldata1))
      this.norec = false;
    }
  }
  createTable(){
    this.viewdata=false;
    this.viewtable=true;
    this.tabledata=[];
    this.isresult = false;
    this.favis = true;
    let ldata = localStorage.getItem('HW8')
    let ldata1 = JSON.parse(ldata)
    this.nodata = false;
    if(ldata1.length>0){
      for ( let i = 0, len = ldata1.length; i < len; ++i ) {
        this.tabledata.push(ldata1[i]["favData"]);
     }
     this.isresult = false;
    }
    else{
      this.norec = true;
    }
    
    
  }
  fromtable(data){
    let city = data["data"][0];
    let state = data["data"][1];
    let street = "";
    this.process_bar = true;
    this.viewdata = false;
    this.viewtable = false;
    // this.city = city;
    // this.state=state;
    this.ipcity=city;
    this.tempData =[];
    this.presData = [];
    this.humiData = [];
    this.ozoData = [];
    this.visiData = [];
    this.windData = [];
    this.url = 'http://cscihw8-env.t2bppczw6s.us-east-2.elasticbeanstalk.com/autocity/forcastof?street='+encodeURIComponent(street)+'&city='+encodeURIComponent(city)+'&state='+encodeURIComponent(state);
      this.apiService.getData(this.url).subscribe((data1) =>{
      this.sealURL = data1["StateSeal"];
      this.lat = data1["WeatherData"]["latitude"];
      this.long = data1["WeatherData"]["longitude"];
      this.currentData={
        "city":city,
        "state":state,
        "timezone":data1["WeatherData"]["timezone"],
        "temperature":Math.round(data1["WeatherData"]["currently"]["temperature"]),
        "summary":data1["WeatherData"]["currently"]["summary"],
      }
      if(data1["WeatherData"]["currently"].hasOwnProperty("humidity")==true && data1["WeatherData"]["currently"]["humidity"] != 0){
        this.currentData["humidity"]=data1["WeatherData"]["currently"]["humidity"]
      }
      else{
        this.nohumi = true;
      }
      if(data1["WeatherData"]["currently"].hasOwnProperty("pressure")==true && data1["WeatherData"]["currently"]["pressure"] != 0){
        this.currentData["pressure"]=data1["WeatherData"]["currently"]["pressure"]
      }
      else{
        this.nopre = true;
      }
      if(data1["WeatherData"]["currently"].hasOwnProperty("windSpeed")==true && data1["WeatherData"]["currently"]["windSpeed"] != 0){
        this.currentData["windspeed"]=data1["WeatherData"]["currently"]["windSpeed"]
      }
      else{
        this.nows = true;
      }
      if(data1["WeatherData"]["currently"].hasOwnProperty("visibility")==true && data1["WeatherData"]["currently"]["visibility"] != 0){
        this.currentData["visibility"]=data1["WeatherData"]["currently"]["visibility"]
      }
      else{
        this.novis = true;
      }
      if(data1["WeatherData"]["currently"].hasOwnProperty("cloudCover")==true && data1["WeatherData"]["currently"]["cloudCover"] != 0){
        this.currentData["cloudcover"]=data1["WeatherData"]["currently"]["cloudCover"]
      }
      else{
        this.novcc = true;
      }
      if(data1["WeatherData"]["currently"].hasOwnProperty("ozone")==true && data1["WeatherData"]["currently"]["ozone"] != 0){
        this.currentData["ozone"]=data1["WeatherData"]["currently"]["ozone"]
      }
      else{
        this.noozo = true;
      }
      let key=this.currentData["city"]+this.currentData["state"];
      let ldata = localStorage.getItem('HW8');
      let ldata1 = JSON.parse(ldata);
      for( let i=0;i<ldata1.length;i++){
        if(ldata1[i]["id"] === key){
          this.isfav = true;
        }
      }
      this.twitter_msg = "https://twitter.com/intent/tweet?text="+encodeURIComponent("The current temperature at "+city+" is "+data1["WeatherData"]["currently"]["temperature"]+"°F. The weather conditions are "+data1["WeatherData"]["currently"]["summary"]+". #CSCI571WeatherSearch")
      let tdata = data1["WeatherData"]["hourly"]["data"];
      for (let i = 0; i<tdata.length; i++){
        this.tempData.push(tdata[i]["temperature"]);
        this.presData.push(tdata[i]["pressure"]);
        this.humiData.push(tdata[i]["humidity"]*100);
        this.ozoData.push(tdata[i]["ozone"]);
        this.visiData.push(tdata[i]["visibility"]);
        this.windData.push(tdata[i]["windSpeed"]);
      }
      let ddata = data1["WeatherData"]["daily"]["data"];
      this.timestmp=[];
      this.tempdiff = [];
      this.time = [];
      for (let i = 0; i<ddata.length;i++){
        this.timestmp.push(ddata[i]["time"])
        this.tempdiff.push([ddata[i]["temperatureLow"],ddata[i]["temperatureHigh"]])
        this.time.push(ddata[i]["time"]*1000)
      }
      this.process_bar = false;
      this.viewdata = true;
      this.isdata = true;
      this.viewtable = false;
      this.is_no_data = false;
      this.isresult = true;
      this.favis = false;
    });
    this.barChartData[0]= {data: this.tempData ,label: 'temperature', backgroundColor:'rgba(136, 184, 219, 1)', hoverBackgroundColor: '#a5d0ee', borderColor: '#a5d0ee', hoverBorderColor: '#a5d0ee'} ;
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        legend: {
          onClick:(e) => e.stopPropagation()
        },
        scales: { yAxes : [{scaleLabel:{display:true, labelString: "Fahrenheit" },
        ticks: {stepSize:2}}],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time difference from current hour'
          },
        }]}
      };
  }
  deletelocalstorage(data){
    let key= data["data"][0].trim()+data["data"][1]
    let ldata = localStorage.getItem('HW8');
    let ldata1 = JSON.parse(ldata);
    for( let i=0;i<ldata1.length;i++){
      if(ldata1[i]["id"] === key){
        ldata1.splice(i,1)
      }
    }
    this.viewtable = true;
    localStorage.setItem("HW8",JSON.stringify(ldata1))
    for(let i=0; i< this.tabledata.length;i++){
      if(this.tabledata[i]["seal"]=== data["seal"]){
        this.tabledata.splice(i,1)
      }
    }
    if(this.tabledata.length<1){
      this.norec=true;
    }
    this.isfav = false;
  }
  del(){
    let key:any;
    if(this.currentData["state"].length == 2){
      key = this.currentData["city"]+this.currentData["state"];  
    }
    else{
      key = this.currentData["city"]+this.us_state_abbrev[this.currentData["state"]];
    }
    let ldata = localStorage.getItem('HW8');
    let ldata1 = JSON.parse(ldata);
    for( let i=0;i<ldata1.length;i++){
      if(ldata1[i]["id"] === key){
        ldata1.splice(i,1)
      }
    }
    
    localStorage.setItem("HW8",JSON.stringify(ldata1))
    for(let i=0; i< this.tabledata.length;i++){
      if(this.tabledata[i]["seal"]=== this.sealURL){
        this.tabledata.splice(i,1)
      }
    }
    this.isfav = false;
  }
  onresultclick(){
      if(this.isresult == true){
        if(this.isdata == true){
          this.viewdata=true;
        }
        else{
          this.viewdata = false;
        }
        if(this.is_no_data == true){
          this.nodata = true;
        }
        this.viewtable=false;
      }
      else{
        if(this.isdata == true){
          this.viewdata=true;
        }
        else{
          this.viewdata=false;
        }
        if(this.is_no_data == true){
          this.nodata = true;
        }
        this.viewtable=false;
        this.isresult=true;
        this.favis=false;
      }
    }
}
