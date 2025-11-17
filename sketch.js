let objs = [];
let colors = ['#f71735', '#f7d002', '#1A53C0', '#232323'];

// 選單相關變數
let menuX = -250; // 選單起始位置（隱藏狀態）
let showIframe = false; // 控制 iframe 顯示
let iframeElement = null; // 儲存 iframe 元素
let closeButtonX; // 關閉按鈕 X 座標
let closeButtonY = 20; // 關閉按鈕 Y 座標
let closeButtonSize = 30; // 關閉按鈕大小
let targetMenuX = -250; // 選單目標位置
let menuWidth = 250; // 選單寬度

// 🐾 按鈕相關變數
let menuButtonSize = 40; // 🐾 按鈕大小
let menuButtonX = 20; // 🐾 按鈕 X 座標
let menuButtonY; // 🐾 按鈕 Y 座標 (在 setup 或 draw 中計算為 height/2)


// ⭐️ 選單項目
// 注意：'作品筆記' 已被移動到 '測驗卷' (索引 3) 的後面，即索引 4。
let menuItems = ['第一單元作品', '第一單元講義', '測驗卷', '作品筆記', '淡江大學', '教育科技系', '回到首頁']; 
let menuItemHeight = 50; // 選單項目高度
const QUIZ_URL = 'https://hanxiang0618-arch.github.io/111/'; // 測驗卷的目標網址
const TKU_URL = 'https://www.tku.edu.tw/'; // 淡江大學 URL 
const ET_URL = 'https://www.et.tku.edu.tw/'; // 教育科技系 URL 
const NOTE_URL = 'https://hackmd.io/@xiangli1234567899/HyQ4dHRole'; // 作品筆記的 URL

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    objs.push(new DynamicShape());
    
    // 創建並設置 iframe
    iframeElement = document.createElement('iframe');
    iframeElement.style.position = 'absolute';
    
    // 設置 iframe 尺寸和位置 (寬 70%, 高 85%)
    iframeElement.style.width = (windowWidth * 0.7) + 'px'; 
    iframeElement.style.height = (windowHeight * 0.85) + 'px';
    iframeElement.style.left = (windowWidth * 0.15) + 'px';
    iframeElement.style.top = (windowHeight * 0.075) + 'px'; // 讓上下置中
    
    iframeElement.style.border = 'none';
    iframeElement.style.display = 'none';
    iframeElement.style.zIndex = '1500'; // 確保在畫布之上
    document.body.appendChild(iframeElement);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    
    // 調整 iframe 大小和位置
    if (iframeElement) {
        iframeElement.style.width = (windowWidth * 0.7) + 'px';
        iframeElement.style.height = (windowHeight * 0.85) + 'px';
        iframeElement.style.left = (windowWidth * 0.15) + 'px';
        iframeElement.style.top = (windowHeight * 0.075) + 'px';
    }
}

function mouseClicked() {
    // 1. 檢查是否點擊關閉按鈕 (所有模式優先處理)
    if (showIframe && 
        mouseX > closeButtonX - closeButtonSize/2 && 
        mouseX < closeButtonX + closeButtonSize/2 && 
        mouseY > closeButtonY - closeButtonSize/2 && 
        mouseY < closeButtonY + closeButtonSize/2) {
        
        iframeElement.style.display = 'none';
        iframeElement.src = ''; // 清空 src 釋放資源
        showIframe = false;
        return;
    }
    
    // 2. 處理 🐾 按鈕點擊切換選單的邏輯 (僅在手機模式啟用)
    // 假設 width < 800px 為手機模式
    if (windowWidth < 800) {
        let btnHalfSize = menuButtonSize / 2;
        if (mouseX > menuButtonX - btnHalfSize && 
            mouseX < menuButtonX + btnHalfSize && 
            mouseY > menuButtonY - btnHalfSize && 
            mouseY < menuButtonY + btnHalfSize) {
            
            // 切換選單狀態
            if (targetMenuX === -250) {
                targetMenuX = 0; // 顯示選單
            } else {
                targetMenuX = -250; // 隱藏選單
            }
            return; // 處理完畢，不再繼續檢查選單項
        }
    }


    // 3. 處理點擊選單項目 (在選單可見時，所有模式通用)
    if (menuX > -50) { 
        for (let i = 0; i < menuItems.length; i++) {
            let y = height/3 + i * menuItemHeight;
            if (mouseX >= menuX && mouseX <= menuX + menuWidth &&
                mouseY >= y - menuItemHeight/2 && mouseY <= y + menuItemHeight/2) {
                
                // 處理選單項目點擊和網址載入
                let urlToLoad = '';
                let isReload = false;

                switch(i) {
                    case 0: urlToLoad = 'https://hanxiang0618-arch.github.io/20251024/'; break; // 第一單元作品
                    case 1: urlToLoad = 'https://hackmd.io/@xiangli1234567899/SJMHuB0jex'; break; // 第一單元講義
                    case 2: urlToLoad = QUIZ_URL; break; // 測驗卷
                    case 3: urlToLoad = NOTE_URL; break; // <-- 作品筆記 (新索引)
                    case 4: urlToLoad = TKU_URL; break; // 淡江大學 (新索引)
                    case 5: urlToLoad = ET_URL; break; // 教育科技系 (新索引)
                    case 6: 
                        isReload = true; // 回到首頁
                        break;
                }
                
                if (isReload) {
                    // 點擊「回到首頁」時，直接重新載入當前頁面
                    window.location.reload();
                } else if (urlToLoad !== '') {
                    // 處理 iframe 顯示/隱藏切換
                    if (showIframe && iframeElement.src === urlToLoad) {
                        iframeElement.style.display = 'none';
                        iframeElement.src = ''; 
                        showIframe = false;
                    } else {
                        iframeElement.src = urlToLoad;
                        iframeElement.style.display = 'block';
                        showIframe = true;
                    }
                }
                
                // 點擊選單項目後自動隱藏選單
                targetMenuX = -250; 
                
                return; // 處理完畢，退出循環
            }
        }
    }
}

