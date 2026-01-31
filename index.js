require('dotenv').config();
const nodemailer = require('nodemailer');
const inquirer = require('inquirer');
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

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  return emailRegex.test(email.trim());
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

async function getGameInputs() {
  console.log('🏈 NFL Imposter Game Setup\n');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'emailInput',
      message: 'Enter player email addresses (comma-separated):',
      validate: (input) => {
        const emails = input.split(',').map(e => e.trim()).filter(e => e);
        if (emails.length < 2) {
          return 'Please enter at least 2 email addresses';
        }
        const invalidEmails = emails.filter(email => !validateEmail(email));
        if (invalidEmails.length > 0) {
          return `Invalid email format: ${invalidEmails.join(', ')}`;
        }
        return true;
      }
    },
    {
      type: 'number',
      name: 'numImposters',
      message: 'How many imposters?',
      default: 1,
      validate: (value, answers) => {
        const emails = answers.emailInput.split(',').map(e => e.trim()).filter(e => e);
        if (!Number.isInteger(value) || value < 1) {
          return 'Please enter a valid number (at least 1)';
        }
        if (value >= emails.length) {
          return `Number of imposters must be less than total players (${emails.length})`;
        }
        return true;
      }
    }
  ]);

  const emails = answers.emailInput.split(',').map(e => e.trim()).filter(e => e);
  return { emails, numImposters: answers.numImposters };
}

async function sendEmails(emails, numImposters) {
  const selectedPlayer = getRandomPlayer();
  const shuffledEmails = shuffleArray(emails);
  const imposterEmails = shuffledEmails.slice(0, numImposters);
  const regularPlayers = shuffledEmails.slice(numImposters);

  console.log('\n🏈 Starting NFL Imposter Game...\n');
  console.log(`📧 Sending emails to ${emails.length} players`);
  console.log(`🎭 ${numImposters} imposter(s), ${regularPlayers.length} regular player(s)\n`);

  try {
    // Send emails to all players
    for (const email of shuffledEmails) {
      const isImposter = imposterEmails.includes(email);

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: '🏈 NFL Imposter Game - Your Role',
        text: isImposter
          ? '🎭 YOU ARE THE IMPOSTER!\n\nYour role is to blend in without knowing the NFL player. Listen to the hints from the other players and try to guess who they\'re talking about without revealing that you don\'t know!\n\nGood luck! 🕵️'
          : `🏈 Your NFL Player: ${selectedPlayer}\n\nGive hints about this player without being too obvious. Watch out for the imposter(s) who don't know who the player is!\n\nGood luck! 🎯`,
        html: isImposter
          ? '<h1>🎭 YOU ARE THE IMPOSTER!</h1><p>Your role is to blend in without knowing the NFL player. Listen to the hints from the other players and try to guess who they\'re talking about without revealing that you don\'t know!</p><p><strong>Good luck! 🕵️</strong></p>'
          : `<h1>🏈 Your NFL Player</h1><h2 style="color: #013369;">${selectedPlayer}</h2><p>Give hints about this player without being too obvious. Watch out for the imposter(s) who don't know who the player is!</p><p><strong>Good luck! 🎯</strong></p>`
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
async function main() {
  const { emails, numImposters } = await getGameInputs();
  await sendEmails(emails, numImposters);
}

main();
