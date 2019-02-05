/********************
 *  Global variables, constants and helpers
 ********************/
var allEnemies = [],
    allGems = [],
    player,
    board,
    modal,
    level,
    heart,
    key,
    rock,
    bullet,
    manager;

    var now;
    var lastTime;

// object of constants
var C = {
    TILE_W: 101,
    TILE_H: 70,
    START_X: 303,
    START_Y: 475
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
    // while the bug is on-canvas
    if(this.x < this.step * 6){
        this.x += this.speed * dt;
    }
    else{
       this.x = -this.step;
    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y - this.height - 20);
    ctx.strokeStyle  = 'red';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
};

/********************
 *  class Player
 ********************/

var Player = function () {
    this.width = C.TILE_W * 0.9;
    this.height = C.TILE_H;
    this.x = C.START_X + 5;
    this.y = C.START_Y;
    this.sprite = 'images/char-boy.png';
    this.stepX = C.TILE_W;
    this.stepY = C.TILE_H;
    this.hearts = 3;
    this.rocks = 0;
    this.killed = 0;
}

Player.prototype.update = function() {
    // I borrowed this to implement a firing function
    now = Date.now();
    dt = (now - lastTime) / 1000.0;
    lastTime = now;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x - 10, this.y - this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height); // test borders
};

Player.prototype.handleInput = function(input){
    switch(input){
        case 'up':
            if(this.y > 0)
                this.y -= this.stepY;
            break;
        case 'down':
            if(this.y < C.TILE_H * 6)
                this.y += this.stepY;
            break;
        case 'left':
            if(this.x > 0)
                this.x -= this.stepX;
            break;
        case 'right':
            if(this.x < C.TILE_W * 5)
                this.x += this.stepX;
            break;
        case 'space':
            if(this.rocks > 0){
                bullet = new Bullets(this.x, this.y);
                bullet.shoot();
                player.rocks -= 1;
                board.bRocks -= 1;
            }
            else
                board.bRocks = 0;
            event.preventDefault();
            break;
    }
}

Player.prototype.incHeart = function () {
    this.hearts = this.hearts + 1;
}

Player.prototype.decHeart = function() {
    this.hearts = this.hearts - 1;
}

Player.prototype.incRock = function () {
    this.rocks = this.rocks + 1;
}

Player.prototype.decRock = function() {
    this.rocks = this.rocks - 1;
}

// reset player position
Player.prototype.reset = function() {
    this.x = C.START_X;
    this.y = C.START_Y;
    this.killed = 0;
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
    this.bRocks = 0;
    this.bKills= 0;
};

Board.prototype.render = function() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0,50, 606, 45);
    this.showLevel();
    this.showScore();
    this.showHearts();
    this.showGems();
    this.showRocks();
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
    ctx.drawImage(Resources.get('images/Star.png'), 475, 43, 30,50);
    ctx.fillStyle = 'white';
    ctx.fillText(this.bScore, 510, 80);
};

Board.prototype.updateScore = function(s) {
    this.bScore = this.bScore + s;
};

Board.prototype.showHearts = function() {
    ctx.drawImage(Resources.get('images/Heart.png'), 270, 45, 30,50);
    ctx.fillStyle = 'white';
    ctx.fillText(this.bHearts, 310, 80);
};

Board.prototype.showGems = function() {
    ctx.drawImage(Resources.get('images/gem-green.png'), 370, 45, 25,40);
    ctx.fillStyle = 'white';
    ctx.fillText(this.bGems, 410, 80);
};

Board.prototype.addGem = function () {
    this.bGems = this.bGems + 1;
}

Board.prototype.showRocks = function() {
    ctx.drawImage(Resources.get('images/Rock.png'), 170, 40, 30,50);
    ctx.fillStyle = 'white';
    ctx.fillText(this.bRocks, 210, 80);
};