function draw() {
    background(255);
    
    // 計算 🐾 按鈕 Y 座標 (保持居中)
    menuButtonY = height / 2;

    for (let i of objs) {
        i.run();
    }

    // 在首頁中間顯示文字（僅當 iframe 未顯示時）
    if (!showIframe) {
        push();
        textAlign(CENTER, CENTER);
        let baseSize = constrain(floor(width * 0.05), 20, 110);
        textSize(baseSize);
        let label = '淡江大學 李O祥 0662';
        let tw = textWidth(label);
        let th = baseSize;
        let padX = tw * 0.25;
        let padY = th * 0.25;

        rectMode(CENTER);
        noStroke();
        fill(32, 32, 32, 200);
        rect(width/2, height/2, tw + padX * 2, th + padY * 2, 12);
        fill(255);
        text(label, width / 2, height / 2);
        pop();
    }

    // 繪製 🐾 按鈕：僅在手機模式 (寬度 < 800) 且選單隱藏時顯示
    if (windowWidth < 800 && targetMenuX === -250) {
        drawMenuButton();
    } 

    // ⭐【選單顯示邏輯控制】
    if (windowWidth >= 800) { 
        // 電腦模式：使用滑鼠懸停控制
        if (mouseX < 100) {
            targetMenuX = 0; // 滑鼠懸停，打開選單
        } else {
            // 只有當選單不是被鎖定在打開狀態（例如被手機模式點擊打開）時才關閉
            targetMenuX = -250; // 滑鼠移開，關閉選單
        }
    } 
    // 注意：手機模式下，targetMenuX 的改變完全依賴 mouseClicked() 中的 🐾 按鈕點擊。
    // ⭐【選單顯示邏輯控制 END】

    // 🚀【控制選單平滑動畫：統一使用慢速平滑過渡 (緩慢拉出)】
    menuX = lerp(menuX, targetMenuX, 0.1);

    // 繪製選單
    drawMenu();
    
    // 繪製關閉按鈕
    drawCloseButton();

    // 動態形狀生成與移除邏輯保持不變
    if (frameCount % int(random([15, 30])) == 0) {
        let addNum = int(random(1, 30));
        for (let i = 0; i < addNum; i++) {
            objs.push(new DynamicShape());
        }
    }
    for (let i = 0; i < objs.length; i++) {
        if (objs[i].isDead) {
            objs.splice(i, 1);
        }
    }
}

// 繪製 🐾 按鈕的函式
function drawMenuButton() {
    push();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    
    // 繪製半透明背景圓圈
    noStroke();
    fill(32, 32, 32, 180); // 深色半透明
    ellipse(menuButtonX, menuButtonY, menuButtonSize + 10);
    
    // 繪製 🐾 文字
    textSize(menuButtonSize * 0.7);
    fill(255);
    text('🐾', menuButtonX, menuButtonY + 3); // 微調 Y 座標讓圖案看起來更置中
    pop();
}


function easeInOutExpo(x) {
    return x === 0 ? 0 :
        x === 1 ?
        1 :
        x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 :
        (2 - Math.pow(2, -20 * x + 10)) / 2;
}

function drawCloseButton() {
    if (showIframe) {
        push();
        // 設置關閉按鈕位置 (與 iframe 右側邊緣對齊)
        closeButtonX = windowWidth * 0.85 + closeButtonSize / 2;
        closeButtonX -= 5; 
        
        // 繪製關閉按鈕
        stroke(50);
        strokeWeight(2);
        fill(200, 0, 0);
        rectMode(CENTER);
        rect(closeButtonX, closeButtonY, closeButtonSize, closeButtonSize, 5);
        
        // 繪製 X 符號
        stroke(255);
        strokeWeight(2);
        line(closeButtonX - 8, closeButtonY - 8, closeButtonX + 8, closeButtonY + 8);
        line(closeButtonX + 8, closeButtonY - 8, closeButtonX - 8, closeButtonY + 8);
        pop();
    }
}

