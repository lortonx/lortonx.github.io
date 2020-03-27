var mirror = {
    token:'',
    socket:null,
    send:function(nick,quadrant) {
        if(settings.mapGlobalFix4 == false &&  this.socket && this.socket.readyState == 1){this.socket.close();this.socket=null;return;}
        if(application.play && comm.playerID &&  this.socket && this.socket.readyState == 1) {
            nick = window.unescape(window.encodeURIComponent(nick));
            if (quadrant != null) {
                this.socket.send(JSON.stringify({
                    "toH": this.token,
                    "msg": {
                        "t": nick,
                        "s": quadrant
                    }
                }));
            }
        }
    },
    connect:function(token){
       this.token = token
       if(settings.mapGlobalFix4 == false) return;
       if(this.socket) {this.socket.url = 'wss://cloud.achex.ca/JIMBOY3200'+this.token ;return this.socket.refresh()}
       var onMessage = function(e){
         var data = JSON.parse(e.data)
         
         if(!data.msg) return;
         var quadrant = data.msg.s
         var name = window.decodeURIComponent(escape(data.msg.t));
         var id = comm.checkPlayerNick(name);
         if (null != id) {
            comm.teamPlayers[id].quadrant = quadrant;
            //console.log(name,quadrant)
         }
        
     }
     var onOpen = function(){
       this.socket.send(JSON.stringify({"auth":"JIM2"+comm.playerID,"password":"legendmod2"}))
       this.socket.send(JSON.stringify({"joinHub":this.token}))
     }.bind(this)
 
     var onClose = function(){
     }
     this.socket = new ReconnectingWebSocket('wss://cloud.achex.ca/JIMBOY3200'+this.token, null, {
       reconnectInterval: 3000,
       maxReconnectAttempts:3
     });
     //socket.binaryType = 'arraybuffer';
     this.socket.onmessage = onMessage
     this.socket.onopen = onOpen
     this.socket.onclose = onClose     
    }
}


function minimapCell(id, name, skinID, skinUrl) {
    this.id = id;
    this.nick = name;
    this.skinID = skinID;
    this.skinURL = skinUrl;
    this.quadrant = -1
    this.x = 0;
    this.y = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.mass = 0;
    this.clanTag = '';
    this.color = null;
    this.customColor = theme.miniMapTeammatesColor;
    this.alive = false;
    this.updateTime = null;
    this.pi2 = 2 * Math.PI;
    this.setColor = function(color, customColor) {
        this.color = color;
        if (customColor.length == 7) {
            this.customColor = customColor;
        }
    };
    this.drawPosition = function(ctx, offset, size, privateMap, targetID) {
        if (!this.alive || privateMap && targetID && this.id != targetID) {
            return;
        }
        this.lastX = (29 * this.lastX + this.x) / 30;
        this.lastY = (29 * this.lastY + this.y) / 30;
        const posX = (this.lastX + offset) * size;
        const posY = (this.lastY + offset) * size;
        if (this.nick.length > 0) {
            ctx.font = `${theme.miniMapNickFontWeight} ${theme.miniMapNickSize}px ${theme.miniMapNickFontFamily}`;
            ctx.textAlign = `center`;
            ctx.textBaseline = "bottom";
            if (theme.miniMapNickStrokeSize > 0) {
                ctx.lineWidth = theme.miniMapNickStrokeSize;
                ctx.strokeStyle = theme.miniMapNickStrokeColor;
                ctx.strokeText(this.nick, posX, posY - (theme.miniMapTeammatesSize * 2 + 2.5));
            }
            ctx.fillStyle = theme.miniMapNickColor;
           
            ctx.fillText(this.nick, posX, posY - (theme.miniMapTeammatesSize * 2 + 2));
        }
        if(this.quadrant<0){
            ctx.beginPath();
            ctx.arc(posX, posY, theme.miniMapTeammatesSize, 0, this.pi2, false);
            ctx.closePath();
        }else{
            const posY3 = posY-theme.miniMapTeammatesSize/3
            const height = theme.miniMapTeammatesSize * Math.cos(Math.PI / 6);
            ctx.beginPath();
            ctx.moveTo(posX-theme.miniMapTeammatesSize, posY3+theme.miniMapTeammatesSize);
            ctx.lineTo(posX+theme.miniMapTeammatesSize, posY3+theme.miniMapTeammatesSize);
            ctx.lineTo(posX, posY3 - height);
            ctx.closePath();
        }
        if (settings.oneColoredTeammates) {
            ctx.fillStyle = theme.miniMapTeammatesColor;
        } else {
            ctx.fillStyle = this.color;
        }
        ctx.fill();
        
    };
}



