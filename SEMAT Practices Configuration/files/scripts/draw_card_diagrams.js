// This script assumes the following input: 
// <script type="text/javascript">var stateMachine=["Conceived","Shared","Stable","Correct","Testable","Fulfilled"];</script>
// function init() { drawStateMachine(stateMachine,-1); continueInit(); }
// or
// var activitySpaceInput=[["Requirements","Opportunity","Project","System"], ["Analyst","Customer Representative"], ["Requirements"]];
// function init() { drawActivitySpaceDiagram(activitySpaceInput); continueInit(); }
// or
// var competencyLevels=["Subject Matter Expert","Project Advisor","Ambassador User","Actively Manages Scope","Directs the Business"];
// function init() { drawCompetencyLevels(competencyLevels,-1,2); continueInit(); }
// or
// var patternSpaceInput=[["Lifecycle"], ["Inception"]];
// function init() { drawPatternSpaceDiagram(patternSpaceInput,true,false); continueInit(); }
// or
// var levelsOfDetail=["Value Established","System Boundary Established","Structured"];
// function init() { drawLevelsOfDetail(levelsOfDetail,-1,0); continueInit(); }
// or
// var activityInput=[["Opportunity"], ["Analyst (accountable)","Customer Representative"], ["Requirements","Use Case"], ["Use-Case Narrative","Supporting Definitions","Use-Case Model"]];
// function init() { drawActivityDiagram(activityInput); continueInit(); }
// or
// function init() { drawCardImage("images/card.jpg"); continueInit(); } - for pattern cards

var linkBoxes = new Array();

var fontName = "Arial";
var fontUnit = "px ";

var stateSymbolDefaultFontSize = "16";

function continueInit() {

	var canvas = document.getElementById('canvas');	
	canvas.addEventListener( 'mousedown', onMouseClickOnCanvas, false ); 
}

function findPos(obj) {
	var curleft = curtop = 0;
	
	if (obj.offsetParent) 
		do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		
	return [curleft,curtop];
}

function onMouseClickOnCanvas( event ) {
        var x = new Number();
        var y = new Number();
        var canvas = document.getElementById('canvas');

        if (event.x != undefined && event.y != undefined)
        {
          x = event.x;
          y = event.y;
        }
        else // Firefox method to get the position
        {
          x = event.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
          y = event.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;
        }

		var offset = findPos(canvas);

        x -= offset[0];
        y -= offset[1];
  
		for(var i=0; i<linkBoxes.length; i++) {
			if (x > linkBoxes[i][0] && x < linkBoxes[i][2] && y > linkBoxes[i][1] && y < linkBoxes[i][3])
				window.location = linkBoxes[i][4];
		}

}

function drawStateCard(stateCardInput,startYtext,lineHeight,lineSpace,checkpointTextSize,checkpointEndY) {
	// assume canvas size 300 x 435 by default
	var stopcolor = "#FFFFFF";

    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
	var lineoffset = 0;
	var len=stateCardInput[1].length;

	// adjust the size of the canvas height if needed to encompass all checkpoints:
	for(var i=0; i<len; i++) {
		lines = getLines(ctx,stateCardInput[1][i],267,checkpointTextSize+fontUnit+fontName);

		lineoffset = lineoffset + (lines.length*lineHeight) + lineSpace;
	}
	if ((startYtext+lineoffset) > checkpointEndY)
	 	c.height = c.height + ((startYtext+lineoffset) - checkpointEndY);

	roundRect(ctx, 2, 2, 296, 60, 5, false, "",  stateCardInput[0][3], stopcolor, "", false, 2, "14", true);

	alphaSymbol(ctx, 10, 15, 64, 34, 15, true, "", stopcolor, stopcolor, "", 3);

	drawText2(stateCardInput[0][0],190,30,ctx,225,"22",20,"center",true);
	
	roundRect(ctx, 10, 70, 280, 60, 5, true, stateCardInput[0][1], stopcolor, stopcolor, "", false, 3, "20", true);

	var thislinelen = 0;
//	ctx.fillStyle = "black";
	var warned = false;
	var lines;
	var canvasHeight = c.height;

	lineoffset = 0;
	
	for(var i=0; i<len; i++) {

		thislinelen = drawText2(stateCardInput[1][i],25,startYtext+lineoffset,ctx,267,checkpointTextSize,lineHeight,"left",false);
		ctx.fillRect(12,(startYtext-2)+lineoffset,5,5);
		
		lineoffset = lineoffset + (thislinelen*lineHeight) + lineSpace;
	}
	
	roundRect(ctx, 10, c.height-45, 280, 40, 5, true, stateCardInput[0][2], stateCardInput[0][3], stopcolor, "", false, 3, "20", true);

	roundRect(ctx, 2, 2, 296, c.height-4, 5, true, "", stopcolor, stopcolor, "", false, 2, "14", false);	

	putImage();
		
}


