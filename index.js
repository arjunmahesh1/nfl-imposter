require('dotenv').config();
const nodemailer = require('nodemailer');
const players = require('./players');

// Check if Gmail credentials are set
if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.error('❌ Error: Gmail credentials not found!');
  console.error('Please create a .env file with:');
  console.error('GMAIL_USER=your.email@gmail.com');
  console.error('GMAIL_APP_PASSWORD=your_app_password');
  console.error('\nSee README.md for setup instructions.');
  process.exit(1);
}

// Get email addresses from command line arguments
const emails = process.argv.slice(2);

if (emails.length !== 3) {
  console.error('❌ Error: Please provide exactly 3 email addresses');
  console.error('Usage: node index.js email1@example.com email2@example.com email3@example.com');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const invalidEmails = emails.filter(email => !emailRegex.test(email));
if (invalidEmails.length > 0) {
  console.error('❌ Error: Invalid email format:', invalidEmails.join(', '));
  process.exit(1);
}

// Random selection logic
function getRandomPlayer() {
  return players[Math.floor(Math.random() * players.length)];
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

async function sendEmails() {
  const selectedPlayer = getRandomPlayer();
  const shuffledEmails = shuffleArray(emails);
  const imposterEmail = shuffledEmails[0];

  console.log('🏈 Starting NFL Imposter Game...\n');
  console.log(`📧 Sending emails to: ${emails.join(', ')}\n`);

  try {
    // Send emails to all players
    for (let i = 0; i < shuffledEmails.length; i++) {
      const email = shuffledEmails[i];
      const isImposter = (i === 0);

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: '🏈 NFL Imposter Game - Your Role',
        text: isImposter
          ? '🎭 YOU ARE THE IMPOSTER!\n\nYour role is to blend in without knowing the NFL player. Listen to the hints from the other players and try to guess who they\'re talking about without revealing that you don\'t know!\n\nGood luck! 🕵️'
          : `🏈 Your NFL Player: ${selectedPlayer}\n\nGive hints about this player without being too obvious. Watch out for the imposter who doesn't know who the player is!\n\nGood luck! 🎯`,
        html: isImposter
          ? '<h1>🎭 YOU ARE THE IMPOSTER!</h1><p>Your role is to blend in without knowing the NFL player. Listen to the hints from the other players and try to guess who they\'re talking about without revealing that you don\'t know!</p><p><strong>Good luck! 🕵️</strong></p>'
          : `<h1>🏈 Your NFL Player</h1><h2 style="color: #013369;">${selectedPlayer}</h2><p>Give hints about this player without being too obvious. Watch out for the imposter who doesn't know who the player is!</p><p><strong>Good luck! 🎯</strong></p>`
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${email}`);
    }

    console.log('\n✨ All emails sent successfully!');
    console.log('🎮 The game is ready to begin!\n');

  } catch (error) {
    console.error('❌ Error sending emails:', error.message);
    if (error.message.includes('Invalid login')) {
      console.error('\n💡 Tip: Make sure you\'re using an App Password, not your regular Gmail password.');
      console.error('See README.md for instructions on how to generate one.');
    }
    process.exit(1);
  }
}

// Run the game
sendEmails();
