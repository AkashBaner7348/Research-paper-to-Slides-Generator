// Application state
const appState = {
    currentTab: 'upload',
    uploadedFile: null,
    generatedSlides: [],
    currentSlideIndex: 0,
    isProcessing: false
};

// Sample research content from the provided data
const sampleContent = {
    title: "Deep Learning Approaches for Automated Document Analysis: A Comprehensive Survey",
    abstract: "This paper presents a comprehensive survey of deep learning techniques applied to automated document analysis. We examine convolutional neural networks (CNNs), transformer models, and hybrid architectures for tasks including optical character recognition (OCR), layout analysis, and information extraction. Our analysis covers 150+ research papers from 2018-2024, identifying key trends and performance benchmarks. Results show transformer-based models achieving 94.2% accuracy on document layout analysis tasks, while hybrid CNN-Transformer architectures demonstrate superior performance in multi-language OCR scenarios. We conclude with recommendations for future research directions in this rapidly evolving field.",
    introduction: "Document analysis has become increasingly important in the digital age, with applications ranging from digitizing historical archives to automating business processes. Traditional rule-based approaches struggle with the variability in document layouts, fonts, and formatting styles. Deep learning offers promising solutions to these challenges by learning robust feature representations from large datasets.",
    methodology: "We conducted a systematic literature review of papers published in top-tier venues (ICCV, CVPR, ICDAR, ACL) between 2018-2024. Our analysis framework categorizes approaches by architecture type (CNN, RNN, Transformer), task domain (OCR, layout analysis, information extraction), and evaluation metrics. We also implemented baseline models to validate reported performance figures.",
    results: "Transformer models show consistent improvements over CNN-based approaches, with BERT-based models achieving 91.8% F1-score on named entity recognition in documents. Layout analysis accuracy improved from 87.3% (2018) to 94.2% (2024) with the introduction of vision transformers. Multi-modal approaches combining text and visual features demonstrate 15-20% improvement over single-modality methods.",
    conclusion: "Deep learning has revolutionized document analysis, with transformer architectures leading current state-of-the-art. Future research should focus on few-shot learning for domain adaptation and improving efficiency for real-time applications. The integration of large language models presents new opportunities for semantic document understanding."
};

const processingSteps = [
    "Parsing document structure and identifying sections...",
    "Extracting text content and metadata...",
    "Analyzing sentence importance using NLP models...",
    "Identifying figures, tables, and visual elements...",
    "Clustering related content using semantic similarity...",
    "Generating optimal slide layouts...",
    "Applying selected template and formatting...",
    "Finalizing presentation structure..."
];

// DOM Elements
const elements = {
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    uploadArea: document.getElementById('upload-area'),
    fileInput: document.getElementById('file-input'),
    fileInfo: document.getElementById('file-info'),
    generateBtn: document.getElementById('generate-slides'),
    processManualBtn: document.getElementById('process-manual'),
    slidesContainer: document.getElementById('slides-container'),
    processingModal: document.getElementById('processing-modal'),
    previewModal: document.getElementById('preview-modal'),
    techPanel: document.getElementById('tech-panel'),
    paperTitle: document.getElementById('paper-title'),
    paperContent: document.getElementById('paper-content')
};

// Initialize application
function initApp() {
    setupEventListeners();
    setupTabNavigation();
    setupFileUpload();
    populateManualInput();
    showTechPanel();
}