Board.prototype.reset = function() {
    this.bScore = 0;
    this.bKills= 0;
    this.bGems = 0;
    this.bLevel = 1;
    this.bHearts = 3;
    this.bRocks = 5;
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

    // add random number of bugs every 5 levels
    if(this.level % 5 == 0)
        manager.spawnEnemies(getRandom(1, Math.floor(this.level/10)));

    // add 1 heart every 6 levels
    if(this.level % 6 == 0){
        manager.spawnHeart();
        setTimeout(() => {
            heart = null;
        }, 6000);
    }

    // add 1 key every 5 levels
    if(board.bLevel % 5 == 0){
        manager.spawnKey();
        setTimeout(() => {
            key = null;
        }, 5000);
    }

    // add 1 rock every 4 levels
    if(board.bLevel % 4 == 0){
        manager.spawnRock();
        setTimeout(() => {
            rock = null;
        }, 4000);
    }

    // give the ability to fire rocks
    if(board.bLevel == 10){
        player.rocks = 5;
        board.bRocks = 5;
    }
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
                    <h2>Level reached: ${board.bLevel}</h2>
                    <h2>Bugs Killed: ${board.bKills}</h2>`;
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
 *  class Heart
 ********************/

var Heart = function (row) {
    this.sprite = 'images/Heart.png';
    this.width = C.TILE_W;
    this.height = C.TILE_H;
    this.row = row;
    this.x = C.TILE_W * this.row;
    this.y = C.TILE_H * this.row + 50;
}

Heart.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width+10, this.height+15);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
}

/********************
 *  class Key
 ********************/

var Key = function (row) {
    this.sprite = 'images/Key.png';
    this.width = C.TILE_W * 0.7;
    this.height = C.TILE_H * 0.9;
    this.row = row;
    this.x = C.TILE_W + 20;
    this.y = C.TILE_H * this.row + 55;
}

Key.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width+10, this.height+15);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
}

/********************
 *  class Rock, picked up by the Player
 ********************/

var RockFactory = function (x, y) {
    this.sprite = 'images/Rock.png';
    this.width = C.TILE_W * 0.6;
    this.height = C.TILE_H * 0.9;
    this.x = x;
    this.y = y;
}

RockFactory.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
}

/********************
 *  class Bullets, represents rocks thrown by Player
 ********************/

var Bullets = function (x, y) {
    this.sprite = 'images/Rock.png';
    this.width = C.TILE_W * 0.6;
    this.height = C.TILE_H;
    this.x = x;
    this.y = y - 10;
    this.velocity = 500;
}

Bullets.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
}

Bullets.prototype.shoot = function () {
    setInterval(() => {
        this.x -= dt * this.velocity;
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    }, 30);

}

Bullets.prototype.die = function() {
    this.x = -100;
};

/********************
 *  class Manager, manages enemies and gems
 ********************/

var Manager = function() {};

Manager.prototype.spawnGems = function(total) {
    // generate a gem with random position and color, and unique points

    if(allGems.length != 0)
        allGems = [];   // empty this array each time for optimization

    var colors = ['blue', 'green', 'orange'];
    var c, p;

    for (var i = 0; i < total; i++) {
        c = colors[getRandom(0,2)] ;
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

        var r = getRandom(2, 4);

        var s = getRandom(100,300);

        allEnemies.push(new Enemy(r, s));
    }
}

Manager.prototype.spawnRock = function () {
    var x = C.TILE_W * 5 + 20;
    var y = C.TILE_H;
    //always appear at the right-most column
    rock = new RockFactory(x, y * getRandom(3,6) + 50);
}

Manager.prototype.resetEnemies = function () {
    allEnemies = [];
    allGems = [];
}

Manager.prototype.spawnHeart = function () {
    heart = new Heart(getRandom(1, 4));
}

Manager.prototype.spawnKey = function () {
    key = new Key(getRandom(4, 6));
}

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
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

    // dummy off-canvas objects just for instantiation
    heart = new Heart(-2);
    key = new Key(-6);
    rock = new RockFactory(-100, -100)
    bullet = new Bullets(-100, -100);
}
Game();