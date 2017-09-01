//Copyright Matti Paalanen http://www.mattipaalanen.com

// you can increase this but it will make the process more heavy and slow
var TREE_COUNT = 5;
var TRUNK_VARIANCE = 0.8 
var TRUNK_VARIANCE_RANGE = 0.4
var ANGLE_VARIANCE = 0.7; //how big of a variance in their angles the trees and their branches will have. Reasonable values 0.7-0.9
var ANGLE_VARIANCE_RANGE = 0.5 //the random range that will be added to base variance. Reasonable values between 0-0.45
var BRANCH_ANGLE = 0.7; //how big an angle the branches will grow from the parent trunk. Reasonable values 0.5-0.8
var BRANCH_ANGLE_RANGE = 0.5 // variance of the branch angles, reasonable values 0.3-0.6

var canvas, ctx, width, height; //these will be initialized in initVariables();

var gameRunning = false;
var loopSpeed = 50;

var branches = [];
var finished = [];


function initVariables() {
	canvas = document.getElementById('treeCanvas');
	width = canvas.width;
	height = canvas.height;

	resetBranches();
}

function resetBranches() {
	branches = [];

	for (var i=0;i<TREE_COUNT;++i) {
		branches.push(getRootNode());
	}
}

function getRandom(limit) {
	return Math.floor(Math.random()*limit);
}

function getRandomDecimal(limit) {
	return Math.random()*limit;
}

function getRootNode() {
	var root = {};
	root.startX = Math.floor(0.4*width + getRandom(width*0.2));
	root.startY = height*0.75;
	root.nodeLength = 30+getRandom(60);
	root.angleVariance = TRUNK_VARIANCE + getRandomDecimal(TRUNK_VARIANCE_RANGE);
	root.direction = Math.PI/2 + getRandomDecimal(root.angleVariance)-(root.angleVariance/2);
	root.curLength = 0;
	setEndCoords(root);
	root.branchChance = 4+getRandom(6);
	root.branchAngle = Math.PI/6 + getRandomDecimal(Math.PI/6);
	root.symmetry = 3 + getRandom(7);
	root.opacity = 1;
	root.generation = 1;
	root.thickness = 5;
	root.multipleBranches = Math.random() < 0.3;
	
	root.growth = 12;

	return root;
}

function getExtension(parent, branchMode) {
	var extension = {};

	extension.startX = parent.endX;
	extension.startY = parent.endY;
	
	extension.finished = false;
	extension.nodeLength = parent.nodeLength * (0.8 + getRandomDecimal(0.15));
	extension.angleVariance = parent.angleVariance * 0.9;
	extension.branchChance = getRandom(10);
	extension.branchAngle = parent.branchAngle * (BRANCH_ANGLE + getRandomDecimal(BRANCH_ANGLE_RANGE));
	extension.direction = parent.direction + getRandomDecimal(parent.angleVariance) - (parent.angleVariance/2);
	extension.generation = parent.generation + 1;
	extension.growth = parent.growth * 0.9;
	extension.curLength = 0;

    
	if (branchMode) {
		extension.nodeLength = parent.nodeLength*(0.5 + getRandomDecimal(0.35));
		extension.angleVariance = parent.angleVariance * (ANGLE_VARIANCE + getRandomDecimal(ANGLE_VARIANCE_RANGE));
		extension.branchChance = parent.branchChance * (0.5 + getRandomDecimal(0.35));
		extension.branchAngle = parent.branchAngle * (BRANCH_ANGLE + getRandomDecimal(BRANCH_ANGLE_RANGE));
		extension.direction = getBranchDirection(parent) + getRandomDecimal(parent.angleVariance) - (parent.angleVariance/2);
		extension.growth = parent.growth * 0.8;
	}

	setEndCoords(extension, extension.curLength);
	extension.opacity = 0.95*parent.opacity;
	if (extension.opacity < 0.4)
		extension.opacity = 0.4;
	extension.multipleBranches =  Math.random() < 0.3;

    extension.symmetry = parent.symmetry;
    extension.generation = parent.generation + 1;
    extension.thickness = parent.thickness -1;
    if (extension.thickness < 1)
    	extension.thickness = 1;
	
	

	return extension;
}

function setEndCoords(node) {
	node.endX = node.startX + Math.cos(node.direction)*node.curLength;
	node.endY = node.startY - Math.sin(node.direction)*node.curLength;
}


function getBranchDirection(parent) {
	var direction =  parent.direction + parent.branchAngle;
	if (getRandom(10) < parent.symmetry) {
		direction = parent.direction - parent.branchAngle;
	}
	return direction;
}

 
 function startGame() {
 	
	gameRunning = true;
 	intervalId = setInterval(function() {gameLoop(); }, loopSpeed);

 }

 function drawBranches() {
 	for (var i=0;i<branches.length;++i) {
		var branch = branches[i];
		drawBranch(branch);
	}
 }

 function gameLoop() {
 	if(gameRunning) {

		for (var i=0;i<branches.length;++i) {
			var branch = branches[i];
			drawBranch(branch);
		}
		updateBranches();
		

 	}
 }
 
 function updateBranches() {
 	for (var i=0;i<branches.length;++i) {
		var branch = branches[i];
		updateBranch(branch);
	}
 }

function updateBranch(branch) {
	//skip
	if (branch.finished)
		return;
	
	//we are finished
	if (branch.curLength >= branch.nodeLength) {
		
		//growth ended, lets extend
		branch.finished = true;
		if (branch.nodeLength > 5) {
			branches.push(getExtension(branch));
		}

		//skip branches if so
		if (getRandom(10) >= branch.branchChance)
			return;

		//create branches
		branches.push(getExtension(branch, true));
		if (branch.multipleBranches) {
			branches.push(getExtension(branch, true));
			if (Math.random() < 0.5)
				branches.push(getExtension(branch, true));
		}
	}

	branch.curLength = branch.curLength + branch.growth;
	setEndCoords(branch);

}


 function drawBranch(branch) {
 	if (!branch.finished) {
	 	//ctx.fillStyle="rgba(0,"+branch.green +",0,"+ branch.opacity + ")";
	 	ctx.strokeStyle ="rgba(0,0,0,"+ branch.opacity + ")";
	 	ctx.lineWidth = branch.thickness;
		ctx.lineJoin = ctx.lineCap = 'round';
		ctx.shadowBlur = branch.thickness;
		ctx.shadowColor = 'rgb(0, 0, 0)';
	 	ctx.beginPath();
		ctx.moveTo(branch.startX, branch.startY);
		ctx.lineTo(branch.endX, branch.endY);
		ctx.stroke();
	 	
 	}
 }

 function clearGameArea() {
 	ctx.clearRect(0,0,width,height);
	
 }

 function mouse(e) {
 	 if (e.button == 0) {
	 	clearGameArea();
	 	resetBranches();
	 }
 }

 function touch(e) {
 	clearGameArea();
	resetBranches();
 }
 

function initGame() {
	ctx = canvas.getContext("2d");
	ctx.font="20px Georgia";

	clearGameArea();

	canvas.addEventListener("mousedown", mouse, false);
    canvas.addEventListener("touchstart", touch, false);
    

}


$(document).ready(function() {
	
    initVariables();
    initGame();
    startGame();
});
