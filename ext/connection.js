function Cell(id, x, y, size, color, isFood, isVirus, isPlayer, shortMass, virusMassShots) {
    this.debugCanvas = null
    this.c = null
    this.id = id;
    this.x = x;
    this.y = y;
    this.accountID = null
    this.isInViewport = false
    this.targetX = x;
    this.targetY = y;
    this.color = color;
    this.oppColor = null;
    this.size = size;
    this.targetSize = size;
    this.alpha = 1;
    this.nick = '';
    this.targetNick = '';
    this.nickCanvas = null;
    /*Object.defineProperty(this,'nickCanvas',{
        get: function(){
            return drawRender.nickCache[nick]
        },
        set:function(data){
            return drawRender.nickCache[nick]=data
        },
    })*/
    this.mass = 0;
    this.lastMass = 0;
    this.kMass = 0;
    this.massCanvas = null;
    this.massTxt = '';
    this.margin = 0;
    this.scale = 1;
    this.nickScale = 1;
    this.massScale = 1;
    this.virMassScale = 3;
    this.strokeScale = 1;
    this.fontSize = 26;
    this.nickSize = 26;
    this.lastNickSize = 0;
    this.massSize = 26;
    this.virMassSize = 26;
    this.nickStrokeSize = 3;
    this.massStrokeSize = 3;
    this.isFood = isFood;
    this.isVirus = isVirus;
    this.isPlayerCell = isPlayer;
    this.shortMass = shortMass;
    this.virMassShots = virusMassShots;
    this.rescale = false;
    this.redrawNick = true;
    this.redrawMass = true;
    this.optimizedNames = false;
    this.optimizedMass = false;
    this.strokeNick = false;
    this.strokeMass = false;
    this.removed = false;
    this.redrawed = 0;
    this.time = 0;
    this.skin = null;
    this.pi2 = 2 * Math.PI;


    this.update = function(x, y, mass, isVirus, isPlayer, nick) {
        this.x = x;
        this.y = y;
        this.isVirus = isVirus;
        this.isPlayerCell = isPlayer;
        this.setMass(mass);
        this.setNick(nick);
    };
    this.removeCell = function() {
        this.removed = true;
        let index = this.c.cells.indexOf(this);
        if (index != -1) {
            this.c.cells.splice(index, 1);
            if (settings.virusesRange) {
                index = this.c.viruses.indexOf(this);
                if (index != -1) {
                    this.c.viruses.splice(index, 1);
                }
            }
        } else {
            index = this.c.food.indexOf(this);
            if (index != -1) {
                this.c.food.splice(index, 1);
            }
        }
        index = this.c.playerCells.indexOf(this);
        if (index != -1) {
            this.c.removePlayerCell = true;
            this.c.playerCells.splice(index, 1);
            index = this.c.playerCellIDs.indexOf(this.id);
            if (index != -1) {
                this.c.playerCellIDs.splice(index, 1);
            }
        }
        if (this.redrawed) {
            this.c.removedCells.push(this);
        }
        delete this.c.indexedCells[this.id];
    };
    this.moveCell = function() {
        const time = this.c.time - this.time;
        let delay = time / settings.animation;
        delay = delay < 0 ? 0 : delay > 1 ? 1 : delay;
        this.x += (this.targetX - this.x) * delay;
        this.y += (this.targetY - this.y) * delay;
        this.size += (this.targetSize - this.size) * delay;
        this.alpha = delay;
        if (!this.removed) {
            this.time = this.c.time;
            return;
        }
        if (delay == 1) {
            const removedCells = this.c.removedCells.indexOf(this);
            if (removedCells != -1) {
                this.c.removedCells.splice(removedCells, 1);
            }
        }
    };
    this.isInView = function() {
        return this.id <= 0 ? false : this.x + this.size + 40 < this.c.viewX - this.c.canvasWidth / 2 / this.c.scale || this.y + this.size + 40 < this.c.viewY - this.c.canvasHeight / 2 / this.c.scale || this.x - this.size - 40 > this.c.viewX + this.c.canvasWidth / 2 / this.c.scale || this.y - this.size - 40 > this.c.viewY + this.c.canvasHeight / 2 / this.c.scale ? false : true;
    };
    this.setMass = function(mass) {
        this.size = mass;
        if (mass <= 40) {
            return false;
        }
        if (!this.massCanvas) {
            this.massCanvas = new newCanvas();
            return false;
        }
        this.mass = ~~(mass * mass / 100);
        this.redrawMass = true;
        if (this.isVirus) {
            if (this.virMassShots && this.mass < 200) {
                this.mass = ~~((200 - this.mass) / 14);
                //if(settings.virusSounds && this.lastMass && this.mass < this.lastMass) application.playSound(application.virusSound)
                this.lastMass = this.mass
            }
            this.massTxt = this.mass.toString();
            return true;
        }
        this.massTxt = this.mass.toString();
        if (this.mass <= 200) {
            return true;
        }
        if (this.shortMass && this.mass >= 1000) {
            this.kMass = Math.round(this.mass / 100) / 10;
            this.massTxt = `${this.kMass}k`;
            return true;
        }
        if (this.optimizedMass) {
            this.redrawMass = Math.abs((this.mass - this.lastMass) / this.mass) >= 0.02 || this.rescale;
        }
        return true;
    };
    this.setNick = function(nick) {
        this.nick = nick;
        if (!nick || this.isVirus) {
            return false;
        }
        if (!this.nickCanvas) {
            this.nickCanvas = new newCanvas();
            return false;
        }
        return true;
    };
    this.setScale = function(scale, nickScale, massScale, virusScale, strokeScale) {
        const ceilScale = Math.ceil(scale * 4) / 4; //10
        this.rescale = false;
        if (this.scale != ceilScale) {
            //patch 1
            if(ceilScale > 0.9) return;
            this.scale = ceilScale;
            this.rescale = true;
        }
        this.nickScale = nickScale;
        this.massScale = massScale;
        this.virMassScale = virusScale;
        this.strokeScale = strokeScale;
    };
    this.setFontSize = function() {
        if (this.isVirus) {
            this.massSize = Math.ceil(this.virMassSize * this.scale * this.virMassScale);
            return;
        }
        this.fontSize = Math.max(this.size * 0.3, 26) * this.scale;
        this.nickSize = ~~(this.fontSize * this.nickScale);
        this.massSize = ~~(this.fontSize * 0.5 * this.massScale);
        if (this.optimizedNames) {
            this.redrawNick = Math.abs((this.nickSize - this.lastNickSize) / this.nickSize) >= 0.3 || this.rescale;
            return;
        }
        this.redrawNick = true;
    };
    this.setStrokeSize = function() {
        if (this.strokeNick && !this.isVirus) {
            this.nickStrokeSize = ~~(this.nickSize * 0.1 * this.strokeScale);
        }
        if (this.strokeMass) {
            this.massStrokeSize = ~~(this.massSize * 0.1 * this.strokeScale);
        }
    };
    this.setDrawing = function() {
        this.optimizedNames = settings.optimizedNames;
        this.optimizedMass = settings.optimizedMass;
        this.shortMass = settings.shortMass;
        this.virMassShots = settings.virMassShots;
        this.strokeNick = settings.namesStroke;
        this.strokeMass = settings.massStroke;
    };
    this.setDrawingScale = function() {
        this.setScale(/*1||*/this.c.viewScale, theme.namesScale, theme.massScale, theme.virMassScale, theme.strokeScale);
        this.setFontSize();
        this.setStrokeSize();
        this.margin = 0;
    };
    this.drawNick = function(ctx) {
        if (!this.nick || !this.nickCanvas || this.isVirus) {
            return;
        }
        const canvas = this.nickCanvas;
        canvas.setDrawing(theme.namesColor, theme.namesFontFamily, theme.namesFontWeight, this.strokeNick, this.nickStrokeSize, theme.namesStrokeColor);
        canvas.setTxt(this.nick);
        if (this.redrawNick) {
            canvas.setFontSize(this.nickSize);
            this.lastNickSize = this.nickSize;
        }
        canvas.setScale(this.scale);
        const imgTxt = canvas.drawTxt();
        const width = /*~~*/(imgTxt.width / this.scale);
        const heigth = /*~~*/(imgTxt.height / this.scale);
        this.margin = /*~~*/(heigth / 2);
        if(width!=0 && heigth!=0) {
            // patch 1
            var pr = ctx.imageSmoothingQuality
            //ctx.imageSmoothingQuality = "high"
            ctx.drawImage(imgTxt, /*~~*/this.x - /*~~*/(width / 2), /*~~*/this.y - this.margin, width, heigth);
            //ctx.imageSmoothingQuality = pr
        }
    };
    this.drawMass = function(ctx) {
        if (!this.massCanvas || this.size <= 40) {
            return;
        }
        const canvas = this.massCanvas;
        canvas.setDrawing(theme.massColor, theme.massFontFamily, theme.massFontWeight, this.strokeMass, this.massStrokeSize, theme.massStrokeColor);
        if (this.redrawMass) {
            canvas.setTxt(this.massTxt);
            this.lastMass = this.mass;
        }
        canvas.setFontSize(this.massSize);
        canvas.setScale(this.scale);
        const imgTxt = canvas.drawTxt();
        const width = /*~~*/(imgTxt.width / this.scale);
        const heigth = /*~~*/(imgTxt.height / this.scale);
        const margin = this.margin == 0 ? ~~this.y - /*~~*/(heigth / 2) : ~~this.y + this.margin;
        if(width!=0 && heigth!=0) {
            // patch 1
            //var pr = ctx.imageSmoothingQuality
            //ctx.imageSmoothingQuality = "high"
            ctx.drawImage(imgTxt, ~~this.x - /*~~*/(width / 2), margin, width, heigth);
            //ctx.imageSmoothingQuality = pr
        }

    };
    this.drawDebug = function(ctx) {
        if (this.size <= 40) {
            return;
        }
        if (!this.debugCanvas) {
            this.debugCanvas = new newCanvas();
            //return false;
        }
        const canvas = this.debugCanvas;
        canvas.setDrawing(theme.namesColor, theme.namesFontFamily, theme.namesFontWeight, this.strokeNick, this.nickStrokeSize, theme.namesStrokeColor);
        canvas.setTxt('x'+Math.round(this.x)+':y'+Math.round(this.y));

        canvas.setFontSize(this.nickSize);
        canvas.setScale(this.scale);
        const imgTxt = canvas.drawTxt();
        const width = ~~(imgTxt.width / this.scale);
        const heigth = ~~(imgTxt.height / this.scale);
        const margin = /*this.margin == 0 ? */~~this.y - ~~(heigth / 2) - (this.size-this.size/3)/*: ~~this.y + this.margin;*/
        if(width!=0 && height!=0) {
            ctx.drawImage(imgTxt, ~~this.x - ~~(width / 2), margin, width, heigth);
        }

    };
    this.draw = function(ctx, update) {
        /*if (this.c.hideSmallBots && this.size <= 36) {
            return;
        }*/
        ctx.save();
        this.redrawed++;
        if (update) {
            this.moveCell();
        }
        if (this.removed) {
            ctx.globalAlpha *= 1 - this.alpha;
        }
        const alpha = ctx.globalAlpha;
        let isAplha = false;
        const size = this.isFood ? this.size + theme.foodSize : this.size;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, this.pi2, false);
        ctx.closePath();
        
        /*function regularpolygon(ctx, x, y, radius, sides) {
            if (sides < 3) return;
            ctx.beginPath();
            var a = ((Math.PI * 2)/sides);
            //ctx.translate(x,y);
            if(sides<1)return;
            //ctx.moveTo(x+radius,y);
            for (var i = 1; i < sides; i++) {
                //ctx.arc(x+(radius*Math.cos(a*i)), y+(radius*Math.sin(a*i)), 100, 0x0, Math.PI * 2, false);
              ctx.lineTo(x+(radius*Math.cos(a*i)),y+(radius*Math.sin(a*i)));
            }
            ctx.closePath();

        }
        regularpolygon(ctx,this.x, this.y, size, Math.max(size)*drawRender.scale )*/
        if (this.isFood) {
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
            return;
        }
        if (this.isVirus) {
            if (settings.transparentViruses) {
                ctx.globalAlpha *= theme.virusAlpha;
                isAplha = true;
            }
            if (settings.virColors && this.c.play) {
                ctx.fillStyle = application.setVirusColor(size);
                ctx.strokeStyle = application.setVirusStrokeColor(size);
            } else {
                ctx.fillStyle = theme.virusColor;
                ctx.strokeStyle = theme.virusStrokeColor;
            }
            ctx.fill();
            if (isAplha) {
                ctx.globalAlpha = alpha;
                isAplha = false;
            }
            ctx.lineWidth = theme.virusStrokeSize;
            ctx.stroke();
            if (settings.showMass) {
                this.setDrawing();
                this.setDrawingScale();
                this.setMass(this.size);
                this.drawMass(ctx);
            }
            ctx.restore();
            return;
        }
        if (settings.transparentCells) {
            ctx.globalAlpha *= theme.cellsAlpha;
            isAplha = true;
        }
        let color = this.color;
        if (application.play) {
            if (this.isPlayerCell) {
                if (settings.myCustomColor) {
                    color = profiles.mainProfile.color;
                }
            } else if (settings.oppColors && !settings.oppRings) {
                color = this.oppColor;
            }
        }
        ctx.fillStyle = color;
        ctx.fill();

        if (isAplha) {
            ctx.globalAlpha = alpha;
            isAplha = false;
        }
        let skin = null;
        if (settings.customSkins && tempsett.showCustomSkins) {
            skin = comm.getCustomSkin(this.targetNick, this.color);
            if (skin) {
                if ((settings.transparentSkins || this.c.play && settings.oppColors) && !(this.isPlayerCell && !settings.myTransparentSkin) || this.isPlayerCell && settings.myTransparentSkin) {
                    ctx.globalAlpha *= theme.skinsAlpha;
                    isAplha = true;
                }
                ctx.drawImage(skin, this.x - size, this.y - size, 2*size, 2*size);
                if (isAplha) {
                    ctx.globalAlpha = alpha;
                    isAplha = false;
                }
            }
        }
        if (settings.teammatesInd && !this.isPlayerCell && size <= 200 && (skin || comm.checkSkinsMap(this.targetNick, this.color))) {
            drawRender.drawTeammatesInd(ctx, this.x, this.y, size);
        }
        if (settings.noNames && !settings.showMass || update) {
            ctx.restore();
            return;
        }
        let hideCells = false;
        if (!this.isPlayerCell) {
            hideCells = application.setAutoHideCellInfo(size);
            if (hideCells && settings.autoHideNames && settings.autoHideMass) {
                ctx.restore();
                return;
            }
        }
        this.setDrawing();
        this.setDrawingScale();
        //this.drawDebug(ctx)
        ctx.globalAlpha *= theme.textAlpha;
        if (!settings.noNames && !(hideCells && settings.autoHideNames) && !(this.isPlayerCell && settings.hideMyName) && !(skin && settings.hideTeammatesNames)) {
            if (this.setNick(this.targetNick)) {
                this.drawNick(ctx);
            }
        }
        if (settings.showMass && !(hideCells && settings.autoHideMass) && !(this.isPlayerCell && settings.hideMyMass) && !(settings.hideEnemiesMass && !this.isPlayerCell && !this.isVirus)) {
            if (this.setMass(this.size)) {
                this.drawMass(ctx);
            }
        }
        ctx.restore();
    };
}

