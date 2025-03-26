# LiveKit Voice Assistant

A real-time AI voice assistant powered by LiveKit and OpenAI, with a backend deployed on Heroku and a frontend on Vercel.

## Project Overview

This project consists of two main components:

1. **Backend Agent**: A LiveKit agent that handles real-time voice processing using OpenAI's models
2. **Web Frontend**: A Next.js web application that provides the user interface for interacting with the voice assistant

## Prerequisites

- Python 3.9 or higher
- Node.js 16 or higher
- pnpm (for frontend package management)
- LiveKit Cloud account
- Heroku account (for backend deployment)
- Vercel account (for frontend deployment)

## Environment Variables

### Backend (.env)

```
# LiveKit connection
LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# Model configuration
MODEL=gpt_4o_realtime
TRANSCRIPTION_MODEL=whisper1
TURN_DETECTION=server_vad
MODALITIES=text_and_audio
VOICE=ash
TEMPERATURE=0.7
MAX_OUTPUT_TOKENS=4096
VAD_THRESHOLD=0.5
VAD_SILENCE_DURATION_MS=200
VAD_PREFIX_PADDING_MS=300

# Personal AI persona instructions
INSTRUCTIONS='your_instructions_here'
```

### Frontend (.env.local)

```
NEXT_PUBLIC_LIVEKIT_URL=your_livekit_url
NEXT_PUBLIC_TOKEN_ENDPOINT=your_token_endpoint
```

## Local Development

### Backend Setup

1. Navigate to the `/agent` directory
2. Create a virtual environment: `python -m venv .venv`
3. Activate the virtual environment:
   - On Windows: `.venv\Scripts\activate`
   - On macOS/Linux: `source .venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Copy the sample environment file: `cp .env.sample .env`
6. Edit the `.env` file with your credentials
7. Run the agent: `python main.py start`

### Frontend Setup

1. Navigate to the `/web` directory
2. Install dependencies: `pnpm install`
3. Create a `.env.local` file with your LiveKit credentials
4. Run the development server: `pnpm dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser


## Project Structure

```
/
├── agent/                  # Backend LiveKit agent
│   ├── main.py             # Main agent implementation
│   ├── web_wrapper.py      # Web wrapper for Heroku
│   ├── Procfile            # Heroku process definition
│   └── requirements.txt    # Python dependencies
│
└── web/                    # Frontend Next.js application
    ├── src/                # Source code
    │   ├── components/     # React components
    │   ├── pages/          # Next.js pages
    │   └── ...
    └── ...
```

