/**
 * NEXUS CORE - Profile and Progress Management
 */

function checkProfile() {
    if (!localStorage.getItem('nexus_active_profile')) {
        window.location.href = 'Profile.html';
    }
}

function getActiveProfile() {
    return localStorage.getItem('nexus_active_profile');
}

function getUserData() {
    const activeUser = getActiveProfile();
    if (!activeUser) return null;
    return JSON.parse(localStorage.getItem('nexus_data_' + activeUser) || '{}');
}

function saveUserData(data) {
    const activeUser = getActiveProfile();
    if (activeUser) {
        localStorage.setItem('nexus_data_' + activeUser, JSON.stringify(data));
    }
}

function updateProgress(module, phase) {
    const data = getUserData();
    if (!data) return;

    if (!data[module]) data[module] = {};
    if (!data[module].phasesPassed) data[module].phasesPassed = [];
    
    if (!data[module].phasesPassed.includes(phase)) {
        data[module].phasesPassed.push(phase);
        saveUserData(data);
    }
}
