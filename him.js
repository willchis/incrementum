const SPEED = 12;
const DRAG = 0.5;
const MAX_SPEED = 10;

// Main character
class Him {
    constructor(sprites) {
        this._direction = 'down';
        this._sprites = sprites;
    }
    
    getDirection() {
      return this._direction;
    }
    
    left() {
      this._direction = 'left';
      this._sprites.x -= SPEED;
      this.switchAnimation('left');
    }
    
    leftUp() {
      this._direction = 'leftUp';
      this._sprites.x -= SPEED;
      this._sprites.y -= SPEED;
      this.switchAnimation('leftUp');
    }
    
    leftDown() {
      this._direction = 'leftDown';
      this._sprites.x -= SPEED;
      this._sprites.y += SPEED;
      this.switchAnimation('leftDown');
    }
    
    right() {
      this._direction = 'right';
      this._sprites.x += SPEED;
      this.switchAnimation('right');
    }
    
    rightUp() {
      this._direction = 'rightUp';
      this._sprites.x += SPEED;
      this._sprites.y -= SPEED;
      this.switchAnimation('rightUp');
    }
    
    rightDown() {
      this._direction = 'rightDown';
      this._sprites.x += SPEED;
      this._sprites.y += SPEED;
      this.switchAnimation('rightDown');
    }
    
    up() {
      this._direction = 'up';
      this._sprites.y -= SPEED;
      this.switchAnimation('up');
    }
    
    down() {
      this._direction = 'down';
      this._sprites.y += SPEED;
      this.switchAnimation('down');
    }
    
    noInput() {
      if (this._direction === 'up') {
        this.switchAnimation('upHover');
      } else if (this._direction === 'down') {
        this.switchAnimation('downHover');
      } else if (this._direction === 'left') {
        this.switchAnimation('leftHover');
      } else if (this._direction === 'leftDown') {
        this.switchAnimation('leftDownHover');
      } else if (this._direction === 'leftUp') {
        this.switchAnimation('leftUpHover');
      } else if (this._direction === 'right') {
        this.switchAnimation('rightHover');
      } else if (this._direction === 'rightDown') {
        this.switchAnimation('rightDownHover');
      } else if (this._direction === 'rightUp') {
        this.switchAnimation('rightUpHover');
      }
      
    }
    
    // Check if chosen animation is running, if not then switch to it
    switchAnimation(name) {
      if (this._sprites.currentAnimation !== name) {
        this._sprites.gotoAndPlay(name);
      } else {
        this._sprites.play();
      }
    }
};
  