function drawText2(text,x,y,ctx,width,sz,isz,align,adjustfirst) {
	
	var lines = getLines(ctx,text,width,sz+fontUnit+fontName);

	if (adjustfirst && lines.length > 1)
		y = y - (isz/2);

	for(var i=0; i<lines.length; i++) {
	    var y1 = isz*i + y;
	    ctx.font = sz+fontUnit+fontName;
	    ctx.textAlign = align;
	    ctx.textBaseline = "middle";
	    ctx.fillStyle = "black";
	    ctx.fillText(lines[i], x, y1); 

	}
	
	return lines.length;
          
}

function alphaSymbol(ctx, x, y, width, height, radius, stroke, label, startcolor, stopcolor, annotation, lineWidth) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 15;
  }

  var oldWidth = ctx.lineWidth;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width - (radius/2), y, x + width, y + (radius/2));
  ctx.lineTo(x + width + radius, y + height);
    ctx.stroke();

//  ctx.lineTo(x + width, y + (radius/2)); // back

	ctx.beginPath();
    ctx.moveTo(x + width + radius, y);


  ctx.lineTo(x + width, y + height - (radius/2));
  	ctx.quadraticCurveTo(x + width - (radius/2), y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
 	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  	ctx.quadraticCurveTo(x, y, x + radius, y);
//  ctx.closePath();
  
  
    ctx.stroke();
  
  ctx.lineWidth = oldWidth;
  
}


function drawStateMachine(stateMachine, highLightStateNr, aocColor, canvasHeight) {

	var xStart = 50; //x and y coordinates for the top-left
	var yStart = 15;
//	var stateWidth = 290; // size of each state symbol
	var stateWidth = 200; // size of each state symbol
	var stateHeight = 50;
	var stateDistance = 25; // distance between state symbols

	var startcolor = "#dddddd";
	var stopcolor = "#FFFFFF";
	var startHighLightcolor = "#FFCC99";
	var stopHighLightcolor = "#FFFFFF";
	var lineWidth = 3;

    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');

	roundRect(ctx, 15, 4, stateWidth+70, canvasHeight-6, 3, true, "", aocColor, stopcolor, "", false, lineWidth, stateSymbolDefaultFontSize, true);
	
	var len=stateMachine.length;
	for(var i=0; i<len; i++) {
	
		if (i != highLightStateNr) {
			roundRect(ctx, xStart, yStart, stateWidth, stateHeight, 5, true, stateMachine[i], stopcolor, stopcolor, "", false, lineWidth, stateSymbolDefaultFontSize, true);
			linkBoxes.push([xStart,yStart,xStart+stateWidth,yStart+stateHeight,stateMachine[i]+"_sc.html"]);
		}
		else { 
			roundRect(ctx, xStart, yStart, stateWidth, stateHeight, 5, true, stateMachine[i], startHighLightcolor, stopHighLightcolor, "", false, lineWidth, stateSymbolDefaultFontSize, true);
//			linkBoxes.push([xStart,yStart,xStart+stateWidth,yStart+stateHeight,stateMachine[i]+"_statecard.html"]);
		}


		
		if (i < len-1) {
			verticalArrowOpen(ctx, stateWidth / 2 + xStart, yStart + stateHeight, stateDistance-2, 5);
		}	
		
		yStart = yStart + stateHeight + stateDistance;
		
	}
	if (len == 0) 
		drawText("There are no states in this alpha.",rects[0][0], rects[0][1]+30,ctx);

}

