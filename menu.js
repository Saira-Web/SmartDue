// menu.js — menu navigation 
// Rolando

// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
// find all elements from menu.html with the class option
    const options = document.querySelectorAll(".option");
    if (!options || options.length === 0) return;

    // all button or divs the user can choose to select
    options.forEach(opt => {
        opt.addEventListener("click", () => {
            const level = opt.dataset.level || opt.textContent.trim();
            window.location.href = `quiz.html?level=${encodeURIComponent(level)}`;
        });
    });

    // Keyboard shortcut: 1-4 selects menu option
    // This is just an optional fuction to let user select the
    // correct answers by using the keyboard
//     document.addEventListener("keydown", (e) => {
//         const map = { "1": 0, "2": 1, "3": 2, "4": 3 };
//         if (map[e.key] !== undefined) {
//             const idx = map[e.key];
//             const opt = options[idx];
//             if (opt) opt.click();
//         }
//     });
// });