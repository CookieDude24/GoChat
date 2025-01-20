import {dev} from "$app/environment";

let baseurl = dev ? "http://localhost:8080" : ""

export class User {
    username: string = $state(getCookie('username'))
    apikey: string = $state(getCookie('user_id'))

    async validateLogin(): Promise<boolean> {
        const apikey = this.apikey;
        const username = this.username;
        const endpoint = baseurl + "/users";


        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "username": username, "user_id": apikey }),
            });
            // for login
            if(response.status === 202){
                setCookie("username", username);
                setCookie("user_id", apikey);
                return true;
            }else {
                return false;
            }

        } catch (error) {
            console.error("Error during login validation:", error);
            return false;
        }
    }

    async signup(): Promise<boolean> {
        const username = this.username;
        const endpoint = baseurl + "/users";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
            });

            if (response.status === 201) {
                const parsedData = await response.json();
                setCookie("username", parsedData["username"]);
                setCookie("user_id", parsedData["user_id"]);
                return true;
            } else if (response.status === 409) {
                return false; // Username already exists
            } else {
                console.error(`HTTP error! Status: ${response.status}`);
                return false;
            }
        } catch (error) {
            console.error("Error during signup:", error);
            return false;
        }
    }
    signout():void{
        setCookie("username", "");
        setCookie("user_id", "");
    }
}

export function getCookie(cname: string): string {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    console.log("decoding cookie: ", ca);
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim(); // Use trim() to remove leading/trailing spaces
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }

    // Cookie not found, return an empty string
    console.log("cookie: ", ca, " not found");
    return "";
}

function setCookie(cname: string, cvalue: string, exdays: number = 365) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
