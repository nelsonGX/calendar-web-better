# Deploying
1. create a Supabase database on vercel
2. create and link to the project
3. add environment variable `API_KEY` in Vercel
4. deploy

# Developing
1. clone to your computer
2. `npm i`
3. run `vercel link` (`npm i -g vercel` if not installed)
4. run `vercel env pull .env.development.local` to fetch credentials
5. add `API_KEY` to .env
6. `npm run dev`

# Importing Your Calendar
If you are using Apple Calendar, you can use this shortcut to export your calendar events to the calendar app via API. Get the shortcut here: https://www.icloud.com/shortcuts/5321326fd5f44e1a9e7a2e3c45aab1e5
You can also make scripts yourself to import events via API.
Example request:
```bash
curl -X POST 'https://your-vercel-deployment.vercel.app/api/events' \
    -H 'Content-Type: application/json' \
    -d '[
            {
                "start_time":"2025-08-08T00:00:00+08:00",
                "end_time":"2025-08-08T23:59:59+08:00",
                "title":"Father’s Day"
            },
            {
                "start_time":"2025-08-24T00:00:00+08:00",
                "end_time":"2025-08-24T23:59:59+08:00",
                "title":"Grandparent’s Day"
            }
        ]'
```

# Editing On The App
1. nevigate to the admin panel by adding query `admin=true`. example: `https://(your calendar url)?admin=true`
2. enter the API key you set inside environment variable
3. now you can edit events on the website
