const items = [
    { name: 'Аркадий Страпонов', image: 'arkady.jpg', rarity: 'legendary', chance: 5, price: 15000 },
    { name: 'Арсений Олений', image: 'arseny.jpg', rarity: 'mythical', chance: 8, price: 7500 },
    { name: 'Ритузики Подгузники', image: 'rituziki.jpg', rarity: 'mythical', chance: 8, price: 7000 },
    { name: 'Нина Хуезина', image: 'nina.jpg', rarity: 'rare', chance: 15, price: 3000 },
    { name: 'Валера Хуила', image: 'valera.jpg', rarity: 'uncommon', chance: 29, price: 1000 },
    { name: 'Виталий Бобриков', image: 'vitaly.jpg', rarity: 'common', chance: 35, price: 500 }
];

let isSpinning = false;

// Добавим определение мобильного устройства
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

document.getElementById('openCase').addEventListener('click', function() {
    if (isSpinning) return;
    isSpinning = true;
    this.disabled = true;
    
    const rouletteContainer = document.querySelector('.roulette-window');
    
    // Создаем новую рулетку
    const roulette = document.createElement('div');
    roulette.className = 'roulette-items';
    roulette.id = 'roulette';
    
    // Удаляем старую рулетку если она есть
    const oldRoulette = document.getElementById('roulette');
    if (oldRoulette) {
        oldRoulette.remove();
    }
    
    rouletteContainer.appendChild(roulette);
    
    // Определяем выигрышный предмет
    const winningItem = getRandomItem();
    
    // Создаем массив предметов
    const rouletteItems = [];
    
    // Добавляем случайные предметы
    for (let i = 0; i < 35; i++) {
        rouletteItems.push(getRandomItem());
    }
    
    // Вставляем выигрышный предмет в позицию 30
    rouletteItems[30] = winningItem;
    
    // Создаем элементы
    rouletteItems.forEach(item => {
        const element = createRouletteItem(item);
        roulette.appendChild(element);
    });
    
    // Устанавливаем начальную позицию
    roulette.style.transform = 'translateX(0)';
    
    // Запускаем анимацию
    requestAnimationFrame(() => {
        roulette.style.transition = 'transform 5s cubic-bezier(0.21, 0.53, 0.29, 0.99)';
        roulette.style.transform = `translateX(${-(30 * 100)}px)`;
    });
    
    setTimeout(() => {
        showWinningPopup(winningItem);
        isSpinning = false;
        this.disabled = false;
    }, 5000);
});

function getRandomItem() {
    const rand = Math.random() * 100;
    let sum = 0;
    
    for (const item of items) {
        sum += item.chance;
        if (rand <= sum) return item;
    }
    
    return items[items.length - 1];
}

function createRouletteItem(item) {
    const div = document.createElement('div');
    div.className = `roulette-item ${item.rarity}`;
    
    const icon = getIconForRarity(item.rarity);
    
    div.innerHTML = `
        <i class="${icon}"></i>
        <span>${item.name}</span>
    `;
    return div;
}

function getIconForRarity(rarity) {
    const icons = {
        legendary: 'fas fa-crown',
        mythical: 'fas fa-gem',
        rare: 'fas fa-star',
        uncommon: 'fas fa-certificate',
        common: 'fas fa-circle'
    };
    return icons[rarity] || icons.common;
}

function showWinningPopup(item) {
    const popup = document.createElement('div');
    popup.className = 'winning-popup';
    
    const icon = getIconForRarity(item.rarity);
    
    popup.innerHTML = `
        <div class="popup-content ${item.rarity}">
            <h3>Поздравляем!</h3>
            <div class="rarity-badge" style="background: ${getRarityColor(item.rarity)}">
                ${getRarityText(item.rarity)}
            </div>
            <i class="${icon}"></i>
            <h2>${item.name}</h2>
            <div class="price">${item.price.toLocaleString()}₽</div>
            <button onclick="closePopupAndSave(this)">Забрать</button>
        </div>
    `;
    
    popup.dataset.item = JSON.stringify(item);
    document.body.appendChild(popup);
    saveToInventory(item);
}

function getRarityColor(rarity) {
    const colors = {
        legendary: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
        mythical: 'linear-gradient(45deg, #ff8e53, #ffcd3c)',
        rare: 'linear-gradient(45deg, #4ecdc4, #45b7d1)',
        uncommon: 'linear-gradient(45deg, #45b7d1, #96ceb4)',
        common: 'linear-gradient(45deg, #96ceb4, #88d8b0)'
    };
    return colors[rarity] || colors.common;
}

function saveToInventory(item) {
    let inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    inventory.push({
        ...item,
        date: new Date().toISOString()
    });
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function closePopupAndSave(button) {
    const popup = button.closest('.winning-popup');
    const item = JSON.parse(popup.dataset.item);
    popup.remove();
}

document.body.insertAdjacentHTML('beforeend', `
    <button class="inventory-button" onclick="showInventory()">
        <i class="fas fa-briefcase"></i>
        Инвентарь
    </button>
    <div class="inventory-modal">
        <div class="inventory-content">
            <h2>Ваш инвентарь</h2>
            <button class="close-inventory" onclick="closeInventory()">
                <i class="fas fa-times"></i>
            </button>
            <div class="inventory-grid"></div>
        </div>
    </div>
`);

function showInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const modal = document.querySelector('.inventory-modal');
    
    if (!modal.querySelector('.inventory-content')) {
        modal.innerHTML = `
            <div class="inventory-content">
                <h2>Ваш инвентарь</h2>
                <button class="close-inventory" onclick="closeInventory()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="inventory-grid"></div>
            </div>
        `;
    }
    
    const grid = modal.querySelector('.inventory-grid');
    
    grid.innerHTML = inventory.map(item => `
        <div class="inventory-item ${item.rarity}">
            <div class="drop-icon">
                <i class="${getIconForRarity(item.rarity)}"></i>
            </div>
            <h3>${item.name}</h3>
            <div class="rarity-badge" style="background: ${getRarityColor(item.rarity)}">
                ${getRarityText(item.rarity)}
            </div>
            <div class="price">${item.price.toLocaleString()}₽</div>
            <div class="date">${new Date(item.date).toLocaleDateString()}</div>
        </div>
    `).join('');
    
    modal.style.display = 'block';
    modal.offsetHeight;
    modal.style.opacity = '1';
}

function closeInventory() {
    const modal = document.querySelector('.inventory-modal');
    modal.classList.add('fade-out');
    
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('fade-out');
    }, 300);
}

function getRarityText(rarity) {
    const texts = {
        legendary: 'Легендарный',
        mythical: 'Мифический',
        rare: 'Редкий',
        uncommon: 'Необычный',
        common: 'Обычный'
    };
    return texts[rarity] || 'Обычный';
}

document.querySelector('.pointer').style.left = 'calc(50% - 2px)'; 