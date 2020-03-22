


var profiles = {
    selectedA:0,
    selectedB:1,
    get mainProfile() {
        return this.profiles[this.selectedA]
    },
    get slaveProfile() {
        return this.profiles[this.selectedB]
    },
    profiles:[],
    load() {
        var p = window.localStorage.getItem('ogarioPlayerProfiles')
        if(p !== null) {
            this.profiles = JSON.parse(p);
        } else {
            for (let length = 0; length < 10; length++) {
                this.profiles.push({
                    nick: `Profile #` + (length + 1),
                    clanTag: '',
                    skinURL: '',
                    color: theme.mainColor
                });
            }
        }
        var s1 = window.localStorage.getItem(`ogarioSelectedProfile`)
        var s2 = window.localStorage.getItem(`ogarioSelectedProfileB`)
        if (s1 !== null && s1 != "undefined") {
            this.selectedA = JSON.parse(s1);
        }
        if (s2 !== null && s2 != "undefined") {
            this.selectedB = JSON.parse(s2);
        }
        if(this.selectedProfile>this.profiles.length) this.selectedProfile = this.profiles.length-1
        //this.mainProfile = this.profiles[this.selectedA]
        //this.slaveProfile = this.profiles[this.selectedB]
    },
    setSkinPreview(num){
        var img = new Image()
        img.onerror = function(){this.style.display='none'}
        img.crossOrigin = 'anonymous'
        img.src = this.profiles[num].skinURL
        this.$preview.html(img)
    },
    setSkinProfile(num){
        var img = new Image()
        img.onerror = function(){this.style.display='none'}
        img.crossOrigin = 'anonymous'
        img.src = this.profiles[num].skinURL
        $('#profiles .thumb:nth('+num+')').html(img)
    },
    addProfile(num){
        var thumb = document.createElement('div')
        thumb.id='profile-'+num
        thumb.setAttribute('data-profile',num)
        if(this.profiles[num].skinURL){
            var img = new Image()
            img.onerror = function(){this.style.display='none'}
            img.crossOrigin = 'anonymous'
            img.src = this.profiles[num].skinURL
            thumb.appendChild(img)
        }

        //thumb.innerHTML = this.profiles[num].skinURL?`<img src="${this.profiles[num].skinURL}">`:''
        thumb.className = 'thumb'
        document.getElementById('skins2').appendChild(thumb)
        this.setPosition()
    },
    remProfile(num){
        this.setPosition()
    },
    setPosition(){
        Math.rad = function (degrees) {
            return degrees * Math.PI / 180
        }
        Math.deg = function (radians) {
            return radians * 180 / Math.PI
        }
        var radius = 60
        var centerX = 50
        var centerY = 50

        var els = document.getElementsByClassName('thumb')
        var len = els.length
        var theta = Math.rad(40)
        var deg = Math.rad(100 * 2 / (len - 2))
        var theta2 = Math.rad(-40)
        var deg2 = Math.rad(-100 * 2 / (len - 2))
    
        for (var i = 0; els.length > i; i++) {
            if (i > Math.ceil(len / 2)) break
            var x = centerX + radius * Math.cos(theta)
            var y = centerY - radius * Math.sin(theta)
            els[i].style = 'top: ' + x + '%;left: ' + y + '%;z-index:' + (200 - i)
            theta += deg
    
        }
    
        for (var i = Math.floor(els.length / 2); els.length > i; i++) {
            var x = centerX + radius * Math.cos(theta2)
            var y = centerY - radius * Math.sin(theta2)
        
            els[i].style = 'top: ' + x + '%;left: ' + y + '%;z-index:' + (200 - i)
            theta2 += deg2
    
        }
    },
    selectProfile(isMain,num){
        if(isMain){
            $('#profile-'+this.selectedA).removeClass('selectedA')
            $('#profile-'+num).addClass('selectedA')
            this.selectedA = num
            Settings.saveSettings(this.selectedA, `ogarioSelectedProfile`);
            this.setSkinPreview(num)
            this.setValues(num)
            //this.mainProfile = this.profiles[this.selectedA]
        }else{
            $('#profile-'+this.selectedB).removeClass('selectedB')
            $('#profile-'+num).addClass('selectedB')
            this.selectedB = num
            Settings.saveSettings(this.selectedB, `ogarioSelectedProfileB`);
            //this.slaveProfile = this.profiles[this.selectedB]
        }
        this.saveSettings()
    },
    saveSettings(){
        Settings.saveSettings(this.profiles, `ogarioPlayerProfiles`);
    },
    setValues(num) {
        this.$nick.val(this.profiles[num].nick);
        this.$clantag.val(this.profiles[num].clanTag);
        this.$skin.val(this.profiles[num].skinURL);
        this.$color.val(this.profiles[num].color);
    },
    getValues(num){
        this.profiles[num].nick = this.$nick.val();
        this.profiles[num].clanTag = this.$clantag.val();
        this.profiles[num].skinURL = this.$skin.val();
        this.profiles[num].color = this.$color.val();
    },
    init(){
        var self = this
        this.$nick = $(`#nick`)
        this.$clantag = $(`#clantag`)
        this.$skin = $(`#skin`)
        this.$color = $(`#color`)
        this.$preview = $('#skin-preview2')

        this.load()
        this.mainProfile = this.slaveProfile = {
            nick: `Profile A`,
            clanTag: '',
            skinURL: '',
            color: theme.mainColor||'#ffffff'
        }
        this.profiles.forEach((profile,n)=>{
            this.addProfile.bind(this)(n)
        })
        this.selectProfile(true,this.selectedA)
        this.selectProfile(false,this.selectedB)

        $(document).on('input', '#skin', function(){
            self.profiles[self.selectedA].skinURL = this.value
            self.setSkinPreview.bind(self)(self.selectedA)
            self.setSkinProfile.bind(self)(self.selectedA)
        })
        $(document).on('contextmenu', '#skins2 .thumb',function(event){
            event.preventDefault();
            var n  = this.getAttribute('data-profile')
            self.selectProfile(false,Number(n))
        })
        $(document).on('click', '#skins2 .thumb',function(event){
            event.preventDefault();
            self.getValues(self.selectedA)
            var n  = this.getAttribute('data-profile')
            self.selectProfile(true,Number(n))
        })


    }
}
profiles.init()


