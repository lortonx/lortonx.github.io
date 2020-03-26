var drawRender = {
    canvas: null,
    ctx: null,
    canvasWidth: 0,
    canvasHeight: 0,
    camX: 0,
    camY: 0,
    scale: 1,
    fpsLastRequest: null,
    renderedFrames: 0,
    renderedObjects:0,
    fps: 0,
    pi2: 2 * Math.PI,
    battleAreaMap: null,
    battleAreaMapCtx: null,
    pieChart: null,
    pellet: null,
    indicator: null,
    nickCache:{},
    massCache:{},
    setCanvas() {
        this.canvas = document.getElementById(`canvas`);
        this.ctx = this.canvas.getContext('2d');
        /*var context = this.ctx
        var drawImage = this.ctx.drawImage
        this.ctx.drawImage = async function(){drawImage.apply(context,arguments)}*/
        
        this.canvas.onmousemove = event => {
            for(var Connection of application.c){
                Connection.clientX = event.clientX * settings.renderQuality;
                Connection.clientY = event.clientY * settings.renderQuality;
                Connection.getCursorPosition(this.camX,this.camY);
            }
        };
    },
    resizeCanvas() {
        this.canvasWidth = window.innerWidth * settings.renderQuality//* window.devicePixelRatio;
        this.canvasHeight = window.innerHeight * settings.renderQuality//* window.devicePixelRatio;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        for(var Connection of application.c){
            Connection.canvasWidth = this.canvasWidth;
            Connection.canvasHeight = this.canvasHeight;
        }
        this.renderFrame();

        //this.app._resizeTo = {clientWidth: this.canvasWidth,clientHeight: this.canvasHeight}
        //this.app.resize()
    },
    setView() {
        var middleViewX = 0
        var middleViewY = 0
        var totalPlaying = 0;
        //const Connection=application.c[application.tabCurrent]
        for(var Connection of application.c){
            
            if(Connection.playerCells.length){
                totalPlaying++
                Connection.calculatePlayerMassAndPosition()
            }
            this.setScale(Connection);
        }

            for (let i = 0; i < application.c.length; i++) {
                if(application.c[i].playerCells.length==0){continue}
                const c = application.c[i];
                middleViewX += c.viewX / totalPlaying;
                middleViewY += c.viewY / totalPlaying;
                //Connection.getCursorPosition(middleViewX,middleViewY)
            }
            if(totalPlaying==0){
                middleViewX=application.c[application.tabCurrent].viewX
                middleViewY=application.c[application.tabCurrent].viewY
            }



            for(var Connection of application.c){
                Connection.playerX = Connection.viewX;
                Connection.playerY = Connection.viewY;
                    if (Connection.playerCells.length && settings.cameraDelay==0) {
                        //console.log('renstate 1')
                        this.camX = (this.camX + middleViewX) / 2;
                        this.camY = (this.camY + middleViewY) / 2;
                        //for(var Connection of application.c){
                            Connection.viewX = this.camX;
                            Connection.viewY = this.camY;
                            
                        //}
                    } else if(Connection.playerCells.length && settings.cameraDelay!=0) {
                        //console.log('renstate 2')
                        var sp30 = settings.cameraDelay
                        var sp29 = settings.cameraDelay-1
                        this.camX = (sp29 * this.camX + middleViewX) / sp30;
                        this.camY = (sp29 * this.camY + middleViewY) / sp30;
                        //for(var Connection of application.c){
                            Connection.viewX = this.camX;
                            Connection.viewY = this.camY;
                        //}
                    } else if(!totalPlaying){
                        //console.log('renstate 3')
                        this.camX = (29 * this.camX + middleViewX) / 30;
                        this.camY = (29 * this.camY + middleViewY) / 30;
                    }
                }

    },
    /*setView(Connection) {
        for(var Connection of application.c){break}
        this.setScale(Connection);
        var speed = 30
        if (Connection.playerCells.length) {
            settings.cameraDelay==0?Connection.calculatePlayerMassAndPosition():Connection.calculatePlayerMassAndPosition2()
            this.camX = (this.camX + Connection.viewX) / 2;
            this.camY = (this.camY + Connection.viewY) / 2;
        } else {
            this.camX = (29 * this.camX + Connection.viewX) / 30;
            this.camY = (29 * this.camY + Connection.viewY) / 30;
        }
        //this.camX=Connection.viewX
       //this.camY=Connection.viewY
        Connection.playerX = this.camX;
        Connection.playerY = this.camY;
    },*/
    setScale(Connection) {
        //for(var Connection of application.c){}
        
        let sp10 = settings.zoomSmoothness
        let sp9 = sp10 - 1
        if (!settings.autoZoom) { // Автозум отключен
            this.scale = (sp9 * this.scale + this.getZoom(Connection)) / sp10;
            Connection.viewScale = this.scale;
            return;
        }
        if (Connection.play) {
            this.scale = (sp9 * this.scale + Math.min(64 / Connection.playerSize, 1) ** 0.2 * this.getZoom(Connection)) / sp10;
        } else {
            this.scale = (sp9 * this.scale + Connection.scale * this.getZoom(Connection)) / sp10;
        }
        Connection.viewScale = this.scale;
    },
    getZoom(Connection) {
        //for(var Connection of application.c){}
        return Math.max(this.canvasWidth / 1080, this.canvasHeight / 1920) * Connection.zoomValue;
    },
    renderFrame() {
        this.renderedObjects=0

        for(var Connection of application.c){
            Connection.time = Date.now();
            for (var i = 0,length = Connection.cells.length; i < length; i++) {
                Connection.cells[i].moveCell();
            }
            
        }
        this.setView();
        /*this.app.stage.scale = new PIXI.Point(this.scale, this.scale);
        this.app.stage.pivot.x=this.camX
        this.app.stage.pivot.y=this.camY
        this.app.stage.x=(this.canvasWidth / 2)
        this.app.stage.y=(this.canvasHeight / 2)*/
        //var Connection=application.c[application.tabCurrent]
        for(var Connection of application.c){
            Connection.getCursorPosition(this.camX,this.camY);
            Connection.sortCells()
            Connection.compareCells();
            Connection.calcViewport()
        }
        
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        if (settings.showGrid) {
            this.drawGrid(this.ctx, this.canvasWidth, this.canvasHeight, this.scale, this.camX, this.camY);
        }

        this.ctx.save();
        this.ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2);
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(-this.camX, -this.camY);
        //this.ctx.imageSmoothingEnabled = false
        //for(var Connection of application.c){
        application.eachTabByPriority((Connection,_Connection,priority,index)=>{
            
            
            if(index==0 && Connection.mapOffsetFixed && Settings.customMapTextureCanvas.complet){
                settings.showGrid && (this.ctx.globalCompositeOperation = 'destination-over')
                this.ctx.drawImage(Settings.customMapTextureCanvas, Connection.mapMinX, Connection.mapMaxY, Connection.mapMaxX-Connection.mapMinX, Connection.mapMinY-Connection.mapMaxY);
                settings.showGrid && (this.ctx.globalCompositeOperation = 'source-over')
            }
            

            if (index==0 && settings.showBgSectors) {
                this.drawSectors(this.ctx, Connection.mapOffsetFixed, theme.sectorsX, theme.sectorsY, Connection.mapMinX, Connection.mapMinY, Connection.mapMaxX, Connection.mapMaxY, theme.gridColor, theme.sectorsColor, theme.sectorsWidth, true);
            }

            if(index==0 && Connection.mapOffsetFixed && Settings.customMapLogoCanvas.complet){
                //settings.showGrid && (this.ctx.globalCompositeOperation = 'destination-over')
                this.ctx.globalAlpha = 0.2
                var ofx = ((Connection.mapMaxX-Connection.mapMinX)/5)*2.2
                var ofy = ((Connection.mapMinY-Connection.mapMaxY)/5)*2.2
                this.ctx.drawImage(
                    Settings.customMapLogoCanvas,  //2.1:5.9
                    Connection.mapMinX+ofx, 
                    Connection.mapMaxY+ofy, 
                    (Connection.mapMaxX-Connection.mapMinX)/8.5, 
                    (Connection.mapMinY-Connection.mapMaxY)/8.5
                );
                this.ctx.globalAlpha = 1
                //settings.showGrid && (this.ctx.globalCompositeOperation = 'source-over')
            }

            if (Connection.gameMode === ':battleroyale') {
                this.drawBattleArea(this.ctx);
            }
            if (index==0 && settings.showMapBorders) {
                const borderWidth = theme.bordersWidth / 2;
                this.drawMapBorders(this.ctx, Connection.mapOffsetFixed, Connection.mapMinX - borderWidth, Connection.mapMinY - borderWidth, Connection.mapMaxX + borderWidth, Connection.mapMaxY + borderWidth, theme.bordersColor, theme.bordersWidth);
            }
            if (settings.virusesRange) {
                this.drawVirusesRange(this.ctx, Connection,_Connection);
            }
        })
            //break
        //}
        //for(var Connection of application.c){
    application.eachTabByPriority((Connection,_Connection,priority)=>{
            this.drawFood(Connection,_Connection);
    })
    application.eachTabByPriority((Connection,_Connection,priority)=>{
        if (Connection.play && priority == 0) {
            if (settings.splitRange) {
                this.drawSplitRange(this.ctx, Connection.biggerSTECellsCache, Connection.playerCells, Connection.selectBiggestCell);
            }
            if (settings.oppRings) {
                this.drawOppRings(this.ctx, this.scale, Connection.biggerSTECellsCache, Connection.biggerCellsCache, Connection.smallerCellsCache, Connection.STECellsCache);
            }
            if (settings.cursorTracking) {
                
                //Connection.isInViewport(Connection.cursorX,Connection.cursorY,1)&&
                this.drawCursorTracking(this.ctx, Connection.playerCells, Connection.cursorX, Connection.cursorY);
            }
        }

    })
    application.eachTabByPriority((Connection,_Connection,priority)=>{
        priority == 0&&this.drawGhostCells(Connection,_Connection);
    })

    application.eachTabByPriority((Connection,_Connection,priority)=>{
        for (var i = 0; i < Connection.removedCells.length; i++) {
            if(_Connection && _Connection.isInViewport(Connection.removedCells[i].targetX,Connection.removedCells[i].targetY,0/*Connection.removedCells[i].size*/))
            continue;

            Connection.removedCells[i].draw(this.ctx, true);
        }
    })
    application.eachTabByPriority((Connection,_Connection,priority)=>{
        /*this.graphics.clear();
        this.graphics.lineStyle(1);
        this.graphics.beginFill(0xFFFF0B, 0.5);*/
        //console.log(Connection,_Connection)
        //Connection.calcViewport()
        for (const cell of Connection.cells) {
            if(_Connection){
                if(_Connection.isInViewport(cell.targetX,cell.targetY,cell.size  ))
                continue
            }
            if(!this.isInDisplay(cell.targetX,cell.targetY,cell.size)){
                continue;
            }
            this.renderedObjects++
            cell.draw(this.ctx);

                //var x1 = Connection.cells[length].targetX//((Connection.cells[length].targetX-this.camX)*this.scale)+this.canvasWidth / 2
                //var y1 = Connection.cells[length].targetY//((Connection.cells[length].targetY-this.camY)*this.scale)+this.canvasHeight / 2
                //this.graphics.drawCircle(x1,y1,Connection.cells[length].size);
                

            ///Sticky cell
            /*if(drawRender.LMB && this.pointInCircle(Connection.cursorX, Connection.cursorY, Connection.cells[length].x, Connection.cells[length].y, Connection.cells[length].size)){
                Connection.selected = Connection.cells[length].id
                this.drawRing(this.ctx,Connection.cells[length].x,Connection.cells[length].y,Connection.cells[length].size,0.75,'#ffffff')
             }*/
        }
    //}
    })
        //this.graphics.endFill();
         ///Sticky cell
       /* Connection.indexedCells[Connection.selected] && this.drawRing(this.ctx,
            Connection.indexedCells[Connection.selected].x,
            Connection.indexedCells[Connection.selected].y,
            Connection.indexedCells[Connection.selected].size,
        0.75,'#ffffff');

        if(drawRender.RMB && Connection.indexedCells[Connection.selected] && Connection.playerCellIDs.length){
            var index = Connection.selectBiggestCell ? Connection.playerCells.length - 0x1 : 0x0;

            if(Connection.playerCells[index] == undefined) return;
            var xc = Connection.playerCells[index].targetX//.x
            var yc = Connection.playerCells[index].targetY//.y
            
            var x = Connection.indexedCells[Connection.selected].targetX//.x
            var y = Connection.indexedCells[Connection.selected].targetY//.y
            
            var a = xc - x
            var b = yc - y
            var distance = Math.sqrt( a*a + b*b ) - (Connection.indexedCells[Connection.selected].size+Connection.playerCells[index].size)

            var ang = Math.atan2(y - yc, x - xc);
            Connection.cursorX= xc +(Math.cos(ang)*distance)
            Connection.cursorY= yc +(Math.sin(ang)*distance)
            Connection.sendPosition()

        }*/

        if(settings.debug){
            //this.drawViewport(this.ctx, 'Viewport #1', Connection.camMinX, Connection.camMinY, Connection.camMaxX, Connection.camMaxY, gameSetupTheme.bordersColor, 15);
            
            for(var Connection of application.c){

            this.drawViewport(this.ctx, 'Client Viewport '+application.c.indexOf(Connection), Connection.protocol_viewX - Connection.viewportW2s, Connection.protocol_viewY - Connection.viewportH2s, Connection.protocol_viewX + Connection.viewportW2s, Connection.protocol_viewY + Connection.viewportH2s, theme.bordersColor, 15);
            //this.drawViewport(this.ctx, 'Client Viewport '+application.c.indexOf(Connection), Connection.viewMinX, Connection.viewMinY, Connection.viewMaxX, Connection.viewMaxY, theme.bordersColor, 15);
            this.drawRing(this.ctx, Connection.viewX, Connection.viewY, 15, 1, '#ff00ff') 
        }

        }
        this.ctx.restore();
        if (Connection.gameMode === `:teams`) {
            if (this.pieChart && this.pieChart.width) {
                this.ctx.drawImage(this.pieChart, this.canvasWidth - this.pieChart.width - 10, 10);
            }
        }

        if(settings.debug){
            this.ctx.fillStyle  = "white";
            this.ctx.font = "15px sans-serif";
            this.ctx.textAlign = "start";
            var lw=(this.canvasHeight/2)
            this.ctx.fillText("playerID: "+comm.playerID, 50, lw+=25);
            this.ctx.fillText("isFreeSpectate: "+Connection.isFreeSpectate, 50, lw+=25);
            this.ctx.fillText("isSpectateEnabled: "+Connection.isSpectateEnabled, 50, lw+=25);
            this.ctx.fillText("realQuadrant: "+Connection.realQuadrant, 50, lw+=25);
            this.ctx.fillText("lastQuadrant: "+Connection.lastQuadrant, 50, lw+=25);
            this.ctx.fillText("quadrant: "+Connection.quadrant, 50, lw+=25);
            this.ctx.fillText("comm.lastMostLike: "+comm.lastMostLike, 50, lw+=25);
            this.ctx.fillText("renderedObjects: "+this.renderedObjects, 50, lw+=25);
            
            //Connection.camMaxX && this.ctx.fillText("cMaxX: "+Connection.camMaxX, 50, lw+=30);
            //Connection.camMaxY && this.ctx.fillText("cMaxY: "+Connection.camMaxY, 50, lw+=30);
            //Connection.camMinX && this.ctx.fillText("cMinX: "+Connection.camMinX, 50, lw+=30);
            //Connection.camMinY && this.ctx.fillText("cMinY: "+Connection.camMinY, 50, lw+=30);
        }
        //this.pixiren.render(this.stage)
    },
    drawViewport:function(ctx, text, minX, maxY, maxX, minY, stroke, width){

        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;

        ctx.fillStyle  = "white";
        ctx.font = "100px sans-serif";
        ctx.textAlign = "end";
        ctx.textBaseline = "hanging"

        ctx.beginPath();
        ctx.moveTo(minX, maxY);
        ctx.lineTo(maxX, maxY);
        ctx.lineTo(maxX, minY);
        ctx.lineTo(minX, minY);
        ctx.closePath();
        ctx.stroke();
        ctx.fillText(text, maxX, maxY);
    },
    pointInCircle: function(x, y, cx, cy, radius) {
        var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distancesquared <= radius * radius;
    },
    isInDisplay: function(x, y, size){
        if(!settings.experimental1){return true}
        let daxx = this.scale + this.camX
        let dayy = this.scale + this.camY
        let x2s = this.canvasWidth  / 2 / this.scale
        let y2s = this.canvasHeight / 2 / this.scale

        /*  var q0 = [x2s + this.camX, -y2s + this.camY]
            var q1 = [-x2s + this.camX, -y2s + this.camY]
            var q2 = [-x2s + this.camX, y2s + this.camY]
            var q3 = [x2s + this.camX, y2s + this.camY]
        */
            if (x + size < this.camX - x2s || y + size < this.camY - y2s || x - size > this.camX + x2s || y - size > this.camY + y2s) {
                return false;
            }
            return true;
    },
    drawRing : function (ctx, x, y, size, alpha, color) {
        ctx.lineWidth = 20;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, size-10, 0x0, this.pi2, false);
            ctx.closePath();
            ctx.stroke();
        
        ctx.globalAlpha = 1;
    },
    drawGrid(ctx, width, heigth, scale, camX, camY) {
        const reWidth = width / scale;
        const reHeigth = heigth / scale;
        let x = (-camX + reWidth / 2) % 50;
        let y = (-camY + reHeigth / 2) % 50;
        ctx.strokeStyle = theme.gridColor;
        ctx.globalAlpha = 1 * scale;
        ctx.beginPath();
        for (; x < reWidth; x += 50) {
            ctx.moveTo(x * scale - 0.5, 0);
            ctx.lineTo(x * scale - 0.5, reHeigth * scale);
        }
        for (; y < reHeigth; y += 50) {
            ctx.moveTo(0, y * scale - 0.5);
            ctx.lineTo(reWidth * scale, y * scale - 0.5);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
    },
    drawSectors(ctx, mapOffset, x, y, minX, minY, maxX, maxY, stroke, color, width, type) {
        if (!mapOffset && type) {
            return;
        }
        const posX = ~~((maxX - minX) / x);
        const posY = ~~((maxY - minY) / y);
        let rePosX = 0;
        let rePosY = 0;
        ctx.strokeStyle = stroke;
        ctx.fillStyle = color;
        ctx.lineWidth = width;
        if (type || !type && settings.showMiniMapGrid) {
            ctx.beginPath();
            for (var length = 0; length < x + 1; length++) {
                rePosX = minX + posX * length;
                ctx.moveTo(length == x ? maxX : rePosX, minY);
                ctx.lineTo(length == x ? maxX : rePosX, maxY);
            }
            for (var length = 0; length < y + 1; length++) {
                rePosY = minY + posY * length;
                ctx.moveTo(minX - width / 2, length == y ? maxY : rePosY);
                ctx.lineTo(maxX + width / 2, length == y ? maxY : rePosY);
            }
            ctx.stroke();
        } else {
            this.drawMapBorders(ctx, mapOffset, minX, minY, maxX, maxY, stroke, width);
        }
        if (type) {
            ctx.font = theme.sectorsFontWeight+' '+theme.sectorsFontSize+'px '+theme.sectorsFontFamily;
        } else {
            ctx.font = `${theme.miniMapFontWeight} ${~~(0.4 * posY)}px ${theme.miniMapFontFamily}`;
        }
        ctx.textAlign = 'center';
        ctx.textBaseline = `middle`;
        for (var length = 0; length < y; length++) {
            for (let length_2 = 0; length_2 < x; length_2++) {
                const text = String.fromCharCode(65 + length) + (length_2 + 1);
                rePosX = ~~(minX + posX / 2 + length_2 * posX);
                rePosY = ~~(minY + posY / 2 + length * posY);
                ctx.fillText(text, rePosX, rePosY);
            }
        }
    },
    drawMapBorders(ctx, mapOffset, minX, maxY, maxX, minY, stroke, width) {
        if (!mapOffset) {
            return;
        }
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;



        ctx.beginPath();
        ctx.moveTo(minX, maxY);
        ctx.lineTo(maxX, maxY);
        ctx.lineTo(maxX, minY);
        ctx.lineTo(minX, minY);
        ctx.closePath();
        ctx.stroke();


        /*if(!window.firstrender){
            window.firstrender = true
            console.log(mapOffset,minX, maxY, maxX, minY)
            console.log(Math.sqrt(((maxX - minX) ** 2) + ((maxY - minY) ** 2)))          
        }*/


        //ctx.fillStyle = "#FF0000";
        //ctx.fillRect(minX,minY,maxY,maxX);

    },
    drawVirusesRange(ctx, viruses, Connection,_Connection) {
        if (!viruses.length) {
            return;
        }
        ctx.beginPath();
        for (let length = 0; length < viruses.length; length++) {
            const x = viruses[length].x;
            const y = viruses[length].y;
            const size = viruses[length].size + 820
            if(_Connection && _Connection.isInViewport(x,y,size))
            continue;
            ctx.moveTo(x, y);
            ctx.arc(x, y, size, 0, this.pi2, false);
        }
        ctx.fillStyle = theme.virusColor;
        ctx.globalAlpha = 0.1;
        ctx.fill();
        ctx.globalAlpha = 1;
        /*if (reset) {
            viruses = [];
        }*/
    },
    drawFood(Connection,_Connection) {
        if (!Connection.showFood || settings.autoHideFoodOnZoom && this.scale < 0.2) {
            return;
        }
        if (settings.autoHideFood && !Connection.foodIsHidden && Connection.playerMass > 1000) {
            Connection.showFood = false;
            Connection.foodIsHidden = true;
            return;
        }
        if (!settings.rainbowFood) {
            this.drawCachedFood(this.ctx, Connection, this.scale);
            return;
        }
        for (let length = 0; length < Connection.food.length; length++) {
            if(!this.isInDisplay(Connection.food[length].targetX,Connection.food[length].targetY,0)){continue}
            if(_Connection){
                if(_Connection.isInViewport(Connection.removedCells[i].targetX,Connection.removedCells[i].targetY,Connection.removedCells[i].size))
                continue
            }
            this.renderedObjects++
            Connection.food[length].moveCell();
            Connection.food[length].draw(this.ctx);
        }
    },
    drawCachedFood(ctx, Connection, scale, reset) {
        var food = Connection.food
        if (!food.length) {
            return;
        }
        /*Connection.camMaxX = Connection.playerX
        Connection.camMaxY = Connection.playerY
        Connection.camMinX = Connection.playerX
        Connection.camMinY = Connection.playerY*/
        if (settings.optimizedFood && this.pellet) {
            /*for (var length = 0; length < food.length; length++) {
                var x = food[length].x - 10 - theme.foodSize;
                var y = food[length].y - 10 - theme.foodSize;

                if(!this.isInDisplay(x,y,0)){continue}
                this.renderedObjects++

                if(settings.debug){
                    if( x > Connection.camMaxX ) Connection.camMaxX = x        
                    if( y > Connection.camMaxY ) Connection.camMaxY = y
                    if( x < Connection.camMinX ) Connection.camMinX = x
                    if( y < Connection.camMinY ) Connection.camMinY = y
                }

                ctx.drawImage(this.pellet, x, y);
            }*/
        } else {
            ctx.beginPath();
            //for (var food of Connection.food) {
            Connection.food.forEach((food) => {
               // if(!this.isInDisplay(food.x,food.y,0)){return;/*continue*/}
                this.renderedObjects++
                
                /*if(settings.debug){
                    if( food.x > Connection.camMaxX ) Connection.camMaxX = food.x
                    if( food.y > Connection.camMaxY ) Connection.camMaxY = food.y
                    if( food.x < Connection.camMinX ) Connection.camMinX = food.x
                    if( food.y < Connection.camMinY ) Connection.camMinY = food.y
                }*/
                ctx.moveTo(food.x, food.y);
                if (scale < 0.16) {
                    const size = food.size + theme.foodSize;
                    ctx.rect(food.x - size, food.y - size, 2 * size, 2 * size);
                    return;
                    //continue;
                }
                ctx.arc(food.x, food.y, food.size + theme.foodSize, 0, this.pi2, false);
            });
            //}
            ctx.fillStyle = theme.foodColor;
            ctx.globalAlpha = 1;
            ctx.fill();
        }
        if (reset) {
            food = [];
        }
    },
    drawSplitRange(ctx, biggestCell, players, currentBiggestCell, reset) {
        this.drawCircles(ctx, biggestCell, 760, 4, 0.4, `#BE00FF`);
        if (players.length) {
            const current = currentBiggestCell ? players.length - 1 : 0;
            ctx.lineWidth = 6;
            ctx.globalAlpha = theme.darkTheme ? 0.7 : 0.35;
            ctx.strokeStyle = theme.splitRangeColor;
            ctx.beginPath();
            ctx.arc(players[current].x, players[current].y, players[current].size + 760, 0, this.pi2, false);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        if (reset) {
            biggestCell = [];
        }
    },
    drawOppRings(ctx, scale, biggerSte, biggetCell, smallerCell, smallSte, reset) {
        const width = 14 + 2 / scale;
        const alpha = 12 + 1 / scale;
        this.drawCircles(ctx, biggerSte, width, alpha, 0.75, `#BE00FF`);
        this.drawCircles(ctx, biggetCell, width, alpha, 0.75, `#FF0A00`);
        this.drawCircles(ctx, smallerCell, width, alpha, 0.75, '#00C8FF');
        this.drawCircles(ctx, smallSte, width, alpha, 0.75, `#64FF00`);
        if (reset) {
            biggerSte = [];
            biggetCell = [];
            smallerCell = [];
            smallSte = [];
        }
    },
    drawCursorTracking(ctx, players, cursorX, cursorY) {
        ctx.lineWidth = 4;
        ctx.globalAlpha = theme.darkTheme ? 0.75 : 0.35;
        ctx.strokeStyle = theme.cursorTrackingColor;
        ctx.beginPath();
        for (let length = 0; length < players.length; length++) {
            ctx.moveTo(players[length].x, players[length].y);
            ctx.lineTo(cursorX, cursorY);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
    },
    drawCircles(ctx, players, scale, width, alpha, stroke) {
        ctx.lineWidth = width;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = stroke;
        for (let length = 0; length < players.length; length++) {
            ctx.beginPath();
            ctx.arc(players[length].x, players[length].y, players[length].size + scale, 0, this.pi2, false);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    },
    drawDashedCircle(ctx, x, y, radius, times, width, color) {
        const pi2 = this.pi2 / times;
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        for (let length = 0; length < times; length += 2) {
            ctx.beginPath();
            ctx.arc(x, y, radius - width / 2, length * pi2, (length + 1) * pi2, false);
            ctx.stroke();
        }
    },
    drawTeammatesInd(ctx, x, y, size) {
        if (!this.indicator) {
            return;
        }
        ctx.drawImage(this.indicator, x - 45, y - size - 90);
    },
    drawPieChart() {
        if (!this.pieChart) {
            this.pieChart = document.createElement(`canvas`);
        }
        const ctx = this.pieChart.getContext('2d');
        const mincanvasWidth = Math.min(200, 0.3 * this.canvasWidth) / 200;
        this.pieChart.width = 200 * mincanvasWidth;
        this.pieChart.height = 240 * mincanvasWidth;
        ctx.scale(mincanvasWidth, mincanvasWidth);
        const colors = [`#333333`, '#FF3333', '#33FF33', `#3333FF`];
        for (let time = 0, length = 0; length < Connection.pieChart.length; length++) {
            const currentPie = time + Connection.pieChart[length] * this.pi2;
            ctx.fillStyle = colors[length + 1];
            ctx.beginPath();
            ctx.moveTo(100, 140);
            ctx.arc(100, 140, 80, time, currentPie, false);
            ctx.fill();
            time = currentPie;
        }
    },
    drawBattleArea(ctx) {
        if (!Connection.battleRoyale.state) {
            return;
        }
        this.drawDangerArea(ctx, Connection.battleRoyale.x, Connection.battleRoyale.y, Connection.battleRoyale.radius, Connection.mapMinX, Connection.mapMinY, Connection.mapMaxX - Connection.mapMinX, Connection.mapMaxY - Connection.mapMinY, theme.dangerAreaColor, 0.25);
        this.drawSafeArea(ctx, Connection.battleRoyale.targetX, Connection.battleRoyale.targetY, Connection.battleRoyale.targetRadius, 40, theme.safeAreaColor);
    },
    drawBattleAreaOnMinimap(ctx, width, heigth, newWidth, offsetX, offsetY) {
        if (!Connection.battleRoyale.state) {
            return;
        }
        if (!this.battleAreaMap) {
            this.battleAreaMap = document.createElement(`canvas`);
            this.battleAreaMapCtx = this.battleAreaMap.getContext('2d');
        }
        if (this.battleAreaMap.width != width) {
            this.battleAreaMap.width = width;
            this.battleAreaMap.height = heigth;
        } else {
            this.battleAreaMapCtx.clearRect(0, 0, width, heigth);
        }
        let newX = (Connection.battleRoyale.x + offsetX) * newWidth;
        let newY = (Connection.battleRoyale.y + offsetY) * newWidth;
        let newRadius = Connection.battleRoyale.radius * newWidth;
        this.drawDangerArea(this.battleAreaMapCtx, newX, newY, newRadius, 0, 0, width, heigth, theme.dangerAreaColor, 0.25);
        newX = ~~((Connection.battleRoyale.targetX + offsetX) * newWidth);
        newY = ~~((Connection.battleRoyale.targetY + offsetY) * newWidth);
        newRadius = ~~(Connection.battleRoyale.targetRadius * newWidth);
        this.drawSafeArea(this.battleAreaMapCtx, newX, newY, newRadius, 2, theme.safeAreaColor);
        ctx.drawImage(this.battleAreaMap, 0, 0);
    },
    drawDangerArea(ctx, x, y, radius, minX, minY, maxX, maxY, color, aplha) {
        if (Connection.battleRoyale.radius == Connection.battleRoyale.maxRadius || radius <= 0) {
            return;
        }
        ctx.save();
        ctx.globalAlpha = aplha;
        ctx.fillStyle = color;
        ctx.fillRect(minX, minY, maxX, maxY);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, this.pi2, false);
        ctx.fill();
        ctx.restore();
    },
    drawSafeArea(ctx, targetX, targetY, radius, width, color) {
        if (Connection.battleRoyale.state > 2 || radius <= 0) {
            return;
        }
        this.drawDashedCircle(ctx, targetX, targetY, radius, 60, width, color);
    },
    drawGhostCells(Connection,_Connection) {
        if (!settings.showGhostCells) {
            return;
        }
        const ghostsCells = Connection.ghostCells;
        this.ctx.beginPath();
        for (let length = 0; length < ghostsCells.length; length++) {
            
            if (ghostsCells[length].inView) {
                continue;
            }

            const x = ghostsCells[length].x;
            const y = ghostsCells[length].y;
            if(!this.isInDisplay(x,y,ghostsCells[length].size)){
                continue;
            }
            if(_Connection&&_Connection.isInViewport(x,y,ghostsCells[length].size) || Connection&&Connection.isInViewport(x,y,ghostsCells[length].size))
                continue

            this.renderedObjects++
            this.ctx.moveTo(x, y);
            this.ctx.arc(x, y, ghostsCells[length].size, 0, this.pi2, false);
        }
        this.ctx.fillStyle = theme.ghostCellsColor;
        this.ctx.globalAlpha = theme.ghostCellsAlpha;
        this.ctx.shadowColor = theme.ghostCellsColor;
        this.ctx.shadowBlur = 40;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;
    },
    preDrawPellet() {
        this.pellet = null;
        const size = 10 + theme.foodSize;
        let canvas = document.createElement(`canvas`);
        canvas.width = size * 2;
        canvas.height = size * 2;
        const ctx = canvas.getContext('2d');
        ctx.arc(size, size, size, 0, this.pi2, false);
        ctx.fillStyle = theme.foodColor;
        ctx.fill();
        this.pellet = new Image();
        this.pellet.src = canvas.toDataURL();
        canvas = null;
    },
    preDrawIndicator() {
        this.indicator = null;
        let canvas = document.createElement('canvas');
        canvas.width = 90;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.fillStyle = theme.teammatesIndColor;
        ctx.strokeStyle = `#000000`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(90, 0);
        ctx.lineTo(45, 50);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        this.indicator = new Image();
        this.indicator.src = canvas.toDataURL();
        canvas = null;
    },
    countFps() {
        if (!settings.showStatsFPS) {
            return;
        }
        const Time = Date.now();
        if (!this.fpsLastRequest) {
            this.fpsLastRequest = Time;
        }
        if (Time - this.fpsLastRequest >= 1000) {
            this.fps = this.renderedFrames;
            this.renderedFrames = 0;
            this.fpsLastRequest = Time;
        }
        this.renderedFrames++;
    },
    render() {
        drawRender.countFps();
        drawRender.renderFrame();
        window.requestAnimationFrame(drawRender.render);
        //setTimeout(drawRender.render,1)
    },
    init() {


        /*var app = this.app = new PIXI.Application({ antialias: true,width:window.innerWidth,height:window.innerHeight });
        this.app.view.setAttribute('id','debug-overlay')
        this.app.view.id='debug-overlay'
        this.app.view.style.display='block'
        this.app.view.style.zIndex='-1'
        document.body.appendChild(this.app.view);
        this.graphics = new PIXI.Graphics();
        drawRender.app.stage.addChild(this.graphics);*/

        this.setCanvas();
        this.resizeCanvas();

        this.preDrawPellet();
        this.preDrawIndicator();
        window.requestAnimationFrame(drawRender.render);

        window.addEventListener('resize',function(){
            drawRender.resizeCanvas();
        })
    }
};

drawRender.init()


  function newCanvas() {
        this.txt = '';
        this.txtCanvas = null;
        this.txtCtx = null;
        this.color = '#FFFFFF';
        this.stroke = false;
        this.strokeWidth = 2;
        this.strokeColor = '#000000';
        this.font = `700 16px Ubuntu`;
        this.fontFamily = `Ubuntu`;
        this.fontWeight = 700;
        this.fontSize = 16;
        this.margin = 3;
        this.scale = 1;
        this.quality = 1;
        this.measuredWidth = 0;
        this.redraw = false;
        this.remeasure = false;
        this.setTxt = function(text) {
            if (this.txt !== text) {
                this.txt = text;
                this.redraw = true;
                this.remeasure = true;
            }
        };
        this.setColor = function(color) {
            if (this.color !== color) {
                this.color = color;
                this.redraw = true;
            }
        };
        this.setStroke = function(stroke) {
            if (this.stroke !== stroke) {
                this.stroke = stroke;
                this.redraw = true;
            }
        };
        this.setStrokeWidth = function(width) {
            if (!this.stroke) {
                return;
            }
            if (this.strokeWidth != width) {
                this.strokeWidth = width;
                this.redraw = true;
                this.remeasure = true;
            }
        };
        this.setStrokeColor = function(color) {
            if (!this.stroke) {
                return;
            }
            if (this.strokeColor !== color) {
                this.strokeColor = color;
                this.redraw = true;
            }
        };
        this.setFont = function() {
            this.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
        };
        this.setFontFamily = function(font) {
            if (this.fontFamily !== font) {
                this.fontFamily = font;
                this.setFont();
                this.redraw = true;
                this.remeasure = true;
            }
        };
        this.setFontWeight = function(weigth) {
            if (this.fontWeight != weigth) {
                this.fontWeight = weigth;
                this.setFont();
                this.redraw = true;
                this.remeasure = true;
            }
        };
        this.setFontSize = function(size) {
            if (this.fontSize != size) {
                this.fontSize = size;
                this.margin = ~~(size * 0.2);
                this.setFont();
                this.redraw = true;
            }
        };
        this.setScale = function(scale) {
            if (this.scale != scale) {
                this.scale = scale;
                this.redraw = true;
            }
        };
        this.createCanvas = function() {
            if (this.txtCanvas) {
                return;
            }
            this.txtCanvas = document.createElement(`canvas`);
            this.txtCtx = this.txtCanvas.getContext('2d');
            this.txtCtx.imageSmoothingEnabled = false
            this.txtCtx.ogarioCtx = true;
        };
        this.setDrawing = function(color, font, weigth, stroke, width, strokeColor) {
            this.setColor(color);
            this.setFontFamily(font);
            this.setFontWeight(weigth);
            this.setStroke(stroke);
            this.setStrokeWidth(width);
            this.setStrokeColor(strokeColor);
        };
        this.measureWidth = function() {
            if (this.remeasure) {
                this.txtCtx.font = this.fontWeight + ` 10px ` + this.fontFamily;
                this.measuredWidth = this.txtCtx.measureText(this.txt).width;
                this.remeasure = false;
            }
            return ~~(this.fontSize / 10 * this.measuredWidth) + this.strokeWidth * 2;
        };
        this.drawTxt = function() {
            this.createCanvas();
            if (this.redraw) {
                this.redraw = false;
                this.txtCanvas.width = this.measureWidth();
                this.txtCanvas.height = this.fontSize + this.margin;
                this.txtCtx.font = this.font;
                this.txtCtx.globalAlpha = 1;
                this.txtCtx.lineWidth = this.strokeWidth;
                this.txtCtx.strokeStyle = this.strokeColor;
                this.txtCtx.fillStyle = this.color;
                if (this.stroke) {
                    this.txtCtx.strokeText(this.txt, this.strokeWidth, this.fontSize - this.margin / 2);
                }
                this.txtCtx.fillText(this.txt, this.strokeWidth, this.fontSize - this.margin / 2);
            }
            return this.txtCanvas;
        };
    }