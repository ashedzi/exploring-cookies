'use strict';

const dialog1 = select('.dialog-1');
const dialog2 = select('.dialog-2')
const accept = select('.primary');
const viewSettings = select('.secondary');
const savePreferences = select('.primary-2');
const toggles = selectAll('.toggle');
const LIFETIME = 15;

function select(selector, scope = document) {
    return scope.querySelector(selector);
}

function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

function selectAll(selector, scope = document) {
    return [...scope.querySelectorAll(selector)];
}

function setCookie(name, value, maxAge) {
    const options = {
        path: '/',
        SameSite: 'Lax'
    };

    if(maxAge) {
        options.maxAge = maxAge; 
    }

    let cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    for (let option in options) {
        cookieString += ';' + option + '=' + options[option]
    }

    document.cookie = cookieString;
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
        
        if (decodeURIComponent(cookieName) === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    
    return null;
}

function osSystemName () {
   let userDevice = navigator.userAgent.toLocaleLowerCase();
   
   if(userDevice.includes('win')) {
    return 'Windows';
   } else if(userDevice.includes('mac')) {
    return 'Mac/IOS';
   } else if (userDevice.includes('linux')) {
       return 'Linux';
    } else if (userDevice.includes('android')) {
    return 'Android';
   } else if (userDevice.includes('iphone') || userDevice.includes('ipad')) {
       return 'IOS';
   } else {
    return 'Unknown IOS';
}
}

function systemBrowser () {
    let userAgent = navigator.userAgent;

    if (userAgent.includes('Chrome') && userAgent.includes('Edg')) {
        return 'Edge';
    } else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
        return 'Opera';
    } else if (userAgent.includes('Chrome') || userAgent.includes('Safari') && !userAgent.includes('Opera') && userAgent.includes('Edg')) {
        return 'Chrome';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome') && !userAgent.includes('Edg') && !userAgent.includes('OPR')) {
        return 'Safari';
    } else if (userAgent.includes('Firefox')) {
        return 'Firefox';
    } else if(userAgent.includes('MSIE') || userAgent.includes('Trident')) {
        return 'Internet Explorer';
    } else {
        return `Unknown Browser: ${userAgent}`;
    } 
}

function windowWidth() {
    return `${window.innerWidth}px`;
}

function windowHeight() {
    return `${window.innerHeight}px`;
}

function printSystemDetails () {
    return {
        browser: systemBrowser(),
        os: osSystemName(),
        screenWidth: windowWidth(),
        screenHeight: windowHeight()
    };
}

function validateToggle () {
    const systemDetails = printSystemDetails();
    
    toggles.forEach(toggle => {
        if (toggle.checked) {
            const key = toggle.value;
            const value = systemDetails[key];
            if (value) {
                setCookie(key, value, LIFETIME);
            }
        }
    });
}

listen('click', viewSettings, () => {
    dialog2.showModal();
    dialog1.close();
});

window.addEventListener('load', () => {
    if (!getCookie('browser')) {
        setTimeout(() => {
            dialog1.showModal();
        }, 1000);
    }
});

listen('click', accept, () => {
    setCookie('browser', systemBrowser(), LIFETIME);
    setCookie('os', osSystemName(), LIFETIME);
    setCookie('screenWidth', windowWidth(), LIFETIME);
    setCookie('screenHeight', windowHeight(), LIFETIME);
    dialog1.close();
});

listen('click', savePreferences, () => {
    printSystemDetails ();
    validateToggle ();
    dialog2.close();
});

setTimeout(() => {
    document.cookie = "browser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "os=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "screenWidth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "screenHeight=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}, 15000);

setTimeout(() => {
    toggles.forEach(toggle => {
        if (toggle.checked) {
            const key = toggle.value;
            document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
        }
    });
}, 15000);
