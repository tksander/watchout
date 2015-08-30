// start slangin' some d3 here.

// Game environment

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20 // Do we need?
};

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
};

// Create gameboard
var gameBoard = d3.select('.container').append('svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);

// Scales a number to fit the game board dimensions
var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};


  // Define enemy class - pseudoclassical
  var Enemy = function(id) {
    this.id = id;
    this.x = Math.random()*100;
    this.y = Math.random()*100;
    this.r = 20;
  };

// Returns an array of enemy objects
function createEnemies() {
  // Array of enemy objects
  var enemyData = [];

  // Create enemies
  for(var i = 0; i < gameOptions.nEnemies; i++) {
    enemyData.push(new Enemy(i));
  }
  return enemyData;
};

// Render enemies
function renderEnemies(enemyData) {
  // Bind enemy data to enemy SVG elements
  var enemies = gameBoard.selectAll('.enemy') // should this be dot?
    .data(enemyData, function(d) {return d.id;});

  // Render enemies to board initially
  enemies.enter()
      .append('svg:image')
      .attr("xlink:href", "star.svg")
      .attr("width", 40)
      .attr("height", 40)
      .attr('class', 'enemy') // create css
      .attr('r', function(d) {return d.r;})
      .attr("transform", function(d) {return "rotate(-65)" });


  // Update all enemies
  enemies
    .transition()
    .duration(2000)
    .attr('x', function(d) {return axes.x(d.x);})
    .attr('y', function(d) {return axes.y(d.y);});



  // Remove enemies from board
  enemies.exit()
    .remove()
};

// Moves all enemies
function moveEnemies() {

  // var enemies = gameBoard.selectAll('.enemy');
  // // Animate move from old position to new position
  // enemies.transition()
  //   .duration(2000)
  //   .attr('cx', function(d) {return axes.x(Math.random()*100);})
  //   .attr('cy', function(d) {return axes.y(Math.random()*100);});

  for (var i = 0; i < newEnemyPositions.length; i++) {
    // Update the x and y coordinate of each enemy data
    newEnemyPositions[i].x = Math.random()*100;
    newEnemyPositions[i].y = Math.random()*100;
  }

  renderEnemies(newEnemyPositions);
}

// Define player class - functional

var makePlayer = function() {
  // Make player instance object
  var playerInstance = {};

  playerInstance.data = {
    fill: '#ff6600',
    x: 350,
    y: 250
  }

  // Render player method
  playerInstance.renderPlayer = function() {
    // Bind player data to player SVG element
    // var player = gameBoard.select('circle.player')
      // .data(playerInstance.data);


    // Render player to board
    gameBoard
      .append('circle')
      .attr('class', 'player') // create css
      .attr('cx', playerInstance.data.x)
      .attr('cy', playerInstance.data.y)
      .attr('r', 10)
      .attr('fill', playerInstance.data.fill)

  
    var drag = d3.behavior.drag()
      .on('drag', function() { 
        gameBoard.select(".player").attr('cx', d3.event.x)
                                   .attr('cy', d3.event.y);
      });

    gameBoard.select('.player').call(drag);

  };

  return playerInstance;
}

// Check for player enemy collision
var checkCollision = function(enemies, player, callback) {
  enemies.forEach(function(enemy) {
    var radiusSum = enemy.r + parseFloat(player.attr('r'));
    xDiff = axes.x(enemy.x) - parseFloat(player.attr('cx'));
    yDiff = axes.y(enemy.y) - parseFloat(player.attr('cy'));

    var separation = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2));
    if (separation < radiusSum) {
      callback(player, enemy); 
    }
  });
}

// Update node score text
function updateScore() {
  d3.select('#current-score')
    .text(gameStats.score.toString());
};

// Update node best score text
function updateBestScore() {
  gameStats.bestScore = 
    Math.max(gameStats.bestScore, gameStats.score);

    d3.select('#best-score')
      .text(gameStats.bestScore.toString());
};

function updateCollisions() {
  gameStats.collisions += 1;

  d3.select('#total-collisions')
    .text(gameStats.collisions.toString());
}

// Update best score and score on collision
function onCollision() {
  updateBestScore();
  gameStats.score = 0;
  updateScore();
  updateCollisions();
};

// Increment score and update the score
function increaseScore() {
  gameStats.score += 1;
  updateScore();
};

/*****************/
/* PLAY THE GAME */
/*****************/

// Start the game
var newEnemyPositions = createEnemies();
renderEnemies(newEnemyPositions);

var newPlayer = makePlayer();
newPlayer.renderPlayer();

// Check for collision every 100 ms
setInterval(function() {
  var player = gameBoard.select('.player');
  checkCollision(newEnemyPositions, player, onCollision);
}, 100)

// Increase score
setInterval(increaseScore, 50);

// //Move the enemies 
 setInterval(moveEnemies, 1500);

