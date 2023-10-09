const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const twilio = require('twilio');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Create a 'public' folder for static files
app.set('view engine', 'ejs');

const accountSid = 'ACffcc03985627c07f80af6697bdea3c6b';
const authToken = 'ba76bd77569babba1fd31686d683f7a0';
const client = new twilio(accountSid, authToken);

const reminders = [];
app.get('/', (req, res) => {
    res.render('index', { reminders });
});

app.post('/setReminder', (req, res) => {
    const { time, message, phoneNumber } = req.body;

    const reminder = schedule.scheduleJob(time, async () => {
        try {
            await client.messages.create({
                body: `Reminder: ${message}`,
                from: 'whatsapp:+918688512542', // Twilio sandbox number
                to: `whatsapp:${phoneNumber}`
            });
        } catch (error) {
            console.error('Error sending WhatsApp message:', error.message);
        }
    });

    reminders.push({ time, message, phoneNumber, id: reminder.id });

    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});