function drawLevelsOfDetail(stateMachine, highLightStateNr, reqLevelNr, aocColor, canvasHeight) {

	var xStart = 50; //x and y coordinates for the top-left
	var yStart = 15;
//	var stateWidth = 290; // size of each level symbol
	var stateWidth = 200; // size of each level symbol
	var stateHeight = 50;
	var stateDistance = 25; // distance between level symbols

	var startcolor = "#dddddd";
	var stopcolor = "#FFFFFF";
	var grey = "#D8D8D8";
	var startHighLightcolor = "#FFCC99";
	var stopHighLightcolor = "#FFFFFF";

    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');

	roundRect(ctx, 15, 4, stateWidth+70, canvasHeight-6, 3, true, "", grey, stopcolor, "", false, 3, stateSymbolDefaultFontSize, true);

	var len=stateMachine.length;
	for(var i=0; i<len; i++) {

		var lineWidth = 3;
		if (i <= reqLevelNr)
			lineWidth = 6;
	
		if (i != highLightStateNr)
			roundRect(ctx, xStart, yStart, stateWidth, stateHeight, 10, true, stateMachine[i], stopcolor, stopcolor, "", true, lineWidth, stateSymbolDefaultFontSize, true);
		else 
			roundRect(ctx, xStart, yStart, stateWidth, stateHeight, 10, true, stateMachine[i], startHighLightcolor, stopHighLightcolor, "", true, lineWidth, stateSymbolDefaultFontSize, true);
		
		if (i < len-1) {
			verticalArrowOpen(ctx, stateWidth / 2 + xStart, yStart + stateHeight, stateDistance-2, 5);
		}	
		
		yStart = yStart + stateHeight + stateDistance;
		
	}
	if (len == 0) 
		drawText("There are no levels of detail in this work product.",rects[0][0], rects[0][1]+30,ctx);

}

function drawText(text,x,y,ctx) {

	var width = 130;
	
	var lines = getLines(ctx,text,300,"14"+fontUnit+fontName);

	for(var i=0; i<lines.length; i++) {
	    var x1 = (width / 2) + x;
	    var y1 = 18*i + y;
	    ctx.font = "14"+fontUnit+fontName;
	    ctx.textAlign = "center";
	    ctx.textBaseline = "middle";
	    ctx.fillStyle = "black";
	    ctx.fillText(lines[i], x1, y1); 

	}
	
          
}


function drawCompetencyLevels(levels, highLightStateNr, reqLevelNr, aocColor, canvasHeight) {

	var xStart = 50; //x and y coordinates for the top-left
	var yStart = 15;
//	var levelWidth = 290; // size of each state symbol
	var levelWidth = 200; // size of each state symbol
	var levelHeight = 50;
	var levelDistance = 25; // distance between state symbols

	var startcolor = "#dddddd";
	var stopcolor = "#FFFFFF";
	var startHighLightcolor = "#FFCC99";
	var stopHighLightcolor = "#FFFFFF";
	var lineWidth = 3;

    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');

	roundRect(ctx, 15, 4, levelWidth+70, canvasHeight-6, 3, true, "", aocColor, stopcolor, "", false, lineWidth, stateSymbolDefaultFontSize, true);

	var len=levels.length;
	for(var i=0; i<len; i++) {

		lineWidth = 3;
		if (i >= reqLevelNr && reqLevelNr >= 0)
			lineWidth = 6;
	
		if (i != highLightStateNr)
			roundRect(ctx, xStart, yStart, levelWidth, levelHeight, 1, true, levels[i], stopcolor, stopcolor, (len-i).toString(), false, lineWidth, stateSymbolDefaultFontSize, true);
		else
			roundRect(ctx, xStart, yStart, levelWidth, levelHeight, 1, true, levels[i], startHighLightcolor, stopHighLightcolor, (len-i).toString(), false, lineWidth, stateSymbolDefaultFontSize, true);
						
		yStart = yStart + levelHeight + levelDistance;
		
	}
	if (len == 0) 
		drawText("There are no competency levels.",rects[0][0], rects[0][1]+30,ctx);

}

function drawCardImage(src) {

    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');

	var x = (390 - getImgWidth(src)) / 2;
	var y = (520 - getImgHeight(src)) / 2;

	var myImage = new Image();
	myImage.onload = function() {
		ctx.drawImage(myImage, x, y);
	}
	myImage.src = src;

}

function getImgWidth(imgSrc)
{
	var newImg = new Image();
	newImg.src = imgSrc;
	return newImg.width;
}

function getImgHeight(imgSrc)
{
	var newImg = new Image();
	newImg.src = imgSrc;
	return newImg.height;
}

