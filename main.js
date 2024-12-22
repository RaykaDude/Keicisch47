import { initUser, getUserData, updateUserInventory, updateUserBalance } from './firebase-config.js';

let currentUser = null;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('loginModal');
    const loginButton = document.getElementById('loginButton');
    const nicknameInput = document.getElementById('nicknameInput');

    loginButton.addEventListener('click', async () => {
        console.log('Login button clicked');
        const nickname = nicknameInput.value.trim();
        if (nickname) {
            console.log('Attempting to create user with nickname:', nickname);
            try {
                const userId = await initUser(nickname);
                console.log('User created with ID:', userId);
                if (userId) {
                    currentUser = await getUserData(userId);
                    console.log('Got user data:', currentUser);
                    updateUIWithUserData(currentUser);
                    loginModal.style.display = 'none';
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        } else {
            console.log('Nickname is empty');
        }
    });
});

// Обновление UI с данными пользователя
function updateUIWithUserData(userData) {
    console.log('Updating UI with user data:', userData);
    const userProfile = document.getElementById('userProfile');
    const userNickname = userProfile.querySelector('.user-nickname');
    const userBalance = userProfile.querySelector('.user-balance');
    const userAvatar = userProfile.querySelector('.user-avatar');

    userProfile.style.display = 'flex';
    userNickname.textContent = userData.nickname;
    userBalance.textContent = `${userData.balance} ₽`;
    userAvatar.textContent = userData.nickname.charAt(0).toUpperCase();
}

// Модифицируйте функцию выигрыша предмета
async function handleWin(item) {
    if (currentUser) {
        await updateUserInventory(currentUser.uid, item);
        // Обновляем баланс если нужно
        const newBalance = currentUser.balance - item.price;
        await updateUserBalance(currentUser.uid, newBalance);
        currentUser.balance = newBalance;
        updateUIWithUserData(currentUser);
    }
} 