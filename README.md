# NFL Imposter Game

A CLI tool to send NFL imposter game emails to players. The app randomly selects an NFL player and assigns one person as the imposter.

## How It Works

- 2 players receive an email with the name of a current NFL player
- 1 player receives an email saying they're the imposter
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

Run the app with 3 email addresses:

```bash
node index.js player1@email.com player2@email.com player3@email.com
```

Or use the npm script:

```bash
npm start player1@email.com player2@email.com player3@email.com
```

The app will:
1. Randomly select an NFL player from the list
2. Randomly assign one person as the imposter
3. Send emails to all 3 players with their roles

## Game Rules

After everyone receives their email:

1. Each player takes turns giving ONE hint about "their" player
2. The imposter must give a hint too, trying to blend in without knowing who the actual player is
3. After all hints are given, players discuss and vote on who they think is the imposter
4. The imposter wins if they can guess the NFL player OR if they don't get caught
5. The other players win if they correctly identify the imposter

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
