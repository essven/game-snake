'use strict';
//установить счёт игры в ноль и настроить холст
let score = 0;
const canvas = document.querySelector('canvas'),
      ctx = canvas.getContext('2d'),
      width = canvas.width,
      height = canvas.height,
      blockSize = 10,
      widthInBlocks = width/blockSize,
      heightInBlocks = height/blockSize;

let drawBorder = function(){
    ctx.fillstyle = 'gray';
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(0, height - blockSize, width,blockSize);
    ctx.fillRect(width -blockSize, 0, blockSize, height);
};

let drawScore = function(){
    ctx.font = '20px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Счёт: ${score}`, blockSize, blockSize);
};

let gameOver = function(){
    // clearInterval(intervalId);
    ctx.font = '60px Courier';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("Конец игры", width/2, height/2);
};

let circle = function(x, y, radius, fillCircle){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle){
        ctx.fill();
    } else{
        ctx.stroke();
    }
};

let Block = function(col,row){
    this.col = col;
    this.row = row;
};

Block.prototype.drawSquare = function(color){
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function(color){
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize/2, true);
};

Block.prototype.equal = function(otherBlock){
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

let Snake = function(){
    this.segments = [new Block(7,5), new Block(6,5), new Block(5, 5)];
    this.direction = 'right';
    this.nextDirection = 'right';
};

//Создать змейку
Snake.prototype.setDirection = function (newDirection){
    if (this.direction === 'up' && newDirection === 'up') {
        return;
    } else if (this.direction === 'down' && newDirection === 'down'){
        return;
    } else if (this.direction === 'right' && newDirection === 'left'){
        return;
    } else if (this.direction === 'left' && newDirection === 'left'){
        return;
    }
    this.nextDirection = newDirection;
};

Snake.prototype.draw = function(){
    for (let i in this.segments){
        this.segments[i].drawSquare('blue');
    }
};

Snake.prototype.checkCollision = function(head){
    let leftCollision = (head.col === 0),
        topCollision = (head.row === 0),
        rightCollision = (head.col === widthInBlocks - 1),
        bottomCollision = (head.row === widthInBlocks - 1),
        wallCollision = leftCollision || rightCollision || topCollision || bottomCollision,
        selfCollision = false;

    for(let i in this.segments){
        if (head.equal(this.segments[i])){
            selfCollision = true;
        }
    }
    return wallCollision || selfCollision;
};

Snake.prototype.move = function(){
    let head = this.segments[0];
    let newHead;
    this.direction = this.nextDirection;
    if (this.direction === 'right'){
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === 'left'){
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === 'up') {
        newHead = new Block(head.col, head.row - 1);
    } else if (this.direction === 'down') {
        newHead = new Block(head.col, head.row + 1);
    }
    if (this.checkCollision(newHead)){
        gameOver();
        return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)){
        score ++;
        apple.move();
    } else {
        this.segments.pop();
    }
};

//Создать яблоко
let Apple = function(){
    this.position = new Block(10,10);
};

Apple.prototype.draw = function(){
    this.position.drawCircle('limeGreen');
};

Apple.prototype.move = function(){
    let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);
};

const apple = new Apple(),
      snake = new Snake();
snake.draw();
apple.draw();

let intervalId = setInterval(() =>{
    ctx.clearRect(0,0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
}, 100);

let directions = {ArrowLeft:'left', ArrowUp:'up', ArrowRight:'right', ArrowDown:'down'};

const body = document.querySelector('body');
body.addEventListener('keydown', (event) => {
    let newDirection = directions[event.key];
    console.log(event.key);
    if (newDirection !== undefined){
        snake.setDirection(newDirection);
    }
});

