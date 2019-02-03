/********************
 *  Global variables, constants
 ********************/
var allEnemies = [],
    allGems = [],
    player,
    a;


// object of constants
var C = {
    TILE_W: 101,
    TILE_H: 83,
    START_X: 202,
    START_Y: 470
};

/********************
 *  class Enemy
 ********************/

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt) {

};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/********************
 *  class Player
 ********************/

var Player = function () {
    this.width = 101;
    this.height = 73;
    this.x = C.START_X;
    this.y = C.START_Y;
    this.sprite = 'images/char-boy.png';
    this.stepX = C.TILE_W;
    this.stepY = C.TILE_H;
    this.lives = 3;
}

Player.prototype.update = function(dt) {
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y - this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height); // test borders
};

Player.prototype.handleInput = function(input){
    switch(input){
        case 'up':
            if(this.y > 0)
                this.y -= this.stepY;
            break;
        case 'down':
            if(this.y < C.TILE_H * 5)
                this.y += this.stepY;
            break;
        case 'left':
            if(this.x > 0)
                this.x -= this.stepX;
            break;
        case 'right':
            if(this.x < C.TILE_W * 4)
                this.x += this.stepX;
            break;
    }
}

// reset player position
Player.prototype.reset = function() {
    this.x = C.START_X;
    this.y = C.START_Y;
};

/********************
 *  class Gem
 ********************/

var Gem = function(color, points, row){
    this.width = C.TILE_W * 0.7;
    this.height = C.TILE_H * 0.9;
    this.row = row;
    this.x = C.TILE_W * this.row + 20;
    this.y = C.TILE_H * this.row + 55;
    this.sprite = 'images/gem-' + color + '.png';
    this.points = points;
}

Gem.prototype.clear = function () {
    this.x = -100;

}

Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    ctx.strokeStyle  = 'red';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
}


document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// function to instantiate objects
var Game = function () {
    player = new Player();
    allGems.push(new Gem('green', 100, 1), new Gem('orange', 200, 4));
}
Game();