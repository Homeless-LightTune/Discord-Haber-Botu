const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const cron = require('node-cron');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const NEWS_API_KEY = 'API KEY BURAYA'; // Buraya API anahtarınızı koyun.
const NEWS_API_URL = 'https://api.collectapi.com/news/getNews?country=tr&tag=general';
const CHANNEL_ID = 'KANAL ID'; // Haberleri paylaşmak istediğiniz kanal ID'sini buraya ekleyin.

// Giriş yaptıktan sonra çalışacak
client.once('ready', () => {
    console.log(`Haber botu ${client.user.tag} olarak giriş yaptı!`);

    sendNews();
    
    // Her saat başı haberleri kanala gönder
    cron.schedule('0 * * * *', () => {
        console.log('Haberleri gönderme zamanı geldi!');
        sendNews();
    });
});

async function sendNews() {
    try {
        console.log('Haberleri çekmeye çalışıyorum...');

        const response = await axios.get(NEWS_API_URL, {
            headers: {
                'Authorization': `apikey ${NEWS_API_KEY}`
            }
        });

        console.log('API cevabı:', response.data); // API cevabını kontrol etmek için

        const articles = response.data.result;

        if (articles && articles.length > 0) {
            let newsMessage = "Güncel Haberler:\n\n";
            articles.forEach((article, index) => {
                newsMessage += `${index + 1}. **${article.name}**\n${article.url}\n\n`;
            });

            const channel = client.channels.cache.get(CHANNEL_ID);
            if (channel) {
                console.log('Kanal bulundu, haberler gönderiliyor...');
                channel.send(newsMessage);
            } else {
                console.error('Kanal bulunamadı!');
            }
        } else {
            console.log('Güncel haber bulunamadı.');
        }
    } catch (error) {
        console.error('Haberleri çekerken bir hata oluştu:', error);
    }
}

client.login('DISCORD BOT TOKEN BURAYA'); // Buraya doğru Discord bot tokenini ekleyin.
