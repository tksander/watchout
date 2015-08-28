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
  bestScore: 0
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
  var enemies = gameBoard.selectAll('circle.enemy') // should this be dot?
    .data(enemyData, function(d) {return d.id;});

  // Render enemies to board
  enemies.enter()
    .append('circle')
      .attr('class', 'enemy') // create css
      .attr('cx', function(d) {return axes.x(d.x);})
      .attr('cy', function(d) {return axes.y(d.y);})
      .attr('r', 15);

  // Remove enemies from board
  enemies.exit()
    .remove()
};

// Play the game
var newEnemyPositions = createEnemies();
renderEnemies(newEnemyPositions);


