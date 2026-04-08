function password(length: number = 8): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let result = "";
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * chars.length);
        result += chars[index];
    }
    return result;
}

const btn = document.getElementById("generate-btn") as HTMLButtonElement;
const output = document.getElementById("password-output") as HTMLDivElement;
const passwordLength = document.getElementById("password-length") as HTMLInputElement;

btn.addEventListener("click", () => {
    let length = parseInt(passwordLength.value, 10);
    if (length < 4) length = 8;
    if (length > 128) length = 128;

    const pass = password(length);
    output.textContent = pass;
});
