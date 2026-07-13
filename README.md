# Remix Engine

Pulls your best-performing Instagram, Facebook, and LinkedIn posts, ranks them
by how well they did relative to your own average, and uses AI to generate
new post drafts that reuse the *structure* of what worked — rewritten in your
voice. You review, edit, and approve every draft before anything gets
published. Nothing posts automatically.

This runs entirely on your own computer. Your posts, drafts, and API keys are
stored in a local database on your machine — nothing is sent anywhere except
to the AI provider and Ayrshare (the service that connects to your social
accounts) when you actively use those features.

## Requirements

- [Node.js](https://nodejs.org) version 20 or later
- [git](https://git-scm.com/downloads)
- An [OpenRouter](https://openrouter.ai) account with prepaid credits (powers
  draft generation — you choose which AI model to use during setup)
- An [Ayrshare](https://www.ayrshare.com) account, **Launch plan or higher**
  (the cheapest plan doesn't include the History API this app needs), with
  your Instagram (Business/Creator account), Facebook Page (not a personal
  profile), and LinkedIn linked through their dashboard

## First-time setup

1. Clone this repository and install dependencies:

   ```bash
   git clone https://github.com/alignyourtruenorth/remix-engine.git
   cd remix-engine
   npm install
   ```

2. Set up the local database:

   ```bash
   npx prisma migrate deploy
   ```

3. Build and start the app:

   ```bash
   npm run build
   npm run start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser. The
   app will walk you through connecting your OpenRouter and Ayrshare
   accounts, then filling out your Profile (niche, voice, offers).

Leave the terminal window open while you use the app — closing it stops the
server. To stop it yourself, click into the terminal and press `Ctrl+C`.

## Using it day-to-day

Once it's set up, you don't need to repeat any of the above — just run
`npm run start` again from inside the `remix-engine` folder whenever you want
to use it, and open `http://localhost:3000`.

## Getting updates

When a new version is released:

```bash
git pull
npm install
npx prisma migrate deploy
npm run build
npm run start
```

## Development mode

If you're editing the code yourself, use `npm run dev` instead of
`build`/`start` — it reloads automatically as you make changes.
