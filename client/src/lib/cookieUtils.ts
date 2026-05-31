/**
 * Utilitaires pour gérer les cookies avec une durée de 12 heures
 */

export const getCookie = (name: string): string | null => {
    try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(";").shift() || null;
        }
    } catch (error) {
        console.error(`Error reading cookie "${name}":`, error);
    }
    return null;
};

export const setCookie = (name: string, value: string, hoursToExpire: number = 12) => {
    try {
        const expires = new Date(Date.now() + hoursToExpire * 3600000).toUTCString();
        document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Lax`;
        console.log(`✅ Cookie "${name}" set for ${hoursToExpire} hours. Value:`, value.substring(0, 20) + "...");
    } catch (error) {
        console.error(`Error setting cookie "${name}":`, error);
    }
};

export const deleteCookie = (name: string) => {
    try {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
        console.log(`✅ Cookie "${name}" deleted.`);
    } catch (error) {
        console.error(`Error deleting cookie "${name}":`, error);
    }
};