function drawMyImage(x,y,width,height,name,ctx,src,tw) {

	var xoffset = 65 - (width / 2);
	var yoffset = 0;
	var textWidth = 128;
	if (tw > 0)
		textWidth = tw;

	var textSize = "14"+fontUnit;		

	var myImage = new Image();
	myImage.onload = function() {
		ctx.drawImage(myImage, x+xoffset, y+yoffset);
	}
	myImage.src = src;

	var lines = getLines(ctx,name,textWidth,textSize+fontName);

	if (lines.length == 1) {
	    var x1 = (width / 2) + x + xoffset;
	    var y1 = height + 12 + y + yoffset;
	    ctx.font = textSize+fontName;
	    ctx.textAlign = "center";
	    ctx.textBaseline = "middle";
	    ctx.fillStyle = "black";
	    ctx.fillText(lines[0], x1, y1); 
	} 
	else if (lines.length > 1) {
	    var x1 = (width / 2) + x + xoffset;
	    var y1 = height + 12 + y + yoffset - 2;
	    ctx.font = textSize+fontName;
	    ctx.textAlign = "center";
	    ctx.textBaseline = "middle";
	    ctx.fillStyle = "black";
	    ctx.fillText(lines[0], x1, y1); 	
	    var x2 = (width / 2) + x + xoffset;
	    var y2 = height + 30 + y + yoffset - 2;
	    ctx.font = textSize+fontName;
	    ctx.textAlign = "center";
	    ctx.textBaseline = "middle";
	    ctx.fillStyle = "black";
	    if (lines.length == 2) 
	    	ctx.fillText(lines[1], x2, y2); 
	    else
	    	ctx.fillText(lines[1]+"...", x2, y2); 
	    	
	}
          
}

function verticalArrowClosed(ctx, x, y, len, head) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + len);
  ctx.lineTo(x - head, y + len - head);
//  ctx.moveTo(x, y + len);
  ctx.lineTo(x + head, y + len - head);
  ctx.lineTo(x, y + len);
  ctx.closePath();
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.fill();
}

function verticalArrowOpen(ctx, x, y, len, head) {

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + len);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y + len);
  ctx.lineTo(x - head, y + len - head);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y + len);
  ctx.lineTo(x + head, y + len - head);
  ctx.stroke();
  
}

var rects = [ 
	[130,0,130,85], [0,0,130,85], [260,0,130,85],
	[130,85,130,85], [0,85,130,85], [260,85,130,85],
	[130,170,130,85], [0,170,130,85], [260,170,130,85],
	[130,255,130,85], [0,255,130,85], [260,255,130,85],
	[130,340,130,85], [0,340,130,85], [260,340,130,85],
	[130,425,130,85], [0,425,130,85], [260,425,130,85],
	[130,510,130,85], [0,510,130,85], [260,510,130,85],
	[130,595,130,85], [0,595,130,85], [260,595,130,85],
	[130,680,130,85], [0,680,130,85], [260,680,130,85],
	[130,765,130,85], [0,765,130,85], [260,765,130,85],
	[130,850,130,85], [0,850,130,85], [260,850,130,85]

 ];
 
 
function drawActivitySpaceDiagram(content1, aocColor, canvasHeight) {
 
   var c = document.getElementById('canvas');
   var ctx = c.getContext('2d');
 	var stopcolor = "#FFFFFF";
 
// drawGrid(ctx);  
 
//   var content1 = [ ["Requirements", "System", "Opportunity", "Team", "Test", "Project"], ["Analyst", "Developer"], ["Requirements", "Team", "Project"] ];

//	roundRect(ctx, 15, 2, 360, canvasHeight-5, 3, true, "", aocColor, "#FFFFFF", "", false, 3, "12", true);

   
   // draw input alphas:
   for (var i=0;i<content1[0].length;i++) {
     	drawMyImage( rects[i][0], rects[i][1], 64, 34, content1[0][i][0], ctx, content1[0][i][1],0);
   }
	if (content1[0].length == 0) 
		drawText("There are no input alphas.",rects[0][0], rects[0][1]+14,ctx);

  var conLen0 = content1[0].length;
   if (conLen0 == 0)
   		conLen0 = 1;
    
   var compRow = Math.ceil(conLen0 / 3) * 3;
   var arrowstartx = rects[compRow][0] - 50;
   var arrowstarty = rects[compRow][1] - 5;
   
   var conLen1 = content1[1].length;
   if (conLen1 == 0)
   		conLen1 = 1;
   		 
   compRow = compRow + (3 * conLen1);
   var arrowendx = rects[compRow][0] + 130 + 50;
   var arrowendy = rects[compRow][1];
//	if (content1[1].length > 0) 
   		drawCompArrow(arrowstartx,arrowstarty, arrowendx, arrowendy, ctx, false, aocColor, 40, 115);
   
   
   compRow = Math.ceil(conLen0 / 3) * 3;
   for (var j=0;j<content1[1].length;j++) {
     	drawMyImage( rects[compRow][0], rects[compRow][1], 44, 40, content1[1][j][0], ctx, content1[1][j][1],215);
		compRow = compRow + 3;
   }
	if (content1[1].length == 0) { 
//		drawText("There are no required competencies.",rects[compRow+3][0], rects[compRow+3][1],ctx);
		compRow = compRow + 3;
	}
   
   
   
	compRow = compRow + 3; // put output one row below

   // draw output alphas:
   for (var k=0;k<content1[2].length;k++) {
     	drawMyImage( rects[compRow+k][0], rects[compRow+k][1], 64, 34, content1[2][k][0], ctx, content1[2][k][1],0);
   }
	if (content1[2].length == 0) 
		drawText("There are no output alphas.",rects[compRow+6][0], rects[compRow+6][1],ctx);

}

