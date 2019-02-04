/********************
 *  Global variables, constants and helpers
 ********************/
var allEnemies = [],
    allGems = [],
    player,
    board,
    modal,
    level,
    manager;


// object of constants
var C = {
    TILE_W: 101,
    TILE_H: 83,
    START_X: 202,
    START_Y: 470
};

// helper function to return random integer
function getRandom(min, max) {
    return Math.floor(min + Math.random()*(max + 1 - min));
}

/********************
 *  class Enemy
 ********************/

var Enemy = function(row, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.step = C.TILE_W;
    this.x = -100;
    this.y = row * C.TILE_H + 55;
    this.speed = speed;
    this.width = C.TILE_W *.8;  // 80% original dimensions
    this.height = C.TILE_H *.8;
};

Enemy.prototype.update = function(dt) {
    if(this.x < this.step * 5){
        this.x += this.speed * dt;
    }
    else{
       this.x = -this.step;
    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y - this.height -10);
    ctx.strokeStyle  = 'red';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
};

/********************
 *  class Player
 ********************/

var Player = function () {
    this.width = C.TILE_W * 0.9;
    this.height = C.TILE_H;
    this.x = C.START_X + 10;
    this.y = C.START_Y;
    this.sprite = 'images/char-boy.png';
    this.stepX = C.TILE_W;
    this.stepY = C.TILE_H;
    this.hearts = 3;
}

Player.prototype.update = function(dt) {
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x - 10, this.y - this.height + 25);
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

Player.prototype.incHeart = function () {
    this.hearts = this.hearts + 1;
}

Player.prototype.decHeart = function() {
    this.hearts = this.hearts - 1;
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
    this.x = -200; //create an illusion of acheiving the gem
    board.addGem();
}

Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y -33, this.width, this.height+33);
    ctx.strokeStyle  = 'red';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
}

/********************
 *  class Board, handles the level, gems, hearts, and score
 ********************/

var Board = function () {
    this.bLevel = 1;
    this.bHearts = 3;
    this.bScore = 0;
    this.bGems = 0;
};

Board.prototype.render = function() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0,50, 505, 45);
    this.showLevel();
    this.showScore();
    this.showHearts();
    this.showGems();
};

Board.prototype.showLevel = function() {
    ctx.font = '1.4em courier';  //atari flavor :)
    ctx.fillStyle = 'white';
    ctx.fillText('Level: '+ this.bLevel, 15, 80);
};

Board.prototype.updateLevel = function(l) {
    this.bLevel = l;
};

Board.prototype.showScore = function() {
    ctx.font = '1.3em courier';
    ctx.fillStyle = 'white';
    ctx.fillText(this.bScore, 420, 80);
};

Board.prototype.updateScore = function(s) {
    this.bScore = this.bScore + s;
};

Board.prototype.showHearts = function() {
    ctx.drawImage(Resources.get('images/Heart.png'), 210, 45, 30,50);
    ctx.fillStyle = 'white';
    ctx.fillText('x'+ this.bHearts, 250, 80);
};

Board.prototype.updateHearts = function(h) {
    this.bHearts = h;
};

Board.prototype.showGems = function() {
    ctx.drawImage(Resources.get('images/gem-orange.png'), 310, 45, 25,40);
    ctx.fillStyle = 'white';
    ctx.fillText('x'+ this.bGems, 340, 80);
};

Board.prototype.addGem = function () {
    this.bGems = this.bGems + 1;
}

Board.prototype.reset = function() {
    this.bScore = 0;
    this.bGems = 0;
    this.bLevel = 1;
    this.updateHearts(3);

};

/********************
 *  class Level
 ********************/

var Level = function() {
    this.level = 1;
};

Level.prototype.update = function() {

    // Increase level when player reaches water, and reset him
    this.level++;
    player.reset();

    // Update level on board, and add 500 bonus
    board.updateLevel(this.level);
    board.updateScore(500);

    manager.spawnGems(getRandom(2, 4));
    if(this.level % 4 == 0)
        manager.spawnEnemies(1);
}

Level.prototype.reset = function() {

    // Reset to level 1
    board.reset();

    // Reset player's position
    player.reset();
    this.level = 1;
}

/********************
 *  class Modal, game over screen
 ********************/

var Modal = function () {
    this.element = document.querySelector('.modal');

    this.show = function () {
        this.element.style.display = 'block';
        var modalBody = document.querySelector('#modal-body');
        var msg =  `<h2>Points collected: ${board.bScore} </h2>
                    <h2>Gems collected: ${board.bGems}</h2>
                    <h2>Level ${board.bLevel}</h2>`

        modalBody.innerHTML = msg;
        document.querySelector('#play').addEventListener('click', function () {
            modal.hide();
            level.reset();
            manager.resetEnemies();
            Game();
        })
    }

    this.hide = function () {
        this.element.style.display = 'none';
    }
}

/********************
 *  class Manager, manages enemies and gems
 ********************/

var Manager = function() {};

Manager.prototype.spawnGems = function(total) {
    // generate a gem with random position and color

    var colors = ['blue', 'green', 'orange'];
    var c, p;

    for (var i = 0; i < total; i++) {
        c = colors[getRandom(1,3) - 1] ;
        switch(c){
            case 'blue':
                p = 300; break;
            case 'green':
                p = 200; break;
            case 'orange':
                p = 100; break;
        }

        allGems.push(new Gem(c, p, getRandom(1, 3)));
    }
};

Manager.prototype.spawnEnemies = function (total) {
    // generate an enemy with random position and speed
    for (let i = 0; i < total; i++) {

        var r = getRandom(1, 3);

        var s = getRandom(50,300);

        allEnemies.push(new Enemy(r, s));
      }
}

Manager.prototype.resetEnemies = function () {
    allEnemies = [];
    allGems = [];
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
    // draw logo
    board = new Board();
    modal = new Modal();
    level = new Level();
    player = new Player();
    manager = new Manager();
    manager.spawnEnemies(1);
    manager.spawnGems(2);
}
Game();