# NFL Imposter Game

A CLI tool to send NFL imposter game emails to players. The app randomly selects an NFL player and assigns one person as the imposter.

## How It Works

- Works with any number of players (minimum 2)
- You choose how many imposters (must be less than total players)
- Regular players receive an email with the name of a current NFL player
- Imposters receive an email saying they're the imposter
- The assignment is completely random - you won't know who got what!

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Gmail App Password

Since you're using Gmail, you need to create an App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "How you sign in to Google", click **2-Step Verification** (you must enable this first if not already enabled)
4. Scroll down and click **App passwords**
5. In the "Select app" dropdown, choose **Mail**
6. In the "Select device" dropdown, choose **Other (Custom name)**
7. Enter a name like "NFL Imposter Game"
8. Click **Generate**
9. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Gmail credentials:
   ```
   GMAIL_USER=your.email@gmail.com
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   ```

   **Important:** Use the 16-character App Password you just generated, NOT your regular Gmail password!

## Usage

Run the app:

```bash
node index.js
```

Or use the npm script:

```bash
npm start
```

The app will prompt you for:
1. **Player email addresses** - Enter comma-separated emails (e.g., `player1@email.com, player2@email.com, player3@email.com`)
2. **Number of imposters** - Choose how many imposters you want

Then the app will:
1. Randomly select an NFL player from the list
2. Randomly assign the specified number of people as imposters
3. Send emails to all players with their roles

**Example:**
```
🏈 NFL Imposter Game Setup

? Enter player email addresses (comma-separated): alice@email.com, bob@email.com, charlie@email.com, dana@email.com
? How many imposters? 1

🏈 Starting NFL Imposter Game...

📧 Sending emails to 4 players
🎭 1 imposter(s), 3 regular player(s)

✅ Email sent to alice@email.com
✅ Email sent to bob@email.com
✅ Email sent to charlie@email.com
✅ Email sent to dana@email.com

✨ All emails sent successfully!
🎮 The game is ready to begin!
```

## Game Rules

After everyone receives their email:

1. Each player takes turns giving ONE hint about "their" player
2. Imposters must give hints too, trying to blend in without knowing who the actual player is
3. After all hints are given, players discuss and vote on who they think are the imposters
4. Imposters win if they can guess the NFL player OR if they don't get caught
5. Regular players win if they correctly identify all the imposters

**Tips:**
- With multiple imposters, they can work together or independently
- Imposters don't know who the other imposters are
- Start with 1 imposter for smaller groups (3-5 players)
- Use 2+ imposters for larger groups (6+ players) for more chaos

## Player List

The app includes ~70 famous current NFL players across positions:
- Quarterbacks (Patrick Mahomes, Josh Allen, Joe Burrow, etc.)
- Wide Receivers (Tyreek Hill, Justin Jefferson, CeeDee Lamb, etc.)
- Running Backs (Christian McCaffrey, Derrick Henry, Saquon Barkley, etc.)
- Tight Ends (Travis Kelce, George Kittle, Mark Andrews, etc.)

## Troubleshooting

**"Invalid login" error:**
- Make sure you're using an App Password, not your regular Gmail password
- Ensure 2-Step Verification is enabled on your Google account
- Double-check that the app password is copied correctly (remove spaces)

**Emails not arriving:**
- Check spam/junk folders
- Verify email addresses are correct
- Make sure Gmail credentials in `.env` are correct

## Security Note

Never commit your `.env` file to version control! It's already added to `.gitignore` to prevent accidental exposure of your credentials.
