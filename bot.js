const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const conf = JSON.parse(fs.readFileSync('conf.json'));
const token = conf.key;

const bot = new TelegramBot(token, { polling: true});

const promemoria = []; // Lista per memorizzare tutti i promemoria

bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text.startsWith("/ricordami")) {
        const ricorda = text.split(" "); // [comando, secondi, cosa da ricordare]
        if (ricorda.length < 3) {
            bot.sendMessage(chatId, "❌ Usa il comando nel formato: /remindme <secondi> <messaggio>");
            return;
        }
        const conv = parseInt(ricorda[1], 10) * 1000; // Converte in millisecondi x il timeout
        const reminderText = ricorda.slice(2).join(" ");

        bot.sendMessage(chatId, `✅ Ti ricorderò tra ${ricorda[1]} secondi: "${reminderText}"`); // sempre con chatId !

        const timeout = setTimeout(() => {
            bot.sendMessage(chatId, `⏰ Hey! ricorda questo: ${reminderText}`);
            const index = promemoria.findIndex(element => element.timeout === timeout);
            if (index !== -1) promemoria.splice(index, 1);
        }, conv);

        promemoria.push({ chatId, timeout, message: reminderText, time: Date.now() + conv }); 
    }
    
    if (text === "/info") {
        bot.sendMessage(chatId, "Bot di proprietà di @Serpizzotransatlantico \nRicorda ciò che vuoi grazie a Minnarello"); //prova @
    }
    if (text === "/juve") {
        bot.sendMessage(chatId, "MERDA");// Prova 1 cancella
    }
    if (text === "/help") {
        bot.sendMessage(chatId, "Comandi possibili:\n/ricordami <secondi> <messaggio> per impostare un promemoria.\n/juve.\n/info."); // comandi disp
    }
});