// Event Listeners
function setupEventListeners() {
    // Generate slides button
    elements.generateBtn?.addEventListener('click', handleGenerateSlides);
    
    // Process manual content button
    elements.processManualBtn?.addEventListener('click', handleProcessManual);
    
    // Preview mode button
    document.getElementById('preview-mode')?.addEventListener('click', openPreviewMode);
    
    // Export slides button
    document.getElementById('export-slides')?.addEventListener('click', handleExportSlides);
    
    // Preview navigation
    document.getElementById('prev-slide')?.addEventListener('click', () => navigateSlide(-1));
    document.getElementById('next-slide')?.addEventListener('click', () => navigateSlide(1));
    document.getElementById('close-preview')?.addEventListener('click', closePreviewMode);
    
    // Modal close handlers
    document.getElementById('close-tech-panel')?.addEventListener('click', hideTechPanel);
    
    // Close modals on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeAllModals();
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Tab Navigation
function setupTabNavigation() {
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    // Update active tab button
    elements.tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Update active content
    elements.tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabId}-tab`).classList.add('active');
    
    appState.currentTab = tabId;
}

// File Upload
function setupFileUpload() {
    if (!elements.uploadArea || !elements.fileInput) return;
    
    // Click to upload
    elements.uploadArea.addEventListener('click', () => {
        elements.fileInput.click();
    });
    
    // File input change
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    elements.uploadArea.addEventListener('dragover', handleDragOver);
    elements.uploadArea.addEventListener('dragleave', handleDragLeave);
    elements.uploadArea.addEventListener('drop', handleFileDrop);
}

function handleDragOver(e) {
    e.preventDefault();
    elements.uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    elements.uploadArea.classList.remove('dragover');
}

function handleFileDrop(e) {
    e.preventDefault();
    elements.uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect({ target: { files } });
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
        alert('Please select a PDF file.');
        return;
    }
    
    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB.');
        return;
    }
    
    appState.uploadedFile = file;
    displayFileInfo(file);
}

function displayFileInfo(file) {
    if (!elements.fileInfo) return;
    
    const fileName = elements.fileInfo.querySelector('.file-name');
    const fileSize = elements.fileInfo.querySelector('.file-size');
    
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    elements.fileInfo.classList.remove('hidden');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Manual Input
function populateManualInput() {
    if (elements.paperTitle && elements.paperContent) {
        elements.paperTitle.value = sampleContent.title;
        elements.paperContent.value = `Abstract:\n${sampleContent.abstract}\n\nIntroduction:\n${sampleContent.introduction}\n\nMethodology:\n${sampleContent.methodology}\n\nResults:\n${sampleContent.results}\n\nConclusion:\n${sampleContent.conclusion}`;
    }
}

// Processing Simulation
async function handleGenerateSlides() {
    if (!appState.uploadedFile && appState.currentTab === 'upload') {
        alert('Please upload a PDF file first.');
        return;
    }
    
    await startProcessing();
}

async function handleProcessManual() {
    const title = elements.paperTitle?.value.trim();
    const content = elements.paperContent?.value.trim();
    
    if (!title || !content) {
        alert('Please enter both title and content.');
        return;
    }
    
    await startProcessing();
}

async function startProcessing() {
    if (appState.isProcessing) return;
    
    appState.isProcessing = true;
    showProcessingModal();
    
    try {
        await simulateProcessing();
        generateSlides();
        hideProcessingModal();
        switchTab('slides');
        showTechPanel();
    } catch (error) {
        console.error('Processing error:', error);
        alert('An error occurred during processing. Please try again.');
    } finally {
        appState.isProcessing = false;
    }
}

function showProcessingModal() {
    const modal = elements.processingModal;
    if (!modal) return;
    
    modal.classList.remove('hidden');
    setupProcessingSteps();
}

function hideProcessingModal() {
    const modal = elements.processingModal;
    if (!modal) return;
    
    modal.classList.add('hidden');
}

function setupProcessingSteps() {
    const stepsContainer = document.getElementById('processing-steps');
    if (!stepsContainer) return;
    
    stepsContainer.innerHTML = '';
    
    processingSteps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'processing-step';
        stepElement.innerHTML = `
            <div class="step-icon">${index + 1}</div>
            <span>${step}</span>
        `;
        stepsContainer.appendChild(stepElement);
    });
}

async function simulateProcessing() {
    const steps = document.querySelectorAll('.processing-step');
    const progressFill = document.getElementById('progress-fill');
    const currentStepText = document.getElementById('current-step');
    const timeRemaining = document.getElementById('time-remaining');
    
    const totalTime = 8000; // 8 seconds
    const stepTime = totalTime / processingSteps.length;
    
    for (let i = 0; i < processingSteps.length; i++) {
        // Update current step
        steps.forEach(step => step.classList.remove('active', 'completed'));
        steps[i].classList.add('active');
        steps[i].querySelector('.step-icon').classList.add('active');
        
        if (currentStepText) {
            currentStepText.textContent = processingSteps[i];
        }
        
        // Update progress
        const progress = ((i + 1) / processingSteps.length) * 100;
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        // Update time remaining
        const remaining = Math.ceil((processingSteps.length - i - 1) * (stepTime / 1000));
        if (timeRemaining) {
            timeRemaining.textContent = `Estimated time: ${remaining}s`;
        }
        
        // Mark previous steps as completed
        for (let j = 0; j < i; j++) {
            steps[j].classList.add('completed');
            steps[j].querySelector('.step-icon').classList.add('completed');
        }
        
        await new Promise(resolve => setTimeout(resolve, stepTime));
    }
    
    // Mark all steps as completed
    steps.forEach(step => {
        step.classList.add('completed');
        step.querySelector('.step-icon').classList.add('completed');
    });
    
    if (currentStepText) {
        currentStepText.textContent = 'Processing complete!';
    }
    if (timeRemaining) {
        timeRemaining.textContent = 'Ready!';
    }
}

// Slide Generation
function generateSlides() {
    const slideCount = parseInt(document.getElementById('slide-count')?.value || '8');
    const presentationStyle = document.getElementById('presentation-style')?.value || 'academic';
    
    appState.generatedSlides = createSampleSlides(slideCount, presentationStyle);
    renderSlides();
}

function createSampleSlides(count, style) {
    const slides = [
        {
            title: sampleContent.title,
            content: [
                "Comprehensive survey of deep learning in document analysis",
                "Analysis of 150+ research papers (2018-2024)",
                "Focus on CNNs, Transformers, and hybrid architectures",
                "Applications: OCR, layout analysis, information extraction"
            ],
            type: "title"
        },
        {
            title: "Research Motivation",
            content: [
                "Digital transformation requires automated document processing",
                "Traditional rule-based approaches have limitations",
                "Variability in layouts, fonts, and formatting",
                "Deep learning provides robust feature learning"
            ],
            type: "content"
        },
        {
            title: "Methodology Overview",
            content: [
                "Systematic literature review (ICCV, CVPR, ICDAR, ACL)",
                "Categorization by architecture type and task domain",
                "Performance evaluation using standard benchmarks",
                "Implementation of baseline models for validation"
            ],
            type: "content"
        },
        {
            title: "Key Architectures",
            content: [
                "Convolutional Neural Networks (CNNs)",
                "Recurrent Neural Networks (RNNs)",
                "Transformer models (BERT, Vision Transformers)",
                "Hybrid CNN-Transformer architectures"
            ],
            type: "content"
        },
        {
            title: "Performance Results",
            content: [
                "Transformer models: 94.2% accuracy (layout analysis)",
                "BERT-based NER: 91.8% F1-score",
                "Multi-modal approaches: 15-20% improvement",
                "Significant progress from 2018 to 2024"
            ],
            type: "results"
        },
        {
            title: "Key Findings",
            content: [
                "Transformers consistently outperform CNN approaches",
                "Vision Transformers excel in layout analysis",
                "Multi-modal fusion improves performance significantly",
                "Efficiency remains a challenge for real-time applications"
            ],
            type: "content"
        },
        {
            title: "Future Directions",
            content: [
                "Few-shot learning for domain adaptation",
                "Improved efficiency for real-time processing",
                "Integration with large language models",
                "Enhanced semantic document understanding"
            ],
            type: "content"
        },
        {
            title: "Conclusion",
            content: [
                "Deep learning has revolutionized document analysis",
                "Transformer architectures lead current state-of-the-art",
                "Significant opportunities for future research",
                "Real-world applications continue to expand"
            ],
            type: "conclusion"
        }
    ];
    
    return slides.slice(0, count);
}

function renderSlides() {
    if (!elements.slidesContainer) return;
    
    elements.slidesContainer.innerHTML = '';
    
    appState.generatedSlides.forEach((slide, index) => {
        const slideElement = createSlideElement(slide, index);
        elements.slidesContainer.appendChild(slideElement);
    });
}

function createSlideElement(slide, index) {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'slide-card';
    slideDiv.innerHTML = `
        <div class="slide-header">
            <span class="slide-number">Slide ${index + 1}</span>
            <div class="slide-actions">
                <button class="btn btn--outline btn--sm" onclick="editSlide(${index})">Edit</button>
                <button class="btn btn--outline btn--sm" onclick="duplicateSlide(${index})">Duplicate</button>
            </div>
        </div>
        <h4 class="slide-title">${slide.title}</h4>
        <div class="slide-content">
            <ul>
                ${slide.content.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
        <div class="slide-actions">
            <button class="btn btn--secondary btn--sm" onclick="previewSlide(${index})">Preview</button>
            <button class="btn btn--outline btn--sm" onclick="moveSlide(${index}, -1)" ${index === 0 ? 'disabled' : ''}>↑</button>
            <button class="btn btn--outline btn--sm" onclick="moveSlide(${index}, 1)" ${index === appState.generatedSlides.length - 1 ? 'disabled' : ''}>↓</button>
        </div>
    `;
    return slideDiv;
}

// Slide Actions
function editSlide(index) {
    const slide = appState.generatedSlides[index];
    const newTitle = prompt('Edit slide title:', slide.title);
    if (newTitle !== null) {
        slide.title = newTitle;
        renderSlides();
    }
}

function duplicateSlide(index) {
    const slide = appState.generatedSlides[index];
    const newSlide = { ...slide, title: slide.title + ' (Copy)' };
    appState.generatedSlides.splice(index + 1, 0, newSlide);
    renderSlides();
}

function moveSlide(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= appState.generatedSlides.length) return;
    
    const slide = appState.generatedSlides.splice(index, 1)[0];
    appState.generatedSlides.splice(newIndex, 0, slide);
    renderSlides();
}

function previewSlide(index) {
    appState.currentSlideIndex = index;
    openPreviewMode();
}

// Preview Mode
function openPreviewMode() {
    if (appState.generatedSlides.length === 0) {
        alert('No slides generated yet. Please generate slides first.');
        return;
    }
    
    const modal = elements.previewModal;
    if (!modal) return;
    
    modal.classList.remove('hidden');
    updatePreviewSlide();
    updateSlideCounter();
}

function closePreviewMode() {
    const modal = elements.previewModal;
    if (!modal) return;
    
    modal.classList.add('hidden');
}

function navigateSlide(direction) {
    const newIndex = appState.currentSlideIndex + direction;
    if (newIndex < 0 || newIndex >= appState.generatedSlides.length) return;
    
    appState.currentSlideIndex = newIndex;
    updatePreviewSlide();
    updateSlideCounter();
}

function updatePreviewSlide() {
    const previewSlide = document.getElementById('preview-slide');
    if (!previewSlide) return;
    
    const slide = appState.generatedSlides[appState.currentSlideIndex];
    if (!slide) return;
    
    previewSlide.innerHTML = `
        <h2 style="margin-bottom: var(--space-24); color: var(--color-text);">${slide.title}</h2>
        <div style="flex: 1;">
            <ul style="font-size: var(--font-size-lg); line-height: 1.8; color: var(--color-text);">
                ${slide.content.map(item => `<li style="margin-bottom: var(--space-12);">${item}</li>`).join('')}
            </ul>
        </div>
    `;
}

function updateSlideCounter() {
    const counter = document.getElementById('slide-counter');
    if (!counter) return;
    
    counter.textContent = `${appState.currentSlideIndex + 1} / ${appState.generatedSlides.length}`;
}

// Technical Panel
function showTechPanel() {
    const panel = elements.techPanel;
    if (!panel) return;
    
    panel.classList.remove('hidden');
    animateSalienceBars();
}

function hideTechPanel() {
    const panel = elements.techPanel;
    if (!panel) return;
    
    panel.classList.add('hidden');
}

function animateSalienceBars() {
    setTimeout(() => {
        const bars = document.querySelectorAll('.salience-bar div');
        bars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 500);
}

// Export Functionality
function handleExportSlides() {
    if (appState.generatedSlides.length === 0) {
        alert('No slides to export. Please generate slides first.');
        return;
    }
    
    const exportFormat = document.querySelector('#settings-tab select')?.value || 'pptx';
    
    // Simulate export process
    const exportBtn = document.getElementById('export-slides');
    const originalText = exportBtn.textContent;
    
    exportBtn.textContent = 'Exporting...';
    exportBtn.disabled = true;
    
    setTimeout(() => {
        exportBtn.textContent = originalText;
        exportBtn.disabled = false;
        alert(`Slides exported successfully as ${exportFormat.toUpperCase()} format!`);
    }, 2000);
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    if (elements.previewModal.classList.contains('hidden')) return;
    
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            navigateSlide(-1);
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateSlide(1);
            break;
        case 'Escape':
            e.preventDefault();
            closePreviewMode();
            break;
    }
}

// Utility Functions
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);