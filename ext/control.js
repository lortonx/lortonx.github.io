

const eventify = (self) => {
    self.events = {}

    self.on = function (event, listener) {
        if (typeof self.events[event] !== 'object') {
            self.events[event] = []
        }

        self.events[event].push(listener)
    }

    self.removeListener = function (event, listener) {
        let idx

        if (typeof self.events[event] === 'object') {
            idx = self.events[event].indexOf(listener)

            if (idx > -1) {
                self.events[event].splice(idx, 1)
            }
        }
    }

    self.emit = function (event) {
        var i, listeners, length, args = [].slice.call(arguments, 1);

        if (typeof self.events[event] === 'object') {
            listeners = self.events[event].slice()
            length = listeners.length

            for (i = 0; i < length; i++) {
                listeners[i].apply(self, args)
            }
        }
    }

    self.once = function (event, listener) {
        self.on(event, function g () {
            self.removeListener(event, g)
            listener.apply(self, arguments)
        })
    }
}



const Settings = {
    menuMainColorCSS: null,
    menuPanelColorCSS: null,
    menuTextlColorCSS: null,
    menuButtonsCSS: null,
    hudCSS: null,
    chatCSS: null,
    chatScaleCSS: null,
    cursorCSS: null,
    customMapTextureCanvas:{},
    customMapTextureLogo:{},
    loadThemeSettings() {
        let storage = null;
        if (window.localStorage.getItem('ogarioThemeSettings') !== null) {
            storage = JSON.parse(window.localStorage.getItem('ogarioThemeSettings'));
        }
        for (const option in theme) {
            if (theme.hasOwnProperty(option)) {
                if (storage && storage.hasOwnProperty(option)) {
                    theme[option] = storage[option];
                }
                if (tempsett.hasOwnProperty(option)) {
                    tempsett[option] = gameSetupTheme[option];
                }
            }
        }
    },
    saveThemeSettings() {
        window.localStorage.setItem(`ogarioThemeSettings`, JSON.stringify(theme));
    },
    restoreThemeSettings() {
        if (window.localStorage.getItem(`ogarioThemeSettings`) !== null) {
            window.localStorage.removeItem('ogarioThemeSettings');
            window.location.reload();
        }
    },
    addCustomCSS(name, css) {
        if (!this[name]) {
            this[name] = $(`<style type='text/css'>`).appendTo('head');
        }
        this[name].html(css);
    },
    addPresetBox(id, name, options, value, callback) {
        $(id).append(`<div class="preset-box"
        <span class="title-box">` + textLanguage[name] + `</span>
        <div class="input-group"><select id="` + name + `" class="form-control"></select>
        </div>
        </div>`);
        for (const option in options) {
            if (options.hasOwnProperty(option)) {
                $(`#${name}`).append(`<option value="${option}">${options[option].name}</option>`);
        }
    }
    $(`#${name}`).val(theme[value]);
    const app = this;
    $(`#${name}`).on(`change`, function() {
        const optionValue = this.value;
        theme[value] = optionValue;
        app[callback](optionValue);
    });
    },
    addColorBox(id, name, callback) {
        $(id).append(`<div class="setting-box">
            <span class="title">`+textLanguage[name]+`</span>
            <div class="input-group ${name}-picker">
                <input type="text" value="${theme[name]}" id="${name}" class="input"/>
                <span class="input colorpicker-input-addon"><i></i></span>
            </div>
        </div>`);
            const app = this;
            $(`${id} .${name}-picker`).colorpicker({
                format: `hex`,
            }).on(`change`, event => {
                theme[name] = event.value//event.color.toHex();
                if (tempsett.hasOwnProperty(name)) {
                    tempsett[name] = theme[name];
                }
                if (callback) app[callback]();
            });
        
    },
    addRgbaColorBox(id, name, callback) {
            $(id).append(`<div class="setting-box">
                <span class="title">`+textLanguage[name]+`</span>
                <div class="input-group ${name}-picker">
                    <input type="text" value="${theme[name]}" id="${name}" class="input"/>
                    <span class="input colorpicker-input-addon"><i></i></span>
                </div>
            </div>`);
             
            const app = this;
            $(`${id} .${name}-picker`).colorpicker({
                format: `rgba`
            }).on('change', event => {
                console.log(event.value)
                theme[name] = event.value//`rgba(${color.r},${color.g},${color.b},${color.a})`;
                if (tempsett.hasOwnProperty(name)) {
                    tempsett[name] = theme[name];
                }
                if (callback) app[callback]();
            });
       
    },
    addSliderBoxT(id, name, min, max, step, callback) {
        $(id).append(`<div class="slider-box">
        <span class="title">`+textLanguage[name]+`:</span>
        <span id="${name}-value" class="value">${theme[name]}</span>
        <div class="input-group">
            <input id="${name}-slider" type="range" min="${min}" max="${max}" step="${step}" value="${theme[name]}">
        </div></div>`);
        if (callback) {
            const app = this;
            $(`#${name}-slider`).on(`input`, function() {
                const parse = parseFloat($(this).val());
                $(`#${name}-value`).text(parse);
                theme[name] = parse;
                /*if (ogario.hasOwnProperty(name)) {
                    ogario[name] = parse;
                }*/
                app[callback]();
            });
        } else {
            $(`#${name}-slider`).on('input', function() {
                const parse = parseFloat($(this).val());
                $(`#${name}-value`).text(parse);
                theme[name] = parse;
                /*if (ogario.hasOwnProperty(name)) {
                    ogario[name] = parse;
                }*/
            });
        }
    },
    addInputBoxT(id, name, holder, callback) {
        $(id).append(`${`<div class="input-box">
            <span class="title">` + textLanguage[name] + `</span>
                <div class="input-group">
                    <input id="` + name + `" class="" placeholder="` + holder}" value="${theme[name]}" />
                </div>
        </div>`);
        const app = this;
        $(`#${name}`).on(`input`, function() {
            theme[name] = this.value;
            app[callback]();
        });
    },
    addCursorBox(id, url) {
        if (url === theme.customCursor) {
            $(id).append(`<div class="cursor-box"><div class="active"><img src="` + url + `"></a></div>`);
        } else {
            $(id).append(`<div class="cursor-box"><div><img src="` + url + `"></a></div>`);
        }
    },
    setFont(name, fontFamily) {
        theme[name] = fontFamily;
        theme[`${name}Family`] = this.setFontFamily(fontFamily);
        theme[name + `Weight`] = this.setFontWeight(fontFamily);
        /*if (ogario.hasOwnProperty(name + `Family`)) {
            ogario[name + `Family`] = theme[name + `Family`];
        }
        if (ogario.hasOwnProperty(`${name}Weight`)) {
            ogario[`${name}Weight`] = theme[`${name}Weight`];
        }*/
    },
    addFontBox(id, name, callback) {
        const app = this;
        $(id).append(`${`<div class="font-box"><span class="title">` + textLanguage[name]}</span>
        <div class="input-group"><select id="${name}" class="form-control">
            <option value="ubuntu">Ubuntu</option><option value="ubuntu-bold">Ubuntu Bold</option>
            <option value="roboto">Roboto</option><option value="roboto-bold">Roboto Bold</option>
            <option value="oswald">Oswald</option><option value="oswald-bold">Oswald Bold</option>
            <option value="press">Press Start 2P</option>
            <option value="pacifico">Pacifico</option>
            <option value="vcr">VCR OSD</option>
                 
        </select></div></div>`);
        $(`#${name}`).val(theme[name]).on('change', function() {
            const value = this.value;
            app.setFont(name, value);
            if (callback) app[callback]();
        });
    },
    setFontFamily(name) {
        if (name.indexOf(`roboto`) != -1) {
            return `Roboto`;
        } else if (name.indexOf(`oswald`) != -1) {
            return `Oswald`;
        }
        else if (name.indexOf(`press`) != -1) {
            return `'Press Start 2P'`;
        }
        else if (name.indexOf(`pacifico`) != -1) {
            return `'Pacifico'`;
        }
        else if (name.indexOf(`vcr`) != -1) {
            return `'VCR OSD Mono'`;
        }
         else {
            return 'Ubuntu';
        }
    },
    setFontWeight(name) {
        if (name.indexOf(`bold`) != -1) {
            return 700;
        }
        return 400;
    },
    loadSettings() {
        let data = null;
        if (window.localStorage.getItem(`ogarioSettings`) !== null) {
            data = JSON.parse(window.localStorage.getItem(`ogarioSettings`));
        }
        for (const option in settings) {
            if (settings.hasOwnProperty(option)) {
                if (data && data.hasOwnProperty(option)) {
                    settings[option] = data[option];
                }
                
                /*if (Connection.hasOwnProperty(option)) {
                    Connection[option] = settings[option];
                }*/
            }
        }
    },
    saveSettings(option, name) {
        window.localStorage.setItem(name, JSON.stringify(option));
    },
    exportSettings() {
        let options = {
            ogarioCommands: chatCommand,
            ogarioHotkeys: hotkeys,
            ogarioPlayerProfiles: profiles,
            ogarioSettings: settings,
            ogarioThemeSettings: theme
        };
        for (const option in options) {
            if (options.hasOwnProperty(option)) {
                const checked = $(`#export-` + option).prop(`checked`);
                if (!checked) {
                    delete options[option];
                }
            }
        }
        options = JSON.stringify(options);
        $(`#export-settings`).val(options);
        $(`#import-settings`).val('');
        options = null;
    },
    importSettings() {
        $(`#import-settings`).blur();
        let importValue = $(`#import-settings`).val();
        if (importValue) {
            importValue = JSON.parse(importValue);
            for (const value in importValue) {
                if (importValue.hasOwnProperty(value)) {
                    const checked = $(`#import-` + value).prop(`checked`);
                    if (!checked) {
                        continue;
                    }
                    window.localStorage.setItem(value, JSON.stringify(importValue[value]));
                }
            }
            window.location.reload();
        }
    },
    restoreSettings() {
        if (window.localStorage.getItem('ogarioSettings') !== null) {
            window.localStorage.removeItem(`ogarioSettings`);
            window.location.reload();
        }
    },
    addOption(id, name, text, checked) {
    /*    $(id).append(`<div class="option-box">
        <div class="input-group ${name}-picker">
        <label><input type="checkbox" id="${name}" class="js-switch"> ${text}</label>
        </div>
    </div>`)*/
    $(id).append(`<div class="option-box">
    <label class="input-group"  for="${name}">
    <label class="switch">
        <input id="${name}" type="checkbox">
        <span class="slider round"></span>
    </label>
    ${text}
    </label>
    </div>`)
    .on('change',function(){
            settings[name] = this.value;
            app.saveSettings(settings, `ogarioSettings`);
        })
        //$(id).append(`<label><input type="checkbox" id="${name}" class="js-switch"> ${text}</label>`);
        //$(`#${name}`).prop(`checked`, checked);
        
    },
    addOptions(options, section) {
        const app = this
        if (!options) {
            return;
        }
        $('#og-options').append(`${`<div class="options-box ` + section}"><div class="option-title menu-main-color">${textLanguage[section]}</div></div>`);

        for (const option of options) {
            if (settings.hasOwnProperty(option)) {
                /*$(`.${section}`).append(`<div class="option-box">
                <label class="title"><input ${settings[option]?'checked="checked"':''} type="checkbox" id="${option}" class="js-switch"> ${textLanguage[option]}</label>
                </div>
            </div>`)*/
            $(`.${section}`).append(`<label for="${option}" class="option-box">
            <label class="switch">
            <input id="${option}" ${settings[option]?'checked="checked"':''} type="checkbox">
            <span class="slider round"></span>
            </label>
            ${textLanguage[option]}
            </label>`)

            /*$('#'+option).on('change',function(){
                settings[option] = this.checked;
                app.saveSettings(settings, `ogarioSettings`);
            });*/
            //$('#'+option).prop(`checked`, settings[option]);
            }
        }
    },
    addSelectBox(id, name, options, value, callback) {
        $(id).append(`<div class="preset-box"><span class="title-box">` + textLanguage[name] + `</span><div class="select-wrapper"><select id="` + name + `" class="form-control"></select></div></div>`);
        for (const option in options) {
            if (options.hasOwnProperty(option)) {
                $(`#${name}`).append(`${`<option value="` + option}">${options[option].name}</option>`);
            }
        }
        $(`#${name}`).val(settings[value]);
        const app = this;
        $(`#${name}`).on(`change`, function() {
            const optionValue = this.value;
            settings[value] = optionValue;
            app[callback](optionValue);
        });
    },
    addInputBox(id, name, holder, callback) {
        //$(id).append(`${`<div class="input-box"><span class="title-box">` + textLanguage[name]}</span><input id="${name}" class="form-control" placeholder="${holder}" value="${settings[name]}" /></div>`);
        $(id).append(`${`<div class="input-box">
        <span class="title">` + textLanguage[name] + `</span>
            <div class="input-group">
                <input id="` + name + `" class="" placeholder="` + holder}" value="${settings[name]}" />
            </div>
    </div>`);
        
        const app = this;
        $(`#${name}`).on(`input`, function() {
            settings[name] = this.value;
            app[callback]();
            app.saveSettings(settings, `ogarioSettings`);
        });
    },
    addSliderBox(id, name, min, max, step, callback) {
        //$(id).append(`${`<div class="slider-box"><div class="box-label"><span class="value-label">` + textLanguage[name] + `: </span><span id="` + name}-value" class="value">${settings[name]}</span></div><input id="${name}-slider" type="range" min="${min}" max="${max}" step="${step}" value="${settings[name]}"></div>`);
        $(id).append(`<div class="slider-box">
            <span class="title">`+textLanguage[name]+`:</span>
            <span id="${name}-value" class="value">${settings[name]}</span>
            <div class="input-group">
                <input id="${name}-slider" type="range" min="${min}" max="${max}" step="${step}" value="${settings[name]}">
            </div></div>`);
        const app = this;

            $(`#${name}-slider`).on(`input`, function() {
                const parse = parseFloat($(this).val());
                $(`#${name}-value`).text(parse);
                settings[name] = parse;
                if (callback) app[callback]();
                app.saveSettings(settings, `ogarioSettings`);
            });

    },
    setSettingsMenu(){
        const app = this;
        this.addOptions([], `animationGroup`);
        this.addOptions(['autoZoom'], `zoomGroup`);
        this.addOptions([`quickResp`, `autoResp`], `respGroup`);
        this.addOptions(['virusSounds','stickyCell','debug','mapLocalFix3','mapGlobalFix4','experimental1'], `newGroup`);
        
        this.addOptions(['noNames', `optimizedNames`, `autoHideNames`, `hideMyName`, `hideTeammatesNames`, `namesStroke`], `namesGroup`);
        this.addOptions(['showMass', `optimizedMass`, `autoHideMass`, `hideMyMass`, 'hideEnemiesMass', `shortMass`, `virMassShots`, `massStroke`], `massGroup`);
        this.addOptions([`customSkins`, 'vanillaSkins'], 'skinsGroup');
        this.addOptions([`optimizedFood`, 'autoHideFood', 'autoHideFoodOnZoom', `rainbowFood`], `foodGroup`);
        this.addOptions([`myCustomColor`, 'myTransparentSkin', `transparentSkins`, 'transparentCells', 'transparentViruses'], `transparencyGroup`);
        this.addOptions([`showGrid`, `showBgSectors`, `showMapBorders`], `gridGroup`);
        this.addOptions([`disableChat`, 'chatSounds', `chatEmoticons`, `showChatImages`, `showChatVideos`, `showChatBox`], `chatGroup`);
        this.addOptions(['showMiniMap', `showMiniMapGrid`, `showMiniMapGuides`,'showMiniMapGhostCells', `oneColoredTeammates`], `miniMapGroup`);
        this.addOptions([`oppColors`, `oppRings`, 'virColors', `splitRange`, `virusesRange`, `cursorTracking`, 'teammatesInd', 'showGhostCells'], `helpersGroup`);
        this.addOptions([`mouseSplit`, 'mouseFeed', `mouseInvert`], `mouseGroup`);
        this.addOptions([`showTop5`, 'showTop5Sectors', 'showTargeting', `showLbData`, 'centeredLb', `normalLb`, `fpsAtTop`], `hudGroup`);
        this.addOptions(['showStats', `showStatsMass`, `showStatsSTE`, 'showStatsN16', `showStatsFPS`,`showStatsPPS`, `showTime`], `statsGroup`);
        this.addSliderBox(`.newGroup`, `leaderboardLength`, 5, 30, 5);
        this.addSliderBox(`.newGroup`, `renderQuality`, 0.5, 1.75, 0.25);
        $(`#renderQuality-slider`).on(`change`, function() {
            drawRender.setCanvas()
            drawRender.resizeCanvas()                    
        })
        this.addSliderBox(`.newGroup`, `cameraDelay`, 0, 15, 1);
        this.addSliderBox(`.newGroup`, `zoomSmoothness`, 5, 30, 1);
        this.addSliderBox(`.newGroup`, `macroFeeding`, 10, 160, 10);

        this.addSliderBox(`.animationGroup`, `animation`, 40, 200, 1);
        this.addSliderBox(`.zoomGroup`, `zoomSpeedValue`, 0.75, 0.99, 0.01);
        $(`#og-settings`).append(`<button class="btn btn-block btn-success btn-export">` + textLanguage.exportImport + `</button>`);
        $(`#og-settings`).append(`<div class="restore-settings"><a href="#">` + textLanguage.restoreSettings + `</a></div>`);
        $(`#music`).append(`<div class="agario-panel sounds-panel"><h5 class="menu-main-color">` + textLanguage.sounds + `</h5></div>`);

        this.addInputBox(`.sounds-panel`, `messageSound`, 'Sound URL', 'setMessageSound');
        this.addInputBox('.sounds-panel', 'commandSound', `Sound URL`, `setCommandSound`);
        this.addInputBox('.sounds-panel', 'virusSoundURL', `Sound URL`, `setVirusSound`);

        $(document).on(`change`, `#og-options input[type='checkbox']`, function() {
            const option = $(this);
            app.setSettings(option.attr('id'), option.prop(`checked`));
        });
    },
    setThemeMenu() {
        const app = this;
        //$(`#theme`).append(`<ul class="submenu-tabs"><li class="theme-main-tab active"><a href="#theme-main" class="active ogicon-paint-format" data-toggle="tab-tooltip" title="${textLanguage.basicTheming}"></a></li><li class="theme-menu-tab"><a href="#theme-menu" class="ogicon-menu" data-toggle="tab-tooltip" title="${textLanguage.menuTheming}"></a></li><li class="theme-hud-tab"><a href="#theme-hud" class="ogicon-display" data-toggle="tab-tooltip" title="${textLanguage.hudTheming}"></a></li><li class="theme-chat-tab"><a href="#theme-chat" class="ogicon-bubbles" data-toggle="tab-tooltip" title="${textLanguage.chatTheming}"></a></li><li class="theme-minimap-tab"><a href="#theme-minimap" class="ogicon-location2" data-toggle="tab-tooltip" title="${textLanguage.miniMapTheming}"></a></li><li class="theme-images-tab"><a href="#theme-images" class="ogicon-compass" data-toggle="tab-tooltip" title="${textLanguage.imagesTheming}"></a></li></ul><div id="theme-main" class="submenu-panel"></div><div id="theme-menu" class="submenu-panel"></div><div id="theme-hud" class="submenu-panel"></div><div id="theme-chat" class="submenu-panel"></div><div id="theme-minimap" class="submenu-panel"></div><div id="theme-images" class="submenu-panel"></div>`);
        this.addPresetBox(`#theme-main`, `themePreset`, themePresets, `preset`, `changeThemePreset`);
        this.addColorBox('#theme-main', `bgColor`, `setBgColor`);
        this.addColorBox(`#theme-main`, `bordersColor`);
        this.addColorBox(`#theme-main`, `gridColor`);
        this.addColorBox('#theme-main', `sectorsColor`);
        this.addColorBox(`#theme-main`, 'namesColor');
        this.addColorBox('#theme-main', `namesStrokeColor`);
        this.addColorBox(`#theme-main`, `massColor`);
        this.addColorBox(`#theme-main`, `massStrokeColor`);
        this.addColorBox(`#theme-main`, `virusColor`);
        this.addColorBox(`#theme-main`, `virusStrokeColor`);
        this.addColorBox(`#theme-main`, 'foodColor', `setFoodColor`);
        this.addColorBox(`#theme-main`, `teammatesIndColor`, 'setIndicatorColor');
        this.addColorBox(`#theme-main`, `cursorTrackingColor`);
        this.addColorBox(`#theme-main`, `splitRangeColor`);
        this.addColorBox('#theme-main', `safeAreaColor`);
        this.addColorBox(`#theme-main`, `dangerAreaColor`);
        this.addColorBox('#theme-main', 'ghostCellsColor');
        this.addFontBox(`#theme-main`, 'namesFont');
        this.addFontBox(`#theme-main`, `massFont`);
        this.addFontBox(`#theme-main`, `sectorsFont`);
        this.addSliderBoxT(`#theme-main`, `sectorsFontSize`, 200, 2000, 10);
        this.addSliderBoxT(`#theme-main`, `namesScale`, 0.5, 2, 0.1);
        this.addSliderBoxT(`#theme-main`, `massScale`, 1, 5, 1);
        this.addSliderBoxT(`#theme-main`, `virMassScale`, 1, 5, 1);
        this.addSliderBoxT('#theme-main', 'strokeScale', 1, 4, 0.1);
        this.addSliderBoxT(`#theme-main`, 'foodSize', 1, 50, 1, `setFoodColor`);
        this.addSliderBoxT(`#theme-main`, `virusStrokeSize`, 2, 40, 1);
        this.addSliderBoxT('#theme-main', `bordersWidth`, 2, 200, 2);
        this.addSliderBoxT(`#theme-main`, `sectorsWidth`, 2, 200, 2);
        this.addSliderBoxT(`#theme-main`, `cellsAlpha`, 0.01, 0.99, 0.01);
        this.addSliderBoxT(`#theme-main`, `skinsAlpha`, 0.01, 0.99, 0.01);
        this.addSliderBoxT('#theme-main', `virusAlpha`, 0, 1, 0.01);
        this.addSliderBoxT(`#theme-main`, 'textAlpha', 0.1, 1, 0.01);

        this.addPresetBox(`#theme-menu`, 'menuPreset', themePresets, `menuPreset`, 'changeMenuPreset');
        this.addSliderBoxT(`#theme-menu`, `menuOpacity`, 0.1, 1, 0.01, `setMenuOpacity`);
        this.addColorBox(`#theme-menu`, `menuMainColor`, `setMenuMainColor`);
        this.addColorBox(`#theme-menu`, `menuBtnTextColor`, `setMenuButtons`);
        this.addColorBox(`#theme-menu`, `menuPanelColor`, `setMenuPanelColor`);
        this.addColorBox('#theme-menu', `menuPanelColor2`, `setMenuPanelColor`);
        this.addColorBox(`#theme-menu`, `menuTextColor`, `setMenuTextColor`);
        this.addColorBox(`#theme-menu`, 'menuTextColor2', `setMenuTextColor`);
        this.addColorBox(`#theme-menu`, `btn1Color`, `setMenuButtons`);
        this.addColorBox(`#theme-menu`, `btn1Color2`, `setMenuButtons`);
        this.addColorBox(`#theme-menu`, 'btn2Color', `setMenuButtons`);
        this.addColorBox(`#theme-menu`, `btn2Color2`, `setMenuButtons`);
        this.addColorBox(`#theme-menu`, `btn3Color`, 'setMenuButtons');
        this.addColorBox(`#theme-menu`, `btn3Color2`, `setMenuButtons`);
        this.addColorBox(`#theme-menu`, `btn4Color`, `setMenuButtons`);
        this.addColorBox(`#theme-menu`, `btn4Color2`, `setMenuButtons`);
        this.addInputBox(`#theme-menu`, `menuBg`, `Image URL`, `setMenuBg`);

        this.addColorBox(`#theme-hud`, `hudMainColor`, `setHudColors`);
        this.addRgbaColorBox(`#theme-hud`, 'hudColor', 'setHudColors');
        this.addColorBox(`#theme-hud`, 'hudTextColor', 'setHudColors');
        this.addColorBox('#theme-hud', `statsHudColor`, `setHudColors`);
        this.addColorBox(`#theme-hud`, `timeHudColor`, 'setHudColors');
        this.addColorBox(`#theme-hud`, `top5MassColor`, `setHudColors`);
        this.addColorBox(`#theme-hud`, `lbMeColor`, 'setHudColors');
        this.addColorBox(`#theme-hud`, `lbTeammateColor`, `setHudColors`);
        this.addFontBox(`#theme-hud`, `hudFont`, `setHudFont`);
        this.addSliderBoxT('#theme-hud', 'hudScale', 0.5, 2, 0.01, `setHudScale`);

        this.addRgbaColorBox('#theme-chat', `messageColor`, `setChatColors`);
        this.addColorBox(`#theme-chat`, `messageTextColor`, 'setChatColors');
        this.addColorBox(`#theme-chat`, `messageTimeColor`, `setChatColors`);
        this.addColorBox('#theme-chat', `messageNickColor`, `setChatColors`);
        this.addRgbaColorBox(`#theme-chat`, `commandsColor`, 'setChatColors');
        this.addColorBox('#theme-chat', `commandsTextColor`, 'setChatColors');
        this.addColorBox(`#theme-chat`, `commandsTimeColor`, 'setChatColors');
        this.addColorBox(`#theme-chat`, `commandsNickColor`, `setChatColors`);
        this.addRgbaColorBox(`#theme-chat`, `chatBoxColor`, `setChatColors`);
        this.addSliderBoxT(`#theme-chat`, `chatScale`, 1, 2, 0.01, `setChatScale`);

        this.addColorBox(`#theme-minimap`, `miniMapSectorsColor`, `setMiniMapSectorsColor`);
        this.addColorBox(`#theme-minimap`, `miniMapSectorColor`);
        this.addColorBox(`#theme-minimap`, `miniMapNickColor`);
        this.addColorBox(`#theme-minimap`, `miniMapNickStrokeColor`);
        this.addColorBox(`#theme-minimap`, `miniMapMyCellColor`);
        this.addColorBox(`#theme-minimap`, `miniMapMyCellStrokeColor`);
        this.addColorBox(`#theme-minimap`, `miniMapTeammatesColor`);
        this.addColorBox(`#theme-minimap`, `miniMapDeathLocationColor`);
        this.addColorBox(`#theme-minimap`, `miniMapGuidesColor`);
        this.addColorBox('#theme-minimap', 'miniMapGhostCellsColor');
        this.addFontBox(`#theme-minimap`, `miniMapFont`, `setMiniMapFont`);
        this.addFontBox(`#theme-minimap`, 'miniMapNickFont');
        this.addSliderBoxT('#theme-minimap', 'miniMapWidth', 200, 400, 2, 'setMiniMapWidth');
        this.addSliderBoxT(`#theme-minimap`, `miniMapSectorsOpacity`, 0, 1, 0.01, `setMiniMapSectorsOpacity`);
        this.addSliderBoxT(`#theme-minimap`, `miniMapNickSize`, 8, 16, 1);
        this.addSliderBoxT(`#theme-minimap`, `miniMapNickStrokeSize`, 0, 6, 1);
        this.addSliderBoxT(`#theme-minimap`, `miniMapMyCellSize`, 4, 10, 0.5);
        this.addSliderBoxT(`#theme-minimap`, `miniMapMyCellStrokeSize`, 0, 10, 1);
        this.addSliderBoxT(`#theme-minimap`, 'miniMapTeammatesSize', 4, 10, 0.5);
        this.addSliderBoxT('#theme-minimap', 'miniMapGhostCellsAlpha', 0.01, 0.99, 0.01);

        this.addInputBoxT(`#theme-images`, `customMapTexture`, `Image URL`, `setCustomMapTexture`);
        this.addInputBoxT(`#theme-images`, `customMapLogo`, `Image URL`, `setCustomMapLogo`);
        this.addInputBoxT(`#theme-images`, `customBackground`, `Image URL`, `setCustomBackground`);
        this.addInputBoxT(`#theme-images`, `customCursor`, `Cursor image URL`, 'setCustomCursor');
        const cursorUrl = `https://cdn.ogario.ovh/static/img/cursors/cursor_`;
        for (let length = 0; length < 35; length++) {
            if (length < 9) {
                this.addCursorBox(`#theme-images`, `${cursorUrl}0${length + 1}.cur`);
                continue;
            }
            this.addCursorBox(`#theme-images`, `${cursorUrl}${length + 1}.cur`);
        }
        $(document).on(`click`, `#theme-images .cursor-box div`, function(event) {
            event.preventDefault();
            const url = $(`img`, this).attr(`src`);
            theme.customCursor = url;
            app.setCustomCursor();
            $(`#customCursor`).val(url);
            $(`#theme-images .cursor-box div`).removeClass(`active`);
            $(this).addClass(`active`);
        });

        $('#theme-bottom').html(`
        <div class="input-group-row">
            <div class="input-box-cell"><div class="button b" id="reset-theme"><i class="fas fa-trash-restore"></i> ${textLanguage.restoreThemeSettings}</div></div>
            <div class="input-box-cell"><div class="button b" id="save-theme"><i class="fas fa-save"></i> ${textLanguage.saveSett}</div></div>
        </div>`)



        $(document).on('click', `#save-theme`, function(event) {
            event.preventDefault();
            app.saveThemeSettings();
            event.target.p = event.target.p||event.target.innerHTML
            event.target.innerHTML = textLanguage.saved
            setTimeout(()=>{
                event.target.innerHTML = event.target.p
            },500)
        });

        $(document).on(`click`, `#reset-theme`, event => {
            event.preventDefault();
            app.restoreThemeSettings();
        });
        $(`.skin`).colorpicker({
            format: `hex`,
            input: `#color`
        });
    },
    changePreset(presetName, presets) {
        if (presets[presetName]) {
            //presets[presetName] = presetName;
            var _theme = presets[presetName];
        } else {
            return;
        }

        for (const name in _theme) {

            if (theme.hasOwnProperty(name) /*&& presets.hasOwnProperty(name)*/) {
                
                theme[name] = _theme[name];
                /*if (ogario.hasOwnProperty(name)) {
                    ogario[name] = theme[name];
                }*/
                console.log(name)
                //if ($(`#theme .` + name + `-picker`)) {
                    $(`#theme .` + name + `-picker`).colorpicker(`setValue`, theme[name]);
                    $(`.` + name + `-picker i`).css('background',theme[name])
                //}
                //if ($(`#${name}-slider`)) {
                    $(`#${name}-slider`).val(theme[name]).change()
                    $(`#${name}-value`).text(theme[name])
                //}
                //if ($(`input[type=text]#${name}`) || $(`select#` + name)) {
                    $(`#${name}`).val(theme[name]);
                //}
            }
        }
    },
    changeThemePreset(name) {
        this.changePreset(name, themePresets);
        this.setTheme();
    },
    setFonts() {
        this.setFont(`namesFont`, theme.namesFont);
        this.setFont('massFont', theme.namesFont);
        this.setFont('sectorsFont', theme.sectorsFont);
    },
    setBgColor() {
        $(`body`).css('background-color', theme.bgColor);
    },
    setFoodColor() {
        if (!settings.optimizedFood) {
            return;
        }
        drawRender && drawRender.preDrawPellet();
    },
    setIndicatorColor() {
        drawRender && drawRender.preDrawIndicator();
    },
    setCustomBackground() {
        if (theme.customBackground) {
            $('body').css(`background-image`, `${`url(` + theme.customBackground})`);
        } else {
            $('body').css('background-image', `none`);
        }
    },
    setCustomMapTexture() {
        if (theme.customMapTexture) {
            Settings.customMapTextureCanvas = new Image()
            Settings.customMapTextureCanvas.onload = function(){this.complet = true}
            Settings.customMapTextureCanvas.src = theme.customMapTexture
        } else {
            Settings.customMapTextureCanvas = {}
        }
    },
    setCustomMapLogo() {
        if (theme.customMapLogo) {
            Settings.customMapLogoCanvas = new Image()
            Settings.customMapLogoCanvas.onload = function(){this.complet = true}
            Settings.customMapLogoCanvas.src = theme.customMapLogo
        } else {
            Settings.customMapLogoCanvas = {}
        }
    },
    setCustomCursor() {
        if (theme.customCursor) {
            var css = `*{cursor:url(` + theme.customCursor + `), auto !important}`;
        } else {
            var css = '*{cursor: auto}';
        }
        this.addCustomCSS(`cursorCSS`, css);
    },
    setMenu() {
        this.setMenuOpacity();
        this.setMenuMainColor();
        this.setMenuPanelColor();
        this.setMenuTextColor();
        this.setMenuButtons();
        this.setMenuBg();
    },
    changeMenuPreset(name) {
        this.changePreset(name, themePresets);
        this.setMenu();
    },
    setMenuOpacity() {
        $('#helloContainer').css('opacity', theme.menuOpacity);
    },
    setMenuMainColor() {
        const css = `
        ::-moz-selection {
            background-color: ` + theme.menuMainColor + `!important
        }
        
        ::selection {
            background-color: ` + theme.menuMainColor + `!important
        }
        
        .tab-button.active,
        .tab-button:hover,
        .option-title
        {
            color: ` + theme.menuMainColor + ` !important;
        }
        .rangeslider__fill,
        .ps-scrollbar-y,
        .os-theme-dark>.os-scrollbar>.os-scrollbar-track>.os-scrollbar-handle,
        input:checked + .slider {
            background-color: ` + theme.menuMainColor + `!important
        }`;
        this.addCustomCSS(`menuMainColorCSS`, css);
    },
    setMenuPanelColor() {
        const css = `
            .BG,
            .input-group select option,
            .input-group-row .input-box-cell select option
            {
                background-color: ` + theme.menuPanelColor + ` !important
            }

            .tabs {
                background-color: ` + theme.menuPanelColor2 + ` !important
            }

            
        `;
        this.addCustomCSS('menuPanelColorCSS', css);
    },
    setMenuTextColor() {
        const css = `
        .custom-key-in,
        .command-in,
        .container,
        .rangeslider__handle,
        .rangeslider--horizontal{
            color: ` + theme.menuTextColor + ` !important
        }
        .options-box{
            outline-color:` + theme.menuTextColor + ` !important
        }
        .input-group input,
        .input-group select,
        .input-group-row .input-box-cell,
        .input-group-row .input-box-cell input,
        .input-group-row .input-box-cell select {
            color: ` + theme.menuTextColor + ` !important
        }
        
        ::-webkit-input-placeholder {
            color: ` + theme.menuTextColor2 + ` !important
        }
        ::-moz-placeholder {
            color: ` + theme.menuTextColor2 + ` !important
        }

        
        input[type="range"]::-webkit-slider-thumb,
        .slider:before{
            background-color: ` + theme.menuTextColor + ` !important
        }
        `;
        this.addCustomCSS(`menuTextColorCSS`, css);
    },
    setMenuButtons() {
        const css = `
            a,
            a:hover {
                --color: `+theme.btn1Color+`
            }
        }
        
        .button.a {
            background-color: ${theme.btn2Color} !important;
        }
        .button.a:active,
        .button.a:disabled,
        .button.a:focus,
        .button.a:hover {
            background-color: `+theme.btn2Color2+` !important;
        }

        .button.b {
            background-color: ${theme.btn1Color} !important;
        }
        .button.b:active,
        .button.b:disabled,
        .button.b:focus,
        .button.b:hover {
            background-color: `+theme.btn1Color2+` !important;
        }

        .button.c {
            background-color: ${theme.btn3Color} !important;
        }
        .button.c:active,
        .button.c:disabled,
        .button.c:focus,
        .button.c:hover {
            background-color: `+theme.btn3Color2+` !important;
        }

        .button.d {
            background-color: ${theme.btn4Color} !important;
        }
        .button.d:active,
        .button.d:disabled,
        .button.d:focus,
        .button.d:hover {
            background-color: `+theme.btn4Color2+` !important;
        }
        
        .tabs,
        .button.a,
        .button.b,
        .button.c,
        .button.d{
            color: ${theme.menuBtnTextColor} !important;
        }

        

        #hotkeys-cfg .custom-key-in {
            background-color: ${theme.btn4Color2}
            border-color:${theme.btn4Color2}
        }
        `;
        this.addCustomCSS(`menuButtonsCSS`, css);
    },
    setMenuBg() {
        $(`#menuBg`).val(theme.menuBg);
        if (theme.menuBg) {
            //$('.BG').css(`background`, 'url('+theme.menuBg+'), '+theme.menuPanelColor);
            $('.BG').css(`background-image`, `${`url(` + theme.menuBg})`);
        } else {
            //$('.BG').css(`background`, (theme.menuBg?'url('+theme.menuBg+'), ':'')+theme.menuPanelColor);
            $('.BG').css(`background-image`, `none`);
        }
    },


    /**hh */
    setSettings(id, checked) {
        if (settings.hasOwnProperty(id) && checked !== null) {
            settings[id] = checked;
            if (tempsett.hasOwnProperty(id)) {
                tempsett[id] = checked;
            }
            switch (id) {
                case `autoResp`:
                    //this.setAutoResp();
                    break;
                case `showMiniMap`:
                    this.setMiniMap();
                    break;
                case `showMiniMapGrid`:
                    this.resetMiniMapSectors();
                    break;
                case `disableChat`:
                    this.setDisableChat();
                    break;
                case `chatSounds`:
                    this.setChatSoundsBtn();
                    break;
                case 'showChatBox':
                    this.setShowChatBox();
                    break;
                case `showTop5`:
                    this.setTop5();
                    break;
                case 'showTargeting':
                    this.setTargetingHUD();
                    break;
                case `showTime`:
                    this.displayTime();
                    $('#time-hud').show();
                    break;
                case `centeredLb`:
                    this.setCenteredLb();
                    break;
                case 'normalLb':
                    this.setNormalLb();
                    break;
                case `fpsAtTop`:
                    this.setFpsAtTop();
                    break;
                case `showStats`:
                    application.displayStats();
                    $(`#stats-hud`).show();
                    break;
                case 'blockPopups':
                    this.setBlockPopups();
                    break;
            }
            this.saveSettings(settings, 'ogarioSettings');
        }
    },


    
    setShowTop5() {
        settings.showTop5 = !settings.showTop5;
        this.setTop5();
    },
    setTop5() {
        if (settings.showTop5) {
            $(`#top5-hud`).show();
        } else {
            $('#top5-hud').hide();
        }
    },
    setShowTargeting() {
        settings.showTargeting = !settings.showTargeting;
        this.setTargetingHUD();
    },
    setTargetingHUD() {
        if (settings.showTargeting) {
            $('#target-hud, #target-panel-hud').show();
        } else {
            $('#target-hud, #target-panel-hud').hide();
        }
    },
    setShowTime() {
        settings.showTime = !settings.showTime;
        if (settings.showTime) {
            $(`#time-hud`).show();
            this.displayTime();
        } else {
            $(`#time-hud`).hide();
        }
    },
    setShowSplitRange() {
        settings.splitRange = !settings.splitRange;
        tempsett.splitRange = settings.splitRange;
    },
    setShowSplitInd() {
        this.showSplitInd = !this.showSplitInd;
        settings.splitRange = this.showSplitInd;
        settings.oppRings = this.showSplitInd;
        tempsett.splitRange = settings.splitRange;
        tempsett.oppRings = settings.oppRings;
    },
    setShowTeammatesInd() {
        settings.teammatesInd = !settings.teammatesInd;
    },
    setShowOppColors() {
        settings.oppColors = !settings.oppColors;
        tempsett.oppColors = settings.oppColors;
    },
    toggleSkins() {
        if (Connection.vanillaSkins && Connection.customSkins) {
            Connection.vanillaSkins = false;
        } else if (!Connection.vannillaSkins && Connection.customSkins) {
            Connection.vanillaSkins = true;
            Connection.customSkins = false;
        } else {
            Connection.vanillaSkins = true;
            Connection.customSkins = true;
        }
    },
    setTransparentSkins() {
        settings.transparentSkins = !settings.transparentSkins;
        tempsett.transparentSkins = settings.transparentSkins;
    },
    setShowSkins() {
        this.noSkins = !this.noSkins;
        //window.core && window.core.setSkins && window.core.setSkins(!this.noSkins);
        tempsett.showCustomSkins = !this.noSkins;
        this.displayChatInfo(!this.noSkins, `showSkinsMsg`);
    },

    setShowStats() {
        $(`#stats-hud`).toggle();
    },
    toggleCells() {
        tempsett.selectBiggestCell = !tempsett.selectBiggestCell;
    },
    setShowFood() {
        tempsett.showFood = !tempsett.showFood;
    },
    setShowGrid() {
        settings.showGrid = !settings.showGrid;
    },
    setShowMiniMapGuides() {
        settings.showMiniMapGuides = !settings.showMiniMapGuides;
    },
    hideChat() {
        settings.hideChat = !settings.hideChat;
        this.setHideChat();
        Settings.displayChatInfo(!settings.hideChat, `hideChatMsg`);
    },
    setShowHUD() {
        $(`#overlays-hud`).toggle();
    },
    copyLb() {
        const input = $(`<input>`);
        $(`body`).append(input);
        input.val($('#leaderboard-positions').text()).select();
        try {
            document.execCommand(`copy`);
        } catch (error) {
            console.log("can't copy..")
        }
        input.remove();
    },
    setShowLb() {
        console.log('HP')
        if (application.gameMode === `:teams`) {
            return;
        }
        $(`#leaderboard-hud`).toggle();
    },
    toggleAutoZoom() {
        tempsett.autoZoom = !tempsett.autoZoom;
        this.displayChatInfo(tempsett.autoZoom, `autoZoomMsg`);
    },
    resetZoom(on) {
        if (on) {
            tempsett.zoomResetValue = 1;
            tempsett.zoomValue = 1;
        } else {
            tempsett.zoomResetValue = 0;
        }
    },
    setShowBgSectors() {
        settings.showBgSectors = !settings.showBgSectors;
    },
    setHideSmallBots() {
        tempsett.hideSmallBots = !tempsett.hideSmallBots;
        this.displayChatInfo(!tempsett.hideSmallBots, `hideSmallBotsMsg`);
    },
    setShowNames() {
        settings.noNames = !settings.noNames;
    },
    setHideTeammatesNames() {
        settings.hideTeammatesNames = !settings.hideTeammatesNames;
    },
    setShowMass() {
        settings.showMass = !settings.showMass;
    },
    setShowMiniMap() {
        settings.showMiniMap = !settings.showMiniMap;
        this.setMiniMap();
        if (settings.showMiniMap) {
            $(`#minimap-hud`).show();
        } else {
            $(`#minimap-hud`).hide();
        }
    },
    /*setMiniMap() {

    },*/
    
    toggleAutoResp() {
        settings.autoResp = !settings.autoResp;
        this.displayChatInfo(settings.autoResp, `autoRespMsg`);
    },

    setShowQuest() {
        if (application.gameMode !== `:ffa`) {
            return;
        }
        settings.showQuest = !settings.showQuest;
        this.setQuest();
    },
    setQuest() {
        if (settings.showQuest && application.gameMode === `:ffa`) {
            $(`#quest-hud`).show();
        } else {
            $(`#quest-hud`).hide();
        }
    },

    setDisableChat() {
        settings.hideChat = settings.disableChat;
        this.setHideChat();
    },

    setHideChat() {
        if (settings.hideChat) {
            $(`#message-box`).hide();
        }
        this.setShowChatBox();
    },
    setShowChatBox() {
        if (!settings.hideChat && settings.showChatBox) {
            $('#chat-box').show();
        } else {
            $(`#chat-box`).hide();
        }
    },

    displayChatInfo(on, info) {
        if (on) {
            textLanguage[`${info}A`]?toastr.info(textLanguage[`${info}A`]):toastr.info(info)
        } else{
            textLanguage[`${info}B`]?toastr.error(textLanguage[`${info}B`]):toastr.error(info)
        }
    },
    /*** */

    showMenu(value) {
        if (value) {
            $(`#overlays`).fadeIn(value);
        } else {
            $(`#overlays`).show();
        }
    },
    hideMenu(value) {
        if (value) {
            $(`#overlays`).fadeOut(value);
        } else {
            $(`#overlays`).hide();
        }
    },

    setHud() {
        this.setHudColors();
        this.setHudFont();
        this.setHudScale();
    },
    setHudColors() {
        console.log('sethudcolors')
        const css = `
        .hud-main-color,
        #top5-hud a,
        #target-panel-hud a:hover,
        #target-panel-hud a.active,
        #message-menu a{
            color:` + theme.hudMainColor + `
        }

        .hud,
        .hud-b,
        #chat-emoticons{
            background-color:` + theme.hudColor + `
        }
        .hud,
        .hud-b,
        #top5-hud a:hover,
        #target-panel-hud a{
            color:` + theme.hudTextColor+`
        }
        .stats-hud-color{
            color:`+theme.statsHudColor+`
        }
        .time-hud-color{
            color:`+theme.timeHudColor+`
        }
        .top5-mass-color{
            color:`+theme.top5MassColor+`
        }
        #leaderboard-positions .me{
            color:`+theme.lbMeColor+`
        }
        #leaderboard-positions .teammate{
            color:`+theme.lbTeammateColo+`;
        };`
        this.addCustomCSS('hudCSS', css);
    },
    setHudFont() {
        this.setFont('hudFont', theme.hudFont);
        $('#overlays-hud').css({
            'font-family': theme.hudFontFamily,
            'font-weight': theme.hudFontWeight
        });
    },
    setHudScale() {
        const overlays = Math.round(20 * theme.hudScale);
        const leadeboard = Math.round(200 * theme.hudScale);
        const top5 = Math.floor(55 * theme.hudScale);
        const top5_pos = Math.floor(1 * theme.hudScale);
        const time = Math.floor(280 * theme.hudScale);
        const pause = Math.floor(85 * theme.hudScale);
        const target = Math.floor(20 * theme.hudScale);
        $('#overlays-hud').css(`font-size`, `${overlays}px`);
        $('#leaderboard-hud, #time-hud, #botClient').width(leadeboard);
        $(`#top5-hud`).width(leadeboard + 30).css(`top`, `${top5}px`);
        $(`#top5-pos`).css('padding-left', `${top5_pos}px`);
        $(`#time-hud`).css(`top`, `${time}px`);
        $(`#pause-hud`).css(`top`, `${pause}px`);
        $(`#target-hud`).css('padding-top', `${target}px`);
    },
    setCenteredLb() {
        if (settings.centeredLb) {
            $(`#leaderboard-hud`).addClass('hud-text-center');
        } else {
            $(`#leaderboard-hud`).removeClass('hud-text-center');
        }
    },
    setNormalLb() {
        if (settings.normalLb) {
            $(`#leaderboard-hud h4`).html(textLanguage.leaderboard);
        } else {
            $('#leaderboard-hud h4').html(`DELTAV4.GLITCH.ME`);
        }
    },
    setFpsAtTop() {
        if (settings.fpsAtTop) {
            $('#stats-hud').removeClass('hud-bottom').addClass(`hud-top`);
        } else {
            $(`#stats-hud`).removeClass(`hud-top`).addClass(`hud-bottom`);
        }
    },
    setChat() {
        this.setChatColors();
        this.setChatScale();
    },
    setChatColors() {
        const css = `${`#message,#messages li,.toast-success{background-color:` + theme.messageColor + `}#message,.message-text,.toast-success .message-text{color:` + theme.messageTextColor + `}.message-nick,.mute-user,.mute-user:hover,.toast-success .message-nick,.toast .mute-user,.toast .mute-user:hover{color:` + theme.messageNickColor + `}.message-time{color:` + theme.messageTimeColor}}.toast-warning{background-color:${theme.commandsColor}${`}.command-text,.toast-warning .command-text{color:`}${theme.commandsTextColor}${`}.command-nick,.toast-warning .command-nick,.toast-warning .mute-user,.toast-warning .mute-user:hover{color:`}${theme.commandsNickColor}${`}.command-time{color:`}${theme.commandsTimeColor}${`}#chat-box{background-color:`}${theme.chatBoxColor}}`;
        this.addCustomCSS(`chatCSS`, css);
    },
    setChatScale() {
        const message = Math.round(14 * theme.chatScale);
        const toastContainer = Math.round(280 * theme.chatScale);
        const messageBox = Math.round(350 * theme.chatScale);
        const chatBox = Math.round(300 * theme.chatScale);
        const userList = Math.floor(14 * theme.chatScale);
        $(`#message-box, #messages, #toast-container, #chat-box`).css(`font-size`, `${message}px`);
        $('#messages, #toast-container, #chat-box').width(toastContainer);
        $(`#message-box`).width(messageBox);
        $(`#chat-box`).height(chatBox);
        $('.user-list').css(`padding-left`, `${userList}px`);
        const css = `#toast-container{width:` + toastContainer + `px;font-size:` + message + `px}`;
        this.addCustomCSS(`chatScaleCSS`, css);
    },
    setShowChatBox() {
        if (!settings.hideChat && settings.showChatBox) {
            $('#chat-box').show();
        } else {
            $(`#chat-box`).hide();
        }
    },
    setMiniMap() {
        if (settings.showMiniMap) {
            $(`#minimap-hud`).show();
        } else {
            $(`#minimap-hud`).hide();
        }
        this.setMiniMapFont();
        this.setMiniMapWidth();
        this.setMiniMapSectorsOpacity();
    },
    setMiniMapFont() {
        this.setFont(`miniMapFont`, theme.miniMapFont);
        window.comm && comm.resetMiniMapSectors();
    },
    setMiniMapWidth() {
        const resizeWidth = theme.miniMapWidth / 200;
        theme.miniMapTop = 0//Math.round(20 * resizeWidth);
        $('#minimap-hud').css({
            width: theme.miniMapWidth,
            height: theme.miniMapWidth + theme.miniMapTop
        });
        window.comm && comm.resetMiniMapSectors();
    },
    setMiniMapSectorsColor() {
        window.comm && comm.resetMiniMapSectors();
    },
    setMiniMapSectorsOpacity() {
        $('#minimap-sectors').css(`opacity`, theme.miniMapSectorsOpacity);
    },
    setTheme() {
        this.setFonts();
        this.setBgColor();
        this.setCustomBackground();
        this.setCustomMapTexture();
        this.setCustomMapLogo();
        this.setCustomCursor();
        this.setMenu();
        this.setHud();
        this.setChat();
        this.setMiniMap();
    },
    init() {
        /* preventing passive handlers */
        jQuery.event.special.touchstart = {
            setup: function( _, ns, handle ){
              if ( ns.includes("noPreventDefault") ) {
                this.addEventListener("touchstart", handle, { passive: false });
              } else {
                this.addEventListener("touchstart", handle, { passive: true });
              }
            }
          };

        this.loadSettings();
        this.loadThemeSettings();
        this.setTheme()
        this.setSettingsMenu()
        this.setThemeMenu()
        this.setMiniMap();
        this.setShowChatBox();
        this.setTop5();
        this.setCenteredLb();
        this.setNormalLb();
        this.setFpsAtTop();

        /* tabs */
        $(function() {
            $('ul.tabs').on('click', 'li:not(.active)', function() {
                $(this)
                    .addClass('active').siblings().removeClass('active')
                    .closest('.content').find('> .tab-container').removeClass('active').eq($(this).index()).addClass('active');
            });
            $('.container').on('mousewheel',e => {
                e.stopPropagation()
            })
        });

        /* sidemenu */

        function dataToggler(id){

            if(localStorage['dt-'+id]){
                delete localStorage['dt-'+id]
                $(document.getElementById(id)).fadeIn(300);
            }else{
                localStorage['dt-'+id] = '1'
                $(document.getElementById(id)).fadeOut(300);
            }
            
        }
        Array.prototype.slice.call(document.querySelectorAll(`[data-toggle-id]`)).forEach(el => {
            var id = el.getAttribute('data-toggle-id')
            document.getElementById(id).style.display=!localStorage['dt-'+id]?'block':'none';
            el.onclick=function(){
                dataToggler(id)
            }
        })

        /*$(document).on(`click`, `.quick-menu`, event => {
            event.preventDefault();
            gameOptionSettings.showQuickMenu = !gameOptionSettings.showQuickMenu;
            this.saveSettings(gameOptionSettings, `ogarioSettings`);
            this.setShowQuickMenu();
        });
        $(document).on(`click`, `.quick-skins`, event => {
            event.preventDefault();
            gameOptionSettings.showSkinsPanel = !gameOptionSettings.showSkinsPanel;
            this.saveSettings(gameOptionSettings, `ogarioSettings`);
            this.setShowSkinsPanel();
        });*/
        

        /*OverlayScrollbars(document.querySelectorAll(".scrollable"), {
            scrollbars : {
                visibility       : "visible",
                autoHide         : "never",
                autoHideDelay    : 800
            }
        });*/

        /* resize menu */
        let menuHeight = null
        function menuScale() {
            const innerWidth = window.innerWidth;
            const innerHeigth = window.innerHeight;
            const helloContainer = $('#helloContainer');
            let helloContainerWidth = helloContainer.innerHeight();
            if (helloContainerWidth > 0) {
                menuHeight = helloContainerWidth;
            } else {
                helloContainerWidth = menuHeight || 618;
            }
            const scale = Math.min(1, innerHeigth / helloContainerWidth);
            const top = helloContainerWidth * scale;
            const resizeTop = Math.round(innerHeigth / 2 - 0.5 * top);
            const transform = `${`translateX(-50%) translateY(-50%) scale(` + scale})`;
            helloContainer.css('transform', transform);
            helloContainer.css('-ms-transform', transform);
            helloContainer.css('-webkit-transform', transform);
            //helloContainer.css('top', `${resizeTop}px`);
        
        }
        window.onresize = () => {
            menuScale();
        };
        menuScale()

    }
};


Settings.init()