function drawActivityDiagram(content1, aocColor, canvasHeight) {
 
   var c = document.getElementById('canvas');
   var ctx = c.getContext('2d');
 
// var content1=[["Opportunity"], ["Analyst (accountable)","Customer Representative"], ["Requirements","Use Case"], ["Use-Case Narrative","Supporting Definitions","Use-Case Model"]];

   
   // draw input alphas:
   for (var i=0;i<content1[0].length;i++) {
     	drawMyImage( rects[i][0], rects[i][1], 64, 34, content1[0][i][0], ctx, content1[0][i][1],0);
   }
	if (content1[0].length == 0) 
		drawText("There are no input alphas.",rects[0][0], rects[0][1]+14,ctx);
   
   var compRow = Math.ceil(content1[0].length / 3) * 3;
   var arrowstartx = rects[compRow][0] - 120;
   var arrowstarty = rects[compRow][1] - 5;

   compRow = compRow + Math.ceil(content1[1].length / 3) * 3;
   var arrowendx = rects[compRow][0] + 130 + 120;
   var arrowendy = rects[compRow][1];
	if (content1[1].length > 0) 
   		drawCompArrow(arrowstartx,arrowstarty, arrowendx, arrowendy, ctx, false, aocColor, 15, 185);
   
   compRow = Math.ceil(content1[0].length / 3) * 3;
   for (var j=0;j<content1[1].length;j++) {
     	drawMyImage( rects[compRow+j][0], rects[compRow+j][1], 44, 40, content1[1][j][0], ctx, content1[1][j][1],0);
//		compRow = compRow + 3;
   }
	if (content1[1].length == 0) 
		drawText("There are no required competencies.",rects[compRow+3][0], rects[compRow+3][1],ctx);
      
//	compRow = compRow + 3; // put output one row below
   compRow = compRow + 3 + Math.ceil(content1[1].length / 3) * 3;

   // draw output alphas:
   for (var k=0;k<content1[2].length;k++) {
     	drawMyImage( rects[compRow+k][0], rects[compRow+k][1], 64, 34, content1[2][k][0], ctx, content1[2][k][1],0);
   }
   // draw output work products:
   for (var n=content1[2].length;n<content1[2].length+content1[3].length;n++) {
     	drawMyImage( rects[compRow+n][0], rects[compRow+n][1], 35, 40, content1[3][n-content1[2].length][0], ctx, content1[3][n-content1[2].length][1],0);
   }

	if (content1[2].length == 0 && content1[3].length == 0) 
		drawText("There are no output alphas or work products.",rects[compRow+3][0], rects[compRow+3][1],ctx);

}


