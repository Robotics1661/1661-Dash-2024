let onTarget = false;

window.alert = function() {};
alert = function() {};
// Define UI elements

let ui = {
    timer: document.getElementById('timer'),
    robotState: document.getElementById('robot-state'),
    gyro: {
        container: document.getElementById('orientation-grid'),
        val: 0,
        offset: 0,
        visualVal: 0,
        arm: document.getElementById('arrow'),
        number: document.getElementById('orientation-value'),
        reset: document.getElementById('reset-orientation')
    },
    encoder: {
        lEnc: document.getElementById('left-drive-encoder-value'),
        rEnc: document.getElementById('right-drive-encoder-value'),
        haEnc: document.getElementById('ha-encoder-value'),
        vaEnc: document.getElementById('va-encoder-value'),
        shooterEnc: document.getElementById('shooter-encoder-value'),
        
        lEncReset: document.getElementById('left-drive-reset'),
        rEncReset: document.getElementById('right-drive-reset'),
        haEncReset: document.getElementById('ha-reset'),
        vaEncReset: document.getElementById('va-reset'),
        shooterEncReset: document.getElementById('shooter-reset')
    
    },
    ultrasonic: document.getElementById('ultrasonic'),
    ballBlocking: document.getElementById('ball-blocking'),
    robotDiagram: {
        leftClawBar: document.getElementById('diagram-left-claw'),
        rightClawBar: document.getElementById('diagram-right-claw'),
        leftBallBar: document.getElementById('diagram-left-ball-intake'),
        rightBallBar: document.getElementById('diagram-right-ball-intake'),
        vaBar: document.getElementById('diagram-va'),
        elevatorBar: document.getElementById('diagram-elevator'),
        leftDriveBar: document.getElementById('diagram-left-drive'),
        rightDriveBar: document.getElementById('diagram-right-drive'),

        leftClawBarVal: document.getElementById('diagram-left-claw-val'),
        rightClawBarVal: document.getElementById('diagram-right-claw-val'),
        leftBallBarVal: document.getElementById('diagram-left-ball-intake-val'),
        rightBallBarVal: document.getElementById('diagram-right-ball-intake-val'),
        vaBarVal: document.getElementById('diagram-va-val'),
        elevatorBarVal: document.getElementById('diagram-elevator-val'),
        leftDriveBarVal: document.getElementById('diagram-left-drive-val'),
        rightDriveBarVal: document.getElementById('diagram-right-drive-val')
    },
    pid: {
        p: document.getElementById('p-val'),
        i: document.getElementById('i-val'),
        d: document.getElementById('d-val'),
        pCheck:document.getElementById('p-check'),
        iCheck:document.getElementById('i-check'),
        dCheck:document.getElementById('d-check'),
        save: document.getElementById('pid-button')
    },
    power: {
        voltage: document.getElementById('voltage-bar'),
        totaldraw: document.getElementById('total-draw'),
        drivedraw: document.getElementById('drive-train'),
        haDraw: document.getElementById('ha-draw'),
        vaDraw: document.getElementById('va-draw'),
        shooterEnc: document.getElementById('shooter-draw'),
        //velocity: document.getElementById('velocity'),
        acceleration: document.getElementById('acceleration'),
        temperature: document.getElementById('temperature'),

        voltageVal: document.getElementById('voltage-bar-val'),
        totaldrawVal: document.getElementById('total-draw-val'),
        drivedrawVal: document.getElementById('drive-train-val'),
        hadrawVal: document.getElementById('ha-draw-val'),
        vadrawVal: document.getElementById('va-draw-val'),
        shooterDrawVal: document.getElementById('shooter-draw-val'),
        //velocityVal: document.getElementById('velocity-val'),
        accelerationVal: document.getElementById('acceleration-val'),
        temperatureVal: document.getElementById('temperature-val')
    },
    auto: {
        left: document.getElementById('field-bottom-left-square'),
        middle: document.getElementById('field-bottom-middle-square'),
        right: document.getElementById('field-bottom-right-square'),
        leftPath: document.getElementById('automode-left'),
        leftMiddlePath: document.getElementById('automode-middle-left'),
        rightMiddlePath: document.getElementById('automode-middle-right'),
        rightPath: document.getElementById('automode-right'),
        isMiddleRight: document.getElementById('is-right-switch'),
    },
    jetson: {
        console: document.getElementById('console-interior'),
        isConnected: document.getElementById('light')
    },
    limelight: {
        feed: document.getElementById('limelight-feed'),
        isConnected: document.getElementById('limelight-connected')
    },
    field: {
        tarmac: document.getElementById('tarmac'),
        topLeftSquare: document.getElementById('field-top-left-square'),
        topMiddleSquare: document.getElementById('field-top-middle-square'),
        topRightSquare: document.getElementById('field-top-right-square'),
        bottomLeftSquare: document.getElementById('field-bottom-left-square'),
        bottomMiddleSquare: document.getElementById('field-bottom-middle-square'),
        bottomRightSquare: document.getElementById('field-bottom-right-square'),
        topLine1: document.getElementById('field-top-line-1'),
        bottomLine1: document.getElementById('field-bottom-line-1'),
        topLine2: document.getElementById('field-top-line-2'),
        bottomLine2: document.getElementById('field-bottom-line-2'),
        leftRocket1: document.getElementById('field-left-rocket-1'),
        rightRocket1: document.getElementById('field-right-rocket-1'),
        leftRocket2: document.getElementById('field-left-rocket-2'),
        rightRocket2: document.getElementById('field-right-rocket-2'),
        cargo1: document.getElementById('field-cargo-1'),
        cargo2: document.getElementById('field-cargo-2'),
        topLine1: document.getElementById('field-top-line-1'),
        bottomLine1: document.getElementById('field-bottom-line-1'),
        topLine2: document.getElementById('field-top-line-2'),
        bottomLine2: document.getElementById('field-bottom-line-2'),
        autoSpotMidLeft: document.getElementById('auto-spot-mid-left'),
        autoSpotMidRight: document.getElementById('auto-spot-mid-right'),
        autoSpotFarLeft: document.getElementById('auto-spot-far-left'),
        autoSpotFarRight: document.getElementById('auto-spot-far-right'),
        autoSimple: document.getElementById('auto-simple'),
    },
    shot: {
        limelightY: document.getElementById('limelight-y'),
        rangeStatus: document.getElementById('range-status'),
        targetStatus: document.getElementById('target-status'),
        shotLight: document.getElementById('shot-status-light')
    }
};

