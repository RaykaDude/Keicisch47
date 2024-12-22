// В начале файла проверьте импорты
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCZdHeixef9OI2uDofPWN7JmLDgBq8X8ts",
    authDomain: "case-roulette.firebaseapp.com",
    projectId: "case-roulette",
    storageBucket: "case-roulette.firebasestorage.app",
    messagingSenderId: "636233633509",
    appId: "1:636233633509:web:fef30fd44a6a7426da8e0c",
    measurementId: "G-B5Q26D25GL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export const initUser = async (nickname) => {
    try {
        const userCredential = await signInAnonymously(auth);
        const userId = userCredential.user.uid;
        
        await setDoc(doc(db, "users", userId), {
            nickname: nickname,
            balance: 1000, // Начальный баланс
            inventory: [{
                id: "starter",
                name: "Приветственный бонус",
                type: "bonus",
                rarity: "common",
                icon: "fa-gift",
                price: 0,
                obtained: new Date().toISOString()
            }], // Начальный предмет в инвентаре
            createdAt: new Date().toISOString()
        });
        
        return userId;
    } catch (error) {
        console.error("Error initializing user:", error);
        return null;
    }
};

export const getUserData = async (userId) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error("Error getting user data:", error);
        return null;
    }
};

export const updateUserInventory = async (userId, newItem) => {
    try {
        const userRef = doc(db, "users", userId);
        const userData = await getDoc(userRef);
        
        if (userData.exists()) {
            const inventory = userData.data().inventory || [];
            inventory.push(newItem);
            
            await updateDoc(userRef, {
                inventory: inventory
            });
        }
    } catch (error) {
        console.error("Error updating inventory:", error);
    }
};

export const updateUserBalance = async (userId, newBalance) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            balance: newBalance
        });
    } catch (error) {
        console.error("Error updating balance:", error);
    }
};

export { initUser, getUserData, updateUserInventory, updateUserBalance }; 