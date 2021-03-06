function Control(camera) {
    this.camera = camera || {};
    this.keys = {
        w: 87,
        s: 83,
        a: 65,
        d: 68
    };
    this.control_state = {
        moveforward: false,
        moveback: false,
        moveleft: false,
        moveright: false
    };
}

Control.prototype.resetMove = function (key) {

    //disables keys

    switch (key) {
        case this.keys.w:
            {
                this.control_state.moveforward = false;
                break;
            }
        case this.keys.s:
            {
                this.control_state.moveback = false;
                break;
            }
        case this.keys.a:
            {
                this.control_state.moveleft = false;
                break;
            }
        case this.keys.d:
            {
                this.control_state.moveright = false;
                break;
            }
    }
}

Control.prototype.setMove = function (key) {

    //enables keys

    switch (key) {
        case this.keys.w:
            {
                
                
                    this.control_state.moveforward = true;
                
                break;

            }
        case this.keys.s:
            {
                
                    this.control_state.moveback = true;
                
                break;
            }
        case this.keys.a:
            {
                
                    this.control_state.moveleft = true;
                
                break;
            }
        case this.keys.d:
            {
                
                    this.control_state.moveright = true;
                
                break;
            }
    }

};

Control.prototype.update = function () {

    if (this.control_state.moveforward) {
        this.moveForward();
    }
    if (this.control_state.moveback) {
        this.moveBack();
    }
    if (this.control_state.moveleft) {
        this.moveLeft();
    }
    if (this.control_state.moveright) {
        this.moveRight();
    }
};

Control.prototype.moveForward = function () {
    if (!checkWallCollision(camera.position,-2,1)) {
    this.camera.position.z -= MOVESPEED;
    }
};

Control.prototype.moveBack = function () {
    if (!checkWallCollision(camera.position,2,1)) {
        
    this.camera.position.z += MOVESPEED;
    }
};

Control.prototype.moveLeft = function () {
    if (!checkWallCollision(camera.position,-10,0)) {
    this.camera.position.x -= (MOVESPEED / 2);
    }
};

Control.prototype.moveRight = function () {
    if (!checkWallCollision(camera.position,10,0)) {
    this.camera.position.x += (MOVESPEED / 2);
    }
};

Control.prototype.lookAround = function (delta) {
    //this.camera.rotation.y += delta;
    camera.rotateOnAxis( new THREE.Vector3(0,1,0), delta);
    //  player.rotation.y+=delta;
}