function Node(view, offset) {
    this.view = view;
    this.offset = offset;
    this.contentType = 1;
    this.uncompressedSize = 0;
    this.setContentType = function() {
        this.contentType = this.readUint32();
    };
    this.setUncompressedSize = function() {
        this.uncompressedSize = this.readUint32();
    };
    this.compareBytesGt = (bytes1, bytes2) => {
        const byte_1 = bytes1 < 0;
        const byte_2 = bytes2 < 0;
        if (byte_1 != byte_2) {
            return byte_1;
        }
        return bytes1 > bytes2;
    };
    this.skipByte = function() {
        const read = this.readByte();
        if (read < 128) {
            return;
        }
        this.skipByte();
    };
    this.readByte = function() {
        return this.view.getUint8(this.offset++);
    };
    this.readUint32 = function() {
        let number = 0;
        let mayor = 0;
        while (true) {
            const read = this.readByte();
            if (this.compareBytesGt(32, mayor)) {
                if (read >= 128) {
                    number |= (read & 127) << mayor;
                } else {
                    number |= read << mayor;
                    break;
                }
            } else {
                this.skipByte();
                break;
            }
            mayor += 7;
        }
        return number;
    };
    this.readFlag = function() {
        return this.readUint32() >>> 3;
    };
}


const Client = function(){
}
Client.prototype = {
    integrity:true,
    quadrant:null,
    realQuadrant:null,
    lastQuadrant:null,
    mirrorV:false,
    mirrorH:false,
    ghostCellsStep:0,
    totalPackets:0,
    isFreeSpectate:false,
    isSpectateEnabled:false,
    ppsLastRequest:null,
    pps:0,
    ws: null,
    lastws:null,
    socket: null,
    shutup:false,
    protocolKey: null,
    clientKey: null,
    estabilished:false,
    connectionOpened: false,
    accessTokenSent: false,
    loggedIn: false,
    clientVersion: 31007,
    clientVersionString: `3.10.7`,
    time: Date.now(),
    serverTime: 0,
    serverTimeDiff: 0,
    loggedInTime: 0,
    mapSize: 14142,
    mapOffset: 7071,
    mapOffsetX: 0,
    mapOffsetY: 0,
    mapShiftX:0,
    mapShiftY:0,
    mapOffsetFixed: false,
    mapMinX: -7071,
    mapMinY: -7071,
    mapMaxX: 7071,
    mapMaxY: 7071,
    mapMidX:0,
    mapMidY:0,
    
    viewMinX: 0,
    viewMinY: 0,
    viewMaxX: 0,
    viewMaxY: 0,

    camMaxX:0,
    camMaxY:0,
    camMinX:0,
    camMinY:0,

    viewportW2s:0,
    viewportW2s:0,

    canvasWidth: 0,
    canvasHeight: 0,
    canvasScale: 1,
    indexedCells: {},
    cells: [],
    removedCells: [],
    food: [],
    viruses: [],
    playerCells: [],
    playerCellIDs: [],
    ghostCells: [],
    playerX: 0,
    playerY: 0,
    playerSize: 0,
    playerMass: 0,
    playerMaxMass: 0,
    playerMinMass: 0,
    playerScore: 0,
    playerSplitCells: 0,
    playerColor: null,
    playerNick: '',
    playerPosition: 0,
    leaderboard: [],
    biggerSTECellsCache: [],
    biggerCellsCache: [],
    smallerCellsCache: [],
    STECellsCache: [],
    STE: 0,
    autoZoom: false,
    zoomValue: 0.1,
    viewX: 0,
    viewY: 0,
    lviewX: 0,
    lviewY: 0,
    scale: 1,
    viewScale: 1,
    clientX: 0,
    clientY: 0,
    /*get clientX(){
        return this._clientX
    },
    set clientX(x){
        console.trace('set',x)
        return this._clientX = x
    },*/
    cursorX: 0,
    cursorY: 0,
    targetX: 0,
    targetY: 0,
    targetDistance: 0,
    battleRoyale: {
        state: 0,
        players: 0,
        startTime: 0,
        shrinkTime: 0,
        timeLeft: 0,
        x: 0,
        y: 0,
        radius: 0,
        targetX: 0,
        targetY: 0,
        targetRadius: 0,
        maxRadius: 11313,
        rank: [],
        playerRank: 0,
        joined: false
    },
    sendPositionInterval:null,
    play: false,
    pause: false,
    targeting: false,
    removePlayerCell: false,
    showFood: true,
    foodIsHidden: false,
    selectBiggestCell: true,
    hideSmallBots: false,
    pressedKeys: {},
    getPlayerX() {
        return this.playerX + this.mapOffsetX//+this.mapShiftX*2;
    },
    getPlayerY() {
        return this.playerY + this.mapOffsetY//+this.mapShiftY*2;
    },
    connect(url) {
        console.log(`[Client 1] Connecting to game server:`, url);
        const app = this;
        clearInterval(this.sendPositionInterval)
        this.closeConnection(!url);
        this.ws = url;
        this.flushCellsData();
        this.lastws = url
        this.protocolKey = null;
        this.clientKey = null;
        this.estabilished = false
        this.accessTokenSent = false;
        this.connectionOpened = false;
        this.loggedIn = false;
        this.mapOffsetFixed = false;
        this.mapShiftX = 0;
        this.mapShiftY = 0;
        this.leaderboard = [];
        this.sendPositionInterval = setInterval(()=>{this.sendPosition()}, 40);
        //if(window.user.startedBots) window.connection.send(new Uint8Array([1]).buffer)
        //window.game.url = url
        //window.user.isAlive = false
        //window.user.macroFeedInterval = null
        if(!url) return false;
        this.integrity = url.indexOf('agar.io')>-1
        this.socket = new WebSocket(url);
        this.socket.binaryType = `arraybuffer`;
        this.socket.onopen = () => {
            this.onOpen();
        };
        this.socket.onmessage = message => {
            this.onMessage(message);
        };
        this.socket.onerror = error => {
            this.onError(error);
        };
        this.socket.onclose = close => {
            this.onClose(close);
        };

        application.emit('connecting',this)
        //application.getWS(this.ws);
        //application.sendServerJoin();
        //application.sendServerData();
        //application.displayLeaderboard('');

    },
    onOpen() {
        console.log(`[Client 1] Game server socket open`);
        this.time = Date.now();
        let view = this.createView(5);
        view.setUint8(0, 254);
        //if(!window.game.protocolVersion) window.game.protocolVersion = 22
        view.setUint32(1, 22, true);
        this.sendMessage(view);
        view = this.createView(5);
        view.setUint8(0, 255);
        //if(!window.game.clientVersion) window.game.clientVersion = this.clientVersion
        view.setUint32(1, this.clientVersion, true);
        this.sendMessage(view);
        this.connectionOpened = true;
        application.emit('connect',this)
    },
    onMessage(message) {
        message = new DataView(message.data);
        if (this.protocolKey) {
            message = this.shiftMessage(message, this.protocolKey ^ this.clientVersion);
        }
        this.handleMessage(message);
    },
    onError() {
        console.log(`[Client 1] Game server socket error`);
        this.flushCellsData();
        application.emit('error',this)
    },
    onClose() {
        console.log('[Client 1] Game server socket close');
        this.flushCellsData();
        !this.shutup && application.emit('close',this)
    },
    closeConnection(shutup) {
        this.shutup = shutup
        if (this.socket) {
            this.socket.onopen = null;
            this.socket.onmessage = null;
            this.socket.onerror = null;
            this.socket.onclose = null;
            try {
                this.socket.close();
            } catch (error) {}
            this.socket = null;
            this.ws = null;
        }
    },
    isSocketOpen() {
        return this.socket !== null && this.socket.readyState === this.socket.OPEN;
    },
    writeUint32(data, value) {
        while (true) {
            if ((value & -128) == 0) {
                data.push(value);
                return;
            } else {
                data.push(value & 127 | 128);
                value = value >>> 7;
            }
        }
    },
    createView(value) { return new DataView(new ArrayBuffer(value)) },
    sendBuffer(data) { this.socket.send(data.buffer) },
    sendMessage(message) {
        if (this.connectionOpened && this.integrity) {
            if (!this.clientKey) {
                return;
            }
            message = this.shiftMessage(message, this.clientKey);
            this.clientKey = this.shiftKey(this.clientKey);
        }
        this.sendBuffer(message);
    },
    sendAction(action) {
        if (!this.isSocketOpen()) {
            return;
        }
        const view = this.createView(1);
        view.setUint8(0, action);
        this.sendMessage(view);
    },
    sendSpectate() {
        this.isSpectateEnabled = true
        this.sendAction(1);
    },
    sendFreeSpectate() {
        this.isFreeSpectate = !this.isFreeSpectate
        this.sendAction(18);
    },
    sendEject() {
        this.sendPosition();
        this.sendAction(21);
    },
    sendSplit() {
        this.sendPosition();
        this.sendAction(17);
    },
    sendNick(nick) {
        this.playerNick = nick;
        var self = this
        var sendSpawn = function(token) {
            nick = window.unescape(window.encodeURIComponent(self.playerNick));
            var view = self.createView(1+nick.length+1+token.length+1);
            var pos = 1
            for (let length = 0; length < nick.length; length++,pos++) view.setUint8(pos, nick.charCodeAt(length))
            pos++
            for (let length = 0; length < token.length; length++,pos++) view.setUint8(pos, token.charCodeAt(length));
            self.sendMessage(view);
        }

        this.integrity && agarCaptcha.requestCaptchaV3("play", function(token) {
            sendSpawn(token)
        });
        !this.integrity && sendSpawn('0')
    },
    sendPosition() {
        if (!this.isSocketOpen() || !this.connectionOpened || (!this.clientKey && this.integrity)) {
            return;
        }
        let cursorX = this.cursorX;
        let cursorY = this.cursorY;
        //window.user.mouseX = cursorX - window.user.offsetX
        //window.user.mouseY = cursorY - window.user.offsetY
        //if(window.user.startedBots && window.user.isAlive) window.connection.send(window.buffers.mousePosition(window.user.mouseX, window.user.mouseY))
        /*if (!this.play && this.targeting || this.pause) {
            cursorX = this.targetX;
            cursorY = this.targetY;
        }*/
        if(tempsett.pause){
            cursorX = this.playerX;
            cursorY = this.playerY;
        }
        const view = this.createView(13);
        view.setUint8(0, 16);
        view.setInt32(1, this.flipX( this.unshiftX(cursorX),true), true);
        view.setInt32(5, this.flipY( this.unshiftY(cursorY),true), true);
        view.setUint32(9, this.protocolKey, true);
        this.sendMessage(view);
    },
    sendAccessToken(shapes, options, oW) {
        //csse
        if(!this.integrity){
            return
        }
        if (this.accessTokenSent) {
            return;
        }
        if (!oW) {
            oW = 102;
        }
        const curr = shapes.length;
        const count = this.clientVersionString.length;
        let data = [oW, 8, 1, 18];
        this.writeUint32(data, curr + count + 23);
        data.push(8, 10, 82);
        this.writeUint32(data, curr + count + 18);
        data.push(8, options, 18, count + 8, 8, 5, 18, count);
        for (var length = 0; length < count; length++) {
            data.push(this.clientVersionString.charCodeAt(length));
        }
        data.push(24, 0, 32, 0, 26);
        this.writeUint32(data, curr + 3);
        data.push(10);
        this.writeUint32(data, curr);
        for (length = 0; length < curr; length++) {
            data.push(shapes.charCodeAt(length));
        }
        data = new Uint8Array(data);
        const dataView = new DataView(data.buffer);
        this.sendMessage(dataView);
    },
    sendFbToken(token) {
        this.sendAccessToken(token, 2);
    },
    sendGplusToken(token) {
        this.sendAccessToken(token, 4);
    },
    sendRecaptcha(token) {
        const view = this.createView(2 + token.length);
        view.setUint8(0, 86);
        for (let length = 0; length < token.length; length++) {
            view.setUint8(1 + length, token.charCodeAt(length));
        }
        view.setUint8(token.length + 1, 0);
        this.sendMessage(view);
    },
    setClientVersion(version, string) {
        this.clientVersion = version;
        this.clientVersionString = string;
        console.log(`[Client 1] Recieved client version:`, version, string);
    },
    generateClientKey(ip, options) {
        if (!ip.length || !options.byteLength) {
            return null;
        }
        let x = null;
        const Length = 1540483477;
        const ipCheck = ip.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2];
        const newLength = ipCheck.length + options.byteLength;
        const uint8Arr = new Uint8Array(newLength);
        for (let length = 0; length < ipCheck.length; length++) {
            uint8Arr[length] = ipCheck.charCodeAt(length);
        }
        uint8Arr.set(options, ipCheck.length);
        const dataview = new DataView(uint8Arr.buffer);
        let type = newLength - 1;
        const value = (type - 4 & -4) + 4 | 0;
        let newValue = type ^ 255;
        let offset = 0;
        while (type > 3) {
            x = Math.imul(dataview.getInt32(offset, true), Length) | 0;
            newValue = (Math.imul(x >>> 24 ^ x, Length) | 0) ^ (Math.imul(newValue, Length) | 0);
            type -= 4;
            offset += 4;
        }
        switch (type) {
            case 3:
                newValue = uint8Arr[value + 2] << 16 ^ newValue;
                newValue = uint8Arr[value + 1] << 8 ^ newValue;
                break;
            case 2:
                newValue = uint8Arr[value + 1] << 8 ^ newValue;
                break;
            case 1:
                break;
            default:
                x = newValue;
                break;
        }
        if (x != newValue) {
            x = Math.imul(uint8Arr[value] ^ newValue, Length) | 0;
        }
        newValue = x >>> 13;
        x = newValue ^ x;
        x = Math.imul(x, Length) | 0;
        newValue = x >>> 15;
        x = newValue ^ x;
        console.log(`[Client 1] Generated client key:`, x);
        return x;
    },
    shiftKey(key) {
        const value = 1540483477;
        key = Math.imul(key, value) | 0;
        key = (Math.imul(key >>> 24 ^ key, value) | 0) ^ 114296087;
        key = Math.imul(key >>> 13 ^ key, value) | 0;
        return key >>> 15 ^ key;
    },
    shiftMessage(view, key, write) {
        if (!write) {
            for (var length = 0; length < view.byteLength; length++) {
                view.setUint8(length, view.getUint8(length) ^ key >>> length % 4 * 8 & 255);
            }
        } else {
            for (var length = 0; length < view.length; length++) {
                view.writeUInt8(view.readUInt8(length) ^ key >>> length % 4 * 8 & 255, length);
            }
        }
        return view;
    },
    decompressMessage(message) {
        const buffer = window.buffer.Buffer;
        const messageBuffer = new buffer(message.buffer); //reader
        const readMessage = new buffer(messageBuffer.readUInt32LE(1));
        
        return this.uncompressBuffer(messageBuffer.slice(5), readMessage)
        
        //LZ4.decodeBlock(messageBuffer.slice(5), readMessage);
        return readMessage;
    },
    uncompressBuffer(input, output){
        for(let i = 0, j = 0; i < input.length;){
            const byte = input[i++]
            let literalsLength = byte >> 4
            if(literalsLength > 0){
                let length = literalsLength + 240
                while(length === 255){
                    length = input[i++]
                    literalsLength += length
                }
                const end = i + literalsLength
                while(i < end) output[j++] = input[i++]
                if(i === input.length) return output
            }
            const offset = input[i++] | (input[i++] << 8)
            if(offset === 0 || offset > j) return -(i - 2)
            let matchLength = byte & 15
            let length = matchLength + 240
            while(length === 255){
                length = input[i++]
                matchLength += length
            }
            let pos = j - offset
            const end = j + matchLength + 4
            while(j < end) output[j++] = output[pos++]
        }
        return output
    },
    handleMessage(view) {
        const encode = () => {
            for (var text = '';;) {
                const string = view.getUint8(offset++);
                if (string == 0) {
                    break;
                }
                text += String.fromCharCode(string);
            }
            return text;
        };
        var offset = 0;
        let opCode = view.getUint8(offset++);
        if (opCode == 54) {
            opCode = 53;
        }
        switch (opCode) {
            case 5:
                //console.error('[Agario] Facebook friends',view)
                //https://github.com/issy123/agario-protocol/issues/21
                break;
            case 17:
                this.viewX = this.flipX(view.getFloat32(offset, true));
                this.protocol_viewX = this.viewX
                //this.lviewX = this.viewX
                offset += 4;
                this.viewY = this.flipY(view.getFloat32(offset, true));
                this.protocol_viewY = this.viewY
                //this.lviewY = this.viewY
                offset += 4;
                this.scale = view.getFloat32(offset, true);
                //console.log(this.scale)

                //this.viewX = Connection.mapOffsetX
                //this.viewY = Connection.mapOffsetY

                break;
            case 18:
                if (this.protocolKey) {
                    this.protocolKey = this.shiftKey(this.protocolKey);
                }
                this.flushCellsData();
                break;
            case 32:
                this.playerCellIDs.push(view.getUint32(offset, true));
                this.isSpectateEnabled = false
                if (!this.play) {
                    this.play = true;
                    //application.hideMenu();
                    this.playerColor = null;
                    this.emit('spawn',this)
                    application.emit('spawn',this)
                    //window.user.isAlive = true
                    //if(window.user.startedBots) window.connection.send(new Uint8Array([5, Number(window.user.isAlive)]).buffer)
                }
                break;
            case 50:
                this.pieChart = [];
                const pieLength = view.getUint32(offset, true);
                offset += 4;
                for (var length = 0; length < pieLength; length++) {
                    this.pieChart.push(view.getFloat32(offset, true));
                    offset += 4;
                }
                application.emit('piechart',this)
                //drawRender.drawPieChart();
                break;
            case 53:
                this.leaderboard = [];
                this.playerPosition = 0;
                if (view.getUint8(0) == 54) {
                    const pos = view.getUint16(offset, true);
                    offset += 2;
                }
                for (let position = 0; offset < view.byteLength;) {
                    var flags = view.getUint8(offset++);
                    let nick = '';
                    let id = 0;
                    let isFriend = false;
                    position++;
                    if (flags & 2) {
                        nick = window.decodeURIComponent(window.escape(encode()));
                    }
                    if (flags & 4) {
                        id = view.getUint32(offset, true);
                        offset += 4;
                    }
                    if (flags & 8) {
                        nick = this.playerNick;
                        id = `isPlayer`;
                        this.playerPosition = position;
                    }
                    if (flags & 16) {
                        isFriend = true;
                    }
                    this.leaderboard.push({
                        nick: nick,
                        id: id,
                        isFriend: isFriend
                    });
                }
                this.handleLeaderboard();
                break;
            case 54:
                console.log(view)
                break;

            case 69:
                var length = view.getUint16(offset, true);
                offset += 0x2;
                this.ghostCells = [];
                this.ghostCellsStep ++
                for(i = 0x0; i < length; i++) {
                    var x = view.getInt32(offset, true);
                    offset += 4;
                    var y = view.getInt32(offset, true);
                    offset += 4;
                    var mass = view.getUint32(offset, true);
                    offset += 4;
                    //false&&console.log(view.getUint8(offset))
                    offset += 1

                    var size = ~~Math.sqrt(100 * mass);
                    this.ghostCells.push({
                        'x': this.flipX(x),
                        'y': this.flipY(y),
                        'size': size,
                        'mass': mass,
                        'inView': this.isInView(this.flipX(x), this.flipY(y), size/2)
                    });
                }

                if(settings.mapLocalFix3 && this.ghostCellsStep==1 && this.ghostCells[0]) {
                    console.log('[DELTA] ghostfix')
                    this.realQuadrant =  this.calcQuadrant(this.flipX(this.ghostCells[0].x), this.flipY(this.ghostCells[0].y))
                    this.setQuadrant(this.lastQuadrant)
                }
                if (this.ghostCells[0]){
                    this.quadrant = this.calcQuadrant(this.ghostCells[0].x, this.ghostCells[0].y)
                    this.realQuadrant = this.calcQuadrant(this.flipX(this.ghostCells[0].x), this.flipY(this.ghostCells[0].y))
                    this.lastQuadrant = this.quadrant
                } else {
                    this.quadrant = 4;
                }

                break;
            case 85:
                console.log(`[Client 1] Captcha requested`);
                application.emit('captcha',this)
                //alert('captcha requested')
                /*if (window.master && window.master.recaptchaRequested) {
                    myCaptcha.widget!=null && grecaptcha.reset(myCaptcha.widget)
                    //window.recaptchaClientId!=null && grecaptcha.reset(window.recaptchaClientId)
                    agarCaptcha.requestCaptcha()
                    //grecaptcha.reset()
                    //grecaptcha.v3mode = false
                    //window.master.recaptchaRequested();
                    
                }*/
                break;
            case 102:
                const node = new Node(view, offset);
                var flags = node.readFlag();
                if (flags == 1) {
                    node.setContentType();
                }
                flags = node.readFlag();
                if (flags == 2) {
                    node.setUncompressedSize();
                }
                flags = node.readFlag();
                if (flags == 1) {
                    const option = node.readUint32();
                    const response = node.readFlag();
                    const response_2 = node.readUint32();
                    console.log('102 option №',option)
                    switch (option) {
                        case 11:
                            console.log(`102 login response`, node.view.byteLength, node.contentType, node.uncompressedSize, option, response, response_2);
                            break;
                        case 62:
                            console.log('102 game over');
                            break;
                        default:
                            console.log('102 unknown', option, response);
                    }
                }
                if (view.byteLength < 20) {
                    this.loggedIn = false;
                    application.emit('logout',this)
                    //window.logout && window.logout();
                }
                break;
            case 103:
                this.accessTokenSent = true;
                break;
            case 104:
                //window.logout && window.logout();
                break;
            case 114:
                console.error('[Agario] Spectate mode is full')
                break;
            case 160:
                //console.log('zlp+',view)
                break;
            case 161:
                //console.log('zlp-',view)
                break;
            case 176:
                this.battleRoyale.startTime = view.getUint32(offset, true);
                break;
            case 177:
                this.battleRoyale.joined = true;
                break;
            case 178:
                this.battleRoyale.players = view.getUint16(offset, true);
                offset += 2;
                var flags = view.getUint16(offset, true);
                offset += 2;
                if (!flags) {
                    this.battleRoyale.state = 0;
                    this.battleRoyale.joined = false;
                }
                if (flags & 3) {
                    this.battleRoyale.state = view.getUint8(offset++);
                    this.battleRoyale.x = view.getInt32(offset, true);
                    offset += 4;
                    this.battleRoyale.y = view.getInt32(offset, true);
                    offset += 4;
                    this.battleRoyale.radius = view.getUint32(offset, true);
                    offset += 4;
                    this.battleRoyale.shrinkTime = view.getUint32(offset, true) * 1000;
                    offset += 4;
                    if (this.battleRoyale.shrinkTime) {
                        this.battleRoyale.timeLeft = ~~((this.battleRoyale.shrinkTime - Date.now() + this.serverTimeDiff) / 1000);
                        if (this.battleRoyale.timeLeft < 0) {
                            this.battleRoyale.timeLeft = 0;
                        }
                    }
                }
                if (flags & 2) {
                    this.battleRoyale.targetX = view.getInt32(offset, true);
                    offset += 4;
                    this.battleRoyale.targetY = view.getInt32(offset, true);
                    offset += 4;
                    this.battleRoyale.targetRadius = view.getUint32(offset, true);
                }
                break;
            case 179:
                console.log(179)
                var flags = view.getUint8(offset);
                const string = window.decodeURIComponent(window.escape(encode()));
                let test = null;
                if (!flags) {
                    test = window.decodeURIComponent(window.escape(encode()));
                    console.log('179',string,test)
                }
                break;
            case 180:
                this.battleRoyale.joined = false;
                this.battleRoyale.rank = [];
                this.battleRoyale.playerRank = view.getUint32(offset, true);
                offset += 8;
                const royaleLength = view.getUint16(offset, true);
                offset += 2;
                for (var length = 0; length < royaleLength; length++) {
                    const name = window.decodeURIComponent(window.escape(encode()));
                    const place = view.getUint32(offset, true);
                    offset += 4;
                    this.battleRoyale.rank.push({
                        place: place,
                        name: name
                    });
                }
                break;
            case 226:
                const ping = view.getUint16(1, true);
                view = this.createView(3);
                view.setUint8(0, 227);
                view.setUint16(1, ping);
                this.sendMessage(view);
                break;
            case 241:
                this.protocolKey = view.getUint32(offset, true);
                console.log('[Client 1] Received protocol key:', this.protocolKey);
                const agarioReader = new Uint8Array(view.buffer, offset += 4);
                this.clientKey = this.generateClientKey(this.ws, agarioReader);

                this.estabilished = true
                application.emit('estabilished',this)
                this.emit('estabilished',this)

                /*
                
                             _0x6af8x11 = 0;
            _0x6af8x12 = 0;
            var _0x6af8x5e = '';
            _0x6af8x12 = _0x6af8x22['getUint32'](_0x6af8x24, !0);
            for (var _0x6af8x18 = 5; _0x6af8x18 < 11; _0x6af8x18++) {
                _0x6af8x5e += String['fromCharCode'](_0x6af8x22['getUint8'](_0x6af8x18, true))
            };
            _0x6af8x11 = _0x6af8x13(window['curIp']['split'](':')[0] + _0x6af8x5e, 255);
            window['ao'] = _0x6af8x11;
            _0x6af8x1['MC']['updateServerVersion'](_0x6af8x5e);
            console['log']('Server version ' + _0x6af8x5e);
            
                */
                break;
            case 242:
                this.serverTime = view.getUint32(offset, true) * 1000;
                this.serverTimeDiff = Date.now() - this.serverTime;
                break;
            case 255:
                this.handleSubmessage(view);
                break;
            case 16:
                this.updateCells(new buffer.Buffer(view.buffer), offset);
                this.countPps()
                break;
            case 64:
                const encode2 = () => {
                    for (var text = '';;) {
                        const string = message.readUInt8(offset++);
                        if (string == 0) {
                            break;
                        }
                        text += String.fromCharCode(string);
                    }
                    return text;
                };
                var message = new buffer.Buffer(view.buffer)
                this.viewMinX = this.flipX(message.readDoubleLE(offset));
                offset += 8;
                this.viewMinY = this.flipY(message.readDoubleLE(offset));
                offset += 8;
                this.viewMaxX = this.flipX(message.readDoubleLE(offset));
                offset += 8;
                this.viewMaxY = this.flipY(message.readDoubleLE(offset));
                offset += 8
                offset += 4
                if(encode2()) {
                    this.estabilished = true
                    application.emit('estabilished',this)
                    this.emit('estabilished',this)
                }

                this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);
                if(~~(this.viewMaxX - this.viewMinX) === 14142 && ~~(this.viewMaxY - this.viewMinY) === 14142){
                    //window.user.offsetX = (this.viewMinX + this.viewMaxX) / 2
                    //window.user.offsetY = (this.viewMinY + this.viewMaxY) / 2
                }
                break;
            default:
                
                console.log(`[Client 1] Unknown opcode:`, view.getUint8(0));
                break;
        }
    },
    countPps() {
        if (!settings.showStatsPPS) {
            return;
        }
        const Time = Date.now();
        if (!this.ppsLastRequest) {
            this.ppsLastRequest = Time;
        }
        if (Time - this.ppsLastRequest >= 1000) {
            this.pps = this.totalPackets;
            this.totalPackets = 0;
            this.ppsLastRequest = Time;
        }
        this.totalPackets++;
    },
    handleSubmessage(message) {
        message = this.decompressMessage(message);
        let offset = 0;
        switch (message.readUInt8(offset++)) {
            case 16:
                this.updateCells(message, offset);
                this.countPps()
                break;
            case 64:
                this.viewMinX = /*this.flipX*/(message.readDoubleLE(offset));
                offset += 8;
                this.viewMinY = /*this.flipY*/(message.readDoubleLE(offset));
                offset += 8;
                this.viewMaxX = /*this.flipX*/(message.readDoubleLE(offset));
                offset += 8;
                this.viewMaxY = /*this.flipY*/(message.readDoubleLE(offset));

                this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);
                if((~~(this.viewMaxX - this.viewMinX)) === 14142 && (~~(this.viewMaxY - this.viewMinY)) === 14142){
                    //window.user.offsetX = (this.viewMinX + this.viewMaxX) / 2
                    //window.user.offsetY = (this.viewMinY + this.viewMaxY) / 2
                }
                break;
            default:
                console.log(`[Connection] Unknown sub opcode:`, message.readUInt8(0));
                break;
        }
    },
    setOffset(){},
    unshiftX(x){return x-(-this.mapShiftX)},
    unshiftY(y){return y-(-this.mapShiftY)},
    shiftX(x,sh){return !sh?x-this.mapShiftX:x},
    shiftY(y,sh){return !sh?y-this.mapShiftY:y},
    flipX(x,sh){
        const a = !this.mirrorH?x: this.mapMaxX - (x - this.mapMinX)
        const b = this.shiftX(a,sh)
        return b
    },
    flipY(y,sh){
        const a = !this.mirrorV?y: this.mapMaxY - (y - this.mapMinY)
        const b = this.shiftY(a,sh)
        return b
    },
    setQuadrant(n){
        //if(this.gameMode == ':party') return false;
        var prevV = this.mirrorV, prevH = this.mirrorH
        if(n == undefined){
            this.mirrorV = false
            this.mirrorH = false
        }
        if(      this.realQuadrant == 0){
            this.mirrorV = n==2||n==3
            this.mirrorH = n==1||n==2
        }else if(this.realQuadrant == 1){
            this.mirrorV = n==2||n==3
            this.mirrorH = n==0||n==3
        }else if(this.realQuadrant == 2){
            this.mirrorV = n==1||n==0
            this.mirrorH = n==0||n==3
        }else if(this.realQuadrant == 3){
            this.mirrorV = n==1||n==0
            this.mirrorH = n==1||n==2
        }

        if(prevV!=this.mirrorV||prevH != this.mirrorH){
            this.shiftCells()
        }
    },
    shiftCells(){
        for (var id in this.indexedCells){
            this.indexedCells[id].x=this.flipX(this.indexedCells[id].x)
            this.indexedCells[id].y=this.flipY(this.indexedCells[id].y)
            this.indexedCells[id].targetX=this.flipX(this.indexedCells[id].targetX)
            this.indexedCells[id].targetY=this.flipY(this.indexedCells[id].targetY)
        }
    },
    calcQuadrant(x, y) {
        var ofs = 150;
        var calc = (x < this.mapMidX + ofs && x > this.mapMidX - ofs) || (y < this.mapMidY + ofs && y > this.mapMidY - ofs) ? 4 : x >= this.mapMidX && y < this.mapMidY ? 0 : x < this.mapMidX && y < this.mapMidY ? 1 : x < this.mapMidX && y >= this.mapMidY ? 2 : 3;
        return calc
    },
    shortMassFormat(value) {
        return value < 1000 ? value : `${Math.round(value / 100) / 10}k`;
    },
    handleLeaderboard() {
        let text = '';
        let teamText = '';
        for (var length = 0; length < this.leaderboard.length; length++) {
            if (length == settings.leaderboardLength) {
                break;
            }
            let html = '<span>';
            if (this.leaderboard[length].id === `isPlayer`) {
                html = `<span class="me">`;
            } else {
                if (profiles.mainProfile.clanTag.length && this.leaderboard[length].nick.indexOf(profiles.mainProfile.clanTag) == 0) {
                    html = `<span class="teammate">`;
                }
            }
            text += `${html + (length + 1)}. ${this.escapeHTML(this.leaderboard[length].nick)}</span>`;
        }
        if (this.playerPosition > settings.leaderboardLength) {
            text += `<span class="me">${this.playerPosition}. ${this.escapeHTML(this.playerNick)}</span>`;
        }
        text+='<span class="me">Total : '+this.leaderboard.length+'</span>'
        if (settings.showLbData) {
            for (var i = 0; i < this.ghostCells.length; i++) {
                if (i == length) {
                    break;
                }
                teamText += `<span class="lb-data"><span class="top5-mass-color">` + this.shortMassFormat(this.ghostCells[i].mass) + `</span></span>`;
            }
            
        }
        application.displayLeaderboard(text, teamText);
    },
    flushCellsData() {
        this.isFreeSpectate = false
        this.isSpectateEnabled = false
        this.quadrant = null
        this.realQuadrant = null
        this.lastQuadrant =  this.lastQuadrant = this.ws != this.lastws? null :this.lastQuadrant
        this.mirrorH = false
        this.mirrorV = false
        this.ghostCellsStep = 0

        this.ghostCells = []
        this.play = false;
        this.indexedCells = {};
        this.cells = [];
        this.playerCells = [];
        this.playerCellIDs = [];
        this.ghostCells = [];
        this.food = [];
        this.viruses = [];
    },
    setMapOffset(left, top, right, bottom) {
                //this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY

        if ((right - left) > 14000 && (bottom - top) > 14000) {
            
            console.log('mapMinX',this.mapMinX == left)
            console.log('mapMinY',this.mapMinY == top)
            console.log('mapMaxX',this.mapMaxX == right)
            console.log('mapMaxY',this.mapMaxY == bottom)

            this.mapOffsetX = (this.mapOffset) - right;
            this.mapOffsetY = (this.mapOffset) - bottom;
            this.mapMinX = left//((-this.mapOffset) - this.mapOffsetX);
            this.mapMinY = top//((-this.mapOffset) - this.mapOffsetY);
            this.mapMaxX = right//((this.mapOffset) - this.mapOffsetX);
            this.mapMaxY = bottom//((this.mapOffset) - this.mapOffsetY);
            this.mapMidX = (this.mapMaxX + this.mapMinX) / 2;
            this.mapMidY = (this.mapMaxY + this.mapMinY) / 2;
            if (!this.mapOffsetFixed) {
                this.viewX = (right + left) / 2;
                this.viewY = (bottom + top) / 2;
                //application.emit('offset',this)
            }
            this.mapOffsetFixed = true;
            //application.emit('offset',this)
            console.log(`[Client 1] Map offset fixed (x, y):`, this.mapOffsetX, this.mapOffsetY);
        }else{
            this.viewportMinX = left
            this.viewportMinY = top
            this.viewportMaxX = right
            this.viewportMaxY = bottom
        }
        /*if ((right - left) > 14000 && (bottom - top) > 14000) {

            this.mapOffsetX = (this.mapOffset) - right;
            this.mapOffsetY = (this.mapOffset) - bottom;
            this.mapMinX = ((-this.mapOffset) - this.mapOffsetX);
            this.mapMinY = ((-this.mapOffset) - this.mapOffsetY);
            this.mapMaxX = ((this.mapOffset) - this.mapOffsetX);
            this.mapMaxY = ((this.mapOffset) - this.mapOffsetY);
            this.mapMidX = (this.mapMaxX + this.mapMinX) / 2;
            this.mapMidY = (this.mapMaxY + this.mapMinY) / 2;
            if (!this.mapOffsetFixed) {
                this.viewX = (right + left) / 2;
                this.viewY = (bottom + top) / 2;
                //application.emit('offset',this)
            }
            this.mapOffsetFixed = true;
            //application.emit('offset',this)
            console.log(`[Client 1] Map offset fixed (x, y):`, this.mapOffsetX, this.mapOffsetY);
        }*/
    },
    calcViewport(){
        var size = 0
        var mtp = 1.995//1.995
        if(this.playerCells.length>0){
            for (var im = 0; this.playerCells.length > im; im++) 
                size += this.playerCells[im].size
        }else if( this.isFreeSpectate==false && this.isSpectateEnabled==true ){
                for (var i = 0; this.leaderboard.length > i; i++) {
                    for (var im = 0; this.cells.length > im; im++) 
                        if (this.cells[im].nick == this.leaderboard[i].nick)
                            size += this.cells[im].size
                    break
                }
        }else{
            if(this.isFreeSpectate && this.isSpectateEnabled) mtp = 4.95
        }
        var s = Math.pow(Math.min(64 / size, 1), 0.4000);
        this.viewportW2s = 1024/ s / 2 * mtp; //WSVGA
        this.viewportH2s = 600 / s / 2 * mtp;
    },
    isInViewport(x, y, size){
        /* Primitive */
        if (x + size < this.protocol_viewX - this.viewportW2s || y + size < this.protocol_viewY - this.viewportH2s || x - size > this.protocol_viewX + this.viewportW2s || y - size > this.protocol_viewY + this.viewportH2s) {
            return false;
        }
        return true;
    },
    circleInViewport(x, y, size){
        /* Hard */
        var rect={x:this.viewX - this.viewportW2s,y:this.viewY - this.viewportH2s,w:this.viewportW2s*2,h:this.viewportH2s*2};

        var distX = Math.abs(x - this.viewX);
        var distY = Math.abs(y - this.viewY);
    
        if (distX > (this.viewportW2s + size)) { return false; }
        if (distY > (this.viewportH2s + size)) { return false; }
    
        if (distX <= (this.viewportW2s)) { return true; } 
        if (distY <= (this.viewportH2s)) { return true; }
    
        var dx=distX-this.viewportW2s;
        var dy=distY-this.viewportH2s;
        return (dx*dx+dy*dy<=(size*size));
    },
    isInView(x, y, size) {
        var x2s = this.canvasWidth / 2 / this.scale;
        var y2s = this.canvasHeight / 2 / this.scale;
        if (x + size < this.viewX - x2s || y + size < this.viewY - y2s || x - size > this.viewX + x2s || y - size > this.viewY + y2s) {
            return false;
        }
        return true;
    },
    updateCells(view, offset) {
        const encode = () => {
            for (var text = '';;) {
                const string = view.readUInt8(offset++);
                if (string == 0) {
                    break;
                }
                text += String.fromCharCode(string);
            }
            return text;
        };
        this.time = Date.now();
        this.removePlayerCell = false;
        let eatEventsLength = view.readUInt16LE(offset);
        offset += 2;
        for (var length = 0; length < eatEventsLength; length++) {
            const eaterID = this.indexedCells[view.readUInt32LE(offset)];
            const victimID = this.indexedCells[view.readUInt32LE(offset + 4)];
            //console.log('victim isFood',victimID.isFood)
            offset += 8;
            if (eaterID && victimID) {
                victimID.targetX = eaterID.x;
                victimID.targetY = eaterID.y;
                victimID.targetSize = victimID.size;
                victimID.time = this.time;
                victimID.removeCell();
            }
        }

        //var maxedX=maxedY=minedX=minedY=0
        

        for (length = 0;;) {
            var id = view.readUInt32LE(offset);
            offset += 4;
            if (id == 0) {
                break;
            }
            let x = this.flipX(view.readInt32LE(offset));
            offset += 4;
            let y = this.flipY(view.readInt32LE(offset));
            offset += 4;


            /*x =//mm
            y =//mm
*/

            const size = view.readUInt16LE(offset);
            offset += 2;
            const flags = view.readUInt8(offset++);
            let extendedFlags = 0;
            if (flags & 128) {
                extendedFlags = view.readUInt8(offset++);
            }
            let color = null;
            let skin = null;
            let name = '';
            let accountID = null;
            if (flags & 2) {
                const r = view.readUInt8(offset++);
                const g = view.readUInt8(offset++);
                const b = view.readUInt8(offset++);
                color = this.rgb2Hex(~~(r * 0.9), ~~(g * 0.9), ~~(b * 0.9));
            }
            if (flags & 4) {
                skin = encode();
            }
            if (flags & 8) {
                name = window.decodeURIComponent(window.escape(encode()));
            }
            const isVirus = flags & 1;
            const isFood = extendedFlags & 1;
            var cell = null;
            if (this.indexedCells.hasOwnProperty(id)) {
                cell = this.indexedCells[id];
                if (color) {
                    cell.color = color;
                }
            } else {
                cell = new Cell(id, x, y, size, color, isFood, isVirus, false, settings.shortMass, settings.virMassShots);

                cell.c = this
                cell.time = this.time;
                if (!isFood) {
                    if (isVirus && settings.virusesRange) {
                        this.viruses.push(cell);
                    }
                    this.cells.push(cell);
                    if (this.playerCellIDs.indexOf(id) != -1 && this.playerCells.indexOf(cell) == -1) {
                        cell.isPlayerCell = true;
                        this.playerColor = color;
                        this.playerCells.push(cell);
                    }
                } else {
                    this.food.push(cell);
                }
                this.indexedCells[id] = cell;
            }
            

             

            if (cell.isPlayerCell) {
                name = this.playerNick;
            }
            if (name) {
                cell.targetNick = name;
            }
            cell.targetX = x;
            cell.targetY = y;
            cell.targetSize = size;
            cell.isFood = isFood;
            cell.isVirus = isVirus;
            if (skin) {
                cell.skin = skin;
            }
            if (extendedFlags & 4) {
                accountID = view.readUInt32LE(offset);
                cell.accountID = accountID
                offset += 4;
            }
        }
       // var rmaxedX=rmaxedY=rminedX=rminedY=0
        eatEventsLength = view.readUInt16LE(offset);
        offset += 2;
        for (length = 0; length < eatEventsLength; length++) {
            var id = view.readUInt32LE(offset);
            offset += 4;
            cell = this.indexedCells[id];
            if (cell) {
                cell.removeCell();
            }
        }
        if (this.removePlayerCell && !this.playerCells.length) {
            this.play = false;
            this.isSpectateEnabled = false


            
            application.emit('death',this)
            //application.onPlayerDeath();
            //application.showMenu(300);
            //window.user.isAlive = false
            //if(window.user.startedBots) window.connection.send(new Uint8Array([5, Number(window.user.isAlive)]).buffer)
        }
    },
    color2Hex(number) {
        const color = number.toString(16);
        return color.length == 1 ? '0'+color : color;
    },
    rgb2Hex(r, g, b) {
        return '#'+this.color2Hex(r)+this.color2Hex(g)+this.color2Hex(b)
    },
    sortCells() {
        this.cells.sort((A, B) => A.size == B.size ? A.id - B.id : A.size - B.size);
    },
    calculatePlayerMassAndPosition() {
        let size = 0;
        let targetSize = 0;
        let x = 0;
        let y = 0;
        const playersLength = this.playerCells.length;
        for (let length = 0; length < playersLength; length++) {
            const currentPlayer = this.playerCells[length];
            size += currentPlayer.size;
            targetSize += currentPlayer.targetSize * currentPlayer.targetSize;
            x += currentPlayer.x / playersLength;
            y += currentPlayer.y / playersLength;
        }

        //if(settings.cameraDelay==0){
            this.viewX = x;
            this.viewY = y;
            this.protocol_viewX = x
            this.protocol_viewY = y
            //this.lviewX = x
            //this.lviewY = y
        /*}else{
            var sp30 = settings.cameraDelay
            var sp29 = settings.cameraDelay-1
            this.viewX = (sp29 * this.viewX + x) / sp30;
            this.viewY = (sp29 * this.viewY + y) / sp30;
        }*/
        this.playerSize = size;
        this.playerMass = ~~(targetSize / 100);
        this.recalculatePlayerMass();
    },
    recalculatePlayerMass() {
        this.playerScore = Math.max(this.playerScore, this.playerMass);
        if (settings.virColors || settings.splitRange || settings.oppColors || settings.oppRings || settings.showStatsSTE) {
            const cells = this.playerCells;
            const CellLength = cells.length;
            cells.sort((row, conf) => row.size == conf.size ? row.id - conf.id : row.size - conf.size);
            this.playerMinMass = ~~(cells[0].size * cells[0].size / 100);
            this.playerMaxMass = ~~(cells[CellLength - 1].size * cells[CellLength - 1].size / 100);
            this.playerSplitCells = CellLength;
        }
        if (settings.showStatsSTE) {
            const mass = this.selectBiggestCell ? this.playerMaxMass : this.playerMinMass;
            if (mass > 35) {
                this.STE = ~~(mass * (mass < 1000 ? 0.35 : 0.38));
            } else {
                this.STE = null;
            }
        }
    },
    compareCells() {
        if (!this.play) {
            return;
        }
        if (settings.oppColors || settings.oppRings || settings.splitRange) {
            if (settings.oppRings || settings.splitRange) {
                this.biggerSTECellsCache = [];
                this.biggerCellsCache = [];
                this.smallerCellsCache = [];
                this.STECellsCache = [];
            }

            for (const cell of this.cells) {
                if (cell.isVirus) {
                    continue;
                }
                const size = ~~(cell.size * cell.size / 100);
                const mass = this.selectBiggestCell ? this.playerMaxMass : this.playerMinMass;
                const fixMass = size / mass;
                const smallMass = mass < 1000 ? 0.35 : 0.38;
                if (settings.oppColors && !settings.oppRings) {
                    cell.oppColor = this.setCellOppColor(cell.isPlayerCell, fixMass, smallMass);
                }
                if (!cell.isPlayerCell && (settings.splitRange || settings.oppRings)) {
                    this.cacheCells(cell.x, cell.y, cell.size, fixMass, smallMass);
                }
            }
        }
    },
    cacheCells(x, y, size, mass, smallMass) {
        if (mass >= 2.5) {
            this.biggerSTECellsCache.push({
                x: x,
                y: y,
                size: size
            });
            return;
        } else if (mass >= 1.25) {
            this.biggerCellsCache.push({
                x: x,
                y: y,
                size: size
            });
            return;
        } else if (mass < 1.25 && mass > 0.75) {
            return;
        } else if (mass > smallMass) {
            this.smallerCellsCache.push({
                x: x,
                y: y,
                size: size
            });
            return;
        } else {
            this.STECellsCache.push({
                x: x,
                y: y,
                size: size
            });
            return;
        }
    },
    setCellOppColor(isPlayer, mass, smallMass) {
        if (isPlayer) {
            return profiles.mainProfile.color;
        }
        if (mass > 11) {
            return `#FF008C`;
        } else if (mass >= 2.5) {
            return `#BE00FF`;
        } else if (mass >= 1.25) {
            return `#FF0A00`;
        } else if (mass < 1.25 && mass > 0.75) {
            return `#FFDC00`;
        } else if (mass > smallMass) {
            return `#00C8FF`;
        } else {
            return `#64FF00`;
        }
    },
    getCursorPosition(viewX,viewY) {
        if(application.c.indexOf(this) != application.tabCurrent){return}
        //console.log(this.viewX,this.viewY)
        this.cursorX = (this.clientX - this.canvasWidth / 2) / this.viewScale + this.viewX;
        this.cursorY = (this.clientY - this.canvasHeight / 2) / this.viewScale +this.viewY;
    },
    setZoom(event) {
        this.zoomValue = this.zoomValue * settings.zoomSpeedValue ** (event.wheelDelta / -120 || event.detail || 0);
        if (this.zoomValue > 1 / this.viewScale) {
            this.zoomValue = 1 / this.viewScale;
        }
        if (this.zoomValue < 0.00008 / this.viewScale) {
            this.zoomValue = 0.00008 / this.viewScale;
        }
    },
    setTargetPosition(x, y) {
        this.targetX = x - this.mapOffsetX;
        this.targetY = y - this.mapOffsetY;
        this.targetDistance = Math.round(Math.sqrt((this.playerX - this.targetX) ** 2 + (this.playerY - this.targetY) ** 2));
    },
    resetTargetPosition() {
        this.targetX = this.playerX;//this.viewX/2
        this.targetY = this.playerY;//this.viewY2/2
    },
    escapeHTML(string) {
        return String(string).replace(/[&<>"'/]/g, event => escapeChar[event]);
    },
    /*
    setKeys() {
        const app = this;
        document.onkeydown = event => {
            const key = event.keyCode;
            if (app.pressedKeys[key]) {
                return;
            }
            switch (key) {
                case 13:
                    app.sendNick('');
                    break;
                case 32:
                    app.sendSplit();
                    break;
                case 81:
                    app.sendFreeSpectate();
                    break;
                case 83:
                    app.sendSpectate();
                    break;
                case 87:
                    app.sendEject();
                    break;
            }
        };
        document.onkeyup = event => {
            app.pressedKeys[event.keyCode] = false;
        };
    },*/
    init() {
        const app = this;
        /*if (window.master && window.master.clientVersion) {
            this.setClientVersion(window.master.clientVersion, window.master.clientVersionString);
        }*/
    }
};

eventify(Client.prototype)

//const Connection = new Client()