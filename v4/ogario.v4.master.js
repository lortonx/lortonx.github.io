// decoded by Alexander Lylko
// on 24.02.2019 23:40 ｚᶻ͛

//(function(window, $) {
	var langCodes = {'AF': 'JP-Tokyo','AX': 'EU-London','AL': 'EU-London','DZ': 'EU-London','AS': 'SG-Singapore','AD': 'EU-London','AO': 'EU-London','AI': 'US-Atlanta','AG': 'US-Atlanta','AR': 'BR-Brazil','AM': 'JP-Tokyo','AW': 'US-Atlanta','AU': 'SG-Singapore','AT': 'EU-London','AZ': 'JP-Tokyo','BS': 'US-Atlanta','BH': 'JP-Tokyo','BD': 'JP-Tokyo','BB': 'US-Atlanta','BY': 'EU-London','BE': 'EU-London','BZ': 'US-Atlanta','BJ': 'EU-London','BM': 'US-Atlanta','BT': 'JP-Tokyo','BO': 'BR-Brazil','BQ': 'US-Atlanta','BA': 'EU-London','BW': 'EU-London','BR': 'BR-Brazil','IO': 'JP-Tokyo','VG': 'US-Atlanta','BN': 'JP-Tokyo','BG': 'EU-London','BF': 'EU-London','BI': 'EU-London','KH': 'JP-Tokyo','CM': 'EU-London','CA': 'US-Atlanta','CV': 'EU-London','KY': 'US-Atlanta','CF': 'EU-London','TD': 'EU-London','CL': 'BR-Brazil','CN': 'CN-China','CX': 'JP-Tokyo','CC': 'JP-Tokyo','CO': 'BR-Brazil','KM': 'EU-London','CD': 'EU-London','CG': 'EU-London','CK': 'SG-Singapore','CR': 'US-Atlanta','CI': 'EU-London','HR': 'EU-London','CU': 'US-Atlanta','CW': 'US-Atlanta','CY': 'JP-Tokyo','CZ': 'EU-London','DK': 'EU-London','DJ': 'EU-London','DM': 'US-Atlanta','DO': 'US-Atlanta','EC': 'BR-Brazil','EG': 'EU-London','SV': 'US-Atlanta','GQ': 'EU-London','ER': 'EU-London','EE': 'EU-London','ET': 'EU-London','FO': 'EU-London','FK': 'BR-Brazil','FJ': 'SG-Singapore','FI': 'EU-London','FR': 'EU-London','GF': 'BR-Brazil','PF': 'SG-Singapore','GA': 'EU-London','GM': 'EU-London','GE': 'JP-Tokyo','DE': 'EU-London','GH': 'EU-London','GI': 'EU-London','GR': 'EU-London','GL': 'US-Atlanta','GD': 'US-Atlanta','GP': 'US-Atlanta','GU': 'SG-Singapore','GT': 'US-Atlanta','GG': 'EU-London','GN': 'EU-London','GW': 'EU-London','GY': 'BR-Brazil','HT': 'US-Atlanta','VA': 'EU-London','HN': 'US-Atlanta','HK': 'JP-Tokyo','HU': 'EU-London','IS': 'EU-London','IN': 'JP-Tokyo','ID': 'JP-Tokyo','IR': 'JP-Tokyo','IQ': 'JP-Tokyo','IE': 'EU-London','IM': 'EU-London','IL': 'JP-Tokyo','IT': 'EU-London','JM': 'US-Atlanta','JP': 'JP-Tokyo','JE': 'EU-London','JO': 'JP-Tokyo','KZ': 'JP-Tokyo','KE': 'EU-London','KI': 'SG-Singapore','KP': 'JP-Tokyo','KR': 'JP-Tokyo','KW': 'JP-Tokyo','KG': 'JP-Tokyo','LA': 'JP-Tokyo','LV': 'EU-London','LB': 'JP-Tokyo','LS': 'EU-London','LR': 'EU-London','LY': 'EU-London','LI': 'EU-London','LT': 'EU-London','LU': 'EU-London','MO': 'JP-Tokyo','MK': 'EU-London','MG': 'EU-London','MW': 'EU-London','MY': 'JP-Tokyo','MV': 'JP-Tokyo','ML': 'EU-London','MT': 'EU-London','MH': 'SG-Singapore','MQ': 'US-Atlanta','MR': 'EU-London','MU': 'EU-London','YT': 'EU-London','MX': 'US-Atlanta','FM': 'SG-Singapore','MD': 'EU-London','MC': 'EU-London','MN': 'JP-Tokyo','ME': 'EU-London','MS': 'US-Atlanta','MA': 'EU-London','MZ': 'EU-London','MM': 'JP-Tokyo','NA': 'EU-London','NR': 'SG-Singapore','NP': 'JP-Tokyo','NL': 'EU-London','NC': 'SG-Singapore','NZ': 'SG-Singapore','NI': 'US-Atlanta','NE': 'EU-London','NG': 'EU-London','NU': 'SG-Singapore','NF': 'SG-Singapore','MP': 'SG-Singapore','NO': 'EU-London','OM': 'JP-Tokyo','PK': 'JP-Tokyo','PW': 'SG-Singapore','PS': 'JP-Tokyo','PA': 'US-Atlanta','PG': 'SG-Singapore','PY': 'BR-Brazil','PE': 'BR-Brazil','PH': 'JP-Tokyo','PN': 'SG-Singapore','PL': 'EU-London','PT': 'EU-London','PR': 'US-Atlanta','QA': 'JP-Tokyo','RE': 'EU-London','RO': 'EU-London','RU': 'RU-Russia','RW': 'EU-London','BL': 'US-Atlanta','SH': 'EU-London','KN': 'US-Atlanta','LC': 'US-Atlanta','MF': 'US-Atlanta','PM': 'US-Atlanta','VC': 'US-Atlanta','WS': 'SG-Singapore','SM': 'EU-London','ST': 'EU-London','SA': 'EU-London','SN': 'EU-London','RS': 'EU-London','SC': 'EU-London','SL': 'EU-London','SG': 'JP-Tokyo','SX': 'US-Atlanta','SK': 'EU-London','SI': 'EU-London','SB': 'SG-Singapore','SO': 'EU-London','ZA': 'EU-London','SS': 'EU-London','ES': 'EU-London','LK': 'JP-Tokyo','SD': 'EU-London','SR': 'BR-Brazil','SJ': 'EU-London','SZ': 'EU-London','SE': 'EU-London','CH': 'EU-London','SY': 'EU-London','TW': 'JP-Tokyo','TJ': 'JP-Tokyo','TZ': 'EU-London','TH': 'JP-Tokyo','TL': 'JP-Tokyo','TG': 'EU-London','TK': 'SG-Singapore','TO': 'SG-Singapore','TT': 'US-Atlanta','TN': 'EU-London','TR': 'TK-Turkey','TM': 'JP-Tokyo','TC': 'US-Atlanta','TV': 'SG-Singapore','UG': 'EU-London','UA': 'EU-London','AE': 'EU-London','GB': 'EU-London','US': 'US-Atlanta','UM': 'SG-Singapore','VI': 'US-Atlanta','UY': 'BR-Brazil','UZ': 'JP-Tokyo','VU': 'SG-Singapore','VE': 'BR-Brazil','VN': 'JP-Tokyo','WF': 'SG-Singapore','EH': 'EU-London','YE': 'JP-Tokyo','ZM': 'EU-London','ZW': 'EU-London'}
	var MC = {
		'context': null,
		'defaultProvider': 'facebook',
		'loginIntent': '0',
		'userInfo': {
			'socialToken': null,
			'tokenExpires': '',
			'level': '',
			'xp': '',
			'xpNeeded': '',
			'name': '',
			'picture': '',
			'displayName': '',
			'loggedIn': '0',
			'socialId': ''
		}
	};
	var coldEnv = {
		'fb_app_id': 0x268301c162623,
		'gplus_client_id': '686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com',
		'master_url': 'webbouncer-live-v8-0.agario.miniclippt.com',
		'endpoint_version': 'v4',
		'proto_version': '15.0.1',
		'client_version': 31000,
		'client_version_string': '3.10.0'
	};
	var facebookInitialized = false;
	var loginTries = 0x0;
	var GAPI = null;
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
		'clientVersion': coldEnv.client_version,
		'clientVersionString': coldEnv.client_version_string,
		'getClientVersion': function() {
			if(window.localStorage.getItem('ogarioClientVersionString') !== null) {
				this.clientVersionString = window.localStorage.getItem('ogarioClientVersionString');
				this.clientVersion = this.parseClientVersion(this.clientVersionString);
			}
			var self = this;
			$.ajax('//agar.io/mc/agario.js', {
				'error': function() {},
				'success': function(response) {
					var matches = response.match(/versionString=\"(\d+\.\d+\.\d+)\"/);
					if(matches) {
						var string = matches[0x1];
						var parsedString = self.parseClientVersion(string);
						console.log('[Master] Current client version:', parsedString, string);
						self.setClientVersion(parsedString, string);
					}
				},
				'dataType': 'text',
				'method': 'GET',
				'cache': false,
				'crossDomain': true
			});
		},
		'setClientVersion': function(number, string) {
			console.log('[Master] Your client version:', this.clientVersion, this.clientVersionString);
			if(this.clientVersion != number) {
				console.log('[Master] Changing client version...');
				this.clientVersion = number;
				this.clientVersionString = string;
				if(window.core) {
					window.core.setClientVersion(number, string);
				}
				window.localStorage.setItem('ogarioClientVersionString', string);
				this.reconnect(true);
			}
		},
		'parseClientVersion': function(string) {
			return parseInt(string.split('.')[0x0]) * 0x2710 + parseInt(string.split('.')[0x1]) * 0x64 + parseInt(string.split('.')[0x2]);
		},
		'getRegionCode': function() {
			var location = window.localStorage.getItem('location');
			if(location) {
				this.setRegion(location, false);
				if(!this.checkPartyHash()) this.reconnect();
				return;
			}
			var self = this;
			$.get('//gc.agar.io', function(response) {
				var arr = response.split(' ');
				var region = arr[0x0];
				self.setRegionCode(region);
			}, 'text');
		},
		'setRegionCode': function(code) {
			if(langCodes.hasOwnProperty(code)) {
				this.setRegion(langCodes[code], false);
				if(!this.checkPartyHash()) {
					this.reconnect();
				}
			}
		},
		'setRegion': function(region, bool) {
			if(bool == null) {
				bool = true;
			}
			if(!region) {
				return;
			}
			this.region = region;
			window.localStorage.setItem('location', region);
			if($('#region').val() !== region) {
				$('#region').val(region);
			}
			if(bool) {
				this.reconnect();
			}
		},
		'checkRegion': function() {
			var $region = $('#region');
			var region = $region.val();
			if(region) { 
				window.localStorage.setItem('location', region);
			} else {
				region = window.localStorage.getItem('location');
				if(region) {
					$('#region').val(region);
				}
			}
			if($region.val()) {
				$('#locationKnown').append($region);
			} else {
				$('#locationUnknown').append($region);
			}
		},
		'refreshRegionInfo': function() {
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
			var selft = this;
			$('#region option').each(function() {
				var code = $(this).val();
				var _0x362b3d = $(this).text();
				if(!selft.regionNames.hasOwnProperty(code)) {
					selft.regionNames[code] = _0x362b3d;
				}
			});
		},
		'setGameMode': function(string, _0x1960fa) {
			if(_0x1960fa == null) {
				_0x1960fa = true;
			}
			this.applyGameMode(string);
			this.gameMode = string;
			if(_0x1960fa) {
				this.reconnect();
			}
		},
		'applyGameMode': function(string) {
			$('#helloContainer, #overlays-hud').attr('data-gamemode', string);
			$('#gamemode').val(string);
			if(string !== ':party') {
				this.replaceHistoryState('/#' + window.encodeURIComponent(string.replace(':', '')));
			}
		},
		'handleChangeMode': function() {
			var string = $('#gamemode').val();
			this.setGameMode(string);
		},
		'findServer': function(region, gamemode) {
			if(region.indexOf('Antarc')>-1) return core.connect('wss://delta-server.glitch.me')
			var time = Date.now();
			if(time - this.findingServer < 0x1f4) {
				return;
			}
			if(window.core) {
				window.core.disconnect();
			}
			var findMode = 'findServer';
			if(region == null) {
				region = '';
			}
			if(gamemode == null) {
				gamemode = ':ffa';
			} else if(gamemode === ':battleroyale') {
				findMode = 'findBattleRoyaleServer';
			}
			var self = this;
			var payload = this.setRequestMsg(region, gamemode);
			var _0x1d1e8a = ++this.curValidFindServer;
			this.findingServer = time;
			this.makeMasterRequest(coldEnv.endpoint_version + '/' + findMode, payload, function(response) {
				if(_0x1d1e8a != self.curValidFindServer) {
					return;
				}
				var _0xd7f6de = response.endpoints;
				if(_0xd7f6de === null || _0xd7f6de.https === '0.0.0.0:0') {
					self.findServer(region, gamemode);
					return;
				}
				self.serverIP = _0xd7f6de.https;
				if(response.token !== null) {
					self.partyToken = response.token;
				}
				self.backoffPeriod = 0x1f4;
				self.connect(self.serverIP);
			}, function() {
				self.backoffPeriod *= 0x2;
				setTimeout(function() {
					self.findServer(region, gamemode);
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
			$.ajax('https://' + coldEnv.master_url + '/' + requestType, {
				'beforeSend': function(xhr) {
					xhr.setRequestHeader('Accept', 'text/plain');
					xhr.setRequestHeader('Accept', '*/*');
					xhr.setRequestHeader('Accept', 'q=0.01');
					xhr.setRequestHeader('Content-Type', contentType);
					xhr.setRequestHeader('x-support-proto-version', coldEnv.proto_version);
					xhr.setRequestHeader('x-client-version', self.clientVersion);
					return true;
				},
				'error': function() {
					onerror && onerror();
				},
				'success': function(response) {
					callback(response);
				},
				'dataType': 'json',
				'method': 'POST',
				'data': payload,
				'processData': false,
				'cache': false,
				'crossDomain': true
			});
		},
		'makeMasterSimpleRequest': function(findType, dataType, callback, onerror) {
			var self = this;
			$.ajax('https://' + coldEnv.master_url + '/' + findType, {
				'beforeSend': function(xhr) {
					xhr.setRequestHeader('x-support-proto-version', coldEnv.proto_version);
					xhr.setRequestHeader('x-client-version', self.clientVersion);
					return true;
				},
				'error': function() {
					onerror && onerror();
				},
				'success': function(response) {
					callback(response);
				},
				'dataType': dataType,
				'method': 'GET',
				'cache': false,
				'crossDomain': true
			});
		},
		'createParty': function() {
			this.setPartyState('3');
			this.setGameMode(':party');
		},
		'joinParty': function(partyToken) {
			var self = this;
			if(partyToken.indexOf('#') != -0x1) {
				var str = partyToken.split('#')[0x1];
				partyToken = str;
			}
			this.setGameMode(':party', false);
			this.partyToken = partyToken;
			this.replaceHistoryState('/#' + window.encodeURIComponent(partyToken));
			var payload = this.setRequestMsg(this.region, '', partyToken);
			this.makeMasterRequest(coldEnv.endpoint_version + '/getToken', payload, function(response) {
				self.endpoint = response.endpoints.https;
				self.setPartyState('9');
			}, function() {
				self.setPartyState('6');
			});
		},
		'setPartyState': function(state) {
			if(state === '9') {
				this.updatePartyToken();
				this.setGameMode(':party', false);
				this.connect(this.endpoint);
				state = '5';
			}
			$('#helloContainer').attr('data-party-state', state);
		},
		'connect': function(_0x5d1cb1) {
			console.log('[Master] Connect to:', _0x5d1cb1);
			this.ws = 'wss://' + _0x5d1cb1;
			if(this.gameMode === ':party' && this.partyToken) {
				this.ws += '?party_id=' + window.encodeURIComponent(this.partyToken);
			}
			if(window.core) {
				window.core.connect(this.ws);
			}
		},
		'reconnect': function(_0x5d6821) {
			if(!this.region) {
				return;
			}
			if(_0x5d6821 && this.serverIP) {
				this.connect(this.serverIP);
			} else {
				this.findServer(this.region, this.gameMode);
			}
		},
		'onConnect': function() {
			if(this.gameMode === ':party') {
				this.updatePartyToken();
			}
		},
		'onDisconnect': function() {
			this.reconnect();
		},
		'recaptchaRequested': function() {
			requestCaptcha(true);
		},
		'sendRecaptchaResponse': function(_0x196a5a) {
			if(window.core) {
				window.core.recaptchaResponse(_0x196a5a);
			}
		},
		'notifyToken': function(_0x350212) {
			this.sendRecaptchaResponse(_0x350212);
		},
		'setNick': function() {
			this.login();
			var nick = $('#nick').val();
			if(nick && nick.length > 0xf) {
				nick = nick.substring(0x0, 0xf);
			}
			if(window.core) {
				window.core.sendNick(nick);
			}
		},
		'spectate': function() {
			if(window.core) {
				window.core.sendSpectate();
			}
		},
		'updatePartyToken': function() {
			$('#party-token, .party-token').val(this.partyToken);
		},
		'checkHash': function() {
			if(this.checkPartyHash()) {
				this.joinParty(window.location.hash);
				return;
			}
			var hashMode = ['#ffa', '#battleroyale', '#teams', '#experimental'];
			if(window.location.hash && hashMode.indexOf(window.location.hash) != -0x1) {
				this.setGameMode(window.location.hash.replace('#', ':'));
			}
		},
		'checkPartyHash': function() {
			return window.location.hash && window.location.hash.length == 0x7;
		},
		'replaceHistoryState': function(_0x21389d) {
			if(window.history && window.history.replaceState) {
				window.history.replaceState({}, window.document.title, _0x21389d);
			}
		},
		'facebookLogin': function() {
			window.facebookLogin();
		},
		'doLoginWithFB': function(token) {
			this.context = 'facebook';
			this.accessToken = token;
		},
		'doLoginWithGPlus': function(token) {
			this.context = 'google';
			this.accessToken = token;
		},
		'login': function() {
			if(!this.accessToken) {
				return;
			}
			if(this.context === 'facebook' && window.core && window.core.sendFbToken) {
				window.core.sendFbToken(this.accessToken);
			}
			if(this.context === 'google' && window.core && window.core.sendGplusToken) {
				window.core.sendGplusToken(this.accessToken);
			}
			var styles = [
				'background: red',
				'background: orange',
				'background: gold',
				'background: yellowgreen',
				'background: skyblue',
				'background: steelblue',
				'background: darkviolet'
				];
				console.log ( '%c ☝ %c ᴅ %c ᴏ %c ᴄ %c ᴛ %c ᴏ %c ʀ ',
					styles[0], styles[1], styles[2], styles[3],
					styles[4], styles[5], styles[6] );
		},
		'logout': function() {
			this.accessToken = null;
			this.reconnect();
		},
		'setUI': function() {
			var self = this;
			$('[data-itr]').each(function() {
				var $el = $(this);
				var language = $el.attr('data-itr');
				$el.html(window.i18n(language));
			});
			$('#gamemode').on('change', function() {
				self.handleChangeMode();
			});
			$('.btn-play, .btn-play-guest').on('click', function(ev) {
				ev.preventDefault();
				self.setNick();
			});
			$('.btn-spectate').on('click', function(ev) {
				ev.preventDefault();
				self.spectate();
			});
			$('#create-party-btn-2').on('click', function(el) {
				el.preventDefault();
				self.createParty();
			});
			$('#join-party-btn-2').on('click', function(el) {
				el.preventDefault();
				self.joinParty($('#party-token').val());
			});
			/*window.toggleSocialLogin = function() {
				$('#socialLoginContainer').toggle();
			};*/
		},
		'init': function() {
			var self = this;
			this.setUI();
			this.getRegionNames();
			this.refreshRegionInfo();
			this.checkHash();
			this.getRegionCode();
			this.checkRegion();
			setInterval(function() {
				self.refreshRegionInfo();
			}, 0x2bf20);
		}
	};
	
	window.getStorage = function() {
		if(window.localStorage.getItem('storeObjectInfo') !== null) {
			MC = JSON.parse(window.localStorage.getItem('storeObjectInfo'));
		}
	};
	window.updateStorage = function() {
		window.localStorage.setItem('storeObjectInfo', JSON.stringify(MC));
	};
	
	window.facebookLogin = function() {
		alert('You seem to have something blocking Facebook on your browser, please check for any extensions');
	};
	window.logout = function() {
		if(MC.context === 'google') {
			GAPI && GAPI.signOut();
		}
		delete window.localStorage.storeObjectInfo;
		$('#helloContainer').attr('data-logged-in', '0');
		$('.progress-bar-striped').width('0%');
		master.logout();
	};

	window.fbAsyncInit = function() {
		window.FB.init({
			'appId': coldEnv.fb_app_id,
			'cookie': true,
			'xfbml': true,
			'status': true,
			'version': 'v2.8'
		});
		//facebookInitialized = true;

		window.getStorage();
		if(MC.loginIntent === '1' && MC.context === 'facebook') {
			window.FB.getLoginStatus(function(data) {
				if(data.status === 'connected') {
					onFacebookLogin(data);
				} else {
					window.logout();
				}
			});
		}
		window.facebookRelogin = fbReLogin;
		window.facebookLogin = fbReLogin;



	};

/*	function fbLoginStart() {
		if(facebookInitialized) {
			window.getStorage();
			if(MC.loginIntent === '1' && MC.context === 'facebook') {
				window.FB.getLoginStatus(function(data) {
					if(data.status === 'connected') {
						onLoginWithFb(data);
					} else {
						window.logout();
					}
				});
			}
			window.facebookRelogin = fbReLogin;
			window.facebookLogin = fbReLogin;
		}
	}
*/
	function fbReLogin(callback) {
		if(window.FB === null) 
			alert('You seem to have something blocking Facebook on your browser, please check for any extensions');
	    else {
	     	MC.loginIntent = '1';
			MC.context = 'facebook';
			window.updateStorage();
			window.FB.login(onFacebookLogin,{
				'scope': 'public_profile, email'
			})
			return true;
		}
	}

	function onFacebookLogin(result) {
		if(result.status === 'connected') {
			var accessToken = result.authResponse.accessToken;
			if(accessToken) {
				master.doLoginWithFB(accessToken);
				window.FB.api('/me/?fields=picture,first_name,last_name&width=280&height=280', function(data) {
					if(data.picture && data.picture.data.url) {
						MC.userInfo.picture = data.picture.data.url;
						$('.agario-profile-name').text(data.first_name)
						$('.agario-profile-picture').attr('src', data.picture.data.url);
						window.updateStorage();
					}
				});
				$('#helloContainer').attr('data-logged-in', '1');
				$('.progress-bar-striped').width('100%');
			} else {
				if(loginTries < 0x3) {
					loginTries++;
					window.facebookRelogin();
					window.logout();
				}
			}
		}
	}
	window.gapiAsyncInit = function() {
		window.getStorage();
		onLoginWithGP();
	};

	function onLoginWithGP() {
		window.gapi.load('auth2', function() {
			GAPI = window.gapi.auth2.init({
				'client_id': coldEnv.gplus_client_id,
				'cookie_policy': 'single_host_origin',
				'scope': 'profile',
				'app_package_name': 'com.miniclip.agar.io'
			});
			var googleButton = document.getElementById('gplusLogin');
			googleButton.addEventListener('click', function() {
				MC.loginIntent = '1';
				MC.context = 'google';
				window.updateStorage();
			});
			GAPI.attachClickHandler(googleButton);
			GAPI.currentUser.listen(handleGapiUser);
			GAPI.then(function() {
				GAPI.currentUser.get();
				if(MC.loginIntent === '1' && MC.context === 'google') {
					!GAPI.isSignedIn.get() && GAPI.signIn();
				}
			})
		})
	}

/*	function handleGapiState() {
		GAPI.currentUser.get();
		if(MC.loginIntent === '1' && MC.context === 'google') {
			!GAPI.isSignedIn.get() && GAPI.signIn();
		}
	}
*/
	function handleGapiUser(data) {
		if(!data || !GAPI) {
			return;
		}
		if(MC.loginIntent === '1' && MC.context === 'google') {
			if(GAPI.isSignedIn.get()) {
				var authResponse = data.getAuthResponse();
				var id_token = authResponse.id_token;
				var basicProfile = data.getBasicProfile();
				var imageURL = basicProfile.getImageUrl();
				master.doLoginWithGPlus(id_token);
				if(imageURL) {
					MC.userInfo.picture = imageURL;
					window.updateStorage();
					$('.agario-profile-picture').attr('src', imageURL);
					$('.agario-profile-name').text('')
				}
				$('#helloContainer').attr('data-logged-in', '1');
				$('.progress-bar-striped').width('100%');
			}
		}
	}
//}(window, window.jQuery));