window.master = {
    'ws': null,
    'serverIP': null,
    'endpoint': null,
    'region': '',
    'gameMode': ':ffa',
    'partyToken': '',
    'findingServer': 0x0,
    'curValidFindServer': 0x0,
    'backoffPeriod': 0x1f4,
    'regionNames': {},
    'context': '',
    'accessToken': null,
    langCodes: {'AF': 'JP-Tokyo','AX': 'EU-London','AL': 'EU-London','DZ': 'EU-London','AS': 'SG-Singapore','AD': 'EU-London','AO': 'EU-London','AI': 'US-Atlanta','AG': 'US-Atlanta','AR': 'BR-Brazil','AM': 'JP-Tokyo','AW': 'US-Atlanta','AU': 'SG-Singapore','AT': 'EU-London','AZ': 'JP-Tokyo','BS': 'US-Atlanta','BH': 'JP-Tokyo','BD': 'JP-Tokyo','BB': 'US-Atlanta','BY': 'EU-London','BE': 'EU-London','BZ': 'US-Atlanta','BJ': 'EU-London','BM': 'US-Atlanta','BT': 'JP-Tokyo','BO': 'BR-Brazil','BQ': 'US-Atlanta','BA': 'EU-London','BW': 'EU-London','BR': 'BR-Brazil','IO': 'JP-Tokyo','VG': 'US-Atlanta','BN': 'JP-Tokyo','BG': 'EU-London','BF': 'EU-London','BI': 'EU-London','KH': 'JP-Tokyo','CM': 'EU-London','CA': 'US-Atlanta','CV': 'EU-London','KY': 'US-Atlanta','CF': 'EU-London','TD': 'EU-London','CL': 'BR-Brazil','CN': 'CN-China','CX': 'JP-Tokyo','CC': 'JP-Tokyo','CO': 'BR-Brazil','KM': 'EU-London','CD': 'EU-London','CG': 'EU-London','CK': 'SG-Singapore','CR': 'US-Atlanta','CI': 'EU-London','HR': 'EU-London','CU': 'US-Atlanta','CW': 'US-Atlanta','CY': 'JP-Tokyo','CZ': 'EU-London','DK': 'EU-London','DJ': 'EU-London','DM': 'US-Atlanta','DO': 'US-Atlanta','EC': 'BR-Brazil','EG': 'EU-London','SV': 'US-Atlanta','GQ': 'EU-London','ER': 'EU-London','EE': 'EU-London','ET': 'EU-London','FO': 'EU-London','FK': 'BR-Brazil','FJ': 'SG-Singapore','FI': 'EU-London','FR': 'EU-London','GF': 'BR-Brazil','PF': 'SG-Singapore','GA': 'EU-London','GM': 'EU-London','GE': 'JP-Tokyo','DE': 'EU-London','GH': 'EU-London','GI': 'EU-London','GR': 'EU-London','GL': 'US-Atlanta','GD': 'US-Atlanta','GP': 'US-Atlanta','GU': 'SG-Singapore','GT': 'US-Atlanta','GG': 'EU-London','GN': 'EU-London','GW': 'EU-London','GY': 'BR-Brazil','HT': 'US-Atlanta','VA': 'EU-London','HN': 'US-Atlanta','HK': 'JP-Tokyo','HU': 'EU-London','IS': 'EU-London','IN': 'JP-Tokyo','ID': 'JP-Tokyo','IR': 'JP-Tokyo','IQ': 'JP-Tokyo','IE': 'EU-London','IM': 'EU-London','IL': 'JP-Tokyo','IT': 'EU-London','JM': 'US-Atlanta','JP': 'JP-Tokyo','JE': 'EU-London','JO': 'JP-Tokyo','KZ': 'JP-Tokyo','KE': 'EU-London','KI': 'SG-Singapore','KP': 'JP-Tokyo','KR': 'JP-Tokyo','KW': 'JP-Tokyo','KG': 'JP-Tokyo','LA': 'JP-Tokyo','LV': 'EU-London','LB': 'JP-Tokyo','LS': 'EU-London','LR': 'EU-London','LY': 'EU-London','LI': 'EU-London','LT': 'EU-London','LU': 'EU-London','MO': 'JP-Tokyo','MK': 'EU-London','MG': 'EU-London','MW': 'EU-London','MY': 'JP-Tokyo','MV': 'JP-Tokyo','ML': 'EU-London','MT': 'EU-London','MH': 'SG-Singapore','MQ': 'US-Atlanta','MR': 'EU-London','MU': 'EU-London','YT': 'EU-London','MX': 'US-Atlanta','FM': 'SG-Singapore','MD': 'EU-London','MC': 'EU-London','MN': 'JP-Tokyo','ME': 'EU-London','MS': 'US-Atlanta','MA': 'EU-London','MZ': 'EU-London','MM': 'JP-Tokyo','NA': 'EU-London','NR': 'SG-Singapore','NP': 'JP-Tokyo','NL': 'EU-London','NC': 'SG-Singapore','NZ': 'SG-Singapore','NI': 'US-Atlanta','NE': 'EU-London','NG': 'EU-London','NU': 'SG-Singapore','NF': 'SG-Singapore','MP': 'SG-Singapore','NO': 'EU-London','OM': 'JP-Tokyo','PK': 'JP-Tokyo','PW': 'SG-Singapore','PS': 'JP-Tokyo','PA': 'US-Atlanta','PG': 'SG-Singapore','PY': 'BR-Brazil','PE': 'BR-Brazil','PH': 'JP-Tokyo','PN': 'SG-Singapore','PL': 'EU-London','PT': 'EU-London','PR': 'US-Atlanta','QA': 'JP-Tokyo','RE': 'EU-London','RO': 'EU-London','RU': 'RU-Russia','RW': 'EU-London','BL': 'US-Atlanta','SH': 'EU-London','KN': 'US-Atlanta','LC': 'US-Atlanta','MF': 'US-Atlanta','PM': 'US-Atlanta','VC': 'US-Atlanta','WS': 'SG-Singapore','SM': 'EU-London','ST': 'EU-London','SA': 'EU-London','SN': 'EU-London','RS': 'EU-London','SC': 'EU-London','SL': 'EU-London','SG': 'JP-Tokyo','SX': 'US-Atlanta','SK': 'EU-London','SI': 'EU-London','SB': 'SG-Singapore','SO': 'EU-London','ZA': 'EU-London','SS': 'EU-London','ES': 'EU-London','LK': 'JP-Tokyo','SD': 'EU-London','SR': 'BR-Brazil','SJ': 'EU-London','SZ': 'EU-London','SE': 'EU-London','CH': 'EU-London','SY': 'EU-London','TW': 'JP-Tokyo','TJ': 'JP-Tokyo','TZ': 'EU-London','TH': 'JP-Tokyo','TL': 'JP-Tokyo','TG': 'EU-London','TK': 'SG-Singapore','TO': 'SG-Singapore','TT': 'US-Atlanta','TN': 'EU-London','TR': 'TK-Turkey','TM': 'JP-Tokyo','TC': 'US-Atlanta','TV': 'SG-Singapore','UG': 'EU-London','UA': 'EU-London','AE': 'EU-London','GB': 'EU-London','US': 'US-Atlanta','UM': 'SG-Singapore','VI': 'US-Atlanta','UY': 'BR-Brazil','UZ': 'JP-Tokyo','VU': 'SG-Singapore','VE': 'BR-Brazil','VN': 'JP-Tokyo','WF': 'SG-Singapore','EH': 'EU-London','YE': 'JP-Tokyo','ZM': 'EU-London','ZW': 'EU-London'},
    'master_url': 'webbouncer-live-v8-0.agario.miniclippt.com',
    'endpoint_version': 'v4',
    'proto_version': '15.0.3',
    'client_version': 31007,
    'client_version_string': '3.10.7',

    'getClientVersion': function() {
        var clientVersionString = window.localStorage.getItem('ogarioClientVersionString')
        if(clientVersionString !== null) {
            this.clientVersionString = clientVersionString;
            this.clientVersion = this.parseClientVersion(this.client_version_string);
        }
        var self = this;
        $.ajax('//agar.io/mc/agario.js', {
            error: function() {},
            success: function(response) {
                var matches = response.match(/versionString=\"(\d+\.\d+\.\d+)\"/);
                if(matches) {
                    var string = matches[0x1];
                    var number = self.parseClientVersion(string);
                    console.log('[ENV] Current client version:', number, string);
                    self.setClientVersion(number, string);
                }
            },
            dataType: 'text',
            method: 'GET',
            cache: false,
            crossDomain: true
        });
    },
    'setClientVersion': function(number, string) {
        console.log('[ENV] Your client version:', this.client_version, this.client_version_string);
        if(this.client_version != number) {
            console.log('[ENV] Changing client version...');
            this.clientVersion = number;
            this.clientVersionString = string;
            if(window.application) {
                window.application.setClientVersion(number, string);
            }
            window.localStorage.setItem('ogarioClientVersionString', string);
        }
    },
    'parseClientVersion': function(string) {
        return parseInt(string.split('.')[0x0]) * 0x2710 + parseInt(string.split('.')[0x1]) * 0x64 + parseInt(string.split('.')[0x2]);
    },
    'getRegionCode': function() {
        var location = window.localStorage.getItem('location');
        if(location) {
            this.setRegion(location, false);
            return;
        }
        $.get('https://'+this.master_url+'/getCountry', (response) => {
            this.setRegionCode(response.country);
        }, 'json');
    },
    'setRegionCode': function(code) {
        if(this.langCodes.hasOwnProperty(code)) {
            this.setRegion(this.langCodes[code], false);
        }
    },
    'refreshRegionNumPlayers': function() {
        var self = this;
        this.makeMasterSimpleRequest('info', 'text', function(obj) {
            obj = JSON.parse(obj);
            var regions = obj.regions;
            for(var code in regions) {
                if(regions.hasOwnProperty(code)) {
                    $('#region option[value=\"' + code + '\"]').text(self.regionNames[code] + ' (' + regions[code].numPlayers + ')');
                }
            }
        });
    },
    'getRegionNames': function() {
        var self = this;
        $('#region option').each(function() {
            var code = $(this).val();
            var _0x362b3d = $(this).text();
            if(!self.regionNames.hasOwnProperty(code)) {
                self.regionNames[code] = _0x362b3d;
            }
        });
    },

    'findServer': function(region, gamemode, callback) {
        var time = Date.now();
        if(time - this.findingServer < 500) {
            return;
        }
        var findMode = 'findServer';
        if(region == null) region = ''
        if(gamemode == null) gamemode = ':ffa'
        if(gamemode == ':battleroyale') findMode = 'findBattleRoyaleServer'
        var self = this;
        var payload = this.setRequestMsg(region, gamemode);
        var num = ++this.curValidFindServer;
        this.findingServer = time;
        this.makeMasterRequest(this.endpoint_version + '/' + findMode, payload, function(response) {
            if(num != self.curValidFindServer) {
                return;
            }
            var endpoint = response.endpoints;
            if(endpoint === null || endpoint.https === '0.0.0.0:0') {
                self.findServer(region, gamemode);
                return;
            }
            self.serverIP = endpoint.https;
            if(response.token !== null) {
                self.partyToken = response.token;
            }
            self.backoffPeriod = 500;
            callback('wss://'+self.serverIP)
            //application.connect('wss://'+self.serverIP+'');
        }, function() {
            self.backoffPeriod *= 2;
            setTimeout(function() {
                self.findServer(region, gamemode, callback);
            }, self.backoffPeriod);
        });
    },
    'setRequestMsg': function(region, gamemode, partytoken) {
        var encode = function(str) {
            array.push(str.length);
            for(var i = 0x0; i < str.length; i++) {
                array.push(str.charCodeAt(i));
            }
        };
        var array = [0xa, 0x4 + region.length + gamemode.length, 0xa];
        encode(region);
        array.push(0x12);
        encode(gamemode);
        if(partytoken) {
            array.push(0x1a, 0x8, 0xa);
            encode(partytoken);
        }
        return new Uint8Array(array);
    },
    'makeMasterRequest': function(requestType, payload, callback, onerror, contentType) {
        var self = this;
        if(contentType == null) {
            contentType = 'application/octet-stream';
        }
        $.ajax('https://' + this.master_url + '/' + requestType, {
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Accept', 'text/plain');
                xhr.setRequestHeader('Accept', '*/*');
                xhr.setRequestHeader('Accept', 'q=0.01');
                xhr.setRequestHeader('Content-Type', contentType);
                xhr.setRequestHeader('x-support-proto-version', self.proto_version);
                xhr.setRequestHeader('x-client-version', self.client_version);
                return true;
            },
            error: function() {
                onerror && onerror();
            },
            success: function(response) {
                callback(response);
            },
            dataType: 'json',
            method: 'POST',
            data: payload,
            processData: false,
            cache: false,
            crossDomain: true
        });
    },
    'makeMasterSimpleRequest': function(findType, dataType, callback, onerror) {
        var self = this;
        $.ajax('https://' + this.master_url + '/' + findType, {
            beforeSend: function(xhr) {
                xhr.setRequestHeader('x-support-proto-version', self.proto_version);
                xhr.setRequestHeader('x-client-version', self.client_version);
                return true;
            },
            error: function() {
                onerror && onerror();
            },
            success: function(response) {
                callback(response);
            },
            dataType: dataType,
            method: 'GET',
            cache: false,
            crossDomain: true
        });
    },


    'createParty': function() {
        this.setPartyState('3');
        this.setMode(':party');
    },
    'getPartyServer': function(partyToken,callback) {
        var self = this;
        if(partyToken.indexOf('#') != -0x1) {
            var str = partyToken.split('#')[0x1];
            partyToken = str;
        }
        this.setMode(':party', false);
        this.partyToken = partyToken;
        this.setURL('/#' + window.encodeURIComponent(partyToken));
        var payload = this.setRequestMsg(this.region, '', partyToken);
        this.makeMasterRequest(this.endpoint_version + '/getToken', payload, function(response) {
            self.endpoint = response.endpoints.https;
            callback('wss://'+response.endpoints.https)
            self.setPartyState('9');
        }, function() {
            self.setPartyState('6');
        });
    },
    'setPartyState': function(state) {
        state === '6' && alert('party not found')
        if(state === '9') {
            alert('party found',this.endpoint)
            this.displayPartyToken();
            this.setMode(':party', false);
            this.connect(this.endpoint);
            state = '5';
        }
    },
    'displayPartyToken': function() {
        $('#party-token').val(this.partyToken);
    },
    'setURL': function(url) {
        if(window.history && window.history.replaceState) {
            location.hash=url.replace('/#','')
            //window.history.replaceState({}, window.document.title, url);
        }
    },
    'setUI': function() {
        var self = this;
        $(document).on(`change`, `#gamemode`, function() {
            self.setMode(this.value)
            $('#random').click()
        })
        $(document).on(`change`, `#region`, function() {
            self.setRegion(this.value)
            $('#random').click()
        });
    },
    'runFromHash': function(callback) {
        var hash = window.location.hash||''
        var hashMode = ['#ffa', '#battleroyale', '#teams', '#experimental', '#party'];
        if(hash && hashMode.indexOf(hash) != -1) {
            this.setMode(hash.replace('#', ':'));
        }
        if(hash.length == 7) {
            this.setMode(hash.replace(':party'))
            this.setURL('/'+hash)
            this.getPartyServer(hash,callback);
            return true
        }
        return false
    },
    'setRegion': function(region, bool) {
        if(bool == null) bool = true;
        if(!region) return;
        this.region = region;
        window.localStorage.setItem('location', region);
        if($('#region').val() !== region)
           $('#region').val(region)
    },
    'setMode': function(gamemode) {
        if(true||gamemode !== ':party') {this.setURL('/#' + window.encodeURIComponent(gamemode.replace(':', '')))}
        if(!gamemode) return;
        this.gameMode = gamemode;
        window.localStorage.setItem('gamemode', gamemode);
        if($('#gamemode').val() !== gamemode)
           $('#gamemode').val(gamemode)

    },
    getServer:function(callback){
        if(!this.runFromHash(callback)){
            if(this.region.search(/Antarctic/im)>-1){
                callback('wss://delta-server.glitch.me');
            }else{
            this.findServer(this.region,this.gameMode,callback)
            }
        }
    },
    getDefaultSettings: function(){
        //получение региона
        //получение режима
        //получение параметров
        const app = this;

        var region = window.localStorage.getItem('location')
        region != null && this.setRegion(region)
        var gameMode = window.localStorage.getItem('gamemode')
        gameMode != null && this.setMode(gameMode)
        /*if(this.runFromHash()){
            
        }*/

        
    },
    'init': function() {
        var self = this;
        this.setUI();
        this.getDefaultSettings()
        this.getRegionNames();


        //this.runFromHash();
        //this.getRegionCode();
        //this.checkRegion();

        this.refreshRegionNumPlayers();
        setInterval(function() {
            self.refreshRegionNumPlayers();
        }, 0x2bf20);
    }
};

