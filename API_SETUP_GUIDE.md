# 🚀 Football API Setup Guide - football-data.org (FREE)

## Why football-data.org?
- ✅ **100% FREE** for up to 10 requests per minute
- ✅ **No credit card required**
- ✅ **Simple registration process**
- ✅ **Covers major European leagues**
- ✅ **Easy to use API**

## Step-by-Step Setup Instructions

### Step 1: Register for Free Account
1. Go to: **https://www.football-data.org/client/register**
2. Fill out the registration form:
   - **Email**: Your email address
   - **First Name**: Your first name
   - **Last Name**: Your last name
   - **Use Case**: Select "Personal/Educational"
   - **Website**: You can leave blank or put "localhost"
3. Click **"Register"**
4. Check your email for verification link and click it

### Step 2: Get Your API Key
1. After email verification, go to: **https://www.football-data.org/client/login**
2. Login with your credentials
3. Go to your dashboard: **https://www.football-data.org/client/dashboard**
4. You'll see your **API Token** - this is your API key
5. Copy this token (it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 3: Add API Key to Matchee
1. In your Matchee project folder, copy the example file:
   ```bash
   copy .env.local.example .env.local
   ```
2. Open `.env.local` file
3. Replace `your_football_data_api_key_here` with your actual API key:
   ```env
   NEXT_PUBLIC_FOOTBALL_DATA_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```
4. Save the file

### Step 4: Test Your Setup
1. Start your Matchee application:
   ```bash
   npm run dev
   ```
2. Open http://localhost:3000
3. Check the browser console (F12) - you should see real data loading instead of mock data

## What Data You'll Get (FREE Tier)

### Competitions Included:
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 **Premier League** (England)
- 🇪🇸 **La Liga** (Spain) 
- 🇩🇪 **Bundesliga** (Germany)
- 🇮🇹 **Serie A** (Italy)
- 🇫🇷 **Ligue 1** (France)
- 🇳🇱 **Eredivisie** (Netherlands)
- 🇵🇹 **Primeira Liga** (Portugal)
- 🏆 **Champions League**
- 🏆 **Europa League**
- 🌍 **World Cup** (when active)
- 🌍 **European Championship** (when active)

### Data Available:
- ✅ Live match scores
- ✅ Match fixtures and results
- ✅ Team information and logos
- ✅ Competition standings
- ✅ Match statistics (basic)
- ✅ Team lineups (limited)

### Rate Limits (FREE):
- **10 requests per minute**
- **Perfect for personal use**
- **No daily limits**

## Troubleshooting

### Issue: "Invalid API Token"
- **Solution**: Double-check your API key in `.env.local`
- Make sure there are no extra spaces
- Ensure the file is named exactly `.env.local` (not `.env.local.txt`)

### Issue: "Rate limit exceeded"
- **Solution**: You're making too many requests
- The app automatically handles this with caching
- Wait 1 minute and try again

### Issue: "No matches found"
- **Solution**: The API might not have matches for today
- This is normal - not every day has matches
- The app will show mock data as fallback

### Issue: Still seeing mock data
- **Solution**: Check your API key setup
- Open browser console (F12) and look for error messages
- Verify your `.env.local` file exists and has the correct key

## Alternative: If You Want More Data

If you need more comprehensive data (like detailed player stats, more leagues, higher rate limits), you can upgrade to:

1. **football-data.org Premium** ($12/month)
   - 100 requests per minute
   - More detailed statistics
   - More competitions

2. **RapidAPI Football API** (Various plans)
   - More comprehensive data
   - Global coverage
   - Real-time updates

## Testing Your Setup

Once configured, your Matchee app will:
1. ✅ Show real match data instead of mock data
2. ✅ Display actual team logos and names
3. ✅ Update with real scores and match status
4. ✅ Show today's fixtures from major European leagues

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your API key is correct
3. Ensure your `.env.local` file is properly formatted
4. Try refreshing the page after making changes

The football-data.org API is perfect for Matchee and will give you real, live football data for free! 🚀⚽
