/* ============================================
   PixelCraft - Professional Photo Editor
   Main Application Script
   ============================================ */

(function () {
    'use strict';

    // ===== APP STATE =====
    const state = {
        canvas: null,
        originalImage: null,
        originalImageData: null,
        currentTool: 'select',
        zoom: 1,
        history: [],
        historyIndex: -1,
        maxHistory: 50,
        isDirty: false,
        cropRect: null,
        isCropping: false,
        isDrawingShape: false,
        shapeStartX: 0,
        shapeStartY: 0,
        currentFilter: 'none',
        clipboard: null,
        bgImageObj: null,
        realWidth: 0,
        realHeight: 0,
    };

    // ===== STICKERS DATA =====
    const stickersData = {
        emoji: ['😀','😂','😍','🥰','😎','🤩','😇','🤗','🤔','😴','🥳','😱','🤯','👻','💀','👽','🤖','💩','🎃','🎅','🐱','🐶','🦊','🐻','🐸','🐵','🦁','🐯','🐼','🐨','🌸','🌺','🌻','🌈','⭐','🌙','☀️','❄️','🔥','💧'],
        symbols: ['❤️','💛','💚','💙','💜','🖤','💯','✅','❌','⭕','💫','💥','💢','💤','💦','✨','🎵','🎶','📌','🔔','🏆','🎯','🎲','🧩','🎭','🎪','📷','🎬','💡','🔑'],
        arrows: ['➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','↩️','↪️','🔄','🔃','▶️','◀️','🔼','🔽','⏩','⏪','⏫','⏬'],
        hearts: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','♥️'],
    };

    // ===== DOM REFERENCES =====
    const dom = {};

    function cacheDom() {
        // Screens
        dom.welcomeScreen = document.getElementById('welcomeScreen');
        dom.editorContainer = document.getElementById('editorContainer');
        // Welcome
        dom.welcomeUpload = document.getElementById('welcomeUpload');
        dom.welcomeBlank = document.getElementById('welcomeBlank');
        dom.welcomeDropZone = document.getElementById('welcomeDropZone');
        // Canvas
        dom.canvasArea = document.getElementById('canvasArea');
        dom.canvasWrapper = document.getElementById('canvasWrapper');
        // Toolbar
        dom.fileUpload = document.getElementById('fileUpload');
        dom.undoToolbar = document.getElementById('undoToolbar');
        dom.redoToolbar = document.getElementById('redoToolbar');
        dom.zoomIn = document.getElementById('zoomIn');
        dom.zoomOut = document.getElementById('zoomOut');
        dom.zoomFit = document.getElementById('zoomFit');
        dom.zoomLevel = document.getElementById('zoomLevel');
        dom.canvasInfo = document.getElementById('canvasInfo');
        dom.toggleDarkMode = document.getElementById('toggleDarkMode');
        dom.fullscreenBtn = document.getElementById('fullscreenBtn');
        dom.exportBtn = document.getElementById('exportBtn');
        dom.backToHome = document.getElementById('backToHome');
        // File menu
        dom.saveJPG = document.getElementById('saveJPG');
        dom.savePNG = document.getElementById('savePNG');
        dom.saveWEBP = document.getElementById('saveWEBP');
        dom.resetImage = document.getElementById('resetImage');
        dom.clearCanvas = document.getElementById('clearCanvas');
        // Edit menu
        dom.undoBtn = document.getElementById('undoBtn');
        dom.redoBtn = document.getElementById('redoBtn');
        dom.copyBtn = document.getElementById('copyBtn');
        dom.pasteBtn = document.getElementById('pasteBtn');
        dom.deleteBtn = document.getElementById('deleteBtn');
        // Adjustments
        dom.brightness = document.getElementById('brightness');
        dom.contrast = document.getElementById('contrast');
        dom.saturation = document.getElementById('saturation');
        dom.exposure = document.getElementById('exposure');
        dom.hue = document.getElementById('hue');
        dom.temperature = document.getElementById('temperature');
        dom.blur = document.getElementById('blur');
        dom.sharpen = document.getElementById('sharpen');
        dom.noise = document.getElementById('noise');
        dom.vignette = document.getElementById('vignette');
        dom.resetAdjustments = document.getElementById('resetAdjustments');
        // Filters
        dom.filterIntensity = document.getElementById('filterIntensity');
        // Crop
        dom.cropX = document.getElementById('cropX');
        dom.cropY = document.getElementById('cropY');
        dom.cropW = document.getElementById('cropW');
        dom.cropH = document.getElementById('cropH');
        dom.applyCrop = document.getElementById('applyCrop');
        dom.cancelCrop = document.getElementById('cancelCrop');
        // Resize
        dom.resizeW = document.getElementById('resizeW');
        dom.resizeH = document.getElementById('resizeH');
        dom.lockAspect = document.getElementById('lockAspect');
        dom.applyResize = document.getElementById('applyResize');
        // Rotate
        dom.rotateCW = document.getElementById('rotateCW');
        dom.rotateCCW = document.getElementById('rotateCCW');
        dom.rotate180 = document.getElementById('rotate180');
        dom.freeRotate = document.getElementById('freeRotate');
        dom.flipH = document.getElementById('flipH');
        dom.flipV = document.getElementById('flipV');
        // Brush
        dom.brushSize = document.getElementById('brushSize');
        dom.brushOpacity = document.getElementById('brushOpacity');
        dom.brushColor = document.getElementById('brushColor');
        // Eraser
        dom.eraserSize = document.getElementById('eraserSize');
        // Shapes
        dom.shapeFill = document.getElementById('shapeFill');
        dom.shapeStroke = document.getElementById('shapeStroke');
        dom.shapeStrokeWidth = document.getElementById('shapeStrokeWidth');
        dom.shapeOpacity = document.getElementById('shapeOpacity');
        dom.shapeFilled = document.getElementById('shapeFilled');
        // Line
        dom.lineColor = document.getElementById('lineColor');
        dom.lineWidth = document.getElementById('lineWidth');
        // Text
        dom.addText = document.getElementById('addText');
        dom.fontFamily = document.getElementById('fontFamily');
        dom.fontSize = document.getElementById('fontSize');
        dom.textBold = document.getElementById('textBold');
        dom.textItalic = document.getElementById('textItalic');
        dom.textUnderline = document.getElementById('textUnderline');
        dom.textStrike = document.getElementById('textStrike');
        dom.textColor = document.getElementById('textColor');
        dom.textBgColor = document.getElementById('textBgColor');
        dom.textBgEnabled = document.getElementById('textBgEnabled');
        dom.textShadow = document.getElementById('textShadow');
        dom.textSpacing = document.getElementById('textSpacing');
        // Stickers
        dom.stickersGrid = document.getElementById('stickersGrid');
        // Watermark
        dom.watermarkText = document.getElementById('watermarkText');
        dom.watermarkSize = document.getElementById('watermarkSize');
        dom.watermarkOpacity = document.getElementById('watermarkOpacity');
        dom.watermarkColor = document.getElementById('watermarkColor');
        dom.addWatermark = document.getElementById('addWatermark');
        dom.tileWatermark = document.getElementById('tileWatermark');
        // Frames
        dom.frameColor = document.getElementById('frameColor');
        dom.frameWidth = document.getElementById('frameWidth');
        // BG Remover
        dom.bgRemoveColor = document.getElementById('bgRemoveColor');
        dom.bgTolerance = document.getElementById('bgTolerance');
        dom.removeBg = document.getElementById('removeBg');
        dom.pickBgColor = document.getElementById('pickBgColor');
        // Object Properties
        dom.objX = document.getElementById('objX');
        dom.objY = document.getElementById('objY');
        dom.objW = document.getElementById('objW');
        dom.objH = document.getElementById('objH');
        dom.objOpacity = document.getElementById('objOpacity');
        dom.objRotation = document.getElementById('objRotation');
        dom.bringForward = document.getElementById('bringForward');
        dom.sendBackward = document.getElementById('sendBackward');
        dom.duplicateObj = document.getElementById('duplicateObj');
        dom.deleteObj = document.getElementById('deleteObj');
        // Layers
        dom.layersList = document.getElementById('layersList');
        dom.toggleLayers = document.getElementById('toggleLayers');
        dom.layersBody = document.getElementById('layersBody');
        // Export Modal
        dom.exportModal = document.getElementById('exportModal');
        dom.closeExportModal = document.getElementById('closeExportModal');
        dom.exportQuality = document.getElementById('exportQuality');
        dom.exportPreview = document.getElementById('exportPreview');
        dom.exportFileSize = document.getElementById('exportFileSize');
        dom.cancelExport = document.getElementById('cancelExport');
        dom.confirmExport = document.getElementById('confirmExport');
        // Blank Canvas Modal
        dom.blankCanvasModal = document.getElementById('blankCanvasModal');
        dom.closeBlankModal = document.getElementById('closeBlankModal');
        dom.blankW = document.getElementById('blankW');
        dom.blankH = document.getElementById('blankH');
        dom.blankBg = document.getElementById('blankBg');
        dom.cancelBlank = document.getElementById('cancelBlank');
        dom.createBlank = document.getElementById('createBlank');
        // Status
        dom.toolStatus = document.getElementById('toolStatus');
        dom.mousePos = document.getElementById('mousePos');
        dom.imageSize = document.getElementById('imageSize');
        dom.fileSize = document.getElementById('fileSize');
        // Toast
        dom.toastContainer = document.getElementById('toastContainer');
        // Global Colors
        dom.fillColor = document.getElementById('fillColor');
        dom.strokeColor = document.getElementById('strokeColor');
    }

    // ===== INIT =====
    function init() {
        cacheDom();
        initCanvas();
        bindEvents();
        populateStickers('emoji');
        showToast('Welcome to PixelCraft!', 'info');
    }

    function initCanvas() {
        state.canvas = new fabric.Canvas('mainCanvas', {
            preserveObjectStacking: true,
            selection: true,
            backgroundColor: '#ffffff',
            width: 800,
            height: 600,
        });

        state.canvas.on('mouse:move', onCanvasMouseMove);
        state.canvas.on('object:selected', onObjectSelected);
        state.canvas.on('selection:created', onObjectSelected);
        state.canvas.on('selection:updated', onObjectSelected);
        state.canvas.on('selection:cleared', onSelectionCleared);
        state.canvas.on('object:modified', () => { saveHistory(); updateLayers(); });
        state.canvas.on('object:added', () => { updateLayers(); });
        state.canvas.on('object:removed', () => { updateLayers(); });

        updateCanvasInfo();
    }

    // ===== EVENT BINDINGS =====
    function bindEvents() {
        // Welcome Screen
        dom.welcomeUpload.addEventListener('change', handleFileUpload);
        dom.welcomeBlank.addEventListener('click', () => showModal('blankCanvasModal'));
        
        // Drag & Drop on welcome
        dom.welcomeDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dom.welcomeDropZone.classList.add('drag-over');
        });
        dom.welcomeDropZone.addEventListener('dragleave', () => {
            dom.welcomeDropZone.classList.remove('drag-over');
        });
        dom.welcomeDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dom.welcomeDropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length) {
                loadImageFile(e.dataTransfer.files[0]);
            }
        });

        // Drag & Drop on canvas
        dom.canvasArea.addEventListener('dragover', (e) => e.preventDefault());
        dom.canvasArea.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length) {
                loadImageFile(e.dataTransfer.files[0]);
            }
        });

        // File menu
        dom.fileUpload.addEventListener('change', handleFileUpload);
        dom.saveJPG.addEventListener('click', () => downloadImage('jpeg'));
        dom.savePNG.addEventListener('click', () => downloadImage('png'));
        dom.saveWEBP.addEventListener('click', () => downloadImage('webp'));
        dom.resetImage.addEventListener('click', resetToOriginal);
        dom.clearCanvas.addEventListener('click', clearCanvasFull);

        // Edit menu
        dom.undoBtn.addEventListener('click', undo);
        dom.redoBtn.addEventListener('click', redo);
        dom.copyBtn.addEventListener('click', copyObject);
        dom.pasteBtn.addEventListener('click', pasteObject);
        dom.deleteBtn.addEventListener('click', deleteSelected);

        // Toolbar actions
        dom.undoToolbar.addEventListener('click', undo);
        dom.redoToolbar.addEventListener('click', redo);
        dom.zoomIn.addEventListener('click', () => setZoom(state.zoom + 0.1));
        dom.zoomOut.addEventListener('click', () => setZoom(state.zoom - 0.1));
        dom.zoomFit.addEventListener('click', zoomToFit);
        dom.toggleDarkMode.addEventListener('click', toggleDarkMode);
        dom.fullscreenBtn.addEventListener('click', toggleFullscreen);
        dom.exportBtn.addEventListener('click', openExportModal);
        dom.backToHome.addEventListener('click', goHome);

        // Tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => selectTool(btn.dataset.tool));
        });

        // Adjustment sliders
        const adjustSliders = ['brightness', 'contrast', 'saturation', 'exposure', 'hue', 'temperature', 'blur', 'sharpen', 'noise', 'vignette'];
        adjustSliders.forEach(name => {
            const slider = document.getElementById(name);
            if (slider) {
                slider.addEventListener('input', () => {
                    document.getElementById(name + 'Value').textContent = slider.value;
                    applyAdjustments();
                });
            }
        });
        dom.resetAdjustments.addEventListener('click', resetAdjustments);

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.currentFilter = btn.dataset.filter;
                applyFilter(btn.dataset.filter);
            });
        });
        dom.filterIntensity.addEventListener('input', () => {
            document.getElementById('filterIntensityValue').textContent = dom.filterIntensity.value;
            applyFilter(state.currentFilter);
        });

        // Crop
        document.querySelectorAll('[data-ratio]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-ratio]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                startCrop(btn.dataset.ratio);
            });
        });
        dom.applyCrop.addEventListener('click', applyCrop);
        dom.cancelCrop.addEventListener('click', cancelCrop);

        // Resize
        dom.resizeW.addEventListener('input', () => {
            if (dom.lockAspect.checked && state.bgImageObj) {
                const ratio = state.bgImageObj.height / state.bgImageObj.width;
                dom.resizeH.value = Math.round(parseInt(dom.resizeW.value) * ratio);
            }
        });
        dom.resizeH.addEventListener('input', () => {
            if (dom.lockAspect.checked && state.bgImageObj) {
                const ratio = state.bgImageObj.width / state.bgImageObj.height;
                dom.resizeW.value = Math.round(parseInt(dom.resizeH.value) * ratio);
            }
        });
        document.querySelectorAll('[data-size]').forEach(btn => {
            btn.addEventListener('click', () => {
                const [w, h] = btn.dataset.size.split('x').map(Number);
                dom.resizeW.value = w;
                dom.resizeH.value = h;
            });
        });
        dom.applyResize.addEventListener('click', applyResize);

        // Rotate
        dom.rotateCW.addEventListener('click', () => rotateCanvas(90));
        dom.rotateCCW.addEventListener('click', () => rotateCanvas(-90));
        dom.rotate180.addEventListener('click', () => rotateCanvas(180));
        dom.freeRotate.addEventListener('input', () => {
            document.getElementById('rotateValue').textContent = dom.freeRotate.value + '°';
            freeRotateImage(parseInt(dom.freeRotate.value));
        });
        dom.flipH.addEventListener('click', () => flipImage('horizontal'));
        dom.flipV.addEventListener('click', () => flipImage('vertical'));

        // Brush
        dom.brushSize.addEventListener('input', () => {
            document.getElementById('brushSizeValue').textContent = dom.brushSize.value;
            setBrushSettings();
        });
        dom.brushOpacity.addEventListener('input', () => {
            document.getElementById('brushOpacityValue').textContent = dom.brushOpacity.value;
            setBrushSettings();
        });
        dom.brushColor.addEventListener('input', setBrushSettings);
        document.querySelectorAll('[data-brush]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-brush]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                setBrushType(btn.dataset.brush);
            });
        });

        // Eraser
        dom.eraserSize.addEventListener('input', () => {
            document.getElementById('eraserSizeValue').textContent = dom.eraserSize.value;
            setEraserSettings();
        });

        // Shapes
        document.querySelectorAll('.shape-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        dom.shapeStrokeWidth.addEventListener('input', () => {
            document.getElementById('shapeStrokeWidthValue').textContent = dom.shapeStrokeWidth.value;
        });
        dom.shapeOpacity.addEventListener('input', () => {
            document.getElementById('shapeOpacityValue').textContent = dom.shapeOpacity.value;
        });

        // Line
        dom.lineWidth.addEventListener('input', () => {
            document.getElementById('lineWidthValue').textContent = dom.lineWidth.value;
        });

        // Text
        dom.addText.addEventListener('click', addTextToCanvas);
        dom.fontFamily.addEventListener('change', updateSelectedText);
        dom.fontSize.addEventListener('input', () => {
            document.getElementById('fontSizeValue').textContent = dom.fontSize.value;
            updateSelectedText();
        });
        dom.textBold.addEventListener('click', () => toggleTextStyle('bold'));
        dom.textItalic.addEventListener('click', () => toggleTextStyle('italic'));
        dom.textUnderline.addEventListener('click', () => toggleTextStyle('underline'));
        dom.textStrike.addEventListener('click', () => toggleTextStyle('linethrough'));
        dom.textColor.addEventListener('input', updateSelectedText);
        dom.textBgColor.addEventListener('input', updateSelectedText);
        dom.textBgEnabled.addEventListener('change', updateSelectedText);
        dom.textShadow.addEventListener('input', () => {
            document.getElementById('textShadowValue').textContent = dom.textShadow.value;
            updateSelectedText();
        });
        dom.textSpacing.addEventListener('input', () => {
            document.getElementById('textSpacingValue').textContent = dom.textSpacing.value;
            updateSelectedText();
        });
        document.querySelectorAll('[data-align]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-align]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateSelectedText();
            });
        });

        // Stickers categories
        document.querySelectorAll('[data-cat]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                populateStickers(btn.dataset.cat);
            });
        });

        // Watermark
        dom.addWatermark.addEventListener('click', addWatermark);
        dom.tileWatermark.addEventListener('click', tileWatermark);
        dom.watermarkSize.addEventListener('input', () => {
            document.getElementById('watermarkSizeValue').textContent = dom.watermarkSize.value;
        });
        dom.watermarkOpacity.addEventListener('input', () => {
            document.getElementById('watermarkOpacityValue').textContent = dom.watermarkOpacity.value;
        });

        // Frames
        document.querySelectorAll('.frame-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.frame-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyFrame(btn.dataset.frame);
            });
        });
        dom.frameWidth.addEventListener('input', () => {
            document.getElementById('frameWidthValue').textContent = dom.frameWidth.value;
        });

        // BG Remover
        dom.removeBg.addEventListener('click', removeBackground);
        dom.pickBgColor.addEventListener('click', enableColorPicker);
        dom.bgTolerance.addEventListener('input', () => {
            document.getElementById('bgToleranceValue').textContent = dom.bgTolerance.value;
        });

        // Object Properties
        dom.objOpacity.addEventListener('input', () => {
            document.getElementById('objOpacityValue').textContent = dom.objOpacity.value;
            updateObjectProperty('opacity', parseInt(dom.objOpacity.value) / 100);
        });
        dom.objRotation.addEventListener('input', () => {
            document.getElementById('objRotationValue').textContent = dom.objRotation.value + '°';
            updateObjectProperty('angle', parseInt(dom.objRotation.value));
        });
        dom.objX.addEventListener('change', () => updateObjectProperty('left', parseInt(dom.objX.value)));
        dom.objY.addEventListener('change', () => updateObjectProperty('top', parseInt(dom.objY.value)));
        dom.bringForward.addEventListener('click', () => {
            const obj = state.canvas.getActiveObject();
            if (obj) { state.canvas.bringForward(obj); state.canvas.renderAll(); }
        });
        dom.sendBackward.addEventListener('click', () => {
            const obj = state.canvas.getActiveObject();
            if (obj) { state.canvas.sendBackwards(obj); state.canvas.renderAll(); }
        });
        dom.duplicateObj.addEventListener('click', duplicateObject);
        dom.deleteObj.addEventListener('click', deleteSelected);

        // Layers toggle
        dom.toggleLayers.addEventListener('click', () => {
            dom.layersBody.classList.toggle('hidden');
            dom.toggleLayers.querySelector('i').classList.toggle('fa-chevron-down');
            dom.toggleLayers.querySelector('i').classList.toggle('fa-chevron-up');
        });

        // Export Modal
        dom.closeExportModal.addEventListener('click', () => hideModal('exportModal'));
        dom.cancelExport.addEventListener('click', () => hideModal('exportModal'));
        dom.confirmExport.addEventListener('click', exportImage);
        dom.exportQuality.addEventListener('input', () => {
            document.getElementById('exportQualityValue').textContent = dom.exportQuality.value;
            updateExportPreview();
        });
        document.querySelectorAll('.format-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const qualSection = document.getElementById('qualitySection');
                if (btn.dataset.format === 'png') {
                    qualSection.style.display = 'none';
                } else {
                    qualSection.style.display = 'block';
                }
                updateExportPreview();
            });
        });
        document.querySelectorAll('[data-scale]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-scale]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateExportPreview();
            });
        });

        // Blank Canvas Modal
        dom.closeBlankModal.addEventListener('click', () => hideModal('blankCanvasModal'));
        dom.cancelBlank.addEventListener('click', () => hideModal('blankCanvasModal'));
        dom.createBlank.addEventListener('click', createBlankCanvas);
        document.querySelectorAll('[data-bsize]').forEach(btn => {
            btn.addEventListener('click', () => {
                const [w, h] = btn.dataset.bsize.split('x').map(Number);
                dom.blankW.value = w;
                dom.blankH.value = h;
            });
        });

        // Dropdown menus
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            const btn = menu.querySelector('.toolbar-btn');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.dropdown-menu').forEach(m => {
                    if (m !== menu) m.classList.remove('open');
                });
                menu.classList.toggle('open');
            });
        });
        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('open'));
        });

        // Keyboard Shortcuts
        document.addEventListener('keydown', handleKeyboard);

        // Canvas mouse events for shape/line drawing
        state.canvas.on('mouse:down', onCanvasMouseDown);
        state.canvas.on('mouse:move', onCanvasMouseMoveDraw);
        state.canvas.on('mouse:up', onCanvasMouseUp);

        // Window resize
        window.addEventListener('resize', debounce(handleResize, 200));
    }

    // ===== FILE HANDLING =====
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) loadImageFile(file);
    }

    function loadImageFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Please upload a valid image file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            loadImageToCanvas(event.target.result);
        };
        reader.readAsDataURL(file);

        const sizeKB = (file.size / 1024).toFixed(1);
        dom.fileSize.textContent = sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB';
    }

    function loadImageToCanvas(dataUrl) {
        fabric.Image.fromURL(dataUrl, function (img) {
            state.originalImage = dataUrl;

            // Use the actual image dimensions
            const origW = img.width;
            const origH = img.height;

            // Set canvas to the actual image size
            state.canvas.setWidth(origW);
            state.canvas.setHeight(origH);
            state.canvas.setZoom(1);

            // Scale image to exactly fill canvas 1:1
            img.set({
                left: 0,
                top: 0,
                scaleX: 1,
                scaleY: 1,
                originX: 'left',
                originY: 'top',
            });

            state.canvas.setBackgroundImage(img, state.canvas.renderAll.bind(state.canvas));

            state.bgImageObj = img;
            state.originalImageData = state.canvas.toJSON();

            // Store real dimensions
            state.realWidth = origW;
            state.realHeight = origH;

            // Update UI
            dom.resizeW.value = origW;
            dom.resizeH.value = origH;
            dom.imageSize.textContent = origW + ' x ' + origH;
            updateCanvasInfo();

            // Switch to editor and fit to screen
            showEditor();
            saveHistory();
            // Small delay to let the DOM settle before calculating fit
            setTimeout(() => zoomToFit(), 50);
            showToast('Image loaded successfully!', 'success');
        }, { crossOrigin: 'anonymous' });
    }

    function createBlankCanvas() {
        const w = parseInt(dom.blankW.value) || 800;
        const h = parseInt(dom.blankH.value) || 600;
        const bg = dom.blankBg.value;

        // Show editor FIRST so canvas is visible before resizing
        // (Fabric.js can't properly size a canvas inside display:none)
        hideModal('blankCanvasModal');
        showEditor();

        setTimeout(() => {
            state.canvas.clear();
            state.canvas.setWidth(w);
            state.canvas.setHeight(h);
            state.canvas.setBackgroundColor(bg, state.canvas.renderAll.bind(state.canvas));

            state.bgImageObj = null;
            state.originalImage = null;
            state.realWidth = w;
            state.realHeight = h;

            dom.resizeW.value = w;
            dom.resizeH.value = h;
            dom.imageSize.textContent = w + ' x ' + h;
            updateCanvasInfo();

            saveHistory();
            zoomToFit();
            showToast('Blank canvas created!', 'success');
        }, 50);
    }

    // ===== SCREEN MANAGEMENT =====
    function showEditor() {
        dom.welcomeScreen.classList.add('hidden');
        dom.editorContainer.classList.remove('hidden');
        handleResize();
    }

    function goHome() {
        dom.welcomeScreen.classList.remove('hidden');
        dom.editorContainer.classList.add('hidden');
    }

    // ===== TOOL SELECTION =====
    function selectTool(tool) {
        state.currentTool = tool;

        // Update buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });

        // Disable drawing mode
        state.canvas.isDrawingMode = false;
        state.canvas.selection = true;
        state.canvas.defaultCursor = 'default';
        state.isDrawingShape = false;

        // Cancel any crop in progress
        if (tool !== 'crop') {
            cancelCrop();
        }

        // Show relevant panel
        showPanel(tool);

        // Set up tool-specific behavior
        switch (tool) {
            case 'select':
                state.canvas.defaultCursor = 'default';
                break;
            case 'hand':
                state.canvas.defaultCursor = 'grab';
                state.canvas.selection = false;
                break;
            case 'crop':
                startCrop('free');
                break;
            case 'brush':
                state.canvas.isDrawingMode = true;
                setBrushSettings();
                break;
            case 'eraser':
                state.canvas.isDrawingMode = true;
                setEraserSettings();
                break;
            case 'shapes':
                state.canvas.selection = false;
                state.canvas.defaultCursor = 'crosshair';
                break;
            case 'line':
                state.canvas.selection = false;
                state.canvas.defaultCursor = 'crosshair';
                break;
            case 'text':
                break;
        }

        dom.toolStatus.textContent = 'Tool: ' + tool.charAt(0).toUpperCase() + tool.slice(1);
    }

    function showPanel(tool) {
        // Hide all panels except Layers
        document.querySelectorAll('.right-sidebar .panel').forEach(panel => {
            if (panel.id !== 'panelLayers') {
                panel.classList.add('hidden');
            }
        });

        // Map tools to panels
        const panelMap = {
            'adjust': 'panelAdjust',
            'filters': 'panelFilters',
            'crop': 'panelCrop',
            'resize': 'panelResize',
            'rotate': 'panelRotate',
            'brush': 'panelBrush',
            'eraser': 'panelEraser',
            'shapes': 'panelShapes',
            'line': 'panelLine',
            'text': 'panelText',
            'sticker': 'panelSticker',
            'watermark': 'panelWatermark',
            'frames': 'panelFrames',
            'bgremover': 'panelBgremover',
            'select': 'panelAdjust',
            'hand': 'panelAdjust',
        };

        const panelId = panelMap[tool];
        if (panelId) {
            document.getElementById(panelId).classList.remove('hidden');
        }
    }

    // ===== HISTORY (UNDO / REDO) =====
    function saveHistory() {
        const json = JSON.stringify(state.canvas.toJSON(['selectable', 'name']));
        
        // Remove future states if we're not at the end
        if (state.historyIndex < state.history.length - 1) {
            state.history = state.history.slice(0, state.historyIndex + 1);
        }

        state.history.push(json);
        if (state.history.length > state.maxHistory) {
            state.history.shift();
        }
        state.historyIndex = state.history.length - 1;
    }

    function undo() {
        if (state.historyIndex > 0) {
            state.historyIndex--;
            loadFromHistory();
            showToast('Undo', 'info');
        }
    }

    function redo() {
        if (state.historyIndex < state.history.length - 1) {
            state.historyIndex++;
            loadFromHistory();
            showToast('Redo', 'info');
        }
    }

    function loadFromHistory() {
        const json = state.history[state.historyIndex];
        state.canvas.loadFromJSON(json, function () {
            state.canvas.renderAll();
            updateLayers();
        });
    }

    // ===== ZOOM =====
    function setZoom(level) {
        state.zoom = Math.max(0.05, Math.min(5, level));
        
        // Use CSS transform on wrapper for clean zoom (preserves canvas internal coords)
        const wrapper = dom.canvasWrapper;
        wrapper.style.transform = `scale(${state.zoom})`;
        wrapper.style.transformOrigin = 'center center';
        
        dom.zoomLevel.textContent = Math.round(state.zoom * 100) + '%';
    }

    function zoomToFit() {
        const areaW = dom.canvasArea.clientWidth - 60;
        const areaH = dom.canvasArea.clientHeight - 60;
        const canvasW = state.realWidth || state.canvas.getWidth();
        const canvasH = state.realHeight || state.canvas.getHeight();
        
        if (canvasW <= 0 || canvasH <= 0) {
            state.zoom = 1;
        } else {
            state.zoom = Math.min(areaW / canvasW, areaH / canvasH, 1);
        }

        // Round to clean value
        state.zoom = Math.round(state.zoom * 100) / 100;
        
        const wrapper = dom.canvasWrapper;
        wrapper.style.transform = `scale(${state.zoom})`;
        wrapper.style.transformOrigin = 'center center';
        
        dom.zoomLevel.textContent = Math.round(state.zoom * 100) + '%';
    }

    // ===== ADJUSTMENTS =====
    function applyAdjustments() {
        const bgImage = state.canvas.backgroundImage;
        if (!bgImage) return;

        const brightness = parseInt(dom.brightness.value) / 100;
        const contrast = parseInt(dom.contrast.value) / 100;
        const saturation = parseInt(dom.saturation.value) / 100;
        const hueVal = parseInt(dom.hue.value);
        const blurVal = parseFloat(dom.blur.value) / 100;
        const noiseVal = parseInt(dom.noise.value);

        const filters = [];

        if (brightness !== 0) {
            filters.push(new fabric.Image.filters.Brightness({ brightness: brightness * 0.5 }));
        }
        if (contrast !== 0) {
            filters.push(new fabric.Image.filters.Contrast({ contrast: contrast * 0.5 }));
        }
        if (saturation !== 0) {
            filters.push(new fabric.Image.filters.Saturation({ saturation: saturation }));
        }
        if (hueVal !== 0) {
            filters.push(new fabric.Image.filters.HueRotation({ rotation: hueVal / 180 }));
        }
        if (blurVal > 0) {
            filters.push(new fabric.Image.filters.Blur({ blur: blurVal * 0.5 }));
        }
        if (noiseVal > 0) {
            filters.push(new fabric.Image.filters.Noise({ noise: noiseVal * 5 }));
        }

        // Exposure (simulate with brightness + gamma)
        const exposureVal = parseInt(dom.exposure.value) / 100;
        if (exposureVal !== 0) {
            const gamma = exposureVal > 0
                ? [1 + exposureVal, 1 + exposureVal, 1 + exposureVal]
                : [1 / (1 - exposureVal), 1 / (1 - exposureVal), 1 / (1 - exposureVal)];
            filters.push(new fabric.Image.filters.Gamma({ gamma: gamma }));
        }

        // Temperature (warm/cool shift)
        const tempVal = parseInt(dom.temperature.value);
        if (tempVal !== 0) {
            const matrix = tempVal > 0
                ? [1 + tempVal / 200, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 - tempVal / 200, 0, 0, 0, 0, 0, 1, 0]
                : [1 + tempVal / 200, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 - tempVal / 200, 0, 0, 0, 0, 0, 1, 0];
            filters.push(new fabric.Image.filters.ColorMatrix({ matrix: matrix }));
        }

        bgImage.filters = filters;
        bgImage.applyFilters();
        state.canvas.renderAll();
    }

    function resetAdjustments() {
        const sliders = ['brightness', 'contrast', 'saturation', 'exposure', 'hue', 'temperature', 'blur', 'sharpen', 'noise', 'vignette'];
        sliders.forEach(name => {
            const el = document.getElementById(name);
            if (el) {
                el.value = name === 'blur' || name === 'sharpen' || name === 'noise' || name === 'vignette' ? 0 : 0;
                document.getElementById(name + 'Value').textContent = '0';
            }
        });
        
        const bgImage = state.canvas.backgroundImage;
        if (bgImage) {
            bgImage.filters = [];
            bgImage.applyFilters();
            state.canvas.renderAll();
        }
        showToast('Adjustments reset', 'info');
    }

    // ===== FILTERS =====
    function applyFilter(filterName) {
        const bgImage = state.canvas.backgroundImage;
        if (!bgImage) return;

        const intensity = parseInt(dom.filterIntensity.value) / 100;
        let filters = [];

        switch (filterName) {
            case 'none':
                filters = [];
                break;
            case 'grayscale':
                filters.push(new fabric.Image.filters.Grayscale());
                break;
            case 'sepia':
                filters.push(new fabric.Image.filters.Sepia());
                break;
            case 'vintage':
                filters.push(new fabric.Image.filters.Sepia());
                filters.push(new fabric.Image.filters.Brightness({ brightness: -0.05 * intensity }));
                filters.push(new fabric.Image.filters.Contrast({ contrast: -0.05 * intensity }));
                break;
            case 'warm':
                filters.push(new fabric.Image.filters.ColorMatrix({
                    matrix: [1.2 * intensity + (1 - intensity), 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0.8 * intensity + (1 - intensity), 0, 0, 0, 0, 0, 1, 0]
                }));
                break;
            case 'cool':
                filters.push(new fabric.Image.filters.ColorMatrix({
                    matrix: [0.8 * intensity + (1 - intensity), 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1.2 * intensity + (1 - intensity), 0, 0, 0, 0, 0, 1, 0]
                }));
                break;
            case 'dramatic':
                filters.push(new fabric.Image.filters.Contrast({ contrast: 0.3 * intensity }));
                filters.push(new fabric.Image.filters.Saturation({ saturation: 0.2 * intensity }));
                break;
            case 'hdr':
                filters.push(new fabric.Image.filters.Contrast({ contrast: 0.2 * intensity }));
                filters.push(new fabric.Image.filters.Brightness({ brightness: 0.05 * intensity }));
                filters.push(new fabric.Image.filters.Saturation({ saturation: 0.3 * intensity }));
                break;
            case 'fade':
                filters.push(new fabric.Image.filters.Contrast({ contrast: -0.15 * intensity }));
                filters.push(new fabric.Image.filters.Brightness({ brightness: 0.1 * intensity }));
                filters.push(new fabric.Image.filters.Saturation({ saturation: -0.3 * intensity }));
                break;
            case 'chrome':
                filters.push(new fabric.Image.filters.Saturation({ saturation: 0.5 * intensity }));
                filters.push(new fabric.Image.filters.Contrast({ contrast: 0.1 * intensity }));
                break;
            case 'noir':
                filters.push(new fabric.Image.filters.Grayscale());
                filters.push(new fabric.Image.filters.Contrast({ contrast: 0.3 * intensity }));
                break;
            case 'invert':
                filters.push(new fabric.Image.filters.Invert());
                break;
            case 'polaroid':
                filters.push(new fabric.Image.filters.Sepia());
                filters.push(new fabric.Image.filters.Brightness({ brightness: 0.05 * intensity }));
                filters.push(new fabric.Image.filters.Contrast({ contrast: -0.1 * intensity }));
                break;
            case 'kodak':
                filters.push(new fabric.Image.filters.ColorMatrix({
                    matrix: [
                        1.1 * intensity + (1 - intensity), 0.1 * intensity, 0, 0, 0,
                        0, 1.05 * intensity + (1 - intensity), 0, 0, 0,
                        0, 0, 0.9 * intensity + (1 - intensity), 0, 0,
                        0, 0, 0, 1, 0
                    ]
                }));
                break;
            case 'technicolor':
                filters.push(new fabric.Image.filters.Saturation({ saturation: 0.6 * intensity }));
                filters.push(new fabric.Image.filters.Contrast({ contrast: 0.1 * intensity }));
                filters.push(new fabric.Image.filters.HueRotation({ rotation: 0.05 * intensity }));
                break;
        }

        bgImage.filters = filters;
        bgImage.applyFilters();
        state.canvas.renderAll();
        saveHistory();
    }

    // ===== CROP =====
    function startCrop(ratio) {
        cancelCrop(); // Remove existing crop rect

        const w = state.canvas.getWidth();
        const h = state.canvas.getHeight();
        let cropW = w * 0.7;
        let cropH = h * 0.7;

        if (ratio !== 'free') {
            const [rw, rh] = ratio.split(':').map(Number);
            const targetRatio = rw / rh;
            if (cropW / cropH > targetRatio) {
                cropW = cropH * targetRatio;
            } else {
                cropH = cropW / targetRatio;
            }
        }

        const cropRect = new fabric.Rect({
            left: (w - cropW) / 2,
            top: (h - cropH) / 2,
            width: cropW,
            height: cropH,
            fill: 'rgba(88, 166, 255, 0.1)',
            stroke: '#58a6ff',
            strokeWidth: 2,
            strokeDashArray: [5, 5],
            cornerColor: '#58a6ff',
            cornerSize: 10,
            transparentCorners: false,
            hasRotatingPoint: false,
            lockRotation: true,
            name: '__crop__',
        });

        state.canvas.add(cropRect);
        state.canvas.setActiveObject(cropRect);
        state.cropRect = cropRect;
        state.isCropping = true;

        // Sync inputs
        dom.cropX.value = Math.round(cropRect.left);
        dom.cropY.value = Math.round(cropRect.top);
        dom.cropW.value = Math.round(cropRect.width);
        dom.cropH.value = Math.round(cropRect.height);

        cropRect.on('moving', syncCropInputs);
        cropRect.on('scaling', syncCropInputs);
    }

    function syncCropInputs() {
        if (state.cropRect) {
            const rect = state.cropRect;
            dom.cropX.value = Math.round(rect.left);
            dom.cropY.value = Math.round(rect.top);
            dom.cropW.value = Math.round(rect.width * rect.scaleX);
            dom.cropH.value = Math.round(rect.height * rect.scaleY);
        }
    }

    function applyCrop() {
        if (!state.cropRect) return;

        const rect = state.cropRect;
        const left = rect.left;
        const top = rect.top;
        const width = rect.width * rect.scaleX;
        const height = rect.height * rect.scaleY;

        // Remove crop rect
        state.canvas.remove(rect);
        state.cropRect = null;
        state.isCropping = false;
        state.canvas.renderAll();

        // Create cropped image from canvas
        const croppedDataUrl = state.canvas.toDataURL({
            left: left,
            top: top,
            width: width,
            height: height,
            format: 'png',
        });

        // Load cropped image back
        fabric.Image.fromURL(croppedDataUrl, function (img) {
            state.canvas.clear();
            const w = Math.round(width);
            const h = Math.round(height);
            state.canvas.setWidth(w);
            state.canvas.setHeight(h);
            img.set({ left: 0, top: 0, scaleX: 1, scaleY: 1 });
            state.canvas.setBackgroundImage(img, state.canvas.renderAll.bind(state.canvas));
            state.bgImageObj = img;
            state.realWidth = w;
            state.realHeight = h;
            dom.resizeW.value = w;
            dom.resizeH.value = h;
            updateCanvasInfo();
            saveHistory();
            zoomToFit();
            showToast('Image cropped!', 'success');
        });
    }

    function cancelCrop() {
        if (state.cropRect) {
            state.canvas.remove(state.cropRect);
            state.cropRect = null;
            state.isCropping = false;
            state.canvas.renderAll();
        }
    }

    // ===== RESIZE =====
    function applyResize() {
        const newW = parseInt(dom.resizeW.value);
        const newH = parseInt(dom.resizeH.value);
        if (!newW || !newH) return;

        const dataUrl = state.canvas.toDataURL({ format: 'png' });
        fabric.Image.fromURL(dataUrl, function (img) {
            state.canvas.clear();
            state.canvas.setWidth(newW);
            state.canvas.setHeight(newH);
            // Use a single scale that fills the canvas
            const scaleX = newW / img.width;
            const scaleY = newH / img.height;
            img.set({ left: 0, top: 0, scaleX: scaleX, scaleY: scaleY });
            state.canvas.setBackgroundImage(img, state.canvas.renderAll.bind(state.canvas));
            state.bgImageObj = img;
            state.realWidth = newW;
            state.realHeight = newH;
            updateCanvasInfo();
            saveHistory();
            zoomToFit();
            showToast(`Resized to ${newW}x${newH}`, 'success');
        });
    }

    // ===== ROTATE & FLIP =====
    function rotateCanvas(degrees) {
        const dataUrl = state.canvas.toDataURL({ format: 'png' });
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        const img = new Image();
        
        img.onload = function () {
            const isRightAngle = Math.abs(degrees) === 90 || Math.abs(degrees) === 270;
            tempCanvas.width = isRightAngle ? img.height : img.width;
            tempCanvas.height = isRightAngle ? img.width : img.height;

            ctx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
            ctx.rotate((degrees * Math.PI) / 180);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            const rotatedUrl = tempCanvas.toDataURL('image/png');
            fabric.Image.fromURL(rotatedUrl, function (fabricImg) {
                state.canvas.clear();
                const rw = tempCanvas.width;
                const rh = tempCanvas.height;
                state.canvas.setWidth(rw);
                state.canvas.setHeight(rh);
                fabricImg.set({ left: 0, top: 0, scaleX: 1, scaleY: 1 });
                state.canvas.setBackgroundImage(fabricImg, state.canvas.renderAll.bind(state.canvas));
                state.bgImageObj = fabricImg;
                state.realWidth = rw;
                state.realHeight = rh;
                dom.resizeW.value = rw;
                dom.resizeH.value = rh;
                updateCanvasInfo();
                saveHistory();
                zoomToFit();
                showToast(`Rotated ${degrees}°`, 'success');
            });
        };
        img.src = dataUrl;
    }

    function freeRotateImage(angle) {
        const bgImage = state.canvas.backgroundImage;
        if (!bgImage) return;
        bgImage.set({ angle: angle, originX: 'center', originY: 'center', left: state.canvas.getWidth() / 2, top: state.canvas.getHeight() / 2 });
        state.canvas.renderAll();
    }

    function flipImage(direction) {
        const dataUrl = state.canvas.toDataURL({ format: 'png' });
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        const img = new Image();
        
        img.onload = function () {
            tempCanvas.width = img.width;
            tempCanvas.height = img.height;

            if (direction === 'horizontal') {
                ctx.translate(img.width, 0);
                ctx.scale(-1, 1);
            } else {
                ctx.translate(0, img.height);
                ctx.scale(1, -1);
            }
            ctx.drawImage(img, 0, 0);

            const flippedUrl = tempCanvas.toDataURL('image/png');
            fabric.Image.fromURL(flippedUrl, function (fabricImg) {
                state.canvas.setBackgroundImage(fabricImg, state.canvas.renderAll.bind(state.canvas));
                state.bgImageObj = fabricImg;
                saveHistory();
                showToast(`Flipped ${direction}`, 'success');
            });
        };
        img.src = dataUrl;
    }

    // ===== DRAWING (BRUSH / ERASER) =====
    function setBrushSettings() {
        const brush = state.canvas.freeDrawingBrush;
        if (!brush) return;
        brush.color = dom.brushColor.value;
        brush.width = parseInt(dom.brushSize.value);
        brush.strokeLineCap = 'round';
        brush.strokeLineJoin = 'round';
        const opacity = parseInt(dom.brushOpacity.value) / 100;
        // Apply opacity via rgba
        const hex = dom.brushColor.value;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        brush.color = `rgba(${r},${g},${b},${opacity})`;
    }

    function setBrushType(type) {
        switch (type) {
            case 'pencil':
                state.canvas.freeDrawingBrush = new fabric.PencilBrush(state.canvas);
                break;
            case 'spray':
                state.canvas.freeDrawingBrush = new fabric.SprayBrush(state.canvas);
                break;
            case 'circle':
                state.canvas.freeDrawingBrush = new fabric.CircleBrush(state.canvas);
                break;
        }
        setBrushSettings();
    }

    function setEraserSettings() {
        const brush = new fabric.PencilBrush(state.canvas);
        brush.color = '#ffffff';
        brush.width = parseInt(dom.eraserSize.value);
        state.canvas.freeDrawingBrush = brush;
    }

    // ===== SHAPES & LINE DRAWING =====
    let tempShape = null;

    function onCanvasMouseDown(opt) {
        if (state.currentTool === 'shapes' || state.currentTool === 'line') {
            state.isDrawingShape = true;
            const pointer = state.canvas.getPointer(opt.e);
            state.shapeStartX = pointer.x;
            state.shapeStartY = pointer.y;

            if (state.currentTool === 'shapes') {
                const activeShape = document.querySelector('.shape-btn.active')?.dataset.shape || 'rect';
                tempShape = createShape(activeShape, pointer.x, pointer.y, 0, 0);
            } else {
                tempShape = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
                    stroke: dom.lineColor.value,
                    strokeWidth: parseInt(dom.lineWidth.value),
                    selectable: false,
                    evented: false,
                });
            }

            if (tempShape) {
                state.canvas.add(tempShape);
            }
        }
    }

    function onCanvasMouseMoveDraw(opt) {
        if (!state.isDrawingShape || !tempShape) return;
        const pointer = state.canvas.getPointer(opt.e);

        if (state.currentTool === 'shapes') {
            const w = Math.abs(pointer.x - state.shapeStartX);
            const h = Math.abs(pointer.y - state.shapeStartY);
            const left = Math.min(pointer.x, state.shapeStartX);
            const top = Math.min(pointer.y, state.shapeStartY);

            tempShape.set({ left: left, top: top });

            if (tempShape.type === 'rect' || tempShape.type === 'image') {
                tempShape.set({ width: w, height: h });
            } else if (tempShape.type === 'ellipse') {
                tempShape.set({ rx: w / 2, ry: h / 2 });
            } else if (tempShape.type === 'triangle') {
                tempShape.set({ width: w, height: h });
            } else if (tempShape.type === 'polygon') {
                // Star or diamond - recreate
                const activeShape = document.querySelector('.shape-btn.active')?.dataset.shape;
                if (activeShape === 'star') {
                    const points = createStarPoints(left + w / 2, top + h / 2, 5, w / 2, w / 4);
                    tempShape.set({ points: points });
                } else if (activeShape === 'diamond') {
                    tempShape.set({ points: [
                        { x: left + w / 2, y: top },
                        { x: left + w, y: top + h / 2 },
                        { x: left + w / 2, y: top + h },
                        { x: left, y: top + h / 2 },
                    ]});
                }
            }
        } else if (state.currentTool === 'line') {
            tempShape.set({ x2: pointer.x, y2: pointer.y });
        }

        state.canvas.renderAll();
    }

    function onCanvasMouseUp() {
        if (state.isDrawingShape && tempShape) {
            tempShape.set({ selectable: true, evented: true });
            state.canvas.setActiveObject(tempShape);
            tempShape = null;
            state.isDrawingShape = false;
            saveHistory();
        }
    }

    function createShape(type, x, y, w, h) {
        const fill = dom.shapeFilled.checked ? dom.shapeFill.value : 'transparent';
        const stroke = dom.shapeStroke.value;
        const strokeWidth = parseInt(dom.shapeStrokeWidth.value);
        const opacity = parseInt(dom.shapeOpacity.value) / 100;
        const common = { left: x, top: y, fill, stroke, strokeWidth, opacity, selectable: false, evented: false };

        switch (type) {
            case 'rect':
                return new fabric.Rect({ ...common, width: w, height: h, rx: 0, ry: 0 });
            case 'circle':
                return new fabric.Ellipse({ ...common, rx: w / 2, ry: h / 2 });
            case 'triangle':
                return new fabric.Triangle({ ...common, width: w, height: h });
            case 'star':
                const starPts = createStarPoints(x, y, 5, 40, 20);
                return new fabric.Polygon(starPts, { ...common });
            case 'diamond':
                return new fabric.Polygon([
                    { x: x, y: y },
                    { x: x + 20, y: y + 20 },
                    { x: x, y: y + 40 },
                    { x: x - 20, y: y + 20 },
                ], { ...common });
            case 'arrow':
                return new fabric.Polygon([
                    { x: x, y: y + 10 },
                    { x: x + 30, y: y + 10 },
                    { x: x + 30, y: y },
                    { x: x + 50, y: y + 15 },
                    { x: x + 30, y: y + 30 },
                    { x: x + 30, y: y + 20 },
                    { x: x, y: y + 20 },
                ], { ...common });
            default:
                return new fabric.Rect({ ...common, width: w, height: h });
        }
    }

    function createStarPoints(cx, cy, spikes, outerR, innerR) {
        const points = [];
        const step = Math.PI / spikes;
        let rot = -Math.PI / 2;
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            points.push({ x: cx + Math.cos(rot) * r, y: cy + Math.sin(rot) * r });
            rot += step;
        }
        return points;
    }

    // ===== TEXT =====
    function addTextToCanvas() {
        const text = new fabric.IText('Double click to edit', {
            left: state.canvas.getWidth() / 2 - 100,
            top: state.canvas.getHeight() / 2 - 20,
            fontFamily: dom.fontFamily.value,
            fontSize: parseInt(dom.fontSize.value),
            fill: dom.textColor.value,
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'left',
            name: 'Text',
        });

        state.canvas.add(text);
        state.canvas.setActiveObject(text);
        saveHistory();
        showToast('Text added! Double-click to edit', 'success');
    }

    function updateSelectedText() {
        const obj = state.canvas.getActiveObject();
        if (!obj || (obj.type !== 'i-text' && obj.type !== 'text' && obj.type !== 'textbox')) return;

        obj.set({
            fontFamily: dom.fontFamily.value,
            fontSize: parseInt(dom.fontSize.value),
            fill: dom.textColor.value,
            textAlign: document.querySelector('[data-align].active')?.dataset.align || 'left',
            charSpacing: parseInt(dom.textSpacing.value),
        });

        // Background
        if (dom.textBgEnabled.checked) {
            obj.set({ backgroundColor: dom.textBgColor.value });
        } else {
            obj.set({ backgroundColor: '' });
        }

        // Shadow
        const shadowVal = parseInt(dom.textShadow.value);
        if (shadowVal > 0) {
            obj.set({ shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: shadowVal, offsetX: shadowVal / 2, offsetY: shadowVal / 2 }) });
        } else {
            obj.set({ shadow: null });
        }

        state.canvas.renderAll();
    }

    function toggleTextStyle(style) {
        const obj = state.canvas.getActiveObject();
        if (!obj || (obj.type !== 'i-text' && obj.type !== 'text' && obj.type !== 'textbox')) return;

        switch (style) {
            case 'bold':
                obj.set({ fontWeight: obj.fontWeight === 'bold' ? 'normal' : 'bold' });
                dom.textBold.classList.toggle('active');
                break;
            case 'italic':
                obj.set({ fontStyle: obj.fontStyle === 'italic' ? 'normal' : 'italic' });
                dom.textItalic.classList.toggle('active');
                break;
            case 'underline':
                obj.set({ underline: !obj.underline });
                dom.textUnderline.classList.toggle('active');
                break;
            case 'linethrough':
                obj.set({ linethrough: !obj.linethrough });
                dom.textStrike.classList.toggle('active');
                break;
        }
        state.canvas.renderAll();
    }

    // ===== STICKERS =====
    function populateStickers(category) {
        const grid = dom.stickersGrid;
        grid.innerHTML = '';
        const items = stickersData[category] || [];
        items.forEach(emoji => {
            const btn = document.createElement('button');
            btn.className = 'sticker-item';
            btn.textContent = emoji;
            btn.addEventListener('click', () => addSticker(emoji));
            grid.appendChild(btn);
        });
    }

    function addSticker(emoji) {
        const text = new fabric.Text(emoji, {
            left: state.canvas.getWidth() / 2 - 30,
            top: state.canvas.getHeight() / 2 - 30,
            fontSize: 60,
            name: 'Sticker: ' + emoji,
        });
        state.canvas.add(text);
        state.canvas.setActiveObject(text);
        saveHistory();
        showToast('Sticker added!', 'success');
    }

    // ===== WATERMARK =====
    function addWatermark() {
        const wText = dom.watermarkText.value || 'PixelCraft';
        const size = parseInt(dom.watermarkSize.value);
        const opacity = parseInt(dom.watermarkOpacity.value) / 100;
        const color = dom.watermarkColor.value;

        const watermark = new fabric.Text(wText, {
            left: state.canvas.getWidth() - 150,
            top: state.canvas.getHeight() - 50,
            fontSize: size,
            fill: color,
            opacity: opacity,
            fontFamily: 'Inter, Arial',
            fontStyle: 'italic',
            name: 'Watermark',
        });

        state.canvas.add(watermark);
        saveHistory();
        showToast('Watermark added!', 'success');
    }

    function tileWatermark() {
        const wText = dom.watermarkText.value || 'PixelCraft';
        const size = parseInt(dom.watermarkSize.value);
        const opacity = parseInt(dom.watermarkOpacity.value) / 100;
        const color = dom.watermarkColor.value;
        const cw = state.canvas.getWidth();
        const ch = state.canvas.getHeight();

        for (let y = 30; y < ch; y += size * 4) {
            for (let x = 0; x < cw; x += size * wText.length * 0.8) {
                const wm = new fabric.Text(wText, {
                    left: x,
                    top: y,
                    fontSize: size,
                    fill: color,
                    opacity: opacity * 0.5,
                    fontFamily: 'Inter, Arial',
                    fontStyle: 'italic',
                    angle: -30,
                    selectable: false,
                    evented: false,
                    name: 'TiledWatermark',
                });
                state.canvas.add(wm);
            }
        }
        saveHistory();
        showToast('Tiled watermark added!', 'success');
    }

    // ===== FRAMES =====
    function applyFrame(frameType) {
        // Remove old frame objects
        const oldFrames = state.canvas.getObjects().filter(o => o.name === '__frame__');
        oldFrames.forEach(f => state.canvas.remove(f));

        if (frameType === 'none') {
            state.canvas.renderAll();
            return;
        }

        const w = state.canvas.getWidth();
        const h = state.canvas.getHeight();
        const fw = parseInt(dom.frameWidth.value);
        const color = dom.frameColor.value;

        let frame;

        switch (frameType) {
            case 'simple':
                frame = new fabric.Rect({
                    left: 0, top: 0, width: w, height: h,
                    fill: 'transparent', stroke: color, strokeWidth: fw,
                    selectable: false, evented: false, name: '__frame__',
                });
                break;
            case 'rounded':
                frame = new fabric.Rect({
                    left: fw / 2, top: fw / 2, width: w - fw, height: h - fw,
                    fill: 'transparent', stroke: color, strokeWidth: fw,
                    rx: 20, ry: 20,
                    selectable: false, evented: false, name: '__frame__',
                });
                break;
            case 'shadow':
                frame = new fabric.Rect({
                    left: 5, top: 5, width: w - 10, height: h - 10,
                    fill: 'transparent', stroke: color, strokeWidth: 2,
                    shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 15, offsetX: 5, offsetY: 5 }),
                    selectable: false, evented: false, name: '__frame__',
                });
                break;
            case 'polaroid':
                frame = new fabric.Rect({
                    left: 0, top: 0, width: w, height: h,
                    fill: 'transparent', stroke: color, strokeWidth: fw,
                    selectable: false, evented: false, name: '__frame__',
                });
                // Bottom extra border
                const bottomBar = new fabric.Rect({
                    left: 0, top: h - fw * 3, width: w, height: fw * 3,
                    fill: color,
                    selectable: false, evented: false, name: '__frame__',
                });
                state.canvas.add(bottomBar);
                break;
            case 'double':
                frame = new fabric.Rect({
                    left: 0, top: 0, width: w, height: h,
                    fill: 'transparent', stroke: color, strokeWidth: fw,
                    selectable: false, evented: false, name: '__frame__',
                });
                const innerFrame = new fabric.Rect({
                    left: fw + 4, top: fw + 4, width: w - (fw + 4) * 2, height: h - (fw + 4) * 2,
                    fill: 'transparent', stroke: color, strokeWidth: fw / 2,
                    selectable: false, evented: false, name: '__frame__',
                });
                state.canvas.add(innerFrame);
                break;
        }

        if (frame) {
            state.canvas.add(frame);
        }
        state.canvas.renderAll();
        saveHistory();
    }

    // ===== BACKGROUND REMOVER =====
    function removeBackground() {
        const bgImage = state.canvas.backgroundImage;
        if (!bgImage) {
            showToast('No image loaded', 'error');
            return;
        }

        showToast('Removing background...', 'info');

        const targetColor = hexToRgb(dom.bgRemoveColor.value);
        const tolerance = parseInt(dom.bgTolerance.value);

        // Get image data
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        tempCanvas.width = state.canvas.getWidth();
        tempCanvas.height = state.canvas.getHeight();

        // Draw the current canvas onto temp
        const dataUrl = state.canvas.toDataURL({ format: 'png' });
        const img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                const distance = Math.sqrt(
                    Math.pow(r - targetColor.r, 2) +
                    Math.pow(g - targetColor.g, 2) +
                    Math.pow(b - targetColor.b, 2)
                );

                if (distance < tolerance * 4) {
                    data[i + 3] = 0; // Make transparent
                }
            }

            ctx.putImageData(imageData, 0, 0);
            const resultUrl = tempCanvas.toDataURL('image/png');

            fabric.Image.fromURL(resultUrl, function (fabricImg) {
                state.canvas.setBackgroundImage(fabricImg, state.canvas.renderAll.bind(state.canvas));
                state.canvas.setBackgroundColor('transparent', state.canvas.renderAll.bind(state.canvas));
                state.bgImageObj = fabricImg;
                saveHistory();
                showToast('Background removed!', 'success');
            });
        };
        img.src = dataUrl;
    }

    function enableColorPicker() {
        showToast('Click on the canvas to pick a color', 'info');
        state.canvas.defaultCursor = 'crosshair';

        const handler = function (opt) {
            const pointer = state.canvas.getPointer(opt.e);
            const x = Math.round(pointer.x);
            const y = Math.round(pointer.y);

            // Get pixel color
            const ctx = state.canvas.getContext('2d');
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
            dom.bgRemoveColor.value = hex;
            
            state.canvas.defaultCursor = 'default';
            state.canvas.off('mouse:down', handler);
            showToast(`Color picked: ${hex}`, 'success');
        };

        state.canvas.on('mouse:down', handler);
    }

    // ===== OBJECT MANIPULATION =====
    function onObjectSelected() {
        const obj = state.canvas.getActiveObject();
        if (!obj || obj.name === '__crop__' || obj.name === '__frame__') return;

        // Show properties panel
        document.getElementById('panelProperties').classList.remove('hidden');

        dom.objX.value = Math.round(obj.left || 0);
        dom.objY.value = Math.round(obj.top || 0);
        dom.objW.value = Math.round((obj.width || 0) * (obj.scaleX || 1));
        dom.objH.value = Math.round((obj.height || 0) * (obj.scaleY || 1));
        dom.objOpacity.value = Math.round((obj.opacity || 1) * 100);
        document.getElementById('objOpacityValue').textContent = Math.round((obj.opacity || 1) * 100);
        dom.objRotation.value = Math.round(obj.angle || 0);
        document.getElementById('objRotationValue').textContent = Math.round(obj.angle || 0) + '°';

        // If it's text, update text panel values
        if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
            dom.fontFamily.value = obj.fontFamily || 'Arial';
            dom.fontSize.value = obj.fontSize || 32;
            document.getElementById('fontSizeValue').textContent = obj.fontSize || 32;
            dom.textColor.value = obj.fill || '#ffffff';
            dom.textBold.classList.toggle('active', obj.fontWeight === 'bold');
            dom.textItalic.classList.toggle('active', obj.fontStyle === 'italic');
            dom.textUnderline.classList.toggle('active', !!obj.underline);
            dom.textStrike.classList.toggle('active', !!obj.linethrough);
        }
    }

    function onSelectionCleared() {
        document.getElementById('panelProperties').classList.add('hidden');
    }

    function updateObjectProperty(prop, value) {
        const obj = state.canvas.getActiveObject();
        if (!obj) return;
        obj.set(prop, value);
        state.canvas.renderAll();
    }

    function deleteSelected() {
        const activeObj = state.canvas.getActiveObject();
        if (activeObj) {
            if (activeObj.name === '__crop__') {
                cancelCrop();
                return;
            }
            state.canvas.remove(activeObj);
            state.canvas.discardActiveObject();
            state.canvas.renderAll();
            saveHistory();
            showToast('Object deleted', 'info');
        }
    }

    function copyObject() {
        const obj = state.canvas.getActiveObject();
        if (obj) {
            obj.clone(function (cloned) {
                state.clipboard = cloned;
                showToast('Copied!', 'info');
            });
        }
    }

    function pasteObject() {
        if (!state.clipboard) return;
        state.clipboard.clone(function (clonedObj) {
            state.canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 15,
                top: clonedObj.top + 15,
                evented: true,
            });
            state.canvas.add(clonedObj);
            state.canvas.setActiveObject(clonedObj);
            state.canvas.renderAll();
            saveHistory();
            showToast('Pasted!', 'info');
        });
    }

    function duplicateObject() {
        const obj = state.canvas.getActiveObject();
        if (!obj) return;
        obj.clone(function (cloned) {
            cloned.set({ left: obj.left + 20, top: obj.top + 20 });
            state.canvas.add(cloned);
            state.canvas.setActiveObject(cloned);
            state.canvas.renderAll();
            saveHistory();
            showToast('Duplicated!', 'info');
        });
    }

    // ===== LAYERS =====
    function updateLayers() {
        const objects = state.canvas.getObjects().filter(o => o.name !== '__crop__' && o.name !== '__frame__' && o.name !== 'TiledWatermark');
        dom.layersList.innerHTML = '';

        if (objects.length === 0) {
            dom.layersList.innerHTML = '<div style="padding:10px;text-align:center;color:var(--text-muted);font-size:11px;">No layers yet</div>';
            return;
        }

        objects.reverse().forEach((obj, i) => {
            const item = document.createElement('div');
            item.className = 'layer-item' + (state.canvas.getActiveObject() === obj ? ' active' : '');

            let icon = 'fa-layer-group';
            let name = obj.name || 'Object ' + (objects.length - i);
            if (obj.type === 'i-text' || obj.type === 'text') {
                icon = 'fa-font';
                name = obj.name || '"' + (obj.text || '').substring(0, 15) + '"';
            } else if (obj.type === 'rect') icon = 'fa-square';
            else if (obj.type === 'circle' || obj.type === 'ellipse') icon = 'fa-circle';
            else if (obj.type === 'triangle') icon = 'fa-play';
            else if (obj.type === 'path') icon = 'fa-paint-brush';
            else if (obj.type === 'line') icon = 'fa-minus';
            else if (obj.type === 'polygon') icon = 'fa-star';

            item.innerHTML = `
                <i class="fas ${icon}"></i>
                <span class="layer-name">${name}</span>
                <button class="layer-visibility" title="Toggle Visibility">
                    <i class="fas ${obj.visible !== false ? 'fa-eye' : 'fa-eye-slash'}"></i>
                </button>
            `;

            item.addEventListener('click', () => {
                state.canvas.setActiveObject(obj);
                state.canvas.renderAll();
                updateLayers();
            });

            item.querySelector('.layer-visibility').addEventListener('click', (e) => {
                e.stopPropagation();
                obj.set('visible', !obj.visible);
                state.canvas.renderAll();
                updateLayers();
            });

            dom.layersList.appendChild(item);
        });
    }

    // ===== FILE OPERATIONS =====
    function downloadImage(format) {
        const quality = format === 'png' ? 1 : 0.92;
        const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
        
        const dataUrl = state.canvas.toDataURL({
            format: format === 'jpeg' ? 'jpeg' : 'png',
            quality: quality,
            multiplier: 1,
        });

        const link = document.createElement('a');
        link.download = `pixelcraft-${Date.now()}.${format === 'jpeg' ? 'jpg' : format}`;
        link.href = dataUrl;
        link.click();
        showToast(`Saved as ${format.toUpperCase()}!`, 'success');
    }

    function resetToOriginal() {
        if (state.originalImage) {
            loadImageToCanvas(state.originalImage);
            showToast('Image reset to original!', 'success');
        } else {
            showToast('No original image to reset to', 'error');
        }
    }

    function clearCanvasFull() {
        state.canvas.clear();
        state.canvas.setBackgroundColor('#ffffff', state.canvas.renderAll.bind(state.canvas));
        state.bgImageObj = null;
        saveHistory();
        updateLayers();
        showToast('Canvas cleared!', 'info');
    }

    // ===== EXPORT =====
    function openExportModal() {
        showModal('exportModal');
        updateExportPreview();
    }

    function updateExportPreview() {
        const format = document.querySelector('.format-btn.active')?.dataset.format || 'png';
        const quality = parseInt(dom.exportQuality.value) / 100;
        const scale = parseFloat(document.querySelector('[data-scale].active')?.dataset.scale || 1);

        const dataUrl = state.canvas.toDataURL({
            format: format,
            quality: format === 'png' ? 1 : quality,
            multiplier: scale,
        });

        dom.exportPreview.src = dataUrl;
        
        // Estimate file size
        const base64Length = dataUrl.length - dataUrl.indexOf(',') - 1;
        const sizeBytes = Math.round(base64Length * 0.75);
        const sizeKB = (sizeBytes / 1024).toFixed(1);
        dom.exportFileSize.textContent = `Estimated: ${sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB'}`;
    }

    function exportImage() {
        const format = document.querySelector('.format-btn.active')?.dataset.format || 'png';
        const quality = parseInt(dom.exportQuality.value) / 100;
        const scale = parseFloat(document.querySelector('[data-scale].active')?.dataset.scale || 1);

        const dataUrl = state.canvas.toDataURL({
            format: format,
            quality: format === 'png' ? 1 : quality,
            multiplier: scale,
        });

        const ext = format === 'jpeg' ? 'jpg' : format;
        const link = document.createElement('a');
        link.download = `pixelcraft-export-${Date.now()}.${ext}`;
        link.href = dataUrl;
        link.click();

        hideModal('exportModal');
        showToast(`Exported as ${format.toUpperCase()}!`, 'success');
    }

    // ===== DARK MODE =====
    function toggleDarkMode() {
        document.body.classList.toggle('light-mode');
        const icon = dom.toggleDarkMode.querySelector('i');
        if (document.body.classList.contains('light-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            showToast('Light mode enabled', 'info');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            showToast('Dark mode enabled', 'info');
        }
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    // ===== KEYBOARD SHORTCUTS =====
    function handleKeyboard(e) {
        const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT';
        if (isInput) return;

        // Ctrl + Z = Undo
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            undo();
        }
        // Ctrl + Y = Redo
        if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            redo();
        }
        // Ctrl + S = Save PNG
        if (e.ctrlKey && !e.shiftKey && e.key === 's') {
            e.preventDefault();
            downloadImage('png');
        }
        // Ctrl + Shift + S = Save JPG
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            downloadImage('jpeg');
        }
        // Ctrl + O = Open
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            dom.fileUpload.click();
        }
        // Ctrl + C = Copy
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            copyObject();
        }
        // Ctrl + V = Paste
        if (e.ctrlKey && e.key === 'v') {
            e.preventDefault();
            pasteObject();
        }
        // Delete
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (!isInput) deleteSelected();
        }
        // Tool shortcuts
        if (e.key === 'v' || e.key === 'V') selectTool('select');
        if (e.key === 'h' || e.key === 'H') selectTool('hand');
        if (e.key === 'c' && !e.ctrlKey) selectTool('crop');
        if (e.key === 'b' || e.key === 'B') selectTool('brush');
        if (e.key === 'e' || e.key === 'E') selectTool('eraser');
        if (e.key === 't' || e.key === 'T') selectTool('text');
        if (e.key === 'u' || e.key === 'U') selectTool('shapes');
        if (e.key === 'l' || e.key === 'L') selectTool('line');
        // Zoom
        if (e.key === '+' || e.key === '=') setZoom(state.zoom + 0.1);
        if (e.key === '-') setZoom(state.zoom - 0.1);
        if (e.key === '0') zoomToFit();
    }

    // ===== CANVAS EVENTS =====
    function onCanvasMouseMove(opt) {
        const pointer = state.canvas.getPointer(opt.e);
        dom.mousePos.textContent = `X: ${Math.round(pointer.x)} Y: ${Math.round(pointer.y)}`;
    }

    // ===== MODAL MANAGEMENT =====
    function showModal(id) {
        document.getElementById(id).classList.remove('hidden');
    }

    function hideModal(id) {
        document.getElementById(id).classList.add('hidden');
    }

    // ===== TOAST NOTIFICATIONS =====
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        
        toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
        dom.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(30px)';
            toast.style.transition = '0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // ===== UI HELPERS =====
    function updateCanvasInfo() {
        const w = state.canvas.getWidth();
        const h = state.canvas.getHeight();
        dom.canvasInfo.textContent = `${Math.round(w)} x ${Math.round(h)} px`;
        dom.imageSize.textContent = `${Math.round(w)} x ${Math.round(h)}`;
    }

    function handleResize() {
        // Handled by CSS flex
    }

    // ===== UTILITY FUNCTIONS =====
    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }

    function debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // ===== START =====
    document.addEventListener('DOMContentLoaded', init);

})();
