const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_MAX_SPEED = 600;
const LASER_MAX_SPEED = 300;
const LASER_COOLDOWN = 0.3;

const GAME_STATE = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    playerX: 0,
    playerY: 0,
    playerCooldown: 0,
    lasers: []
};

const PLAYER_WIDTH = 20;


const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

function setPosition($el, x, y){
    $el.style.transform = `translate(${x}px, ${y}px)`;
}

function clamp(v, min, max){
    if(v < min){
        return min;
    }else if (v > max){
        return max;
    }
    else{
        return v;
    }
}

function createLaser($container, x, y){
    const $element = document.createElement('img');
    $element.src = 'img/laser-blue-1.png';
    $element.className = "laser";
    $container.appendChild($element);
    const laser = { x, y, $element };
    GAME_STATE.lasers.push(laser);
    setPosition($element, x, y);
    const audio = new Audio('sound/sfx-laser1.ogg');
    audio.play();
}

function createPlayer($container){
    GAME_STATE.playerX = GAME_WIDTH /2;
    GAME_STATE.playerY = GAME_HEIGHT - 50;
    const $player = document.createElement('img');
    $player.src = 'img/player-blue-1.png';
    $player.className = 'player';
    $container.appendChild($player);
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function init(){
    const $container = document.querySelector('.game');
    createPlayer($container);
}

function onKeyDown(e){
    if(e.keyCode === KEY_CODE_LEFT){
        GAME_STATE.leftPressed = true;
    }
    if(e.keyCode === KEY_CODE_RIGHT){
        GAME_STATE.rightPressed = true;
    }
    if(e.keyCode === KEY_CODE_SPACE){
        GAME_STATE.spacePressed = true;
    }
}

function onKeyUp(e){
    if(e.keyCode === KEY_CODE_LEFT){
        GAME_STATE.leftPressed = false;
    }
    if(e.keyCode === KEY_CODE_RIGHT){
        GAME_STATE.rightPressed = false;
    }
    if(e.keyCode === KEY_CODE_SPACE){
        GAME_STATE.spacePressed = false;
    }
}

function update(){
    const currentTime = Date.now();
    const dt = (currentTime - GAME_STATE.lastTime) / 1000;
    
    const $container = document.querySelector('.game');

    updatePlayer(dt, $container);
    updateLasers(dt, $container);
    GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(update);
}

function updateLasers(dt, $container){
    const lasers = GAME_STATE.lasers;
    for(let i = 0; i < lasers.length; i++){
        const laser = lasers[i];
        laser.y -= dt * LASER_MAX_SPEED;
        if(laser.y < 0){
            destroyLaser($container, laser);
        }
        setPosition(laser.$element, laser.x, laser.y);
    }
    GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead);
}

function destroyLaser($container, laser){
    $container.removeChild(laser.$element);
    laser.isDead = true;
}

function updatePlayer(dt, $container){
    if(GAME_STATE.leftPressed){
        GAME_STATE.playerX -= dt * PLAYER_MAX_SPEED;
    }
    if(GAME_STATE.rightPressed){
        GAME_STATE.playerX += dt * PLAYER_MAX_SPEED;
    }
    
    GAME_STATE.playerX = clamp(GAME_STATE.playerX, PLAYER_WIDTH, GAME_WIDTH - PLAYER_WIDTH);
    const $player = document.querySelector('.player');
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);

    if(GAME_STATE.spacePressed && GAME_STATE.playerCooldown <= 0){
        createLaser($container, GAME_STATE.playerX, GAME_STATE.playerY);
        GAME_STATE.playerCooldown = LASER_COOLDOWN;
    }
    if(GAME_STATE.playerCooldown > 0){
        GAME_STATE.playerCooldown -= dt;
    }
}

// if(e.keyCode === KEY_CODE_RIGHT){
//     GAME_STATE.playerX += 5;
//     const $player = document.querySelector('.player');
//     setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
// }

init();

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.requestAnimationFrame(update);