var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1500 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var scoreText;
var gameOver = false;
var activeBomb = null;
var restartButton;

var game = new Phaser.Game(config);

function preload () {
    this.load.image("sky", "../phaser1/assets/image/sky.png");
    this.load.image("ground", "../phaser1/assets/image/platform.png");
    this.load.image("star", "../phaser1/assets/image/star.png");
    this.load.image("bomb", "../phaser1/assets/image/bomb.png");
    this.load.image("dude", "../phaser1/assets/image/dude.png");
}

function create () {
    this.add.image(960, 540, 'sky');

    platforms = this.physics.add.staticGroup();

    let platform1 = platforms.create(950, 1020, 'ground');
    platform1.setScale(4, 1);
    platform1.refreshBody();
    platform1.body.setSize(2000, 50);
    platform1.body.setOffset(50, 90);

    let platform2 = platforms.create(240, 800, 'ground');
    platform2.body.setSize(480, 50);
    platform2.body.setOffset(13, 90);

    let platform3 = platforms.create(1700, 800, 'ground');
    platform3.body.setSize(480, 50);
    platform3.body.setOffset(3, 90);

    let platform4 = platforms.create(950, 600, 'ground');
    platform4.body.setSize(480, 50);
    platform4.body.setOffset(3, 90);

    let platform5 = platforms.create(240, 400, 'ground');
    platform5.body.setSize(480, 50);
    platform5.body.setOffset(13, 90);

    let platform6 = platforms.create(1700, 400, 'ground');
    platform6.body.setSize(480, 50);
    platform6.body.setOffset(3, 90);

    // Playerrrrrrrrrrrrrrrrrr
    player = this.physics.add.sprite(960, 500, 'dude');
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    player.body.setSize(30, 50); 
    player.body.setOffset(45, 30); 


    cursors = this.input.keyboard.createCursorKeys();

    // Starrrrsssssssssss
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 150, y: 0, stepX: 150 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Bombbbbssssssssssssss
    bombs = this.physics.add.group();

    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#ffffff'
    });


    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);


    this.physics.add.overlap(player, stars, collectStar, null, this);

   
    restartButton = this.add.text(960, 540, 'Restart', {
        fontSize: '48px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center'
    }).setOrigin(0.5).setInteractive();

    restartButton.on('pointerdown', restartGame, this);
    restartButton.on('pointerover', function () {
        restartButton.setStyle({ fill: '#ff0000' }); 
    });
    restartButton.on('pointerout', function () {
        restartButton.setStyle({ fill: '#ffffff' }); 
    });

    restartButton.setVisible(false);
}

function update () {
    if (gameOver) return;

    if (cursors.left.isDown) {
        player.setVelocityX(-800);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(800);
        player.flipX = false;
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-1100);
    }


    bombs.children.iterate(function (bomb) {
        if (bomb.active) {
            const speed = 200;
            const direction = new Phaser.Math.Vector2(
                player.x - bomb.x,
                player.y - bomb.y
            ).normalize();

            bomb.setVelocity(direction.x * speed, direction.y * speed);
        }
    });
}

function collectStar (player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 960) ? Phaser.Math.Between(960, 1920) : Phaser.Math.Between(0, 960);
        activeBomb = bombs.create(x, 16, 'bomb');

        activeBomb.setScale(0.5);
        activeBomb.body.setSize(activeBomb.width * 0.5, activeBomb.height * 0.5);
        activeBomb.body.setOffset(activeBomb.width * 0.25, activeBomb.height * 0.25);
        activeBomb.refreshBody();

        activeBomb.setBounce(0);
        activeBomb.setCollideWorldBounds(true);
    }
}

function hitBomb (player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;


    restartButton.setVisible(true);
}

function restartGame() {

    gameOver = false;
    score = 0;
    scoreText.setText('Score: 0');


    player.setTint(0xffffff);
    player.setPosition(960, 500);
    this.physics.resume();

 
    restartButton.setVisible(false);

 
    bombs.clear(true, true);
    stars.clear(true, true);
    

    create.call(this);
}