// Gyro rotation
let updateGyro = (key, value) => {
    ui.gyro.val = value;
    ui.gyro.visualVal = Math.floor((ui.gyro.val - ui.gyro.offset));
    ui.gyro.visualVal %= 360;
    if (ui.gyro.visualVal < 0) {
        ui.gyro.visualVal += 360;
    }
    ui.gyro.value = ui.gyro.visualVal;
    ui.gyro.arm.style.transform = `rotate(${ui.gyro.visualVal}deg)`;
    ui.gyro.number.innerHTML = ui.gyro.visualVal + 'º';
};
NetworkTables.addKeyListener('/SmartDashboard/gyro', updateGyro);
ui.gyro.reset.onclick = function() {
    NetworkTables.putValue('/SmartDashboard/gyroReset', true);
}

// Takes left encoder value
NetworkTables.addKeyListener('/SmartDashboard/lEnc', (key, value) => {
    ui.encoder.lEnc.innerHTML = (Math.floor(value * 10) / 2048).toFixed(1);
});
// Takes right encoder value
NetworkTables.addKeyListener('/SmartDashboard/rEnc', (key, value) => {
    ui.encoder.rEnc.innerHTML = (Math.floor(value * 10) / 2048).toFixed(1);
});
// Takes horizontal agitator encoder value -- jk
NetworkTables.addKeyListener('/SmartDashboard/haEnc', (key, value) => {
    ui.encoder.haEnc.innerHTML = (Math.floor(value * 10) / 2048).toFixed(1);
});
// Takes vertical agitator encoder value
NetworkTables.addKeyListener('/SmartDashboard/vaEnc', (key, value) => {
    ui.encoder.vaEnc.innerHTML = (Math.floor(value * 10) / 2048).toFixed(1);
});
// Takes shooter encoder value
NetworkTables.addKeyListener('/SmartDashboard/shooterEnc', (key, value) => {
    ui.encoder.shooterEnc.innerHTML = (Math.floor(value * 10) / 2048).toFixed(1);
});