function drawMenu() {
    // 繪製選單背景
    push();
    rectMode(CORNER);   // 切換到 CORNER 模式
    fill(32, 32, 32, 220);
    noStroke();
    rect(menuX, 0, menuWidth, height);

    // 繪製選單項目
    textSize(32);
    textAlign(LEFT, CENTER);
    for (let i = 0; i < menuItems.length; i++) {
        let y = height/3 + i * menuItemHeight;
        
        // 檢查滑鼠是否懸停在選單項目上
        if (mouseX >= menuX && mouseX <= menuX + menuWidth &&
            mouseY >= y - menuItemHeight/2 && mouseY <= y + menuItemHeight/2) {
            fill(200, 200, 200);
        } else {
            fill(255);
        }
        
        // 在設置顏色後立即繪製文字
        text(menuItems[i], menuX + 20, y);
    }
    pop();
}

class DynamicShape {
    constructor() {
        this.x = random(0.3, 0.7) * width;
        this.y = random(0.3, 0.7) * height;
        this.reductionRatio = 1;
        this.shapeType = int(random(4));
        this.animationType = 0;
        this.maxActionPoints = int(random(2, 5));
        this.actionPoints = this.maxActionPoints;
        this.elapsedT = 0;
        this.size = 0;
        this.sizeMax = width * random(0.01, 0.05);
        this.fromSize = 0;
        this.init();
        this.isDead = false;
        this.clr = random(colors);
        this.changeShape = true;
        this.ang = int(random(2)) * PI * 0.25;
        this.lineSW = 0;
    }

    show() {
        push();
        translate(this.x, this.y);
        if (this.animationType == 1) scale(1, this.reductionRatio);
        if (this.animationType == 2) scale(this.reductionRatio, 1);
        fill(this.clr);
        stroke(this.clr);
        strokeWeight(this.size * 0.05);
        if (this.shapeType == 0) {
            noStroke();
            circle(0, 0, this.size);
        } else if (this.shapeType == 1) {
            noFill();
            circle(0, 0, this.size);
        } else if (this.shapeType == 2) {
            noStroke();
            rect(0, 0, this.size, this.size);
        } else if (this.shapeType == 3) {
            noFill();
            rect(0, 0, this.size * 0.9, this.size * 0.9);
        } else if (this.shapeType == 4) {
            line(0, -this.size * 0.45, 0, this.size * 0.45);
            line(-this.size * 0.45, 0, this.size * 0.45, 0);
        }
        pop();
        strokeWeight(this.lineSW);
        stroke(this.clr);
        line(this.x, this.y, this.fromX, this.fromY);
    }

    move() {
        let n = easeInOutExpo(norm(this.elapsedT, 0, this.duration));
        if (0 < this.elapsedT && this.elapsedT < this.duration) {
            if (this.actionPoints == this.maxActionPoints) {
                this.size = lerp(0, this.sizeMax, n);
            } else if (this.actionPoints > 0) {
                if (this.animationType == 0) {
                    this.size = lerp(this.fromSize, this.toSize, n);
                } else if (this.animationType == 1) {
                    this.x = lerp(this.fromX, this.toX, n);
                    this.lineSW = lerp(0, this.size / 5, sin(n * PI));
                } else if (this.animationType == 2) {
                    this.y = lerp(this.fromY, this.toY, n);
                    this.lineSW = lerp(0, this.size / 5, sin(n * PI));
                } else if (this.animationType == 3) {
                    if (this.changeShape == true) {
                        this.shapeType = int(random(5));
                        this.changeShape = false;
                    }
                }
                this.reductionRatio = lerp(1, 0.3, sin(n * PI));
            } else {
                this.size = lerp(this.fromSize, 0, n);
            }
        }

        this.elapsedT++;
        if (this.elapsedT > this.duration) {
            this.actionPoints--;
            this.init();
        }
        if (this.actionPoints < 0) {
            this.isDead = true;
        }
    }

    run() {
        this.show();
        this.move();
    }

    init() {
        this.elapsedT = 0;
        this.fromSize = this.size;
        this.toSize = this.sizeMax * random(0.5, 1.5);
        this.fromX = this.x;
        this.toX = this.fromX + (width / 10) * random([-1, 1]) * int(random(1, 4));
        this.fromY = this.y;
        this.toY = this.fromY + (height / 10) * random([-1, 1]) * int(random(1, 4));
        this.animationType = int(random(3));
        this.duration = random(20, 50);
    }
}