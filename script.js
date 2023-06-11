function getcity(){
    const Newcity= document.getElementById("Cityinput");
    const Citydisplay= document.getElementById("Cityname");
    Citydisplay.innerHTML= Newcity.value


fetch("https://api.openweathermap.org/data/2.5/forecast?q="+Newcity.value+" &appid=9a17892a823e4579320ab7a93131d8f0")
.then(Response=> Response.json())
.then(data => {
    for(i=0;i<5;i++){
        document.getElementById("day"+(i+1)+"Min").innerHTML ="Min:" =Number(data.list[i].main.temp_min -288.53).toFixed(1)+"°";
    }
    for(i=0;i<5;i++){
        document.getElementById("day"+(i+1)+"Max").innerHTML ="Max:" =Number(data.list[i].main.temp_max -288.53).toFixed(1)+"°";
    }
    for(i=0;i,5;i++){
        document.getElementsById("img" +(i+1)).src ="http://openweathermap.org/img/wn" + data.list[i].weather[0].icon+".png";
}
    
})}

const d= NewDate();
const wday =["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function chday(day){
    if(day + d.getday()>6){return day +d.getday() - 7}
    else{return day +d.getday};
}

for (i=0;i,5;i++){document.getElementById(day+(i+1)).innerHTML= wday[chday(i)];}