const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const models = [
    "DeepSeek-V3-0324", "QwQ-32B", "DeepSeek-R1", "DeepSeek-V3", 
    "Llama-3.3-70B", "QwQ-32B-Preview", "Qwen2.5-Coder-32B", 
    "Llama-3.2-3B", "Qwen2.5-72B", "Llama-3-70B", "Hermes-3-70B", 
    "Llama-3.1-405B", "Llama-3.1-8B", "Llama-3.1-70B"
];

// Menentukan warna untuk setiap model
const colors = [
    "\x1b[31m", "\x1b[32m", "\x1b[33m", "\x1b[34m", "\x1b[35m", 
    "\x1b[36m", "\x1b[37m", "\x1b[41m", "\x1b[42m", "\x1b[43m", 
    "\x1b[44m", "\x1b[45m", "\x1b[46m"
];

const reset = "\x1b[0m";
const bold = "\x1b[1m";

function runModel(index, callback) {
    const scriptFile = `text/models/${index}.js`; // Path file yang dipanggil
    const modelName = models[index - 1];
    const color = colors[index - 1]; // Menggunakan warna yang berbeda

    console.clear();
    console.log(bold + "\x1b[36m" + `Menjalankan model: ${modelName}` + reset);
    console.log(`Menjalankan file: node ${scriptFile}`);

    exec(`node ${scriptFile}`, (error, stdout, stderr) => {
        if (error) {
            console.error("\x1b[31m" + "Gagal menjalankan " + modelName + ": " + error.message + reset);
        } else if (stderr) {
            console.error("\x1b[31m" + `stderr: ${stderr}` + reset);
        } else {
            console.log(stdout);
        }
        callback();
    });
}

function runAllModels() {
    let currentIndex = 0;

    function nextModel() {
        if (currentIndex < models.length) {
            runModel(currentIndex + 1, () => {
                currentIndex++;
                setTimeout(nextModel, 2000);
            });
        } else {
            console.log("\x1b[36m" + "Semua model telah dijalankan, mengulang kembali..." + reset);
            setTimeout(runAllModels, 2000);
        }
    }

    nextModel();
}

function showTextModels() {
    console.clear();
    console.log(bold + "\x1b[36m" + "\nPilih Model Teks:" + reset);
    models.forEach((model, index) => {
        const color = colors[index % colors.length]; // Menggunakan warna yang berbeda
        console.log(color + bold + (index + 1) + ". " + model + reset);
    });
    console.log("\x1b[33m" + "Ketik 'all' untuk menjalankan semua model secara berulang" + reset);

    rl.question("Masukkan nomor pilihan: ", (choice) => {
        if (choice === "all") {
            runAllModels();
        } else {
            const index = parseInt(choice);
            if (!isNaN(index) && index >= 1 && index <= models.length) {
                runModel(index, mainMenu);
            } else {
                console.log("\x1b[33m" + "Pilihan tidak valid." + reset);
                setTimeout(mainMenu, 2000);
            }
        }
    });
}

function mainMenu() {
    console.clear();
    console.log(bold + "\x1b[36m" + "\nCHATBOT HYPERBOLIC" + reset);
    console.log("\x1b[33m" + "1. Text" + reset);
    console.log("\x1b[33m" + "2. Image (soon)" + reset);
    console.log("\x1b[33m" + "3. Audio (soon)" + reset);
    console.log("\x1b[33m" + "4. Keluar" + reset);

    rl.question("Pilih menu: ", (choice) => {
        if (choice === "1") {
            showTextModels();
        } else if (choice === "2" || choice === "3") {
            console.log("\x1b[33m" + "Akses belum tersedia." + reset);
            setTimeout(mainMenu, 2000);
        } else if (choice === "4") {
            console.log("\x1b[36m" + "Keluar dari program." + reset);
            rl.close();
        } else {
            console.log("\x1b[33m" + "Pilihan tidak valid, coba lagi." + reset);
            setTimeout(mainMenu, 2000);
        }
    });
}

mainMenu();
