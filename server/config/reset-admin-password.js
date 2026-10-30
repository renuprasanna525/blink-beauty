
require("dotenv").config();

const bcrypt = require("bcrypt");
const readline = require("readline");
const pool = require("./db");

function ask(question) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

function askHidden(question) {
    return new Promise((resolve, reject) => {
        const input = process.stdin;

        if (!input.isTTY || typeof input.setRawMode !== "function") {
            reject(new Error("Run this script in an interactive terminal."));
            return;
        }

        let password = "";

        process.stdout.write(question);
        input.setRawMode(true);
        input.resume();

        function cleanup() {
            input.removeListener("data", onData);
            input.setRawMode(false);
            input.pause();
        }

        function onData(data) {
            const key = data.toString("utf8");

            if (key === "\u0003") {
                cleanup();
                process.stdout.write("\n");
                reject(new Error("Password reset cancelled."));
                return;
            }

            if (key === "\r" || key === "\n") {
                cleanup();
                process.stdout.write("\n");
                resolve(password);
                return;
            }

            if (key === "\u007f" || key === "\b") {
                password = password.slice(0, -1);
            } else if (!key.startsWith("\u001b")) {
                password += key;
            }
        }

        input.on("data", onData);
    });
}

async function main() {
    try {
        const email = (await ask("Admin email to reset: ")).toLowerCase();
        const password = await askHidden("Enter new password (hidden): ");

        if (!email || password.length < 12) {
            throw new Error("Email is required and password must be at least 12 characters.");
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const [result] = await pool.execute(
            "UPDATE admins SET password_hash = ? WHERE email = ?",
            [passwordHash, email]
        );

        if (result.affectedRows !== 1) {
            throw new Error("Exactly one admin was not updated. Check the email.");
        }

        console.log("Existing admin password reset successfully.");
    } catch (error) {
        console.error("Password reset failed:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

main();
