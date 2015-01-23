/*Three chart options:
First is pie (pieData)
Second is line (lineData)
Third is bar (barData)
*/
var moreDat=true;//More data to enter: keep running while loop (getData)
var datIn=[];//holds data for input!
var datPts=[];//holds data objects
var chartArea = document.getElementById('chart');
context = chartArea.getContext("2d");

//now cometh the math.
function datPt (rawDat,total){
    //datPt constructor: takes raw data number, 
    //and sum total of data
    this.raw = rawDat;//raw data num
    var percent = rawDat/total;
    this.datRad = (2*Math.PI)*percent;
}



//pie first
function pieData(){
var sliceTot=0;
var keyPos=50;
    context.moveTo(150,120);//move to center of circle
    context.lineTo(250,120);
    context.stroke();
    for (var k=0;k<datPts.length;k++){
        //this final loop does the drawing!
        
        var strt;
        var end;
        //first, we need to find if one of the arc ends is either
        //the BEGINNING (0) or the END (2Pi)
        if (!datPts[k-1]){
            //first slice
            strt=0;
            end = datPts[0].datRad;
            sliceTot = datPts[0].datRad;
        }
        else {
            //middle slices
            strt = sliceTot;
            sliceTot+= datPts[k].datRad;
            end = sliceTot;
        }
        context.strokeStyle = 'black';
        context.fillStyle=colorPik();
        context.beginPath();
        context.arc(150,120,100,strt,end);
        context.lineTo(150,120);
        context.fill();
        context.stroke();
        context.closePath();
        context.fillRect(400,keyPos-10,10,10);
        context.fillStyle = 'black';
        context.font='14px Arial';
        context.fillText('Data: '+datIn[k],420,keyPos);
        keyPos+=17;   
    }
   
}

//now, line
function lineData(){
var datMax = 0; //maximum, for scale
for (var y=0;y<datPts.length;y++){
    //find max data value
    if (datPts[y].raw>datMax) {
	datMax = datPts[y].raw;
    }
}
datMax *=1.1;
var ptTotal=datPts.length; //Total number of points
var keyInc = 500/(ptTotal+1);
var keyPos=keyInc; //starting pos (horizontally)
    for (var k=0;k<datPts.length;k++){
        //this final loop does the drawing!
	context.strokeStyle = 'black';
	var datValAdjusted = 250-((datPts[k].raw/datMax)*250);//this takes the value at the current point, and adjusts it to be between 0 and 250
	context.fillStyle = colorPik();
	context.lineTo(keyPos,datValAdjusted);
	context.fillRect(keyPos-3,datValAdjusted-3,6,6);
	context.stroke();
        keyPos+=keyInc;
    }
    scales(ptTotal, keyInc, datMax);
   
}

//finally, bar!
function barData(){
var datMax = 0; //maximum, for scale
for (var y=0;y<datPts.length;y++){
    //find max data value
    if (datPts[y].raw>datMax) {
	datMax = datPts[y].raw;
    }
}
datMax *=1.1;
var ptTotal=datPts.length; //Total number of points
var keyInc = 500/(ptTotal+1);
var keyPos=keyInc; //starting pos (horizontally)
    for (var k=0;k<datPts.length;k++){
        //this final loop does the drawing!
	var datValAdjusted = 250-((datPts[k].raw/datMax)*250);//this takes the value at the current point, and adjusts it to be between 0 and 250
	var datBef = keyPos-(keyInc/2);//start pos of the bar, horizontally
	var grad = context.createLinearGradient(0,0,0,250);
	grad.addColorStop(0,colorPik());
	grad.addColorStop(1,colorPik());
	context.fillStyle = grad;
	context.fillRect(datBef, datValAdjusted, keyInc,250);
        keyPos+=keyInc;
    }
    scales(ptTotal, keyInc, datMax);
   
}

function getData(){
    //first, we draw a single horizontal line as a radius and
    //side of the first piece. this does not change!
    context.clearRect(0,0,500,250);
    var pos=0;  
    while (moreDat){
        //get new data
        var inDat = prompt ("Please enter a new value, or enter 0 to finish.");
        if (isNaN(inDat)||inDat==""||inDat==null){
            alert('Only numbers, please!');    
        }
        else if (inDat=='0'){
            moreDat=false;   
        }
        else{
            datIn[pos]=parseInt(inDat);   
        }
        pos++;
    }
    var datTotal = 0; //data total, for calcing percent
    for (var i=0; i<datIn.length;i++){
        datTotal += datIn[i];//sum up totals
    }

    for (var j=0; j<datIn.length;j++){
        datPts[j] = new datPt(datIn[j],datTotal); //create data pt objects
    }
    //NEXT: pick a graph!
    var n=true;
    var whichGraph;
    while(n){
         whichGraph = prompt("Please choose a type of graph (pie, line, or bar)").toUpperCase();
	 if (whichGraph=='PIE' || whichGraph=='LINE' || whichGraph=='BAR') {
	    n=false;
	 }
    }
    //So now we've succesfully picked a graph, and gotten the data pts. Now we need to summon forth the function!
    if (whichGraph=='PIE') {
	pieData();
    }
    else if (whichGraph=='LINE') {
	lineData();
    }
    else {
	barData();
    }
}
function colorPik(){
//random color picker
var colPicked='#';

for (var t=0;t<6;t++){
//loop runs once 
var n = Math.floor(Math.random()*16);
    if (n==10){
	colPicked+='A';
    }
    else if (n==11){
	colPicked+='B';
    }
    else if (n==12){
	colPicked+='C';
    }
    else if (n==13){
	colPicked+='D';
    }
    else if (n==14){
	colPicked+='E';
    }
    else if (n==15){
	colPicked+='F';
    }
    else{
	colPicked+=n;
    }
}

return colPicked;
}

function scales(total, inc, max){
    //this fxn will draw scale lines for the bar and line graphs.
    context.strokeStyle = '#cccccc';
    var vertInc = 500/(total+1);
    var vertPos = vertInc;
    var horizPos = 10;
    for(var h=0;h<9;h++){
	//horiz first
	context.moveTo(0,horizPos);
	context.lineTo(500,horizPos);
	context.stroke();
	horizPos += 25;
    }
    for(var v=0;v<total;v++){
	//vert bars
	context.moveTo(vertPos,0);
	context.lineTo(vertPos,250);
	context.stroke();
	vertPos += vertInc;
    }
    document.getElementById('scaleNumsH').innerHTML =parseInt(max);

}