function   drawCompArrow(arrowstartx, arrowstarty, arrowendx, arrowendy, ctx, fill, color, headSize, middleOffset) {

  var oldWidth = ctx.lineWidth;
  ctx.lineWidth = 2;
  var oldStrokeStyle = ctx.strokeStyle;
  ctx.strokeStyle = "#999999";

	ctx.beginPath();
	ctx.moveTo(arrowstartx, arrowstarty);
	ctx.lineTo(arrowendx, arrowstarty);
	ctx.lineTo(arrowendx, arrowendy);
	ctx.lineTo(arrowendx+headSize, arrowendy);
	ctx.lineTo(arrowendx-middleOffset, arrowendy+60);
	ctx.lineTo(arrowstartx-headSize, arrowendy);
	ctx.lineTo(arrowstartx, arrowendy);
  	ctx.closePath();
	ctx.stroke();

	if (fill) {	
	    var grad = ctx.createLinearGradient(arrowstartx, arrowstarty, arrowendx, arrowendy);
	    grad.addColorStop(0, color);
	    grad.addColorStop(1, "#FFFFFF");
	    ctx.fillStyle = grad;
	    ctx.fill();
  	}
  	
  	  ctx.lineWidth = oldWidth;
  	  ctx.strokeStyle = oldStrokeStyle; 
  	
}


function drawPatternSpaceDiagram(content1,careAboutPatternSpaces,careAboutPatterns, aocColor, canvasHeight) {
 
   	var c = document.getElementById('canvas');
   	var ctx = c.getContext('2d');
	var stopcolor = "#FFFFFF";
	var yOffset = 15;


	roundRect(ctx, 15, 4, 360, canvasHeight-6, 3, true, "", stopcolor, stopcolor, "", false, 3, stateSymbolDefaultFontSize, true);
 
//   var content1 = [ ["Lifecycle"], ["Milestone"] ];

	if (content1[0].length == 0 && careAboutPatternSpaces) 
		drawText("There are no contained pattern spaces.",rects[0][0], rects[0][1]+30,ctx);
	if (content1[0].length == 0 && content1[1].length == 0 && careAboutPatterns) 
		drawText("There are no contained patterns.",rects[0][0], rects[0][1]+30,ctx);

      
   	var compRow = 0;
   	for (var j=0;j<content1[0].length;j++) {
     	drawMyImage( rects[compRow][0], rects[compRow][1]+yOffset, 64, 28, content1[0][j][0], ctx, content1[0][j][1],0);
		compRow = compRow + 3;
   	}


   	for (var k=0;k<content1[1].length;k++) {
     	drawMyImage( rects[compRow][0], rects[compRow][1]+yOffset, 64, 28, content1[1][k][0], ctx, content1[1][k][1],0);
		compRow = compRow + 3;
   	}
	
}
  
 function drawGrid(ctx) {
 	//ctx.strokeRect (0, 0, 390, 520);  
 


  ctx.strokeRect (rects[0][0], rects[0][1], rects[0][2], rects[0][3]);  
  ctx.strokeRect (rects[1][0], rects[1][1], rects[1][2], rects[1][3]);  
  ctx.strokeRect (rects[2][0], rects[2][1], rects[2][2], rects[2][3]);  

  ctx.strokeRect (rects[3][0], rects[3][1], rects[3][2], rects[3][3]);  
  ctx.strokeRect (rects[4][0], rects[4][1], rects[4][2], rects[4][3]);  
  ctx.strokeRect (rects[5][0], rects[5][1], rects[5][2], rects[5][3]);  

  ctx.strokeRect (rects[6][0], rects[6][1], rects[6][2], rects[6][3]);  
  ctx.strokeRect (rects[7][0], rects[7][1], rects[7][2], rects[7][3]);  
  ctx.strokeRect (rects[8][0], rects[8][1], rects[8][2], rects[8][3]);  

  ctx.strokeRect (rects[9][0], rects[9][1], rects[9][2], rects[9][3]);  
  ctx.strokeRect (rects[10][0], rects[10][1], rects[10][2], rects[10][3]);  
  ctx.strokeRect (rects[11][0], rects[11][1], rects[11][2], rects[11][3]);  

  ctx.strokeRect (rects[12][0], rects[12][1], rects[12][2], rects[12][3]);  
  ctx.strokeRect (rects[13][0], rects[13][1], rects[13][2], rects[13][3]);  
  ctx.strokeRect (rects[14][0], rects[14][1], rects[14][2], rects[14][3]);  

  ctx.strokeRect (rects[15][0], rects[15][1], rects[15][2], rects[15][3]);  
  ctx.strokeRect (rects[16][0], rects[16][1], rects[16][2], rects[16][3]);  
  ctx.strokeRect (rects[17][0], rects[17][1], rects[17][2], rects[17][3]);  

	//ctx.fillStyle = "rgb(200,0,0)";  
  
 	//ctx.fillStyle = "rgba(0, 0, 200, 0.5)";  
 	//ctx.fillRect (0, 30, 55, 50);  

 } 

