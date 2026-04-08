function password(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  const randomBytes = new Uint32Array(length);
  crypto.getRandomValues(randomBytes);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
}

const btn = document.getElementById("generate-btn");
const output = document.getElementById("password-output");
const passwordLength = document.getElementById("password-length");
const lengthDisplay = document.getElementById("length-display");
const copyBtn = document.getElementById("copy-btn");

passwordLength.addEventListener("input", () => {
  lengthDisplay.textContent = passwordLength.value;
});

btn.addEventListener("click", () => {
  let length = parseInt(passwordLength.value, 10);
  if (length < 6)   length = 12;
  if (length > 12) length = 12;

  const pass = password(length);
  output.textContent = pass;
  output.classList.remove("empty");
});

copyBtn.addEventListener("click", () => {
  if (output.classList.contains("empty")) return;
  navigator.clipboard.writeText(output.textContent).then(() => {
    copyBtn.classList.add("copied");
    setTimeout(() => copyBtn.classList.remove("copied"), 1500);
  });
});