master.init()


   // Окружение
var coldEnv = {
    'fb_app_id': 0x268301c162623,
    'gplus_client_id': '686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com',
    'master_url': 'webbouncer-live-v8-0.agario.miniclippt.com',
    'endpoint_version': 'v4',
    'proto_version': '15.0.1',
    'client_version': 31000,
    'client_version_string': '3.10.0'
};
//Загрузка ФБ СДК
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//apis.google.com/js/client:platform.js?onload=gapiAsyncInit";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'GAPI'));

var accounts = {
    init(){

    }
}
var GAPI = null
var GlAccount = {
    token: null,
    user: {},
    tries: 0,
    isLoggedIn: false,
    reconnect: function () {
        this.logout()
        this.connect()
    },
    connect: function () {
        localStorage['GlAccount'] = 'yes'
        GAPI.signIn()
        GAPI.currentUser.get();
        !GAPI.isSignedIn.get() && GAPI.signIn();
    },
    readUser: function (data) {
        if (!data || !GAPI || !localStorage['GlAccount']) {
            return;
        }
        if (GAPI.isSignedIn.get()) {
            var authResponse = data.getAuthResponse();
            var basicProfile = data.getBasicProfile();
            this.token = authResponse.id_token;
            this.user.picture = basicProfile.getImageUrl();
            this.user.first_name = basicProfile.getGivenName()
            this.user.last_name = basicProfile.getFamilyName()
            this.user.id = basicProfile.getId()
            this.emit('user')
            this.emit('login')
            console.log('readUserGL', this.user)
        }

    },
    read: function () {},
    start:function(){
        if(!!localStorage['GlAccount']) this.connect()
    },
    setLogout:function(){
        delete localStorage['GlAccount']
        this.logout()
    },
    logout: function () {
        this.token = null
        this.user = {}
        this.tries = 0
        this.emit('logout')
    }
}
var FbAccount = {
    token: null,
    user: {},
    tries: 0,
    isLoggedIn: false,
    reconnect: function () {
        this.logout()
        this.start()
    },
    connect: function () {
        localStorage['FbAccount']='yes'
        if (!window.FB) alert('You seem to have something blocking Facebook on your browser, please check for any extensions')
        else
            window.FB.login(this.loginHandler.bind(this), {
                'scope': 'public_profile, email'
            })
    },
    loginHandler: function (result) {
        if (result.status == 'connected') {
            this.token = result.authResponse.accessToken;
            if (this.token) {
                this.readUser()
                this.readFriends()
            } else if (this.tries < 3) {
                this.tries++, this.connect(), this.logout();
            }
        }
    },
    readUser: function () {
        if (this.token) {
            this.emit('login')
            window.FB.api('/me/?fields=picture.width(128),first_name,last_name&width=280&height=280', (data) => {
                this.user.picture = data.picture.data.url
                this.user.first_name = data.first_name
                this.user.last_name = data.last_name
                this.user.id = data.id
                this.emit('user')
                console.log('readUserFB', this.user)
            });
        }
    },
    readFriends: function () {
        if (this.token) {
            window.FB.api('/me/friends?fields=name,id,picture.width(128)', (data) => {
                this.friends = data.friends
                this.emit('friends')
                console.log('readFriendsFB', data)
            });
        }
    },
    start:function(data){
        if(!!localStorage['FbAccount']) this.loginHandler(data)
    },
    setLogout:function(){
        delete localStorage['FbAccount']
        this.logout()
    },
    logout: function () {
        this.token = null
        this.user = {}
        this.tries = 0
        this.emit('logout')
    }
}
eventify(FbAccount)
eventify(GlAccount)

