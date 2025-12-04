//auth.js
//Alejancro


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");
    const showPasswordCheckbox = document.getElementById("show-password");
    const rememberPasswordCheckbox = document.getElementById("remember-password");
    const resetButton = document.getElementById("reset-data");

    // Toggle visibility
    showPasswordCheckbox.addEventListener("change", () => {
        passwordField.type = showPasswordCheckbox.checked ? "text" : "password";
    });

    // Reset all stored users and counter
    resetButton.addEventListener("click", () => {
        localStorage.clear();
        alert("All users and passwords have been reset.");
    });

    form.addEventListener("submit", (ev) => {
        ev.preventDefault();

        const username = usernameField.value.trim();
        const enteredPassword = passwordField.value.trim();

        if (!username) {
            alert("Please enter your name.");
            return;
        }

        let storedPassword = localStorage.getItem(`mm_pass_${username}`);

        if (!storedPassword) {
            // New user → generate sequential password
            let counter = parseInt(localStorage.getItem("mm_pass_counter") || "0", 10);
            storedPassword = counter === 0 ? "password" : `password${counter}`;
            localStorage.setItem(`mm_pass_${username}`, storedPassword);
            localStorage.setItem("mm_pass_counter", counter + 1);

            // Auto-fill and reveal password
            passwordField.value = storedPassword;
            passwordField.type = "text";
            showPasswordCheckbox.checked = true;

            alert(`Welcome ${username}! A password has been created for you.`);
            return; // stop here so they can see/confirm password
        }

        // Returning user → validate
        if (enteredPassword !== storedPassword) {
            alert("Incorrect password. Please try again.");
            return;
        }

        // If "Remember Password" is checked, store it
        if (rememberPasswordCheckbox.checked) {
            localStorage.setItem(`mm_remember_${username}`, storedPassword);
        } else {
            localStorage.removeItem(`mm_remember_${username}`);
        }

        alert(`Welcome back ${username}!`);
        sessionStorage.setItem("mm_user", username);
        window.location.href = "menu.html";
    });

    // Auto-fill password if "remember" was set previously
    usernameField.addEventListener("blur", () => {
        const username = usernameField.value.trim();
        if (!username) return;

        const remembered = localStorage.getItem(`mm_remember_${username}`);
        if (remembered) {
            passwordField.value = remembered;
            // Optionally reveal it automatically
            passwordField.type = "text";
            showPasswordCheckbox.checked = true;
        }
    });
});