ui.encoder.lEncReset.onclick = function() {
    NetworkTables.putValue('/SmartDashboard/lEncReset', true);
    NetworkTables.putValue('/SmartDashboard/lEnc', 0);
};
ui.encoder.rEncReset.onclick = function() {
    NetworkTables.putValue('/SmartDashboard/rEncReset', true);
    NetworkTables.putValue('/SmartDashboard/rEnc', 0);
};
ui.encoder.haEncReset.onclick = function() {
    NetworkTables.putValue('/SmartDashboard/haEncReset', true);
    NetworkTables.putValue('/SmartDashboard/haEnc', 0);
};
ui.encoder.vaEncReset.onclick = function() {
    NetworkTables.putValue('/SmartDashboard/vaEncReset', true);
    NetworkTables.putValue('/SmartDashboard/vaEnc', 0);
};
ui.encoder.shooterEncReset.onclick = function() {
    NetworkTables.putValue('/SmartDashboard/shooterEncReset', true);
    NetworkTables.putValue('/SmartDashboard/shooterEnc', 0);
};

function onStart () {
    document.body.classList.toggle('login', true);
    console.log("Showing login");
    // ui.auto.leftPath.hidden = true;
    // ui.auto.leftMiddlePath.hidden = true;
    // ui.auto.rightMiddlePath.hidden = true;
    // ui.auto.rightPath.hidden = true;
}

NetworkTables.addKeyListener('/SmartDashboard/lDrive', (key, value) => {
    let num = Math.floor((value + 100) / 2);
    ui.robotDiagram.leftDriveBarVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.robotDiagram.leftDriveBar.value = 1 + (Math.floor(value * 100) / 100);
});
NetworkTables.addKeyListener('/SmartDashboard/rDrive', (key, value) => {
    let num = Math.floor((value + 100) / 2);
    ui.robotDiagram.rightDriveBarVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.robotDiagram.rightDriveBar.value = 1 + (Math.floor(value * 100) / 100);
});
NetworkTables.addKeyListener('/SmartDashboard/leftClawIntake', (key, value) => {
    let num = Math.floor((value + 100) / 2);
    ui.robotDiagram.leftClawBarVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.robotDiagram.leftClawBar.value = 1 + (Math.floor(value * 100) / 100);
});
NetworkTables.addKeyListener('/SmartDashboard/rightClawIntake', (key, value) => {
    let num = Math.floor((value + 100) / 2);
    ui.robotDiagram.rightClawBarVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.robotDiagram.rightClawBar.value = 1 + (Math.floor(value * 100) / 100);
});
NetworkTables.addKeyListener('/SmartDashboard/rightBallIntake', (key, value) => {
    let num = Math.floor((value + 100) / 2);
    ui.robotDiagram.rightBallBarVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.robotDiagram.rightBallBar.value = 1 + (Math.floor(value * 100) / 100);
});
NetworkTables.addKeyListener('/SmartDashboard/leftBallIntake', (key, value) => {
    let num = Math.floor((value + 100) / 2);
    ui.robotDiagram.leftBallBarVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.robotDiagram.leftBallBar.value = 1 + (Math.floor(value * 100) / 100);
});
NetworkTables.addKeyListener('/SmartDashboard/rightBallIntake', (key, value) => {
    let num = Math.floor((value + 100) / 2);
    ui.robotDiagram.rightBallBarVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.robotDiagram.rightBallBar.value = 1 + (Math.floor(value * 100) / 100);
});
NetworkTables.addKeyListener('/SmartDashboard/va', (key, value) => {
    let num = Math.floor((value + 100) / 2);
    ui.robotDiagram.vaBarVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.robotDiagram.vaBar.value = 1 + (Math.floor(value * 100) / 100);
});
NetworkTables.addKeyListener('/SmartDashboard/shooter', (key, value) => {
    let num = Math.floor((value + 100) / 2);
    ui.robotDiagram.elevatorBarVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.robotDiagram.elevatorBar.value = 1 + (Math.floor(value * 100) / 100);
});