window.fbAsyncInit = function () {
    window.FB.init({
        'appId': coldEnv.fb_app_id,
        'cookie': true,
        'xfbml': true,
        'status': true,
        'version': 'v2.8'
    });
    window.FB.getLoginStatus(function (data) {
        if (data.status === 'connected') {
            FbAccount.start(data)
        } else {
            FbAccount.logout();
        }
    });
    window.facebookRelogin = FbAccount.reconnect
    window.facebookLogin = FbAccount.reconnect
};

window.gapiAsyncInit = function () {
    window.gapi.load('auth2', function () {
        GAPI = window.gapi.auth2.init({
            'client_id': coldEnv.gplus_client_id,
            'cookie_policy': 'single_host_origin',
            'scope': 'profile',
            'app_package_name': 'com.miniclip.agar.io'
        });
        //var googleButton = document.getElementById('gplusLogin');
        //googleButton.addEventListener('click', function () {});
        //GAPI.attachClickHandler(googleButton);
        /*document.querySelectorAll('.btn-auth-google').forEach((googleButton)=>{
            googleButton.addEventListener('click',e=>e.stopPropagation())
            GAPI.attachClickHandler(googleButton)
        })*/
        GAPI.currentUser.listen((data) => {
            GlAccount.readUser(data)
        });
        GAPI.then(()=>GlAccount.start)
    })
    //GlAccount.connect();
};

