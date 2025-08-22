import sys
import json
from transformers import pipeline
import whisper
import soundfile as sf

# Load Whisper model for transcription
whisper_model = whisper.load_model("base")

# Load the emotion detection model
emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", return_all_scores=True)

def transcribe_audio(audio_file_path):
    # Transcribe the audio file to text using Whisper
    result = whisper_model.transcribe(audio_file_path)
    return result['text']

def analyze_emotions(text):
    # Get emotions from the transcribed text
    emotions = emotion_classifier(text)
    return emotions[0]

def main():
    # Get the audio file path from command-line argument
    audio_file_path = sys.argv[1]

    # Transcribe the audio to text
    transcribed_text = transcribe_audio(audio_file_path)

    # Get emotions for the transcribed text
    emotions = analyze_emotions(transcribed_text)

    # Combine results into a dictionary
    response = {
        'transcribed_text': transcribed_text,
        'emotions': [{'label': emotion['label'], 'score': emotion['score']} for emotion in emotions]
    }

    # Return the result as JSON
    print(json.dumps(response))

if __name__ == "__main__":
    main()