NetworkTables.addKeyListener('/SmartDashboard/voltage', (key, value) => {
    ui.power.voltageVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.power.voltage.value = value;
});
NetworkTables.addKeyListener('/SmartDashboard/totaldraw', (key, value) => {
    ui.power.totaldrawVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.power.totaldraw.value = value;
});
NetworkTables.addKeyListener('/SmartDashboard/driveDraw', (key, value) => {
    ui.power.drivedrawVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.power.drivedraw.value = value;
});
NetworkTables.addKeyListener('/SmartDashboard/hadraw', (key, value) => {
    ui.power.hadrawVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.power.hadraw.value = value;
});
NetworkTables.addKeyListener('/SmartDashboard/vadraw', (key, value) => {
    ui.power.vadrawVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.power.vaDraw.value = value;
});
NetworkTables.addKeyListener('/SmartDashboard/shooterDraw', (key, value) => {
    ui.power.shooterDrawVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.power.shooterDraw.value = value;
});
/*NetworkTables.addKeyListener('/SmartDashboard/velocity', (key, value) => {
    ui.power.velocityVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.power.velocity.value = value;
});*/
NetworkTables.addKeyListener('/SmartDashboard/acceleration', (key, value) => {
    ui.power.accelerationVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    ui.power.acceleration.value = value;
});
NetworkTables.addKeyListener('/SmartDashboard/temperature', (key, value) => {
    value = value * 9 / 5 + 32;
    ui.power.temperatureVal.innerHTML = (Math.floor(value * 100) / 100).toFixed(2);
    let percent = value / 120 * 100;
    ui.power.temperature.value = percent;
});

NetworkTables.addKeyListener('/SmartDashboard/automode', (key, value) => {
    if (value == "midLeft") {
        ui.field.autoSpotMidLeft.classList.add("auto-spot-selected");
        ui.field.autoSpotMidRight.classList.remove("auto-spot-selected");
        ui.field.autoSpotFarLeft.classList.remove("auto-spot-selected");
        ui.field.autoSpotFarRight.classList.remove("auto-spot-selected");
        ui.field.autoSimple.classList.remove("simple-selected");
    }
    else if (value == "midRight") {
        ui.field.autoSpotMidRight.classList.add("auto-spot-selected");
        ui.field.autoSpotMidLeft.classList.remove("auto-spot-selected");
        ui.field.autoSpotFarLeft.classList.remove("auto-spot-selected");
        ui.field.autoSpotFarRight.classList.remove("auto-spot-selected");
        ui.field.autoSimple.classList.remove("simple-selected");
    }
    else if (value == "farLeft") {
        ui.field.autoSpotFarLeft.classList.add("auto-spot-selected");
        ui.field.autoSpotMidRight.classList.remove("auto-spot-selected");
        ui.field.autoSpotMidLeft.classList.remove("auto-spot-selected");
        ui.field.autoSpotFarRight.classList.remove("auto-spot-selected");
        ui.field.autoSimple.classList.remove("simple-selected");
    }
    else if (value == "farRight") {
        ui.field.autoSpotFarRight.classList.add("auto-spot-selected");
        ui.field.autoSpotMidRight.classList.remove("auto-spot-selected");
        ui.field.autoSpotFarLeft.classList.remove("auto-spot-selected");
        ui.field.autoSpotMidLeft.classList.remove("auto-spot-selected");
        ui.field.autoSimple.classList.remove("simple-selected");
    }
    else {
        ui.field.autoSimple.classList.add("simple-selected");
        ui.field.autoSpotFarRight.classList.remove("auto-spot-selected");
        ui.field.autoSpotMidRight.classList.remove("auto-spot-selected");
        ui.field.autoSpotFarLeft.classList.remove("auto-spot-selected");
        ui.field.autoSpotMidLeft.classList.remove("auto-spot-selected");
    }
});