const application = window.application = {
    tabCount:0,
    tabCurrent:0,
    masterTab:null,
    slaveTab:null,
    primaryAccount:0,
    c:[],
    
    protocolMode: true,
    publicIP: 'wss://wss.ogario.eu:3443',//`wss://srv.ogario.eu`,
    privateIP: null,
   
    gameMode: `:ffa`,
    region: '',
    partyToken: '',
    ws: '',
    serverIP: '',
    serverArena: '',
    serverToken: '',

    statsHUD: null,
    leaderboardPositionsHUD: null,
    leaderboardDataHUD: null,
    timeHUD: null,
    questHUD: null,
    retryResp: 0,

    selectBiggestCell: true,

    showQuest: false,
    showSplitInd: false,
    pause: false,
    switchPlayer(isDeath){
        if(!this.slaveTab && !isDeath) this.initSlaveTab()
        for(var i = this.tabCurrent+1; this.c.length + this.tabCurrent > i; i++){
            var indexOfNextTab = i%this.c.length
            var c = this.c[indexOfNextTab]
            if(c.play){
                this.tabCurrent=i%this.c.length
                break;
            }else{
                if(isDeath) return false;
                if(c.estabilished){
                    c.sendNick(profiles[indexOfNextTab==0?'mainProfile':'slaveProfile'].nick)
                    c.once('spawn',(c)=>{
                        this.switchPlayer()
                    })
                }

            }
        } 
    },
    initSlaveTab(){
        this.slaveTab = new Client()
        this.c.push(this.slaveTab)
        drawRender.resizeCanvas()
        this.slaveTab.connect(application.ws)
        this.slaveTab.once('estabilished',(c)=>{
            this.switchPlayer()
        })
    },
    eachTabByPriority(callback,step){
            if(step == undefined){step = 0}
            var previous = null
            var current = null
        for(var i = this.tabCurrent
            , priority=0;
             this.c.length
              + this.tabCurrent
               > i;
                i++,
                priority++){
            //if(step>=0){
                var indexOfTab = 
                i%this.c.length
            /*}else if(step<0){
                var indexOfTab = this.c.length-((this.c.length-step-1)%this.c.length)-1
            }*/
            //var indexOfTab = i%this.c.length
            previous = current
            current = this.c[indexOfTab]
            //if(current[key]!=val) continue
            callback(current,previous,priority,indexOfTab)
        } 

        /*
        var anti = 0
            arr=['a','b','c','d']
            var start=1
            for(var i=0,step=0+start; arr.length+start>i+start; i++,step++){
            if(anti++==30) break
            if(start>=0){
            var indexOfTab = (arr.length+step)%arr.length
            }else if(start<0){
            var indexOfTab = arr.length-((arr.length-step-1)%arr.length)-1
            }

            console.log(arr[indexOfTab])
            }
            */
    },
    fixOffset(Connection){
        var prX=-7071,prY=-7071,ofX=0,ofY=0,dontFix=true
        for( var c of this.c){
            if(c.mapOffsetFixed){
                ofX = c.mapOffsetX
                ofY = c.mapOffsetY
                prX = c.mapMinX
                prY = c.mapMinY
                dontFix = false
                console.log('baseis',c)
                break
            }
        }
        if(dontFix)return;
        Connection.mapShiftX=0
        Connection.mapShiftY=0

        let diffX = prX-Connection.mapMinX+ofX
        let diffY = prY-Connection.mapMinY+ofY

        Connection.mapShiftX=ofX-(diffX*1)
        Connection.mapShiftY=ofY-(diffY*1)
    },
    setupShift(){
        var prX=0,prY=0,ofX=0,ofY=0
        this.eachTabByPriority((current,previous,indexOfPriority,indexOfTab)=>{
            current.mapShiftX=0
            current.mapShiftY=0
            console.log('each',current,previous,indexOfPriority,indexOfTab)
            if(!prX){
                prX = current.mapMinX
                prY = current.mapMinY
                ofX = current.mapOffsetX
                ofY = current.mapOffsetY
                return
            }
            diffX = prX-current.mapMinX+ofX
            diffY = prY-current.mapMinY+ofY

            current.mapShiftX=ofX-(diffX*1)
            current.mapShiftY=ofY-(diffY*1)
        })
    },
    get play(){
        for(var c of this.c) if(c.play) return true
        return false;
    },
    doPlay(){
        if(this.play) return;
        this.c[0].sendNick(profiles.mainProfile.nick)
    },
    sendFbToken(token) {
        for(var c of this.c) c.sendFbToken(token);
    },
    sendGplusToken(token) {
        for(var c of this.c) c.sendGplusToken(token);
    },
    recaptchaResponse(token) {
        for(var c of this.c) c.sendRecaptcha(token);
    },
    setClientVersion(version, strVersion) {
        for(var c of this.c) c.setClientVersion(version, strVersion);
    },
    sendFreeSpectate() {
        for(var c of this.c) c.sendFreeSpectate()
    },
    sendSpectate() {
        for(var c of this.c) c.sendSpectate()
    },
    sendNick(nick) {
        for(var c of this.c) c.sendNick(nick);
    },
    feed() {
        //for(var c of this.c) c.sendEject()
        this.c[this.tabCurrent] && this.c[this.tabCurrent].sendEject()
    },
    macroFeed(on) {
        if (on) {
            if (this.feedInterval) {
                return;
            }
            const app = this;
            this.feed();
            this.feedInterval = setInterval(() => {
                app.feed();
            }, settings.macroFeeding);
        } else {
            if (this.feedInterval) {
                clearInterval(this.feedInterval);
                this.feedInterval = null;
            }
        }
    },
    split() {
        this.c[this.tabCurrent] && this.c[this.tabCurrent].sendSplit()
        //for(var c of this.c) c.sendSplit()
    },
    doubleSplit() {
        const app = this;
        app.split();
        setTimeout(() => {
            app.split();
        }, 40);
    },
    popSplit() {
        const app = this;
        app.split();
        setTimeout(() => {
            app.split();
        }, 200);
    },
    tripleSplit() {
        const app = this;
        app.split();
        setTimeout(() => {
            app.split();
        }, 40);
        setTimeout(() => {
            app.split();
        }, 80);
    },
    split16() {
        const app = this;
        app.split();
        setTimeout(() => {
            app.split();
        }, 40);
        setTimeout(() => {
            app.split();
        }, 80);
        setTimeout(() => {
            app.split();
        }, 120);
    },
    
    tryResp() {
        /*function fn(){
            setTimeout(() => {$('#play').click()},200)
        }
        this.once('connect',fn)
        setTimeout(() => {this.removeListener(fn)},4000)*/
        function fn(){
            this.c[this.tabCurrent]
            this.c[this.tabCurrent].sendNick(profiles[this.tabCurrent==0?'mainProfile':'slaveProfile'].nick)
        }
        if( this.c[this.tabCurrent].estabilished){

        }else{
            this.c[this.tabCurrent].once('estabilished',()=>{fn.bind(this)()})
        }


    },
    quickResp() {
        if (!settings.quickResp) {
            return;
        }
        Settings.hideMenu();
        this.c[this.tabCurrent].connect(this.ws);
        this.c[this.tabCurrent].play = false
        /*for(var Connection of this.c) {
            Connection.play = false;
        }
        */
        this.tryResp();
    },
    autoResp() {
        if (!settings.autoResp) {
            return;
        }
        $('#play').click()
    },
    setQuadrant(quadrant){
        for(var Connection of this.c) {
            Connection.setQuadrant(quadrant)
        }
    },
    setPause() {
        this.pause = !this.pause;
        tempsett.pause = this.pause;
        if (this.pause) {
            //tempsett.resetTargetPosition();
            $(`#pause-hud`).show();
        } else {
            $(`#pause-hud`).hide();
        }
    },

    displayLeaderboard(position, data = '') {
        if (!this.leaderboardPositionsHUD) {
            return;
        }
        this.leaderboardPositionsHUD.innerHTML = position;
        this.leaderboardDataHUD.innerHTML = data;
    },
    displayStats() {
        if (!settings.showStats) {
            $(`#stats-hud`).hide();
            return;
        }
        for(var Connection of this.c) {}
        let arr = []

        if (Connection.play) {
           
            if (settings.showStatsMass && Connection.playerMass) {
                arr.push(textLanguage.mass+": "+Connection.playerMass+"/"+~~(Connection.playerMass/4)+"/"+~~(Connection.playerMass/16))
            }
            if (Connection.playerScore) {
                arr.push(textLanguage.score+': '+Connection.playerScore)
            }
            if (settings.showStatsSTE && Connection.STE) {
                arr.push('STE: '+Connection.STE)
            }
            if (settings.showStatsN16 && Connection.playerSplitCells) {
                arr.push(Connection.playerSplitCells===16?'<span style="background:green">'+Connection.playerSplitCells+'/16</span>':Connection.playerSplitCells+"/16")
            }
        }

        if (settings.showStatsFPS) {
            arr.push('FPS: ' + drawRender.fps)
        }
        
        if (settings.showStatsPPS) {
            let color = ''
            if(Connection.pps<23 || Connection.pps>29) color = 'color:#ff4c4c'
            if(Connection.pps<20 || Connection.pps>32) color = 'color:red'
            arr.push('PPS: <span style="'+color+'">'+Connection.pps+'</span>')
        }
        const str = arr.join('  ');
        this.statsHUD.innerHTML = str;
        const app = this;
        setTimeout(() => {
            app.displayStats();
        }, 250);
    },


    displayTime() {
        if (!settings.showTime) {
            $(`#time-hud`).hide();
            return;
        }
        const time = new Date().toLocaleString();
        this.timeHUD.textContent = time;
        const app = this;
        setTimeout(() => {
            app.displayTime();
        }, 1000);
    },








    setUI() {
        const app = this;
        


        $(document).on(`click`, `#stream-mode`, () => {
            settings.streamMode = !settings.streamMode;
            app.saveSettings(settings, `ogarioSettings`);
            app.setStreamMode();
        });
        $(document).on('click', `#hide-url`, () => {
            settings.hideSkinUrl = !settings.hideSkinUrl;
            app.saveSettings(settings, `ogarioSettings`);
            app.setHideSkinUrl();
        });

        $(document).on(`click`, `#server-connect`, () => {
            app.joinByWS($('#server-ws').val());
        });
        $(document).on(`click`, `#server-reconnect`, () => {
            app.gameServerReconnect();
        });
        $(document).on(`click`, `#server-join`, () => {
            app.joinByToken($(`#server-token`).val());
        });

        $(document).on(`click`, `#random`, () => {
            for(var c of app.c) {c.shutup=true;c.socket.close()}
            master.getServer((ws)=>{
                app.joinByWS(ws)
            })
        });

        $(document).on(`click`, `#spectate`, () => {
            comm.onSpectate()
            profiles.getValues(profiles.selectedA)
            profiles.saveSettings()
            this.sendSpectate()
            Settings.hideMenu()
            profiles.saveSettings()
        });

        $(document).on(`click`, `#play`, () => {
            profiles.getValues(profiles.selectedA)
            profiles.saveSettings()
            Settings.hideMenu()
            this.doPlay();
            profiles.saveSettings()
        });


        this.on('offset',(c)=>{
            this.setupShift()
            //app.fixOffset(c)
        })

        this.on('death',(c)=>{
                app.switchPlayer(true)
                if(app.play) return;
                    //c.isFreeSpectate==true&&c.sendFreeSpectate()
                    //!settings.autoResp&&c.sendSpectate()
                Settings.showMenu()
                app.autoResp()
                comm.onPlayerDeath()
        })

        var reconnectTries = 0
        this.on('close',()=>{
            /*if(reconnectTries==3){
                reconnectTries = 0
                console.log('server down',this.ws)
                return;
            }
            reconnectTries++
            setTimeout(()=>{
                app.joinByWS(app.ws);
            },300)*/
            master.getServer((ws)=>{
                app.joinByWS(ws)
            })
        })
        /* AUTHORIZATION */
        function setPrimaryAccount(num, ui){
            application.primaryAccount = Number(num)
            localStorage['primaryAccount'] = application.primaryAccount
            application.c[0] && application.c[0].accessTokenSent == true && application.joinByWS(application.ws)
            application.c[1] && application.c[1].accessTokenSent == true && application.joinByWS(application.ws)
            ui && $(`#primaryAccount`).val(localStorage['primaryAccount']||application.primaryAccount)
        }
        $(document).on(`click`, `.btn-auth-facebook`, (e) => {
            if(FbAccount.token) return;
            (!FbAccount.token && !GlAccount.token) && setPrimaryAccount(0,true)
            FbAccount.connect()
        })
        $(document).on(`click`, `.btn-auth-google`, (e) => {
            if(GlAccount.token) return;
            (!FbAccount.token && !GlAccount.token) && setPrimaryAccount(1,true)
            GlAccount.connect()
        })
        $(document).on(`click`, `.btn-logout-facebook`, () => {
            FbAccount.setLogout()
        })
        $(document).on(`click`, `.btn-logout-google`, () => {
            GlAccount.setLogout()
        })

        $(document).on(`change`, `#primaryAccount`, function(){setPrimaryAccount(this.value)})
        setPrimaryAccount(localStorage['primaryAccount']||application.primaryAccount,true)
        function setAuthButtons(){
            $('.btn-logout-facebook')[FbAccount.token?'show':'hide']();
            $('.btn-logout-google')[GlAccount.token?'show':'hide']();
            //(!FbAccount.token || !GlAccount.token) && $('.unauthorized').show();
            //(FbAccount.token || GlAccount.token) && $('.unauthorized').hide();

            if(!(FbAccount.token || GlAccount.token)) {
                $('.unauthorized').show();
                $('.authorized').hide();
            }else{
                $('.unauthorized').hide()
                $('.authorized').show();
            }
        }
        setAuthButtons()
        this.on('estabilished',function(Client){
            var i = application.c.indexOf(Client)
            if(i==-1 && i > 1) return false;
            if(i == application.primaryAccount){
                FbAccount.token && Client.sendFbToken(FbAccount.token)
            } else {
                GlAccount.token && Client.sendGplusToken(GlAccount.token)
            }
        })
        this.on('logout',function(Client){
            var i = application.c.indexOf(Client)
            if(i==-1 && i > 1) return false;
            if(i == application.primaryAccount){
                FbAccount.logout()
                Settings.displayChatInfo(0,'Facebook login canceled by server')
            } else {
                GlAccount.logout()
                Settings.displayChatInfo(0,'Google login canceled by server')
            }
        })
        FbAccount.on('login',function(){
            setAuthButtons()
            //Settings.displayChatInfo(1,'Facebook login successfully')
            var  Client = application.c[application.primaryAccount]
            if(!Client) return;
            Client.accessTokenSent == false && Client.clientKey != null && Client.sendFbToken(FbAccount.token)
        })
        FbAccount.on('logout',function(){
            setAuthButtons()
            setPrimaryAccount(application.primaryAccount)
        })

        GlAccount.on('login',function(){
            setAuthButtons()
            //Settings.displayChatInfo(1,'Google login successfully')
            var  Client = application.c[application.primaryAccount==0?1:0]
            if(!Client) return;
            Client.accessTokenSent == false && Client.clientKey != null && Client.sendGplusToken(GlAccount.token)
        })
        GlAccount.on('logout',function(){
            setAuthButtons()
            setPrimaryAccount(application.primaryAccount)
        })

        /* COMM */

        this.on('captcha',(c)=>{
                myCaptcha.widget!=null && grecaptcha.reset(myCaptcha.widget)
                agarCaptcha.requestCaptcha()
                window.core={
                    recaptchaResponse(token){
                        c.sendRecaptcha(token)
                    }
                }

        })

        this.on('spawn',()=>{
            comm.onPlayerSpawn()
        })
        this.on('death',()=>{
            if(app.play) return;
            comm.onPlayerDeath();
        })
        $(document).on(`click`, `#spectate`, () => {
            comm.onSpectate()
        });
        this.on('connecting',()=>{
            window.comm /*&& comm.onSpectate()*/ && comm.sendServerJoin() && comm.sendServerData()
            !window.comm && setTimeout(()=>{
                //comm.onSpectate()
                comm.sendServerJoin()
                comm.sendServerData()

            },1000)
        })



        this.statsHUD = document.getElementById(`stats-hud`);
        this.activeParties = document.getElementById('active-parties');
        this.leaderboardPositionsHUD = document.getElementById(`leaderboard-positions`);
        this.leaderboardDataHUD = document.getElementById(`leaderboard-data`);
        this.timeHUD = document.getElementById('time-hud');
        this.questHUD = document.getElementById(`quest-hud`);

        $(`#canvas`).bind(`contextmenu`, () => false);
        $(document).on('mouseup', `.btn`, function() {
            $(this).blur();
        });
        $(`[data-toggle='tab-tooltip']`).tooltip({
            trigger: `hover`
        });
        /*$('.submenu-panel, #chat-box, #exp-imp-settings, #export-settings, #import-settings').perfectScrollbar({
            suppressScrollX: true
        });*/

        toastr.options = {
            newestOnTop: false,
            positionClass: `toast-bottom-left`,
            timeOut: 15000
        };
    },
    getDefaultSettings() {


    },
    setStreamMode() {
        if (settings.streamMode) {
            $(`#stream-mode`).addClass(`ogicon-eye-blocked`);
            $('#clantag, #nick, #party-token').addClass('stream-mode');
        } else {
            $('#stream-mode').removeClass(`ogicon-eye-blocked`);
            $(`#clantag, #nick, #party-token`).removeClass(`stream-mode`);
        }
    },
    setHideSkinUrl() {
        if (settings.hideSkinUrl) {
            $('#hide-url').addClass(`ogicon-eye-blocked`);
            $('#skin').addClass(`hide-url`);
        } else {
            $(`#hide-url`).removeClass(`ogicon-eye-blocked`);
            $(`#skin`).removeClass(`hide-url`);
        }
    },
    setVirusColor(size) {
        const floor = Math.floor(size * size / 100);
        if (floor > 183) {
            return `#C80000`;
        }
        return theme.virusColor;
    },
    setVirusStrokeColor(size) {
        for(var Connection of application.c)
        if (Connection.play && Connection.playerMaxMass != 0) {
            const floor = Math.floor(size * size / 100);
            const biggestCell = floor / (this.selectBiggestCell ? Connection.playerMaxMass : Connection.playerMinMass);
            if (biggestCell > 0.76) {
                return `#FFDC00`;
            }
            return `#C80000`;
        }
        return theme.virusStrokeColor;
    },
    setAutoHideCellInfo(size) {
        for(var Connection of application.c)
        if (size <= 40 || Connection.viewScale < 0.5 && size < 550 && size < 25 / Connection.viewScale) {
            return true;
        }
        return false;
    },






    flushData() {
        this.play = false;
    },
    getWS(ws) {
        if (!ws) {
            return;
        }
        this.ws = ws;
        this.createServerToken();
        this.updateServerInfo();
    },
    recreateWS(token) {
        if (!token) {
            return null;
        }
        let text = null;
        if (!text && /^[a-z0-9]{5,}\.tech$/ .test(token)) {
            text = `wss://live-arena-` + token + `.agar.io:80`;
        }
        if (/^[a-zA-Z0-9=+/]{12,}$/ .test(token)) {
            const atobToken = atob(token);

            //ccse
            if(!text && atobToken.search(/agar\.io/)==-1){
                text = 'wss://'+atobToken
                return text
            }


            if (/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/ .test(atobToken)) {
                text = `wss://ip-${atobToken.replace(/./g, '-').replace(':', `.tech.agar.io:`)}`;
            }
        }
        if (!text && /^[a-z0-9]{5,}$/ .test(token)) {
            text = `wss://live-arena-` + token + `.agar.io:443`;
        }
        return text;
    },
    createServerToken() {
        console.log(this.ws)
        let matchOld = this.ws.match(/ip-\d+/);
        const matchNew = this.ws.match(/live-arena-([\w\d]+)/);
        var matchNew2 = this.ws.match(/live-arena-(.+\.tech)/);
        let text = null;
        if (matchOld) {
            const replace = this.ws.replace(`.tech.agar.io`, '').replace(/-/g, '.');
            matchOld = replace.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/);
            if (matchOld) {
                this.serverIP = matchOld[0];
                text = btoa(this.serverIP);
            }
        }
        if (matchNew2 && matchNew2[1]) {
            //wss://live-arena-19bre41.tech.agar.io:80
            const replace = matchNew2[1]
            console.log(replace)
                this.serverArena = replace
                text = this.serverArena;

        }
        //ccse
        if(this.ws.search(/wss?:\/\//)>-1 && this.ws.search(/agar\.io/)==-1){
            text = this.ws.match(/wss?:\/\/(.+)/)[1]
            this.serverIP = text
            text = btoa(text)
            console.log(this.serverIP)
        }
        if (!text && matchNew) {
            this.serverArena = matchNew[1];
            text = this.serverArena;
            console.log(this.serverArena)
        }
        if (text) {
            if (this.serverToken !== text) {
                this.serverToken = text;
                console.log(this.serverToken)
                //this.flushData();
                //this.flushCells();
            }
            this.partyToken = '';
            const matchPartyId = this.ws.match(/party_id=([A-Z0-9]{6})/);
            if (matchPartyId) {
                this.partyToken = matchPartyId[1];
                changeUrl(`/#${window.encodeURIComponent(this.partyToken)}`);
            }
        }

    },
    updateServerInfo() {
        $(`#server-ws`).val(this.ws);
        $(`#server-token`).val(this.serverToken);
        $(`#party-token, .party-token`).val(this.partyToken);
    },
    joinByWS(ws) {
        if (!ws)  return;
        this.connect(ws)
    },
    joinRandomWS() {
        window.master && window.master.reconnect && window.master.reconnect();
    },
    joinByToken(token) {
        const ws = this.recreateWS(token);
        if (ws) this.joinByWS(ws);
    },
    connect(ws) {
        console.log('[Master] Connect to:', ws);
        this.ws = ws;
        this.getWS(this.ws)
        this.tabCurrent = 0
        for(var c of this.c){
            var i = this.c.indexOf(c)
            if(i>0){
                this.c[i].connect(false)
                delete c
                delete this.slaveTab
                this.c.splice(i,1)
            }

            i==0&&c.connect(ws)
        }
        
    },
    init() {

        this.setUI();

        this.masterTab = new Client()
        this.c.push(this.masterTab)
        setTimeout(() => {
            this.displayStats();
        }, 1000);
        
        master.getServer((ws)=>{
            this.joinByWS(ws);
        })

        function handleMouseWheel(value){
            for(var Connection of this.c) {
                Connection.setZoom(value);
            }
        }
        if (/firefox/i .test(navigator.userAgent)) {
            document.addEventListener(`DOMMouseScroll`, handleMouseWheel.bind(this));
        } else {
            document.body.onmousewheel = handleMouseWheel.bind(this)
        }

        
        //this.setBlockPopups();
        //this.preloadChatSounds();
        //this.setChatSoundsBtn();

    }
};

eventify(application)
application.init();

//application.joinByWS('wss://live-arena-1sl4mgd.agar.io:443')
//application.joinByWS('wss://delta-server.glitch.me');
//application.getDefaultSettings();
//application.connect();
