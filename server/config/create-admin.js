
require("dotenv").config();

const bcrypt = require("bcrypt");
const readline = require("readline");
const pool = require("./db");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

function askHidden(question) {
    return new Promise((resolve) => {
        const stdin = process.stdin;
        const wasRaw = stdin.isRaw;

        process.stdout.write(question);
        stdin.setRawMode(true);
        stdin.resume();

        let password = "";

        function onData(key) {
            if (key.toString() === "\u0003") {
                process.stdout.write("\n");
                cleanup();
                process.exit(1);
            }

            if (key.toString() === "\r" || key.toString() === "\n") {
                process.stdout.write("\n");
                cleanup();
                resolve(password);
            } else if (key.toString() === "\u007f" || key.toString() === "\b") {
                password = password.slice(0, -1);
            } else {
                password += key.toString();
            }
        }

        function cleanup() {
            stdin.removeListener("data", onData);
            stdin.setRawMode(wasRaw || false);
            rl.close();
        }

        stdin.on("data", onData);
    });
}

async function main() {
    try {
        const username = (await ask("Admin username: ")).trim();
        const email = (await ask("Admin email: ")).trim();
        const password = await askHidden("Admin password (hidden): ");

        if (!username || !email || !password) {
            throw new Error("Username, email, and password are required.");
        }

        if (password.length < 12) {
            throw new Error("Use a password with at least 12 characters.");
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await pool.execute(
            `INSERT INTO admins (username, email, password_hash)
             VALUES (?, ?, ?)`,
            [username, email, passwordHash]
        );

        console.log("Admin account created successfully.");
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            console.error("That username or email already exists.");
        } else {
            console.error("Admin setup failed:", error.message);
        }
        process.exitCode = 1;
    } finally {
        rl.close();
        await pool.end();
    }
}

main();
