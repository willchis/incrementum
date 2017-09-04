
var KEYCODE_ENTER = 13;		//usefull keycode
var KEYCODE_SPACE = 32;		//usefull keycode
var KEYCODE_UP = 38;		//usefull keycode
var KEYCODE_LEFT = 37;		//usefull keycode
var KEYCODE_DOWN = 40;		//usefull keycode
var KEYCODE_RIGHT = 39;		//usefull keycode
var KEYCODE_W = 87;			//usefull keycode
var KEYCODE_A = 65;			//usefull keycode
var KEYCODE_D = 68;			//usefull keycode
var KEYCODE_S = 83;			//usefull keycode
var KEYCODE_SPACE = 32;			//usefull keycode

var spaceHeld;			//is the user holding a space
var lfHeld;				//is the user holding the left command
var rtHeld;				//is the user holding the right command
var upHeld;			//is the user holding the up command
var dnHeld;			//is the user holding the down command
var spaceHeld;		// has the user pressed space

// Globals
var him, 
    stage;

function init() {
    console.log('foo');
    // create a new stage and point it at our canvas:
    var canvas = document.getElementById("canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    stage = new createjs.Stage(canvas);
    
    // json map data at the end of this file for ease of understanding (created on Tiled map editor)
    // mapData = mapDataJson; // could get from JSON instead when on live.
    // var mapSize = 1000;
    // for (var i = 0; i < mapSize; i++) {
    //     mapData.layers[0].data.push(85);
    //     if (Math.random() > 0.98) {
    //         mapData.layers[0].data.push(101);
    //     } else if (Math.random() < 0.01) {
    //         mapData.layers[0].data.push(103);
    //     }
    // }
    // create EaselJS image for tileset
    tileset = new Image();
    // getting imagefile from first tileset
    //tileset.src = mapData.tilesets[0].image;
    // callback for loading layers after tileset is loaded
    //tileset.onLoad = initLayers();

    // Define a spritesheet.
    // 0 - 7 hover right
    // 56 - 64 hover right up
    // 112 hover 
    // 168
    // 224
    // 280
    // 336
    // 392
    // 448
    var dragonAnimations = new createjs.SpriteSheet({
        "animations": 
            {
                'leftHover': [0, 7],
                'left': [8,15],
                'leftUpHover': [56, 63],
                'leftUp': [64, 71],
                'upHover': [112, 119],
                'up': [120, 127],
                'rightUpHover': [168, 175],
                'rightUp': [176, 183],
                'rightHover': [224, 231],
                'right': [232, 239],
                'rightDownHover': [280, 287],
                'rightDown': [288, 295],
                'downHover': [336, 343],
                'down': [343, 350],
                'leftDownHover': [392, 399],
                'leftDown': [400, 407]
            },
        "images": ["assets/dragon.png"],
        "frames":
            {
                "height": 256,
                "width":256,
                "regX": 0,
                "regY": 0,
                "count": 448
            }
    });
    
    // Add the ship as a sprite animation
    var himSprite = new createjs.Sprite(dragonAnimations, 336); // don't start any animations
    himSprite.x = 360;
    himSprite.y = 22;
    
    // Add sprites to global ship option
    him = new Him(himSprite);

    // Add ship to stage, and add it as a listener to Ticker to get updates each frame.
    stage.addChild(himSprite);
    createjs.Ticker.setFPS(18);
    // Update stage every tick
    createjs.Ticker.addEventListener("tick", stage);
    
    // Add ticker
    createjs.Ticker.addEventListener("tick", tick);
}

function tick() {
    // Check for double key
    if (lfHeld) {
        if (upHeld) {
            him.leftUp();
        } else if (dnHeld) {
            him.leftDown();
        } else {
            him.left();
        }
    }
    
    // Check for double key
    if (rtHeld) {
        if (upHeld) {
            him.rightUp();
        } else if (dnHeld) {
            him.rightDown();
        } else {
            him.right();
        }
    }
    
    if (upHeld && !lfHeld && !rtHeld) {
        him.up();
    }
    
    if (dnHeld && !lfHeld && !rtHeld) {
        him.down();
    } 
    if (!lfHeld && !rtHeld && !upHeld && !dnHeld) {
        him.noInput();
    }
}

    // Bind keys
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

// Add WASD key listeners
function handleKeyDown(e) {
    //cross browser issues exist
    if(!e){ var e = window.event; }
    switch(e.keyCode) {
        case KEYCODE_A:
        case KEYCODE_LEFT:	lfHeld = true; return false;
        case KEYCODE_D:
        case KEYCODE_RIGHT: rtHeld = true; return false;
        case KEYCODE_W:
        case KEYCODE_UP:	upHeld = true; return false;
        case KEYCODE_S:
        case KEYCODE_DOWN:	dnHeld = true; return false;
        case KEYCODE_SPACE:	spaceHeld = true; return false;
        case KEYCODE_ENTER:	 if(canvas.onclick == handleClick){ handleClick(); }return false;
    }
}

function handleKeyUp(e) {
    //cross browser issues exist
    if(!e){ var e = window.event; }
    switch(e.keyCode) {
        case KEYCODE_A:
        case KEYCODE_LEFT:	lfHeld = false; break;
        case KEYCODE_D:
        case KEYCODE_RIGHT: rtHeld = false; break;
        case KEYCODE_W:
        case KEYCODE_UP:	upHeld = false; break;
        case KEYCODE_S:
        case KEYCODE_DOWN:	dnHeld = false; break;
    }
}

// loading layers
function initLayers() {
    // compose EaselJS tileset from image (fixed 64x64 now, but can be parametized)
    var w = mapData.tilesets[0].tilewidth;
    var h = mapData.tilesets[0].tileheight;
    var imageData = {
        images : [ tileset ],
        frames : {
            width : w,
            height : h
        }
    };
    // create spritesheet
    var tilesetSheet = new createjs.SpriteSheet(imageData);
    
    // loading each layer at a time
    
    // stage updates (not really used here)
    createjs.Ticker.setFPS(20);
    createjs.Ticker.addEventListener(stage);
}

// layer initialization
function initLayer(layerData, tilesetSheet, tilewidth, tileheight) {
    for ( var y = 0; y < layerData.height; y++) {
        for ( var x = 0; x < layerData.width; x++) {
            // create a new Bitmap for each cell
            var cellBitmap = new createjs.BitmapAnimation(tilesetSheet);
            // layer data has single dimension array
            var idx = x + y * layerData.width;
            // tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
            cellBitmap.gotoAndStop(layerData.data[idx] - 1);
            // isometrix tile positioning based on X Y order from Tiled
            cellBitmap.x = (window.innerWidth / 2) + x * tilewidth/2 - y * tilewidth/2;
            cellBitmap.y = -100 + (y * tileheight/2 + x * tileheight/2);
            // add bitmap to stage
            stage.addChild(cellBitmap);
        }
    }
}

// Map data created on Tiled map editor (mapeditor.org). Use export for JSON format
var mapDataJson = { "height":1,
 "layers":[
        {
         "data":[10000], // insert extra items into this rather than writing a huge array here
         "height":32,
         "name":"ground00",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":32,
         "x":0,
         "y":0
        }
        ],
 "orientation":"isometric",
 "properties":
    {

    },
 "version":1,
 "width":10
};