ui.field.autoSpotMidLeft.onclick = function() {
  NetworkTables.putValue('/SmartDashboard/automode', "midLeft");
}
ui.field.autoSpotMidRight.onclick = function() {
  NetworkTables.putValue('/SmartDashboard/automode', "midRight");
}
ui.field.autoSpotFarLeft.onclick = function() {
  NetworkTables.putValue('/SmartDashboard/automode', "farLeft");
}
ui.field.autoSpotFarRight.onclick = function() {
  NetworkTables.putValue('/SmartDashboard/automode', "farRight");
}
ui.field.autoSimple.onclick = function() {
    NetworkTables.putValue('/SmartDashboard/automode', "simple");
  }
  


NetworkTables.addKeyListener('/SmartDashboard/ultrasonic', (key, value) => {
    ui.ultrasonic.innerHTML = value.toFixed(2);
    if (value > 13.0 && value < 14.3) {
        ui.ballBlocking.innerHTML = "NOT BLOCKED";
    }
    else {
        ui.ballBlocking.innerHTML = "BLOCKED";
    }
    ui.ultrasonic.value = value;
});
NetworkTables.addKeyListener('/SmartDashboard/onTarget', (key, value) => {
    onTarget = value;
    alert(onTarget);
    ui.shot.targetStatus.innerHTML = value ? "On Target" : "Target Not Found";
    ui.shot.targetStatus.style.color = value ? "#51ff00" : "#f11000";
});
NetworkTables.addKeyListener('/SmartDashboard/LimelightY', (key, value) => {
    ui.shot.limelightY.innerHTML = value.toFixed(3);
    if (onTarget) {
        if (value > 8.3 && value < 9.1) {
            ui.shot.rangeStatus.innerHTML = "Amazing";
            ui.shot.rangeStatus.style.color = "#1cf100";
            ui.shot.shotLight.style.background = "#1cf100";
        }
        else if (value > 7.3 && value < 9.6) {
            ui.shot.rangeStatus.innerHTML = "Good";
            ui.shot.rangeStatus.style.color = "#b9f100";
            ui.shot.shotLight.style.background = "#b9f100";
        }
        else if (value > 9.6) {
            ui.shot.rangeStatus.innerHTML = "Move Farther";
            ui.shot.rangeStatus.style.color = "#f16000";
            ui.shot.shotLight.style.background = "#f16000";
        }
        else if (value < 8.2) {
            ui.shot.rangeStatus.innerHTML = "Move Closer";
            ui.shot.rangeStatus.style.color = "#f16000";
            ui.shot.shotLight.style.background = "#f16000";
        }
    }
    else {
        ui.shot.rangeStatus.innerHTML = "Not on Target"
        ui.shot.rangeStatus.style.color = "#f16000";
        ui.shot.shotLight.style.background = "#f16000";
    }
});
/*
NetworkTables.addKeyListener('/SmartDashboard/p', (key, value) => {
    ui.pid.p.value = value;
    ui.pid.save.style.background = '#415359';
    ui.pid.pCheck.style.opacity = "0";
});
NetworkTables.addKeyListener('/SmartDashboard/i', (key, value) => {
    ui.pid.i.value = value;
    ui.pid.save.style.background = '#415359';
    ui.pid.iCheck.style.opacity = "0";
});
NetworkTables.addKeyListener('/SmartDashboard/d', (key, value) => {
    ui.pid.d.value = value;
    ui.pid.save.style.background = '#415359';
    ui.pid.dCheck.style.opacity = "0";
});
ui.pid.save.onclick = function() {
  NetworkTables.putValue('/SmartDashboard/p', ui.pid.p.value);
  NetworkTables.putValue('/SmartDashboard/i', ui.pid.i.value);
  NetworkTables.putValue('/SmartDashboard/d', ui.pid.d.value);
  ui.pid.save.style.background = 'linear-gradient(135deg, #f16000 0%,#ff2b51 100%)';
  ui.pid.pCheck.style.opacity = "1";
  ui.pid.iCheck.style.opacity = "1";
  ui.pid.dCheck.style.opacity = "1";
}*/