const emojiChar = {
    ':)': `1f642.svg`,
    ';)': `1f609.svg`,
    '=)': '1f60f.svg',
    ':D': `1f600.svg`,
    'X-D': `1f606.svg`,
    '=D': `1f602.svg`,
    ':(': '2639.svg',
    ';(': `1f62d.svg`,
    ':P': `1f61b.svg`,
    ';P': '1f61c.svg',
    ':*': '1f618.svg',
    '$)': '1f60d.svg',
    '<3': `2764.svg`,
    '8=)': '1f60e.svg',
    ':o': `1f632.svg`,
    '(:|': `1f613.svg`,
    ':|': `1f610.svg`,
    ':': '1f612.svg',
    ':@': '1f621.svg',
    '|-)': '1f634.svg',
    '^_^': '1f60a.svg',
    '-_-': `1f611.svg`,
    '$_$': `1f911.svg`,
    'O:)': `1f607.svg`,
    '3:)': `1f608.svg`,
    '(poop)': `1f4a9.svg`,
    '(fuck)': '1f595.svg',
    '(clap)': `1f44f.svg`,
    '(ok)': `1f44c.svg`,
    '(victory)': '270c.svg',
    '(y)': '1f44d.svg',
    '(n)': `1f44e.svg`,

    '(angry)': '1f479.svg',
    '(clown)': '1f921.svg',
    '(crazy)': '1f61c.svg',
    '(devil)': '1f47a.svg',
    '(devil2)': '1f47e.svg',
    '(fb)': '1f1eb.svg',
    '(google)': '1f1ec.svg',
    '(ghost)': '1f47b.svg',
    '(heel)': '1f460.svg',
    '(kiss)': '1f48b.svg',
    '(lipstick)': '1f484.svg',
    //				'(rage)': 'newrage.svg',
    '(teacher)': '1f440.svg',
    '(together)': '1f491.svg',
    '(toothy)': '1f913.svg',
    '(baby)': '1f476.svg',
    '(wow)': '1f631.svg'
};
var comm = {
    privateMode: false,
    protocolMode: true,
    publicIP: 'wss://wss.ogario.eu:3443',
    privateIP: null,
    updateInterval: 1000,
    updateTick: 0,
    updateMaxTick: 2,
    currentSector: '',
    miniMap: null,
    miniMapCtx: null,
    miniMapSectors: null,
    pi2: 2 * Math.PI,
    socket: null,
    cells: {},
    teamPlayers: [],
    parties: [],
    chatHistory: [],
    chatUsers: {},
    chatMutedUsers: {},
    chatMutedUserIDs: [],
    customSkinsCache: {},
    customSkinsMap: {},
    cacheQueue: [],
    deathLocations: [],
    playerID: null,
    playerMass: 0,
    selectedProfile: 0,
    lastDeath: 0,
    skipServerData: false,
    gameMode: `:ffa`,
    region: '',
    partyToken: '',
    ws: '',
    serverIP: '',
    serverArena: '',
    serverToken: '',
    lastSentNick: '',
    lastSentClanTag: null,
    lastSentSkinURL: '',
    lastSentCustomColor: '',
    lastSentPartyToken: '',
    lastSentServerToken: '',
    lastMessageSentTime: Date.now(),
    privateMiniMap: false,
    messageSound: null,
    top5limit:5,
    get c(){
        return application.c[0]
    },
    
    connect() {
        this.closeConnection();
        this.flushData();
        //this.setParty();
        console.log(`[Communication] Connecting to chat server`);
        if (this.privateMode && this.privateIP) {
            this.socket = new WebSocket(this.privateIP);
        } else {
            this.socket = new WebSocket(this.publicIP);
        }
        this.socket.ogarioWS = true;
        this.socket.binaryType = 'arraybuffer';
        const app = this;
        this.socket.onopen = () => {
            console.log('[Communication] Socket open chat server');
            const buf = app.createView(3);
            buf.setUint8(0, 0);
            buf.setUint16(1, 401, true);
            app.sendBuffer(buf);
            app.sendPartyData();
        };
        this.socket.onmessage = message => {
            app.handleMessage(message);
        };
        this.socket.onclose = close => {
            app.flushData();
            console.log('[Communication] Socket close chat server', close);
        };
        this.socket.onerror = error => {
            app.flushData();
            console.log(`[Communication] Socket error chat server`, error);
        };
    },
    closeConnection() {
        if (this.socket) {
            this.socket.onmessage = null;
            try {
                this.socket.close();
            } catch (error) {}
            this.socket = null;
        }
    },
    reconnect() {
        //this.setParty();
        const app = this;
        setTimeout(() => {
            app.connect();
        }, 1000);
    },
    isSocketOpen() {
        return this.socket !== null && this.socket.readyState === this.socket.OPEN;
    },
    createView(value) {
        return new DataView(new ArrayBuffer(value));
    },
    strToBuff(offset, str) {
        const view = this.createView(1 + str.length * 2);
        view.setUint8(0, offset);
        for (let length = 0; length < str.length; length++) {
            view.setUint16(1 + length * 2, str.charCodeAt(length), true);
        }
        return view;
    },
    sendBuffer(value) {
        this.socket.send(value.buffer);
    },
    handleMessage(message) {
        this.readMessage(new DataView(message.data));
    },
    readMessage(message) {
        switch (message.getUint8(0)) {
            case 0:
                this.playerID = message.getUint32(1, true);
                break;
            case 1:
                this.sendPlayerUpdate();
                break;
            case 20:
                this.updateTeamPlayer(message);
                break;
            case 30:
                this.updateTeamPlayerPosition(message);
                break;
            case 96:
                //break;
                this.updateParties(message);
                this.displayParties();
                break;
            case 100:
                this.readChatMessage(message);
                break;
        }
    },
    sendPlayerState(state) {
        if (this.isSocketOpen()) {
            const view = this.createView(1);
            view.setUint8(0, state);
            this.sendBuffer(view);
        }
    },
    sendPlayerSpawn() {
        this.sendPlayerState(1);
    },
    sendPlayerDeath() {
        this.sendPlayerState(2);
    },
    sendPlayerJoin() {
        this.sendPlayerState(3);
    },
    sendPlayerData(offset, name, str) {
        if (this[name] !== null && this[name] === str) {
            return;
        }
        if (this.isSocketOpen()) {
            this.sendBuffer(this.strToBuff(offset, str));
            this[name] = str;
        }
    },
    sendPlayerNick() {
        this.sendPlayerData(10, `lastSentNick`, profiles.mainProfile.nick);
    },
    sendPlayerClanTag() {
        this.sendPlayerData(11, `lastSentClanTag`, profiles.mainProfile.clanTag);
    },
    sendPlayerSkinURL() {
        this.sendPlayerData(12, `lastSentSkinURL`, profiles.mainProfile.skinURL);
    },
    sendPlayerCustomColor() {
        this.sendPlayerData(13, `lastSentCustomColor`, profiles.mainProfile.color);
    },
    sendPlayerColor() {
        if (this.isSocketOpen() && this.c.playerColor) {
            this.sendBuffer(this.strToBuff(14, this.c.playerColor));
        }
    },
    sendPartyToken() {
        //this.setParty();
        this.sendPlayerData(15, `lastSentPartyToken`, application.partyToken);
    },
    sendServerToken() {
        this.sendPlayerData(16, 'lastSentServerToken', application.serverToken);
    },
    sendServerJoin() {
        console.log('[Delta] Map rotation unlocked!')
        this.sc = [0,0,0,0,0,0]
        this.scLock = false
        this.scoreStep = 0
        this.lastMostLike = 4
        this.sendServerToken();
        this.sendPlayerJoin();
    },
    sendServerRegion() {
        if (!this.region) {
            return;
        }
        const region = this.region.split('-');
        if (this.isSocketOpen()) {
            this.sendBuffer(this.strToBuff(17, region[0]));
        }
    },
    sendServerGameMode() {
        let gamemode = `FFA`;
        switch (this.gameMode) {
            case `:battleroyale`:
                gamemode = `BTR`;
                break;
            case `:teams`:
                gamemode = `TMS`;
                break;
            case `:experimental`:
                gamemode = `EXP`;
                break;
            case `:party`:
                gamemode = `PTY`;
                break;
        }
        if (this.isSocketOpen()) {
            this.sendBuffer(this.strToBuff(18, gamemode));
        }
    },
    sendServerData() {
        if (this.skipServerData) {
            this.skipServerData = false;
            return;
        }
        this.region = $('#region').val();
        this.gameMode = $('#gamemode').val();
        this.sendServerRegion();
        this.sendServerGameMode();
    },
    sendPartyData() {
        if(settings.mapGlobalFix4) mirror.connect(application.serverToken)
        console.log('sendpartydata')
        this.sendPlayerClanTag();
        this.sendPartyToken();
        this.sendServerToken();
        this.sendPlayerNick();
    },
    sendPlayerUpdate() {
        if (this.isSocketOpen() && this.c.play && this.playerID && this.c.playerColor) {
            function encode(str) {
                for (let length = 0; length < str.length; length++) {
                    view.setUint16(offset, str.charCodeAt(length), true);
                    offset += 2;
                }
                view.setUint16(offset, 0, true);
                offset += 2;
            }
            let text = 41;
            text += profiles.mainProfile.nick.length * 2;
            text += profiles.mainProfile.skinURL.length * 2;
            var view = this.createView(text);
            view.setUint8(0, 20);
            view.setUint32(1, this.playerID, true);
            var offset = 5;
            encode(profiles.mainProfile.nick);
            encode(profiles.mainProfile.skinURL);
            encode('#ffffff'||profiles.mainProfile.color);
            encode('#ffffff'||this.c.playerColor);
            this.sendBuffer(view);
        }
    },
    sendPlayerPosition() {
        if (this.isSocketOpen() && this.c.play && this.playerID) {
            const view = this.createView(17);
            view.setUint8(0, 30);
            view.setUint32(1, this.playerID, true);
            view.setInt32(5, this.c.getPlayerX(), true);
            view.setInt32(9, this.c.getPlayerY(), true);
            if (typeof this.c.playerMass !== `undefined`) {
                view.setUint32(13, this.c.playerMass, true);
            } else {
                view.setUint32(13, this.c.playerMass, true);
            }
            this.sendBuffer(view);
        }
    },
    checkPlayerID(id) {
        if (id) {
            for (let length = 0; length < this.teamPlayers.length; length++) {
                if (this.teamPlayers[length].id == id) {
                    return length;
                }
            }
        }
        return null;
    },
    checkPlayerNick(t) {
        if (t)
            for (var e = 0; e < this.teamPlayers.length; e++)
                if (this.teamPlayers[e].nick == t) return e;
        return null;
    },


    escapeHTML(string) {
        return String(string).replace(/[&<>"'/]/g, event => escapeChar[event]);
    },
    checkImgURL(url) {
        if (url.includes("png") || url.includes("jpg") || url.includes("jpeg")) {
            return url;
        } else {
            return false;
        }
    },
    checkSkinURL(url) {
        return this.checkImgURL(url)
    },
    toggleDeath() {
        this.lastDeath--;
        if (this.lastDeath < 0) {
            this.lastDeath = this.deathLocations.length - 1;
        }
    },
    flushData() {
        this.flushPartyData();
        this.flushSkinsMap();
        this.flushChatData();
        //this.cancelTargeting();
        //this.c.play = false;
        //this.c.playerColor = null;
    },
    flushPartyData() {
        this.teamPlayers = [];
        this.parties = [];
        this.lastSentNick = '';
        this.lastSentClanTag = null;
        this.lastSentSkinURL = '';
        this.lastSentCustomColor = '';
        this.lastSentPartyToken = '';
        this.lastSentServerToken = '';
    },
    flushCells() {
        this.cells = {};
    },
    flushSkinsMap() {
        this.customSkinsMap = {};
    },
    flushChatData() {
        this.chatUsers = {};
    },
    
    updateTeamPlayer(message) {
        function encode() {
            for (var text = '';;) {
                const string = message.getUint16(offset, true);
                if (string == 0) {
                    break;
                }
                text += String.fromCharCode(string);
                offset += 2;
            }
            offset += 2;
            return text;
        }
        const id = message.getUint32(1, true);
        var offset = 5;
        const nick = encode();
        const skinUrl = this.checkSkinURL(encode());
        const customColor = encode();
        const defaultColor = encode();
        const skinName = this.gameMode === `:party` ? nick + defaultColor : nick;
        const userId = this.checkPlayerID(id);
        if (userId !== null) {
            this.teamPlayers[userId].nick = nick;
            this.teamPlayers[userId].skinID = skinName;
            this.teamPlayers[userId].skinURL = skinUrl;
            this.teamPlayers[userId].setColor(defaultColor, customColor);
        } else {
            const map = new minimapCell(id, nick, skinName, skinUrl);
            map.setColor(defaultColor, customColor);
            this.teamPlayers.push(map);
        }
        this.cacheCustomSkin(nick, defaultColor, skinUrl);
    },
    updateTeamPlayerPosition(message) {
        const id = message.getUint32(1, true);
        const userId = this.checkPlayerID(id);
        if (userId !== null) {
            const x = message.getInt32(5, true);
            const y = message.getInt32(9, true);
            const mass = message.getUint32(13, true);
            if (mass > 360000) {
                return;
            }
            const teamPlayer = this.teamPlayers[userId];
            teamPlayer.x = x;
            teamPlayer.y = y;
            teamPlayer.mass = mass;
            teamPlayer.alive = true;
            teamPlayer.updateTime = Date.now();
            if (this.targeting && this.targetID && id == this.targetID) {
                this.updateTarget(teamPlayer.nick, teamPlayer.skinURL, x, y, mass, teamPlayer.color);
            }
        }
    },
    sc:[0,0,0,0,0,0],//q0,q1,q2,q3,q4,q0-3
    scLock:false,
    scoreStep:0,
    lastMostLike:4,
    updateTeamPlayers() {
        this.sendPlayerPosition();
        this.chatUsers = {};
        this.top5 = [];
        var frequency = 1///-~~(Math.random()*2)
        var alives = 0
        for (const teamPlayer of this.teamPlayers) {
            if (teamPlayer.alive && Date.now() - teamPlayer.updateTime >= 2000 || teamPlayer.mass == 0) {
                teamPlayer.alive = false;
                if (this.targeting && this.targetID && teamPlayer.id == this.targetID) {
                    this.setTargetStatus(2);
                }
            }
            if (teamPlayer.alive) {
                this.top5.push({
                    id: teamPlayer.id,
                    nick: teamPlayer.nick,
                    x: teamPlayer.x,
                    y: teamPlayer.y,
                    mass: teamPlayer.mass,
                    color: teamPlayer.color,
                    quadrant: teamPlayer.quadrant
                });
                if (!this.isChatUserMuted(teamPlayer.id)) {
                    this.addChatUser(teamPlayer.id, teamPlayer.nick);
                }
                if (teamPlayer.quadrant == 4) {
                    //this.sc = [0,0,0,0,0,0]
                    this.sc[teamPlayer.quadrant]++;
                    alives ++
                }
                if (teamPlayer.quadrant >=0 && teamPlayer.quadrant <= 3) {
                    this.sc[teamPlayer.quadrant]++;
                    this.sc[5]++;
                    alives ++
                }
                
            }
        }



        if(/*this.scLock == true && */this.c.play){
            try{mirror.send(profiles.mainProfile.nick,this.c.quadrant)}catch(e){}
        }
     
        var resetstep = this.scoreStep++ % frequency == 0
        var fastfix = this.scoreStep==2
        if(resetstep || fastfix){
            var mostlike = this.sc.indexOf(Math.max(...this.sc.slice(0,4)))
            //var totalansvers = this.sc[5] + this.sc[4]
            //console.table(...this.sc.slice(0,4),'resetstep:',resetstep,'fastfix:',fastfix)
            if(this.sc[5] > 0 && this.sc[4] == 0 /*&& this.c.realQuadrant != 4*/ && this.lastMostLike == mostlike){
                if(this.scLock == false){
                    this.scLock = true
                    console.log('[Delta] Map fixed with LM+Delta players - ',mostlike,'. Rotation locked until rejoin')
                    application.setQuadrant(mostlike)
                }
                this.sc = [0,0,0,0,0,0]
            }else{
                this.sc = [0,0,0,0,0,0]
            }
            this.lastMostLike = mostlike
        }
        this.top5.sort((row, config) => config.mass - row.mass);
        this.displayTop5();
    },
    updateParties(message) {
        this.parties = [];
        const userLength = message.getUint8(1);
        for (let offset = 2, length = 0; length < userLength; length++) {
            for (var text = '';;) {
                const string = message.getUint16(offset, true);
                if (string == 0) {
                    break;
                }
                text += String.fromCharCode(string);
                offset += 2;
            }
            offset += 2;
            this.parties.push(text);
        }
    },
    readChatMessage(message) {
        if (settings.disableChat) {
            return;
        }
        const time = new Date().toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1');
        const type = message.getUint8(1);
        const id = message.getUint32(2, true);
        const nick = message.getUint32(6, true);
        if (this.isChatUserMuted(id) || nick != 0 && nick != this.playerID && id != this.playerID) {
            return;
        }
        for (var text = '', length = 10; length < message.byteLength; length += 2) {
            const string = message.getUint16(length, true);
            if (string == 0) {
                break;
            }
            text += String.fromCharCode(string);
        }
        this.displayChatMessage(time, type, id, text);
    },

    
    enterChatMessage() {
        const messageBox = $(`#message-box`);
        const message = $(`#message`);
        if (!messageBox.is(`:visible`)) {
            messageBox.show();
            message.focus();
            message.val('');
        } else {
            const value = message.val();
            if (value.length) {
                this.sendChatMessage(101, value);
                if (this.c.play) {
                    message.blur();
                    messageBox.hide();
                }
            } else {
                message.blur();
                messageBox.hide();
            }
            message.val('');
        }
    },

    sendChatMessage(type, message) {
        if (Date.now() - this.lastMessageSentTime < 500 || message.length == 0 || profiles.mainProfile.nick.length == 0) {
            return;
        }
        if (this.isSocketOpen()) {
            var message = `${profiles.mainProfile.nick}: ${message}`;
            const view = this.createView(10 + message.length * 2);
            view.setUint8(0, 100);
            view.setUint8(1, type);
            view.setUint32(2, this.playerID, true);
            view.setUint32(6, 0, true);
            for (let length = 0; length < message.length; length++) {
                view.setUint16(10 + length * 2, message.charCodeAt(length), true);
            }
            this.sendBuffer(view);
            this.lastMessageSentTime = Date.now();
        }
    },
    prepareCommand(command) {
        const chatCommand = command.replace(`%currentSector%`, this.currentSector);
        return chatCommand;
    },
    sendCommand(command) {
        const prepareCommand = this.prepareCommand(chatCommand[`comm` + command]);
        this.sendChatMessage(102, prepareCommand);
    },
    addChatUser(id, name) {
        this.chatUsers[id] = name;
    },
    getChatUserNick(id) {
        if (this.chatUsers.hasOwnProperty(id)) {
            return this.chatUsers[id];
        }
        return '';
    },
    muteChatUser(id) {
        if (!id || this.isChatUserMuted(id)) {
            return;
        }
        const User = this.getChatUserNick(id);
        this.chatMutedUsers[id] = User;
        this.chatMutedUserIDs.push(id);
        toastr.error(`${textLanguage.userMuted.replace(`%user%`, `<strong>` + this.escapeHTML(User) + `</strong>`) + ` <button data-user-id="` + id}" class="btn btn-xs btn-green btn-unmute-user">${textLanguage.unmute}</button>`);
    },
    unmuteChatUser(id) {
        if (!id) {
            return;
        }
        const User = this.chatMutedUserIDs.indexOf(id);
        if (User != -1) {
            this.chatMutedUserIDs.splice(User, 1);
            toastr.info(textLanguage.userUnmuted.replace(`%user%`, `${`<strong>` + this.escapeHTML(this.chatMutedUsers[id])}</strong>`));
            delete this.chatMutedUsers[id];
        }
    },
    isChatUserMuted(id) {
        if (this.chatMutedUserIDs.indexOf(id) != -1) {
            return true;
        }
        return false;
    },
    parseMessage(string) {
        const isImage = /\[img\]([\w\:\/\.\?]+)\[\/img\]/i;
        if (isImage.test(string)) {
            var url = string.match(isImage)[1];
            if (settings.showChatImages && this.checkImgURL(url)) {
                return `<img src="` + url + `" style="width:100%;border:none;">`;
            }
            return '';
        }
        const isVideo = /\[yt\]([\w-]{11})\[\/yt\]/i;
        if (isVideo.test(string)) {
            if (settings.showChatVideos) {
                var url = string.match(isVideo);
                return `<iframe type="text/html" width="100%" height="auto" src="https://www.youtube.com/embed/${url[1]}?autoplay=1&amp;vq=tiny" frameborder="0" />`;
            }
            return '';
        }
        let escapedHtml = this.escapeHTML(string);
        if (settings.chatEmoticons) {

            escapedHtml = this.parseEmoticons(escapedHtml);

        }
        return escapedHtml;
    },
    parseEmoticons(string) {
        return String(string).replace(/\&lt\;3/g, '<3').replace(/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\)|\(angry\)|\(clown\)|\(crazy\)|\(devil\)|\(devil2\)|\(fb\)|\(google\)|\(ghost\)|\(heel\)|\(kiss\)|\(lipstick\)|\(rage\)|\(teacher\)|\(together\)|\(toothy\)|\(evil\)|\(baby\)|\(wow\))/g, function(t) {
            return '<img src=\"https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/svg/' + emojiChar[t] + '\" alt=\"' + t + '\" class=\"emoticon\">';
        });
    },
    displayChatMessage(time, type, id, nick) {
        if (nick.length == 0) {
            return;
        }
        let userName = nick.split(': ', 1).toString();
        const parseMessage = this.parseMessage(nick.replace(`${userName}: `, ''));
        if (userName.length == 0 || userName.length > 15 || parseMessage.length == 0) {
            return;
        }
        let text = '';
        if (id != 0 && id != this.playerID) {
            this.addChatUser(id, userName);
            text = `${`<a href="#" data-user-id="` + id}" class="mute-user fas fa-user-times"></a> `;
        }
        userName = this.escapeHTML(userName);
        if (type == 101) {
            if (settings.showChatBox) {
                $(`#chat-box`).append(`${`<div class="message"><span class="message-time">[` + time + `] </span>` + text + `<span class="message-nick">` + userName}: </span><span class="message-text">${parseMessage}</span></div>`);
                $('#chat-box').perfectScrollbar(`update`);
                $('#chat-box').animate({
                    scrollTop: $('#chat-box').prop(`scrollHeight`)
                }, 500);
                if (settings.chatSounds) {
                    this.playSound(this.messageSound);
                }
                return;
            }
            if (!settings.hideChat) {
                toastr.success(`${`<span class="message-nick">` + userName + `: </span><span class="message-text">` + parseMessage}</span>${text}`);
                if (settings.chatSounds) {
                    this.playSound(this.messageSound);
                }
            }
            this.chatHistory.push({
                nick: userName,
                message: parseMessage
            });
            if (this.chatHistory.length > 15) {
                this.chatHistory.shift();
            }
        } else if (type == 102) {
            if (settings.showChatBox) {
                $(`#chat-box`).append(`${`<div class="message command"><span class="command-time">[` + time + `] </span>` + text}<span class="command-nick">${userName}: </span><span class="command-text">${parseMessage}</span></div>`);
                $('#chat-box').perfectScrollbar('update');
                $(`#chat-box`).animate({
                    scrollTop: $('#chat-box').prop(`scrollHeight`)
                }, 500);
                if (settings.chatSounds) {
                    this.playSound(this.commandSound);
                }
                return;
            }
            if (!settings.hideChat) {
                toastr.warning(`${`<span class="command-nick">` + userName}: </span><span class="command-text">${parseMessage}</span>${text}`);
                if (settings.chatSounds) {
                    this.playSound(this.commandSound);
                }
            }
        } else {
            $(`#messages`).append(nick);
        }
    },
    displayUserList(users, activeUser, html, isMute, icon) {
        let text = '';
        if (Object.keys(users).length) {
            text += `<ol class="user-list">`;
            for (const user in users) {
                if (users.hasOwnProperty(user)) {
                    text += `${`<li><strong>` + this.escapeHTML(users[user]) + `</strong> <button data-user-id="` + user}" class="btn btn-xs ${html}">${isMute}</button></li>`;
                }
            }
            text += `</ol>`;
        } else {
            text += textLanguage.none;
        }
        toastr[icon](text, activeUser, {
            closeButton: true,
            tapToDismiss: false
        });
    },
    displayChatActiveUsers() {
        this.displayUserList(this.chatUsers, textLanguage.activeUsers, `btn-red btn-mute-user`, textLanguage.mute, 'info');
    },
    displayChatMutedUsers() {
        this.displayUserList(this.chatMutedUsers, textLanguage.mutedUsers, `btn-green btn-unmute-user`, textLanguage.unmute, 'error');
    },
    

    displayTop5() {
        if (!settings.showTop5) {
            return;
        }
        let text = '';
        let mass = 0;
        let top5length = this.top5.length;
        for (let length = 0; length < top5length; length++) {
            mass += this.top5[length].mass;
            if (length >= this.top5limit) {
                continue;
            }
            text += `<li><span class="cell-counter" style="background-color: ${this.top5[length].color}"></span>`;
            if (settings.showTargeting) {
                text += `<a href="#" data-user-id="` + this.top5[length].id + `" class="set-target ogicon-target"></a> `;
            }
            settings.showTop5Sectors && (text += `<span class="hud-main-color">[` + this.calculateMapSector(this.top5[length].x, this.top5[length].y) + `]</span> `);
            text += `<span class="top5-mass-color">${this.shortMassFormat(this.top5[length].mass)}</span> ${this.escapeHTML(this.top5[length].nick)}</li>`;
        }
        this.top5pos.innerHTML = text;
        if (this.c.play && this.c.playerMass) {
            mass += this.c.playerMass;
            top5length++;
        }
        this.top5totalMass.textContent = this.shortMassFormat(mass);
        this.top5totalPlayers.textContent = top5length;
    },
    setTop5limit(value) {
        if (!value) {
            return;
        }
        this.top5limit = value;
    },
    displayChatHistory(on) {
        if (on) {
            this.clearChatHistory(true);
            for (let length = 0; length < this.chatHistory.length; length++) {
                $(`#messages`).append(`<li><span class="message-nick">` + this.chatHistory[length].nick + `: </span><span class="message-text">` + this.chatHistory[length].message + `</span></li>`);
            }
            return;
        }
        this.clearChatHistory(false);
    },
    clearChatHistory(on) {
        $(`#messages`).empty();
        if (on) {
            toastr.clear();
            if (settings.showChatBox) {
                $(`#chat-box .message`).remove();
                this.chatHistory.length = 0;
            }
        }
    },
    preloadChatSounds() {
        this.setMessageSound();
        this.setCommandSound();
        this.setVirusSound();
    },
    setChatSoundsBtn() {
        if (settings.chatSounds) {
            $(`.chat-sound-notifications`).removeClass(`fa-volume-mute`).addClass(`fa-volume-up`);
        } else {
            $(`.chat-sound-notifications`).removeClass(`fa-volume-up`).addClass(`fa-volume-mute`);
        }
    },
    setVirusSound() {
        this.virusSound = this.setSound(settings.virusSoundURL);
    },
    setMessageSound() {
        this.messageSound = this.setSound(settings.messageSound);
    },
    setCommandSound() {
        this.commandSound = this.setSound(settings.commandSound);
    },
    setSound(audio) {
        if (!audio) {
            return null;
        }
        return new Audio(audio);
    },
    playSound(audio) {
        if (audio && audio.play) {
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        }
    },


    setParty() {
        let value = $('#party-token').val();
        this.gameMode  = $(`#gamemode`).val();
        //this.setQuest();
        if (this.gameMode !== ':party' || !value) {
            return;
        }
        let newValue = value;
        if (value.indexOf('#') != -1) {
            value = value.split('#');
            newValue = value[1];
        }
        if (this.partyToken !== newValue) {
            this.partyToken = newValue;
            this.flushSkinsMap();
            this.flushChatData();
            this.cancelTargeting();
        }
    },
    setMainButtons() {
        const app = this;
    },
    play() {
        //this.setParty();
        if (this.isSocketOpen()) {
            this.sendPartyData();
        } else {
            this.connect();
            const app = this;
            setTimeout(() => {
                app.sendPartyData();
            }, 1000);
        }
    },
    onPlay() {
        this.play();
        window.ga && window.ga(`create`, `UA-67142685-2`, `auto`, `ogarioTracker`);
        window.ga && window.ga(`ogarioTracker.send`, `pageview`);
    },
    onSpectate() {
        this.onJoin();
        this.sendPlayerJoin();
        this.sendPlayerSpawn()
    },
    join() {
        //this.setParty();
        this.sendPartyData();
        this.sendPlayerDeath();
    },
    onJoin() {
        //this.setParty();
        if (this.isSocketOpen()) {
            this.join();
        } else {
            this.connect();
            const app = this;
            setTimeout(() => {
                app.join();
                app.sendPlayerJoin();
            }, 1000);
        }
    },
    create() {
        //this.setParty();
        if (this.partyToken) {
            this.onJoin();
            return;
        }
        const app = this;
        setTimeout(() => {
            app.create();
        }, 100);
    },
    onCreate() {
        //this.setParty();
        if (this.gameMode !== ':party' || !this.partyToken) {
            this.createParty();
        } else {
            this.gameServerReconnect();
        }
        this.create();
    },
    onPlayerSpawn() {
        //this.c.play = true;
        if (this.c.playerColor) {
            this.sendPlayerSpawn();
            this.cacheCustomSkin(profiles.mainProfile.nick, this.c.playerColor, profiles.mainProfile.skinURL);
            return;
        }
        const app = this;
        setTimeout(() => {
            app.onPlayerSpawn();
        }, 100);
    },
    onPlayerDeath() {
        //this.c.play = false;
        this.c.playerColor = null;
        //this.c.foodIsHidden = false;
        this.c.playerMass = 0;
        this.c.playerScore = 0;
        this.c.playerSplitCells = 0;
        this.sendPlayerDeath();
        this.updateDeathLocations(this.c.playerX, this.c.playerY)
    },
    loadSkin(img, url) {
        const app = this;
        img[url] = new Image();
        img[url].crossOrigin = `Anonymous`;
        img[url].onload = function() {
            if (this.complete && this.width && this.height && this.width <= 2000 && this.height <= 2000) {
                app.cacheQueue.push(url);
                if (app.cacheQueue.length == 1) {
                    app.cacheSkin(app.customSkinsCache);
                }
            }
        };
        img[url].src = url;
    },
    cacheSkin(skinCache) {
        if (this.cacheQueue.length == 0) {
            return;
        }
        const shift = this.cacheQueue.shift();
        if (shift) {
            let canvas = document.createElement(`canvas`);
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(256, 256, 256, 0, 2 * Math.PI, false);
            ctx.clip();
            ctx.drawImage(this.customSkinsCache[shift], 0, 0, 512, 512);
            this.customSkinsCache[shift + `_cached`] = new Image();
            this.customSkinsCache[shift + `_cached`].src = canvas.toDataURL();
            canvas = null;
            this.cacheSkin(this.customSkinsCache);
        }
    },
    getCachedSkin(skinCache, skinMap) {
        if (skinCache[skinMap + `_cached`] && skinCache[skinMap + `_cached`].complete && skinCache[skinMap + `_cached`].width) {
            return skinCache[`${skinMap}_cached`];
        }
        return null;
    },
    cacheCustomSkin(nick, color, skinUrl) {
        if (skinUrl) {
            const gamemode = this.gameMode === `:party` ? nick + color : nick;
            if (gamemode) {
                this.customSkinsMap[gamemode] = skinUrl;
            }
            if (this.customSkinsCache.hasOwnProperty(skinUrl)) {
                return;
            }
            this.loadSkin(this.customSkinsCache, skinUrl);
        }
    },
    checkSkinsMap(nick, color) {
        const skinName = this.gameMode === `:party` ? nick + color : nick;
        if (this.customSkinsMap.hasOwnProperty(skinName)) {
            return true;
        }
        return false;
    },
    getCustomSkin(nick, color) {
        if (!this.checkSkinsMap(nick, color)) {
            return null;
        }
        const skinName = this.gameMode === ':party' ? nick + color : nick;
        return this.getCachedSkin(this.customSkinsCache, this.customSkinsMap[skinName]);
    },
    calculateMapSector(x, y, resize = false) {
        if (!this.c.mapOffsetFixed) {
            return '';
        }
        const offsetX = resize ? this.c.mapOffsetX + this.c.mapOffset : this.c.mapOffset;
        const offsetY = resize ? this.c.mapOffsetY + this.c.mapOffset : this.c.mapOffset;
        let resizeX = Math.floor((y + offsetY) / (this.c.mapSize / theme.sectorsY));
        let resizeY = Math.floor((x + offsetX) / (this.c.mapSize / theme.sectorsX));
        resizeX = resizeX < 0 ? 0 : resizeX >= theme.sectorsY ? theme.sectorsY - 1 : resizeX;
        resizeY = resizeY < 0 ? 0 : resizeY >= theme.sectorsX ? theme.sectorsX - 1 : resizeY;
        return String.fromCharCode(resizeX + 65) + (resizeY + 1);
    },
    shortMassFormat(value) {
        return value < 1000 ? value : `${Math.round(value / 100) / 10}k`;
    },
    updateDeathLocations(x, y) {
        if (!this.c.mapOffsetFixed) {
            return;
        }
        this.deathLocations.push({
            x: x + this.c.mapOffsetX,
            y: y + this.c.mapOffsetY
        });
        if (this.deathLocations.length == 6) {
            this.deathLocations.shift();
        }
        this.lastDeath = this.deathLocations.length - 1;
    },
    drawMiniMap() {
        if (!this.c.mapOffsetFixed) {
            return;
        }
        const mapWidth = theme.miniMapWidth;
        const mapTop = 0//theme.miniMapTop;
        const height = mapWidth + mapTop;
        const width = mapWidth - 18;
        const scale = mapTop + 9.5;
        if (!this.miniMap) {
            this.miniMap = document.getElementById(`minimap`);
            this.miniMapCtx = this.miniMap.getContext('2d');
            this.miniMapCtx.ogarioCtx = true;
            this.miniMap.width = mapWidth;
            this.miniMap.height = height;
        } else {
            this.miniMapCtx.clearRect(0, 0, mapWidth, height);
        }
        if (this.miniMap.width != mapWidth) {
            this.miniMap.width = mapWidth;
            this.miniMap.height = height;
        }
        const newSize = width / this.c.mapSize;
        const resizeoffX = this.c.mapOffsetX + this.c.mapOffset;
        const resizeoffY = this.c.mapOffsetY + this.c.mapOffset;
        this.drawSelectedCell(this.miniMapCtx);
        this.currentSector = this.calculateMapSector(this.c.playerX, this.c.playerY, true);
        this.miniMapCtx.globalAlpha = 1;
        this.miniMapCtx.font = `${theme.miniMapFontWeight} ${mapTop - 4}px ${theme.miniMapFontFamily}`;
        this.miniMapCtx.fillStyle = theme.miniMapSectorColor;
        this.miniMapCtx.fillText(this.currentSector, 10, mapTop);
        if (!this.miniMapSectors) {
            this.drawMiniMapSectors(theme.sectorsX, theme.sectorsY, width, height, scale);
        }
        this.miniMapCtx.save();
        this.miniMapCtx.translate(9.5, scale);
        if (this.gameMode === `:battleroyale`) {
            drawRender && drawRender.drawBattleAreaOnMinimap(this.miniMapCtx, width, width, newSize, resizeoffX, resizeoffY);
        }
        
        if(settings.showMiniMapGhostCells) {
            var ghostCells = this.c.ghostCells;
            this.miniMapCtx.beginPath();
            for(var i = 0x0; i < ghostCells.length; i++)
                if(true/*!_0x1f1f64[_0x31130d].inView*/) {
                    var x = ~~((ghostCells[i].x + resizeoffX) * newSize),
                        y = ~~((ghostCells[i].y + resizeoffY) * newSize);
                    this.miniMapCtx.moveTo(x, y), this.miniMapCtx.arc(x, y, ~~(ghostCells[i].size * newSize), 0x0, this.pi2, false);
                } this.miniMapCtx.fillStyle = theme.miniMapGhostCellsColor, this.miniMapCtx.globalAlpha = theme.miniMapGhostCellsAlpha, this.miniMapCtx.shadowColor = theme.miniMapGhostCellsColor, this.miniMapCtx.shadowBlur = 0xa, this.miniMapCtx.shadowOffsetX = 0x0, this.miniMapCtx.shadowOffsetY = 0x0, this.miniMapCtx.fill(), this.miniMapCtx.globalAlpha = 0x1, this.miniMapCtx.shadowBlur = 0x0;
        }


        if (settings.showMiniMapGuides) {
            var roundX = /*Math.round*/((this.c.playerX + resizeoffX) * newSize);
            var roundY = /*Math.round*/((this.c.playerY + resizeoffY) * newSize);
            this.miniMapCtx.lineWidth = 1;
            this.miniMapCtx.strokeStyle = theme.miniMapGuidesColor;
            this.miniMapCtx.beginPath();
            this.miniMapCtx.moveTo(roundX, 0);
            this.miniMapCtx.lineTo(roundX, width - 1);
            this.miniMapCtx.moveTo(0, roundY);
            this.miniMapCtx.lineTo(width - 1, roundY);
            this.miniMapCtx.stroke();
        }

        if (settings.showExtraMiniMapGuides) {
            var roundX = /*Math.round*/((this.c.playerX + resizeoffX) * newSize);
            var roundY = /*Math.round*/((this.c.playerY + resizeoffY) * newSize);

            var miniax = this.c.canvasWidth / (this.c.mapMaxX - this.c.mapMinX) / this.c.viewScale;
            var miniay = this.c.canvasHeight / (this.c.mapMaxY - this.c.mapMinY) / this.c.viewScale;
            var minidaxx = this.miniMapSectors.width * miniax;
            var minidayy = this.miniMapSectors.width * miniay;
            var fixminidaxx = roundX - (minidaxx / 2);
            var fixminidayy = roundY - (minidayy / 2);

            var visibility = 4-miniay*12
            if(visibility>0){
                this.miniMapCtx.globalAlpha = visibility < 0 ? 0 : visibility
                var q0 = [fixminidaxx+minidaxx, fixminidayy, theme.miniMapTeammatesSize]
                var q1 = [fixminidaxx, fixminidayy, theme.miniMapTeammatesSize]
                var q2 = [fixminidaxx, fixminidayy+minidayy, theme.miniMapTeammatesSize]
                var q3 = [fixminidaxx+minidaxx, fixminidayy+minidayy]
                /*this.miniMapCtx.beginPath();
                this.miniMapCtx.lineWidth = "1";
                this.miniMapCtx.strokeStyle = "yellow";
                this.miniMapCtx.rect(fixminidaxx, fixminidayy, minidaxx, minidayy);
                this.miniMapCtx.stroke();*/
                
                var lenx = miniax * 80
                var leny = miniay * 60
                this.miniMapCtx.beginPath();
                this.miniMapCtx.moveTo(q0[0], q0[1]+leny);   
                this.miniMapCtx.lineTo(...q0); 
                this.miniMapCtx.lineTo(q0[0]-lenx, q0[1]); 
                this.miniMapCtx.stroke();

                this.miniMapCtx.beginPath();
                this.miniMapCtx.moveTo(q1[0], q1[1]+leny);   
                this.miniMapCtx.lineTo(...q1); 
                this.miniMapCtx.lineTo(q1[0]+lenx, q1[1]); 
                this.miniMapCtx.stroke();

                this.miniMapCtx.beginPath();
                this.miniMapCtx.moveTo(q2[0]+lenx, q2[1]);   
                this.miniMapCtx.lineTo(...q2); 
                this.miniMapCtx.lineTo(q2[0], q2[1]-leny); 
                this.miniMapCtx.stroke();

                this.miniMapCtx.beginPath();
                this.miniMapCtx.moveTo(q3[0]-lenx, q3[1]);   
                this.miniMapCtx.lineTo(...q3); 
                this.miniMapCtx.lineTo(q3[0], q3[1]-leny); 
                this.miniMapCtx.stroke();

                this.miniMapCtx.globalAlpha =1
            }
            


        }


        this.miniMapCtx.beginPath();
        this.miniMapCtx.arc((this.c.playerX + resizeoffX) * newSize, (this.c.playerY + resizeoffY) * newSize, theme.miniMapMyCellSize, 0, this.pi2, false);
        this.miniMapCtx.closePath();
        if (theme.miniMapMyCellStrokeSize > 0) {
            this.miniMapCtx.lineWidth = theme.miniMapMyCellStrokeSize;
            this.miniMapCtx.strokeStyle = theme.miniMapMyCellStrokeColor;
            this.miniMapCtx.stroke();
        }
        this.miniMapCtx.fillStyle = theme.miniMapMyCellColor;
        this.miniMapCtx.fill();
        if (this.teamPlayers.length) {
            for (let length = 0; length < this.teamPlayers.length; length++) {
                this.teamPlayers[length].drawPosition(this.miniMapCtx, this.c.mapOffset, newSize, this.privateMiniMap, this.targetID);
            }
        }
        if (this.deathLocations.length > 0) {
            var roundX = Math.round((this.deathLocations[this.lastDeath].x + this.c.mapOffset) * newSize);
            var roundY = Math.round((this.deathLocations[this.lastDeath].y + this.c.mapOffset) * newSize);
            const mySize = Math.max(theme.miniMapMyCellSize - 2, 4);
            this.miniMapCtx.lineWidth = 1;
            this.miniMapCtx.strokeStyle = this.deathLocations.length - 1 == this.lastDeath ? theme.miniMapDeathLocationColor : '#FFFFFF';
            this.miniMapCtx.beginPath();
            this.miniMapCtx.moveTo(roundX - mySize, roundY);
            this.miniMapCtx.lineTo(roundX + mySize, roundY);
            this.miniMapCtx.moveTo(roundX, roundY - mySize);
            this.miniMapCtx.lineTo(roundX, roundY + mySize);
            this.miniMapCtx.stroke();
        }
        this.miniMapCtx.restore();
    },
    drawMiniMapSectors(x, y, size, height, scale) {
        this.miniMapSectors = document.getElementById(`minimap-sectors`);
        const ctx = this.miniMapSectors.getContext('2d');
        ctx.ogarioCtx = true;
        this.miniMapSectors.width = size;
        this.miniMapSectors.height = height;
        ctx.fillStyle = `#FFFFFF`;
        //this.dTok(ctx, size - 1);
        drawRender.drawSectors(ctx, this.c.mapOffsetFixed, x, y, 0.5, scale, size - 0.5, height - 9.5, theme.miniMapSectorsColor, theme.miniMapSectorsColor, 1, false);
    },
    resetMiniMapSectors() {
        this.miniMapSectors = null;
    },
    drawSelectedCell(ctx) {
        if (this.c.play && this.c.playerSplitCells > 1 && (settings.splitRange || settings.oppColors || settings.oppRings || settings.showStatsSTE)) {
            ctx.fillStyle = `#FFFFFF`;
            ctx.globalAlpha = this.selectBiggestCell ? 0.6 : 0.3;
            ctx.beginPath();
            ctx.arc(48, 15, 6, 0, this.pi2, false);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = this.selectBiggestCell ? 0.3 : 0.6;
            ctx.beginPath();
            ctx.arc(60, 15, 4, 0, this.pi2, false);
            ctx.closePath();
            ctx.fill();
        }
    },


    setUi(){
        var app = this
        this.top5pos = document.getElementById('top5-pos');
        this.top5totalMass = document.getElementById(`top5-total-mass`);
        this.top5totalPlayers = document.getElementById(`top5-total-players`);
        $(document).on(`click`, `#set-targeting`, event => {
            event.preventDefault();
            app.setTargeting();
        });
        $(document).on('click', `#cancel-targeting`, event => {
            event.preventDefault();
            app.cancelTargeting();
        });
        $(document).on(`click`, `#set-private-minimap`, event => {
            event.preventDefault();
            app.setPrivateMiniMap();
        });
        $(document).on(`click`, `#change-target`, event => {
            event.preventDefault();
            app.changeTarget();
        });
        $(document).on('click', `.team-top-limit`, function(event) {
            event.preventDefault();
            const top5 = $(this);
            const limit = parseInt(top5.attr('data-limit'));
            if (limit) {
                app.setTop5limit(limit);
                app.displayTop5();
                $(`.team-top`).text(limit);
                $(`.team-top-limit`).removeClass(`active`);
                top5.addClass(`active`);
            }
        });
        $(document).on(`click`, `#top5-pos .set-target`, function(event) {
            event.preventDefault();
            app.setTarget(parseInt($(this).attr('data-user-id')));
        });
        $(document).on(`click`, `.mute-user`, function(event) {
            event.preventDefault();
            app.muteChatUser(parseInt($(this).attr(`data-user-id`)));
        });
        $(document).on(`click`, '.btn-mute-user', function() {
            const btn = $(this);
            app.muteChatUser(parseInt(btn.attr(`data-user-id`)));
            btn.removeClass(`btn-red btn-mute-user`).addClass(`btn-green btn-unmute-user`).text(textLanguage.unmute);
        });
        $(document).on(`click`, '.btn-unmute-user', function() {
            const btn = $(this);
            app.unmuteChatUser(parseInt(btn.attr(`data-user-id`)));
            btn.removeClass('btn-green btn-unmute-user').addClass(`btn-red btn-mute-user`).text(textLanguage.mute);
        });
        $(document).on(`click`, '.chat-sound-notifications', event => {
            event.preventDefault();
            settings.chatSounds = !settings.chatSounds;
            Settings.saveSettings(settings, 'ogarioSettings');
            app.setChatSoundsBtn();
        });
        $(document).on(`click`, '.chat-active-users', event => {
            event.preventDefault();
            app.displayChatActiveUsers();
        });
        $(document).on('click', `.chat-muted-users`, event => {
            event.preventDefault();
            app.displayChatMutedUsers();
        });
        $(document).on(`click`, `.show-chat-emoticons`, function(event) {
            event.preventDefault();
            const option = $(this);
            const chatEmoji = $(`#chat-emoticons`);
            chatEmoji.toggle();
            if (chatEmoji.is(`:visible`)) {
                option.addClass(`active`);
            } else {
                option.removeClass('active');
                $(`#message`).focus();
            }
        });



        for (const emoji in emojiChar) {
            if (emojiChar.hasOwnProperty(emoji)) {
                $('#chat-emoticons').append(`<img src="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/svg/${emojiChar[emoji]}" alt="${emoji}" class="emoticon">`);
            }
        }

        $(document).on(`click`, '#chat-emoticons .emoticon', function() {
            const chatEmoji = $(this);
            const alt = chatEmoji.attr(`alt`);
            const message = $(`#message`);
            const value = message.val();
            if (value.length + alt.length <= 80) {
                message.val(value + alt);
            }
            message.focus();
        });

    },
    init() {

        //this.setMiniMap();
        //this.setDisableChat();
        //this.setShowChatBox();
        //this.setTop5();
        //this.setTargetingHUD();
        this.setUi()
        this.preloadChatSounds();
        this.setChatSoundsBtn();
        this.connect()
        const app = this;
        setInterval(() => {
            requestAnimationFrame(app.drawMiniMap.bind(this))
        }, 100);
        setInterval(() => {
            app.updateTeamPlayers();
        }, this.updateInterval);
    }
}

comm.init()