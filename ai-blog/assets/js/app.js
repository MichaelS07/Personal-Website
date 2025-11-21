// Global State
let selectedModels = [];

// DOM Elements
const modelsGrid = document.getElementById('models-grid');
const comparisonView = document.getElementById('comparison-view');
const modal = document.getElementById('model-modal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (modelsGrid) {
        renderModels(models);
    }
});

// Render Model Cards
function renderModels(data) {
    modelsGrid.innerHTML = data.map(model => `
        <div class="card model-card" data-id="${model.id}">
            <div class="card-header">
                <h3>${model.name}</h3>
                <span class="badge">${model.developer}</span>
            </div>
            <p>${model.description}</p>
            <div class="model-stats">
                <div class="stat">
                    <span class="label">Context</span>
                    <span class="value">${model.contextWindow}</span>
                </div>
                <div class="stat">
                    <span class="label">MMLU</span>
                    <span class="value">${model.mmlu}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-outline btn-sm" onclick="viewModelDetails('${model.id}')">View Details</button>
                <button class="btn btn-primary btn-sm" onclick="toggleCompare('${model.id}')" id="btn-${model.id}">
                    Compare
                </button>
            </div>
        </div>
    `).join('');
}

// View Model Details (Modal)
function viewModelDetails(id) {
    const model = models.find(m => m.id === id);
    if (!model) return;

    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <span class="close-modal" onclick="closeModal()">&times;</span>
        <h2>${model.name}</h2>
        <div class="modal-body">
            <p class="developer">By ${model.developer} • Released ${model.releaseDate}</p>
            <p class="description">${model.description}</p>
            
            <div class="specs-grid">
                <div class="spec-item">
                    <strong>Context Window</strong>
                    <span>${model.contextWindow}</span>
                </div>
                <div class="spec-item">
                    <strong>MMLU Score</strong>
                    <span>${model.mmlu}</span>
                </div>
                <div class="spec-item">
                    <strong>Input Price</strong>
                    <span>${model.inputPrice} / 1M tokens</span>
                </div>
                <div class="spec-item">
                    <strong>Output Price</strong>
                    <span>${model.outputPrice} / 1M tokens</span>
                </div>
            </div>
            
            <div class="tags">
                ${model.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Comparison Logic
function toggleCompare(id) {
    const btn = document.getElementById(`btn-${id}`);

    if (selectedModels.includes(id)) {
        selectedModels = selectedModels.filter(m => m !== id);
        btn.textContent = 'Compare';
        btn.classList.remove('active');
    } else {
        if (selectedModels.length >= 2) {
            alert('You can only compare 2 models at a time. Deselect one first.');
            return;
        }
        selectedModels.push(id);
        btn.textContent = 'Selected';
        btn.classList.add('active');
    }

    updateComparisonView();
}

function updateComparisonView() {
    const container = document.getElementById('comparison-container');

    if (selectedModels.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    const compareList = document.getElementById('compare-list');

    // If we have 2 models, show the full comparison table
    if (selectedModels.length === 2) {
        renderComparisonTable();
    } else {
        // Just show selected chips
        compareList.innerHTML = selectedModels.map(id => {
            const m = models.find(mod => mod.id === id);
            return `<div class="selected-chip">${m.name}</div>`;
        }).join('');
        document.getElementById('comparison-table').innerHTML = '';
    }
}

function renderComparisonTable() {
    const m1 = models.find(m => m.id === selectedModels[0]);
    const m2 = models.find(m => m.id === selectedModels[1]);

    const table = document.getElementById('comparison-table');
    table.innerHTML = `
        <div class="compare-grid">
            <div class="compare-header">Feature</div>
            <div class="compare-header">${m1.name}</div>
            <div class="compare-header">${m2.name}</div>
            
            <div class="compare-row">Developer</div>
            <div class="compare-row">${m1.developer}</div>
            <div class="compare-row">${m2.developer}</div>
            
            <div class="compare-row">Context Window</div>
            <div class="compare-row">${m1.contextWindow}</div>
            <div class="compare-row">${m2.contextWindow}</div>
            
            <div class="compare-row">MMLU Score</div>
            <div class="compare-row highlight">${m1.mmlu}</div>
            <div class="compare-row highlight">${m2.mmlu}</div>
            
            <div class="compare-row">Input Price</div>
            <div class="compare-row">${m1.inputPrice}</div>
            <div class="compare-row">${m2.inputPrice}</div>
        </div>
    `;
}
