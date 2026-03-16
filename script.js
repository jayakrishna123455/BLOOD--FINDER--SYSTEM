// Load donors from LocalStorage
let donors = JSON.parse(localStorage.getItem("donors")) || [];

// Show donors when page loads
displayDonors();


// Register donor
function addDonor(){

let name=document.getElementById("name").value;
let blood=document.getElementById("blood").value.toUpperCase();
let city=document.getElementById("city").value.toLowerCase();
let phone=document.getElementById("phone").value;
let date=document.getElementById("date").value;

// Get donor location
navigator.geolocation.getCurrentPosition(function(position){

let donor={
name:name,
blood:blood,
city:city,
phone:phone,
date:date,
lat:position.coords.latitude,
lon:position.coords.longitude
};

donors.push(donor);

localStorage.setItem("donors",JSON.stringify(donors));

alert("Donor Registered Successfully");

displayDonors();

});

}


// Display donors
function displayDonors(){

let table="";

for(let i=0;i<donors.length;i++){

let status=checkEligibility(donors[i].date);

table+=`
<tr>
<td>${donors[i].name}</td>
<td>${donors[i].blood}</td>
<td>${donors[i].city}</td>
<td>${donors[i].phone}</td>
<td>${status}</td>
</tr>
`;

}

document.getElementById("tableBody").innerHTML=table;

}


// Search donor
function searchDonor(){

let blood=document.getElementById("searchBlood").value.toUpperCase();
let cityInput=document.getElementById("searchCity").value.toLowerCase();

let table="";

for(let i=0;i<donors.length;i++){

if(
donors[i].blood==blood &&
donors[i].city.includes(cityInput)
){

let status=checkEligibility(donors[i].date);

table+=`
<tr>
<td>${donors[i].name}</td>
<td>${donors[i].blood}</td>
<td>${donors[i].city}</td>
<td>${donors[i].phone}</td>
<td>${status}</td>
</tr>
`;

}

}

if(table==""){
alert("No donor found");
}

document.getElementById("tableBody").innerHTML=table;

}


// Find nearest donor
function findNearestDonor(){

navigator.geolocation.getCurrentPosition(showNearest);

}


// Show nearest donor
function showNearest(position){

let userLat=position.coords.latitude;
let userLon=position.coords.longitude;

let nearest=null;
let minDistance=Infinity;

for(let i=0;i<donors.length;i++){

if(donors[i].lat && donors[i].lon){

let dist=distance(userLat,userLon,donors[i].lat,donors[i].lon);

if(dist<minDistance){

minDistance=dist;
nearest=donors[i];

}

}

}

if(nearest){

alert(
"Nearest Donor\n\n"+
"Name: "+nearest.name+"\n"+
"Blood: "+nearest.blood+"\n"+
"City: "+nearest.city+"\n"+
"Distance: "+minDistance.toFixed(2)+" km\n"+
"Phone: "+nearest.phone
);

}else{

alert("No donor location available");

}

}


// Distance calculation
function distance(lat1,lon1,lat2,lon2){

const R=6371;

let dLat=(lat2-lat1)*Math.PI/180;
let dLon=(lon2-lon1)*Math.PI/180;

let a=
Math.sin(dLat/2)*Math.sin(dLat/2)+
Math.cos(lat1*Math.PI/180)*
Math.cos(lat2*Math.PI/180)*
Math.sin(dLon/2)*
Math.sin(dLon/2);

let c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

return R*c;

}


// Check 3-month eligibility
function checkEligibility(lastDate){

let lastDonation=new Date(lastDate);
let today=new Date();

let diff=(today-lastDonation)/(1000*60*60*24);

if(diff<90){
return "Not Eligible (Donated Recently)";
}

return "Eligible";

}
