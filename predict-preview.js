
const button = document.getElementById("test-button");
const result = document.getElementById("result");

button.addEventListener("click", () => {
    result.textContent =
        "Interface test successful. No model inference performed.";

    result.style.color = "#23965c";
    result.style.fontWeight = "bold";
});