function handleChange(checkbox) {
    if(checkbox.checked == true){
        NetworkTables.putValue('/SmartDashboard/pants', true);
    }else{
        NetworkTables.putValue('/SmartDashboard/pants', false);
    }
}


// NetworkTables.addKeyListener('/SmartDashboard/pants', (key, value) => {

//     ui.auto.leftMiddlePath.hidden = true;
//     ui.auto.rightMiddlePath.hidden = true;
//     let currentMode = NetworkTables.getValue('/SmartDashboard/automode');
//     if (currentMode == 1) {
//         if (value)  ui.auto.rightMiddlePath.hidden = false;
//      else ui.auto.leftMiddlePath.hidden = false;
//     }

// });

// NetworkTables.addKeyListener('/SmartDashboard/automode', (key, value) => {

//     ui.auto.left.style.background = '#21282B';
//     ui.auto.middle.style.background = '#21282B';
//     ui.auto.right.style.background = '#21282B';

//     ui.auto.leftPath.hidden = true;
//     ui.auto.leftMiddlePath.hidden = true;
//     ui.auto.rightMiddlePath.hidden = true;
//     ui.auto.rightPath.hidden = true;
 
//    let pantsVal = NetworkTables.getValue('/SmartDashboard/pants');
//    if(value === 0){
//      ui.auto.left.style.background = 'linear-gradient(135deg, #f16000 0%,#ff2b51 100%)';
//      ui.auto.leftPath.hidden = false;
//    } else if(value === 1){
//      ui.auto.middle.style.background = 'linear-gradient(135deg, #f16000 0%,#ff2b51 100%)';
//      if(pantsVal)  ui.auto.rightMiddlePath.hidden = false;
//      else  ui.auto.leftMiddlePath.hidden = false;
//    } else {
//      ui.auto.right.style.background = 'linear-gradient(135deg, #f16000 0%,#ff2b51 100%)';
//      ui.auto.rightPath.hidden = false;

//    }
// });



ui.encoder.lEncReset.onclick = function() {
    NetworkTables.putValue('/SmartDashboard/lEncReset', true);
    NetworkTables.putValue('/SmartDashboard/lEnc', 0);
};

NetworkTables.addKeyListener('/SmartDashboard/limelight', (key, value) => {
    let feed = NetworkTables.getValue();
});

// Not yet sure how to format these
NetworkTables.addKeyListener('/SmartDashboard/consoleOutput', (key, value) => {
    var newValue = current.concat(value).concat("\n");
    NetworkTables.putValue('/SmartDashboard/consoleOutput', newValue);
    ui.jetson.console.innerHTML = NetworkTables.getValue('/SmartDashboard/consoleOutput');
});
NetworkTables.addKeyListener('/SmartDashboard/jetsonConnected', (key, value) => {
    if (value) {
        ui.jetson.isConnected.classList.add('color-icon');
    }
    else {
        ui.jetson.isConnected.classList.remove('color-icon');
    }
});
NetworkTables.addKeyListener('/SmartDashboard/')
NetworkTables.addKeyListener('/SmartDashboard/timer', (key, value) => {
    ui.timer.innerHTML = 'REMAINING TIME: ' + (value < 0 ? '0:00' : Math.floor(value / 60) + ':'
    + (value % 60 < 10 ? '0' : '') + Math.floor(value % 60 * 10) / 10 + (Math.floor(value % 60 * 10) / 10 === Math.floor(value % 60) ? '.0' : ''));
    if(value < 30 && !NetworkTables.getValue('/SmartDashboard/inauto')) {
      ui.timer.style.color = 'red';
    } else {
      ui.timer.style.color = 'white';
    }
});