function roundRect(ctx, x, y, width, height, radius, stroke, label, startcolor, stopcolor, annotation, octagon, lineWidth, labelTextSize, fill) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  if (octagon)
  	ctx.lineTo(x + width, y + radius);
  else
  	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  if (octagon)
  	ctx.lineTo(x + width - radius, y + height);
  else
  	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  if (octagon)
  	ctx.lineTo(x, y + height - radius);
  else
 	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  if (octagon)
  	ctx.lineTo(x + radius, y);
  else
  	ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  
  var oldWidth = ctx.lineWidth;
  ctx.lineWidth = lineWidth;
  
  if (stroke) {
    ctx.stroke();
  }
  
  ctx.lineWidth = oldWidth;
  
    var grad = ctx.createLinearGradient(x, y, x+width, y+height);
    grad.addColorStop(0, startcolor);
//    grad.addColorStop(0.5, '#FFFF00');
    grad.addColorStop(1, stopcolor);
    ctx.fillStyle = grad;
  
  
  if (fill) {
    ctx.fill();
  }
  
  // label text

  
    if (annotation != null && annotation != "")  { // used e.g. for competency levels
	    var xl1 = width + x - 8;
	    var yl1 = height + y - 8;
 	    ctx.font = "10"+fontUnit+fontName;
	    ctx.textAlign = "center";
	    ctx.textBaseline = "middle";
	    ctx.fillStyle = "black";
	    ctx.fillText(annotation, xl1, yl1); 
	      
	    drawCircle(ctx,xl1,yl1,ctx.measureText(annotation).width);
    }
     

	var lines = getLines(ctx,label,width-4,labelTextSize+fontUnit+fontName);

	if (lines.length == 1) {
	    var x1 = (width / 2) + x;
	    var y1 = (height / 2) + y;
	    ctx.font = labelTextSize+fontUnit+fontName;
	    ctx.textAlign = "center";
	    ctx.textBaseline = "middle";
	    ctx.fillStyle = "black";
	    ctx.fillText(lines[0], x1, y1); 
	} 
	else if (lines.length > 1) {
	    var x1 = (width / 2) + x;
	    var y1 = (height / 2) + y - 14;
	    ctx.font = labelTextSize+fontUnit+fontName;
	    ctx.textAlign = "center";
	    ctx.textBaseline = "middle";
	    ctx.fillStyle = "black";
	    ctx.fillText(lines[0], x1, y1); 	
	    var x2 = (width / 2) + x;
	    var y2 = (height / 2) + y + 14;
	    ctx.font = labelTextSize+fontUnit+fontName;
	    ctx.textAlign = "center";
	    ctx.textBaseline = "middle";
	    ctx.fillStyle = "black";
	    if (lines.length == 2) 
	    	ctx.fillText(lines[1], x2, y2); 
	    else
	    	ctx.fillText(lines[1]+"...", x2, y2); 
	    	
	}
          
}

function drawCircle(ctx,centerX,centerY,radius) {

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
//    ctx.fillStyle = "#8ED6FF";
//    ctx.fill();
    ctx.lineWidth = 1;
  	ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.stroke();
}

function getLines(ctx,phrase,maxPxLength,textStyle) {
    var wa=phrase.split(" "),
        phraseArray=[],
        lastPhrase="",
        l=maxPxLength,
        measure=0;
    ctx.font = textStyle;
    for (var i=0;i<wa.length;i++) {
        var w=wa[i];
        measure=ctx.measureText(lastPhrase+w).width;
        if (measure<l && i==0) {
            lastPhrase+=(w);
        }else if (measure<l && i>0) {
            lastPhrase+=(" "+w);
        }else {
            phraseArray.push(lastPhrase);
            lastPhrase=w;
        }
        if (i===wa.length-1) {
            phraseArray.push(lastPhrase);
            break;
        }
    }
    return phraseArray;
}


function putImage()
{
  var canvas1 = document.getElementById("canvas");        
  if (canvas1.getContext) {
 	 var ctx = canvas1.getContext("2d");                // Get the context for the canvas.
     var myImage = canvas1.toDataURL("image/png");      // Get the data as an image.
  }
  var imageElement = document.getElementById("cardpic");  // Get the img object.
  imageElement.src = myImage;                           // Set the src to data from the canvas.
  
}

window.onload=init;