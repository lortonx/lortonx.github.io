const keyBlind = {};
var hotkeys = {};
const hotkeysCommand = {
    /*
    'hk-bots-split': {
        label: textLanguage[`hk-bots-split`],
        defaultKey: 'T',
        keyDown() {
            if(window.user.startedBots && window.user.isAlive) window.connection.send(new Uint8Array([2]).buffer)
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-bots-feed': {
        label: textLanguage[`hk-bots-feed`],
        defaultKey: 'A',
        keyDown() {
            if(window.user.startedBots && window.user.isAlive) window.connection.send(new Uint8Array([3]).buffer)
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-bots-ai': {
        label: textLanguage[`hk-bots-ai`],
        defaultKey: 'F',
        keyDown() {
            if(window.user.startedBots && window.user.isAlive){
                if(!window.bots.ai){
                    document.getElementById('botsAI').style.color = '#00C02E'
                    document.getElementById('botsAI').innerText = 'Enabled'
                    window.bots.ai = true
                    window.connection.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                }
                else {
                    document.getElementById('botsAI').style.color = '#DA0A00'
                    document.getElementById('botsAI').innerText = 'Disabled'
                    window.bots.ai = false
                    window.connection.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                }
            }
        },
        keyUp: null,
        type: 'normal'
    },*/
    'hk-feed': {
        label: textLanguage[`hk-feed`],
        defaultKey: 'W',
        keyDown() {
            application && application.feed();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-macroFeed': {
        label: textLanguage[`hk-macroFeed`],
        defaultKey: 'E',
        keyDown() {
            application && application.macroFeed(true);
        },
        keyUp() {
            application && application.macroFeed(false);
        },
        type: `normal`
    },
    'hk-split': {
        label: textLanguage[`hk-split`],
        defaultKey: 'SPACE',
        keyDown() {
            application && application.split();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-doubleSplit': {
        label: textLanguage[`hk-doubleSplit`],
        defaultKey: 'Q',
        keyDown() {
            application && application.doubleSplit();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-popSplit': {
        label: `Popsplit`,
        defaultKey: `ALT+Q`,
        keyDown() {
            application && application.popSplit();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-tripleSplit': {
        label: `Triplesplit`,
        defaultKey: ``,
        keyDown() {
            application && application.tripleSplit();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-split16': {
        label: textLanguage[`hk-split16`],
        defaultKey: 'SHIFT',
        keyDown() {
            application && application.split16();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-pause': {
        label: textLanguage['hk-pause'],
        defaultKey: 'R',
        keyDown() {
            application && application.setPause();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-switchPlayer': {
        label: textLanguage['hk-switchPlayer'],
        defaultKey: 'TAB',
        keyDown() {
            application && application.switchPlayer();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showTop5': {
        label: textLanguage[`hk-showTop5`],
        defaultKey: 'V',
        keyDown() {
            Settings && Settings.setShowTop5();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showTime': {
        label: textLanguage['hk-showTime'],
        defaultKey: 'ALT+T',
        keyDown() {
            Settings && Settings.setShowTime();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showSplitRange': {
        label: textLanguage[`hk-showSplitRange`],
        defaultKey: 'U',
        keyDown() {
            Settings && Settings.setShowSplitRange();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showSplitInd': {
        label: textLanguage[`hk-showSplitInd`],
        defaultKey: 'I',
        keyDown() {
            Settings && Settings.setShowSplitInd();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showTeammatesInd': {
        label: textLanguage[`hk-showTeammatesInd`],
        defaultKey: `ALT+I`,
        keyDown() {
            Settings && Settings.setShowTeammatesInd();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showOppColors': {
        label: textLanguage[`hk-showOppColors`],
        defaultKey: 'O',
        keyDown() {
            Settings && Settings.setShowOppColors();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-toggleSkins': {
        label: textLanguage['hk-toggleSkins'],
        defaultKey: 'K',
        keyDown() {
            Settings && Settings.toggleSkins();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-transparentSkins': {
        label: textLanguage[`hk-transparentSkins`],
        defaultKey: '',
        keyDown() {
            Settings && Settings.setTransparentSkins();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showSkins': {
        label: textLanguage[`hk-showSkins`],
        defaultKey: 'S',
        keyDown() {
            Settings && Settings.setShowSkins();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showStats': {
        label: textLanguage[`hk-showStats`],
        defaultKey: `ALT+S`,
        keyDown() {
            Settings && Settings.setShowStats();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-toggleCells': {
        label: textLanguage[`hk-toggleCells`],
        defaultKey: 'D',
        keyDown() {
            Settings && Settings.toggleCells();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showFood': {
        label: textLanguage[`hk-showFood`],
        defaultKey: 'X',
        keyDown() {
            Settings && Settings.setShowFood();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showGrid': {
        label: textLanguage[`hk-showGrid`],
        defaultKey: 'G',
        keyDown() {
            Settings && Settings.setShowGrid();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showMiniMapGuides': {
        label: textLanguage[`hk-showMiniMapGuides`],
        defaultKey: `ALT+G`,
        keyDown() {
            Settings && Settings.setShowMiniMapGuides();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-hideChat': {
        label: textLanguage[`hk-hideChat`],
        defaultKey: 'H',
        keyDown() {
            Settings && Settings.hideChat();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showHUD': {
        label: textLanguage['hk-showHUD'],
        defaultKey: 'ALT+H',
        keyDown() {
            Settings && Settings.setShowHUD();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-copyLb': {
        label: textLanguage[`hk-copyLb`],
        defaultKey: 'L',
        keyDown() {
            Settings && Settings.copyLb();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showLb': {
        label: textLanguage[`hk-showLb`],
        defaultKey: `ALT+L`,
        keyDown() {
            Settings && Settings.setShowLb();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-toggleAutoZoom': {
        label: textLanguage[`hk-toggleAutoZoom`],
        defaultKey: '',
        keyDown() {
            Settings && Settings.toggleAutoZoom();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-resetZoom': {
        label: textLanguage[`hk-resetZoom`],
        defaultKey: 'ALT+Z',
        keyDown() {
            Settings && Settings.resetZoom(true);
        },
        keyUp() {
            Settings && Settings.resetZoom(false);
        },
        type: `normal`
    },

    'hk-showBgSectors': {
        label: textLanguage[`hk-showBgSectors`],
        defaultKey: 'B',
        keyDown() {
            Settings && Settings.setShowBgSectors();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-hideBots': {
        label: textLanguage[`hk-hideBots`],
        defaultKey: 'ALT+B',
        keyDown() {
            Settings && Settings.setHideSmallBots();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showNames': {
        label: textLanguage['hk-showNames'],
        defaultKey: 'N',
        keyDown() {
            Settings && Settings.setShowNames();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-hideTeammatesNames': {
        label: textLanguage[`hk-hideTeammatesNames`],
        defaultKey: '',
        keyDown() {
            Settings && Settings.setHideTeammatesNames();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showMass': {
        label: textLanguage[`hk-showMass`],
        defaultKey: 'M',
        keyDown() {
            Settings && Settings.setShowMass();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showMiniMap': {
        label: textLanguage[`hk-showMiniMap`],
        defaultKey: `ALT+M`,
        keyDown() {
            Settings && Settings.setShowMiniMap();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showQuest': {
        label: textLanguage[`hk-showQuest`],
        defaultKey: '',
        keyDown() {
            Settings && Settings.setShowQuest();
        },
        keyUp: null,
        type: `normal`
    },




    'hk-quickResp': {
        label: textLanguage[`hk-quickResp`],
        defaultKey: 'TILDE',
        keyDown() {
            application && application.quickResp();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-autoResp': {
        label: textLanguage[`hk-autoResp`],
        defaultKey: '',
        keyDown() {
            Settings && Settings.toggleAutoResp();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-zoom1': {
        label: `${textLanguage[`hk-zoomLevel`]} 1`,
        defaultKey: `ALT+1`,
        keyDown() {
            application && application.setZoom(0.5);
        },
        keyUp: null,
        type: `normal`
    },
    'hk-zoom2': {
        label: `${textLanguage[`hk-zoomLevel`]} 2`,
        defaultKey: `ALT+2`,
        keyDown() {
            application && application.setZoom(0.25);
        },
        keyUp: null,
        type: `normal`
    },
    'hk-zoom3': {
        label: `${textLanguage[`hk-zoomLevel`]} 3`,
        defaultKey: `ALT+3`,
        keyDown() {
            application && application.setZoom(0.125);
        },
        keyUp: null,
        type: `normal`
    },
    'hk-zoom4': {
        label: `${textLanguage[`hk-zoomLevel`]} 4`,
        defaultKey: `ALT+4`,
        keyDown() {
            application && application.setZoom(0.075);
        },
        keyUp: null,
        type: `normal`
    },
    'hk-zoom5': {
        label: `${textLanguage[`hk-zoomLevel`]} 5`,
        defaultKey: `ALT+5`,
        keyDown() {
            application && application.setZoom(0.05);
        },
        keyUp: null,
        type: `normal`
    },


/*
    'hk-showTargeting': {
        label: textLanguage[`hk-showTargeting`],
        defaultKey: '',
        keyDown() {
            Settings && Settings.setShowTargeting();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-setTargeting': {
        label: textLanguage['hk-setTargeting'],
        defaultKey: '',
        keyDown() {
            Settings && Settings.setTargeting();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-cancelTargeting': {
        label: textLanguage['hk-cancelTargeting'],
        defaultKey: '',
        keyDown() {
            Settings && Settings.cancelTargeting();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-changeTarget': {
        label: textLanguage[`hk-changeTarget`],
        defaultKey: '',
        keyDown() {
            Settings && Settings.changeTarget();
        },
        keyUp: null,
        type: `normal`
    },
*/


    'hk-toggleDeath': {
        label: textLanguage['hk-toggleDeath'],
        defaultKey: 'Z',
        keyDown() {
            comm && comm.toggleDeath();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-clearChat': {
        label: textLanguage[`hk-clearChat`],
        defaultKey: 'C',
        keyDown() {
            comm && comm.displayChatHistory(true);
        },
        keyUp() {
            comm && comm.displayChatHistory(false);
        },
        type: `normal`
    },
    'hk-chatMessage': {
        label: textLanguage[`hk-chatMessage`],
        defaultKey: `ENTER`,
        keyDown() {
            comm && comm.enterChatMessage();
        },
        keyUp: null,
        type: `special`
    },
    'hk-comm1': {
        label: chatCommand.comm1,
        defaultKey: '1',
        keyDown() {
            comm && comm.sendCommand(1);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm2': {
        label: chatCommand.comm2,
        defaultKey: '2',
        keyDown() {
            comm && comm.sendCommand(2);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm3': {
        label: chatCommand.comm3,
        defaultKey: '3',
        keyDown() {
            comm && comm.sendCommand(3);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm4': {
        label: chatCommand.comm4,
        defaultKey: '4',
        keyDown() {
            comm && comm.sendCommand(4);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm5': {
        label: chatCommand.comm5,
        defaultKey: '5',
        keyDown() {
            comm && comm.sendCommand(5);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm6': {
        label: chatCommand.comm6,
        defaultKey: '6',
        keyDown() {
            comm && comm.sendCommand(6);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm7': {
        label: chatCommand.comm7,
        defaultKey: '7',
        keyDown() {
            comm && comm.sendCommand(7);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm8': {
        label: chatCommand.comm8,
        defaultKey: '8',
        keyDown() {
            comm && comm.sendCommand(8);
        },
        keyUp: null,
        type: 'command'
    },
    'hk-comm9': {
        label: chatCommand.comm9,
        defaultKey: '9',
        keyDown() {
            comm && comm.sendCommand(9);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm0': {
        label: chatCommand.comm0,
        defaultKey: '0',
        keyDown() {
            comm && comm.sendCommand(0);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm10': {
        label: chatCommand.comm10,
        defaultKey: `MOUSE WHEEL`,
        keyDown() {
            comm && comm.sendCommand(10);
        },
        keyUp: null,
        type: 'command'
    },
    'hk-comm11': {
        label: chatCommand.comm11,
        defaultKey: `LEFT`,
        keyDown() {
            comm && comm.sendCommand(11);
        },
        keyUp: null,
        type: 'command'
    },
    'hk-comm12': {
        label: chatCommand.comm12,
        defaultKey: 'UP',
        keyDown() {
            comm && comm.sendCommand(12);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm13': {
        label: chatCommand.comm13,
        defaultKey: 'RIGHT',
        keyDown() {
            comm && comm.sendCommand(13);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm14': {
        label: chatCommand.comm14,
        defaultKey: 'DOWN',
        keyDown() {
            comm && comm.sendCommand(14);
        },
        keyUp: null,
        type: `command`
    }
};
const hotkeysSetup = {
    lastPressedKey: '',
    lastKeyId: '',
    defaultMessageKey: `ENTER`,
    inputClassName: 'custom-key-in',
    loadDefaultHotkeys() {
        hotkeys = {};
        for (const command in hotkeysCommand) {
            if (hotkeysCommand.hasOwnProperty(command)) {
                hotkeys[hotkeysCommand[command].defaultKey] = command;
            }
        }
        hotkeys[`spec-messageKey`] = this.defaultMessageKey;
    },
    loadHotkeys() {
        if (window.localStorage.getItem(`ogarioHotkeys`) !== null) {
            hotkeys = JSON.parse(window.localStorage.getItem('ogarioHotkeys'));
        } else {
            this.loadDefaultHotkeys();
        }
        if (window.localStorage.getItem(`ogarioCommands`) !== null) {
            chatCommand = JSON.parse(window.localStorage.getItem('ogarioCommands'));
        }
    },
    saveHotkeys() {
        window.localStorage.setItem('ogarioHotkeys', JSON.stringify(hotkeys));
        this.saveCommands();
    },
    saveCommands() {
        $('#hotkeys .command-in').each(function() {
            const element = $(this);
            const id = element.attr('id');
            if (chatCommand.hasOwnProperty(id)) {
                chatCommand[id] = element.val();
            }
        });
        window.localStorage.setItem(`ogarioCommands`, JSON.stringify(chatCommand));
    },
    resetHotkeys() {
        this.loadDefaultHotkeys();
        $('#hotkeys-cfg .custom-key-in').each(function() {
            const id = $(this).attr('id');
            if (hotkeysCommand[id]) {
                $(this).val(hotkeysCommand[id].defaultKey);
            }
        });
    },
    setHotkeysMenu() {
        const setup = this;
        $('#hotkeys').append(`
        <div id="hotkeys-cfg"></div>
        <div id="hotkeys-inst"><ul><li>${textLanguage['hk-inst-assign']}</li><li>${textLanguage[`hk-inst-delete`]}</li><li>${textLanguage[`hk-inst-keys`]}</li></ul>
        </div>`);
        $('#hotkeys-bottom').html(`
        <div class="input-group-row">
            <div class="input-box-cell"><div class="button b" id="reset-hotkeys"><i class="fas fa-trash-restore"></i> ${textLanguage.restoreSettings}</div></div>
            <div class="input-box-cell"><div class="button b" id="save-hotkeys"><i class="fas fa-save"></i> ${textLanguage.saveSett}</div></div>
        </div>`)
        for (const command in hotkeysCommand) {
            if (hotkeysCommand.hasOwnProperty(command)) {
                const currentCommand = hotkeysCommand[command];
                let text = '';
                for (const key in hotkeys) {
                    if (hotkeys.hasOwnProperty(key) && hotkeys[key] === command) {
                        text = key;
                        break;
                    }
                }
                if (currentCommand.type === `command`) {
                    const replaceHk = command.replace(`hk-`, '');
                    $(`#hotkeys-cfg`).append(`${`
                    <div class="hotkey-box">
                    <div class="hotkey-title"><input id="` + replaceHk + `" class="command-in" value="` + chatCommand[replaceHk] + `" maxlength="80" /></div>
                    <div class="default-key"><div>`+currentCommand.defaultKey+`</div></div>
                    <div class="custom-key"><input id="` + command + `" class="custom-key-in" value="` + text}" /></div>
                    </div>`);
                } else {
                    $('#hotkeys-cfg').append(`<div class="hotkey-box">
                    <div class="hotkey-title"><div>${currentCommand.label}</div></div>
                    <div class="default-key"><div>${currentCommand.defaultKey}</div></div>
                    <div class="custom-key"><input id="${command}" class="custom-key-in" value="${text}" /></div>
                    </div>`);
                }
            }
        }
        $(document).on('click', `#reset-hotkeys`, event => {
            event.preventDefault();
            setup.resetHotkeys();
            event.target.p = event.target.p||event.target.innerHTML
            event.target.innerHTML = textLanguage.saved
            setTimeout(()=>{
                event.target.innerHTML = event.target.p
            },500)
        });
        $(document).on(`click`, `#save-hotkeys`, event => {
            event.preventDefault();
            setup.saveHotkeys();
            event.target.p = event.target.p||event.target.innerHTML
            event.target.innerHTML = textLanguage.saved
            setTimeout(()=>{
                event.target.innerHTML = event.target.p
            },500)
        });
        $(document).on(`click`, `.hotkeys-link`, event => {
            $(`#hotkeys`).fadeIn(500);
            $(`#hotkeys-cfg`).perfectScrollbar(`update`);
            resetonkeydown();
        });
    },
    getPressedKey(key) {
        let specialKey = '';
        let normalKey = '';
        if (key.ctrlKey || key.keyCode == 17) {
            specialKey = 'CTRL';
        } else if (key.altKey || key.keyCode == 18) {
            specialKey = `ALT`;
        }
        switch (key.keyCode) {
            case 9:
                normalKey = `TAB`;
                break;
            case 13:
                normalKey = `ENTER`;
                break;
            case 16:
                normalKey = 'SHIFT';
                break;
            case 17:
                break;
            case 18:
                break;
            case 27:
                normalKey = `ESC`;
                break;
            case 32:
                normalKey = 'SPACE';
                break;
            case 37:
                normalKey = `LEFT`;
                break;
            case 38:
                normalKey = 'UP';
                break;
            case 39:
                normalKey = `RIGHT`;
                break;
            case 40:
                normalKey = `DOWN`;
                break;
            case 46:
                normalKey = `DEL`;
                break;
            case 61:
                normalKey = '=';
                break;
            case 187:
                normalKey = '=';
                break;
            case 192:
                normalKey = `TILDE`;
                break;
            default:
                normalKey = String.fromCharCode(key.keyCode);
                break;
        }
        if (specialKey !== '') {
            if (normalKey !== '') {
                return `${specialKey}+${normalKey}`;
            }
            return specialKey;
        }
        return normalKey;
    },
    deleteHotkey(name, id) {
        delete hotkeys[name];
        $(`#${id}`).val('');
    },
    setDefaultHotkey(id) {
        let key = false;
        if (hotkeysCommand[id] && !hotkeys.hasOwnProperty(hotkeysCommand[id].defaultKey)) {
            key = hotkeysCommand[id].defaultKey;
            hotkeys[key] = id;
            return key;
        }
        return key;
    },
    setHotkey(key, id) {
        if (!id || this.lastPressedKey === key && this.lastKeyId === id) {
            return;
        }
        const value = $(`#${id}`).val();
        this.deleteHotkey(value, id);
        if (key === 'DEL') {
            return;
        }
        if (hotkeys[key] && hotkeys[key] !== id) {
            const hotkey = hotkeys[key];
            const defaultKey = this.setDefaultHotkey(hotkey);
            if (defaultKey) {
                hotkeys[defaultKey] = hotkey;
                $(`#${hotkey}`).val(defaultKey);
            } else {
                this.deleteHotkey(key, hotkey);
            }
        }
        hotkeys[key] = id;
        $(`#${id}`).val(key);
        if (id === 'hk-chatMessage') {
            hotkeys[`spec-messageKey`] = key;
        }
        this.lastPressedKey = key;
        this.lastKeyId = id;
    },
    init() {
        this.loadHotkeys();
        this.setHotkeysMenu();
    }
};
document.onkeydown = event => {
    const pressKey = hotkeysSetup.getPressedKey(event);
    if (event.target.tagName === `INPUT` && event.target.className !== hotkeysSetup.inputClassName && pressKey !== hotkeys['spec-messageKey']) {
        return;
    }
    if (pressKey !== '' && !keyBlind[pressKey]) {
        keyBlind[pressKey] = true;
        if (pressKey === `ESC`) {
            event.preventDefault();
            //application && application.showMenu();
            $('#overlays').toggle()
            return;
        }
        if (event.target.className === hotkeysSetup.inputClassName) {
            event.preventDefault();
            hotkeysSetup.setHotkey(pressKey, event.target.id);
            return;
        }
        if (hotkeys[pressKey]) {
            event.preventDefault();
            const key = hotkeys[pressKey];
            if (key !== '' && hotkeysCommand[key]) {
                if (hotkeysCommand[key].keyDown) {
                    hotkeysCommand[key].keyDown();
                }
            }
        }
    }
};
document.onkeyup = event => {
    const pressedKey = hotkeysSetup.getPressedKey(event);
    if (pressedKey !== '') {
        if (hotkeys[pressedKey]) {
            const key = hotkeys[pressedKey];
            if (key !== '' && hotkeysCommand[key]) {
                if (hotkeysCommand[key].keyUp) {
                    hotkeysCommand[key].keyUp();
                }
            }
        }
        keyBlind[pressedKey] = false;
    }
};
window.onmousedown = event => {
    if (!$(`#overlays`).is(`:visible`)) {
        if (event.which == 2) {
            event.preventDefault();
            comm && comm.sendCommand(10);
        } else {
            if (settings.mouseSplit) {
                if (event.which == 1 && !settings.mouseInvert || event.which == 3 && settings.mouseInvert) {
                    event.preventDefault();
                    application && application.split();
                }
            }
            if (settings.mouseFeed) {
                if (event.which == 3 && !settings.mouseInvert || event.which == 1 && settings.mouseInvert) {
                    event.preventDefault();
                    application && application.macroFeed(true);
                }
            }
        }
    }
};
window.onmouseup = event => {
    if (settings.mouseFeed) {
        if (event.which == 3 && !settings.mouseInvert || event.which == 1 && settings.mouseInvert) {
            application && application.macroFeed(false);
        }
    }
};

window.onbeforeunload = event => {
    if (application.play) {
        return textLanguage.exit;
    } else {
        return;
    }
};

function spectateBlind() {
    window.onkeydown = event => {
        81 == event.keyCode && window.application && window.application.sendFreeSpectate();
    };
    window.onkeyup = event => {};
}
spectateBlind()
hotkeysSetup.init()



        /*Array.prototype.slice.call(document.querySelectorAll(`.js-switch`)).forEach(event => {
            const SwitchVanillaOption = new Switchery(event, {
                color: theme.menuMainColor,
                size: 'small'
            });
        });*/

        /*$('input[type="range"]').rangeslider({
            polyfill: false
        });*/

        OverlayScrollbars(document.querySelectorAll(".scrollable"), {
            scrollbars : {
                visibility       : "visible",
                autoHide         : "leave",
                autoHideDelay    : 10
            }
        });