NetworkTables.addKeyListener('/SmartDashboard/isred', (key, value) => {

    if (true) return;

    if (value) {
        ui.field.tarmac.classList.remove('flip');
        ui.field.leftRocket1.classList.remove('color-red');
        ui.field.rightRocket1.classList.remove('color-red');
        ui.field.leftRocket1.classList.add('color-blue');
        ui.field.rightRocket1.classList.add('color-blue');
        ui.field.leftRocket2.classList.remove('color-blue');
        ui.field.rightRocket2.classList.remove('color-blue');
        ui.field.leftRocket2.classList.add('color-red');
        ui.field.rightRocket2.classList.add('color-red');
        ui.field.topLine1.classList.remove('red-line');
        ui.field.topLine1.classList.add('blue-line');
        ui.field.bottomLine1.classList.remove('red-line');
        ui.field.bottomLine1.classList.add('blue-line');
        ui.field.topLine2.classList.remove('blue-line');
        ui.field.topLine2.classList.add('red-line');
        ui.field.bottomLine2.classList.remove('blue-line');
        ui.field.bottomLine2.classList.add('red-line');
        ui.field.cargo1.classList.remove('color-blue');
        ui.field.cargo1.classList.add('color-red');
        ui.field.cargo2.classList.remove('color-red');
        ui.field.cargo2.classList.add('color-blue');
        
    }
    else {
        ui.field.leftRocket1.classList.remove('color-blue');
        ui.field.rightRocket1.classList.remove('color-blue');
        ui.field.leftRocket1.classList.add('color-red');
        ui.field.rightRocket1.classList.add('color-red');
        ui.field.leftRocket2.classList.remove('color-red');
        ui.field.rightRocket2.classList.remove('color-red');
        ui.field.leftRocket2.classList.add('swapBlue');
        ui.field.rightRocket2.classList.add('swapBlue');
        ui.field.cargo1.classList.remove('color-red');
        ui.field.cargo1.classList.add('color-blue');
        ui.field.cargo2.classList.remove('color-blue');
        ui.field.cargo2.classList.add('color-red');
        ui.field.topLine1.classList.remove('blue-line');
        ui.field.topLine1.classList.add('red-line');
        ui.field.bottomLine1.classList.remove('blue-line');
        ui.field.bottomLine1.classList.add('red-line');
        ui.field.topLine2.classList.remove('red-line');
        ui.field.topLine2.classList.add('blue-line');
        ui.field.bottomLine2.classList.remove('red-line');
        ui.field.bottomLine2.classList.add('blue-line');
        ui.field.tarmac.classList.add('flip');
    }
   
});

// NetworkTables.addKeyListener('/SmartDashboard/scale1left', (key, value) => {
//     ui.field.scale1left.style.background = (value == NetworkTables.getValue('/SmartDashboard/isred')) ? 'red' : 'blue';
//     ui.field.scale1right.style.background = (value == NetworkTables.getValue('/SmartDashboard/isred')) ? 'blue' : 'red';
// });
// NetworkTables.addKeyListener('/SmartDashboard/scale2left', (key, value) => {
//     ui.field.scale2left.style.background = (value == NetworkTables.getValue('/SmartDashboard/isred')) ? 'red' : 'blue';
//     ui.field.scale2right.style.background = (value == NetworkTables.getValue('/SmartDashboard/isred')) ? 'blue' : 'red';
// });
// NetworkTables.addKeyListener('/SmartDashboard/scale3left', (key, value) => {
//     ui.field.scale3left.style.background = (value == NetworkTables.getValue('/SmartDashboard/isred')) ? 'red' : 'blue';
//     ui.field.scale3right.style.background = (value == NetworkTables.getValue('/SmartDashboard/isred')) ? 'blue' : 'red';
// });

addEventListener('error',(ev)=>{
    ipc.send('windowError',`${ev}`)
})