import io
import openai
from openai import OpenAI
from fastapi import UploadFile
import os
from dotenv import load_dotenv
import wave
from io import BytesIO
from pymongo import MongoClient
from pydub import AudioSegment
import random
import torch
import torchaudio
import numpy as np
from silero_vad import load_silero_vad, get_speech_timestamps
import time

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable.")

client = openai

client.api_key = OPENAI_API_KEY

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client_openai = openai.AsyncOpenAI(api_key=OPENAI_API_KEY)

vad_model = load_silero_vad()

async def pcm_to_wav(pcm_bytes, sample_rate=16000, channels=1, sample_width=2):
    buffer = BytesIO()
    with wave.open(buffer, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_bytes)
    return buffer.getvalue()

async def combine_audio_streams(audio_streams):
    """Combine multiple WAV audio streams into one WAV file"""
    combined_audio = AudioSegment.empty()
    for audio_stream in audio_streams:
        audio_segment = AudioSegment.from_wav(io.BytesIO(audio_stream))
        combined_audio += audio_segment
    wav_buffer = io.BytesIO()
    combined_audio.export(wav_buffer, format="wav")
    wav_bytes = wav_buffer.getvalue()
    return wav_bytes

async def detect_speech_segments(audio_bytes, sample_rate=16000):
    """
    Use Silero VAD to detect speech segments in audio
    Returns list of speech timestamps and filtered audio
    """
    try:
        if isinstance(audio_bytes, bytes):
            audio_np = np.frombuffer(audio_bytes, dtype=np.int16).astype(np.float32) / 32768.0
            audio_tensor = torch.from_numpy(audio_np)
        else:
            audio_tensor = audio_bytes
        
        if sample_rate != 16000:
            resampler = torchaudio.transforms.Resample(sample_rate, 16000)
            audio_tensor = resampler(audio_tensor)
        
        speech_timestamps = get_speech_timestamps(
            audio_tensor, 
            vad_model,
            sampling_rate=16000,
            threshold=0.5,
            min_speech_duration_ms=250, 
            min_silence_duration_ms=100, 
            return_seconds=False  
        )
        
        if not speech_timestamps:
            return None, None

        speech_chunks = []
        for segment in speech_timestamps:
            start_sample = segment['start']
            end_sample = segment['end']
            speech_chunks.append(audio_tensor[start_sample:end_sample])

        if speech_chunks:
            filtered_audio = torch.cat(speech_chunks, dim=0)
            return speech_timestamps, filtered_audio
        else:
            return None, None
            
    except Exception as e:
        print(f"VAD error: {e}")

async def tensor_to_wav_bytes(audio_tensor, sample_rate=16000):
    """Convert torch tensor to WAV bytes"""
    if audio_tensor.dtype != torch.float32:
        audio_tensor = audio_tensor.float()
    
    audio_tensor = audio_tensor * 32767
    audio_tensor = torch.clamp(audio_tensor, -32768, 32767)
    audio_np = audio_tensor.numpy().astype(np.int16)
    
    buffer = BytesIO()
    with wave.open(buffer, 'wb') as wf:
        wf.setnchannels(1)  # Mono
        wf.setsampwidth(2)  # 16-bit
        wf.setframerate(sample_rate)
        wf.writeframes(audio_np.tobytes())
    return buffer.getvalue()

async def combine_audio_streams_with_vad(audio_streams):
    """Combine multiple WAV audio streams with VAD filtering"""
    if not audio_streams:
        return None
    
    combined_speech_chunks = []
    
    for audio_stream in audio_streams:
        try:
            audio_segment = AudioSegment.from_wav(io.BytesIO(audio_stream))
            
            raw_audio = audio_segment.raw_data
            sample_rate = audio_segment.frame_rate

            speech_timestamps, filtered_audio = await detect_speech_segments(raw_audio, sample_rate)
            
            if filtered_audio is not None:
                combined_speech_chunks.append(filtered_audio)
                
        except Exception as e:
            print(f"Error processing audio stream: {e}")

    if not combined_speech_chunks:
        return None
    
    combined_audio_tensor = torch.cat(combined_speech_chunks, dim=0)
    
    audio_bytes = await tensor_to_wav_bytes(combined_audio_tensor)
    
    return audio_bytes

async def speech_to_text_with_vad(audioFile):
    """Speech to text with VAD preprocessing"""
    if audioFile is None or len(audioFile) < 1600:  
        return ""
    t = time.time()
    audioBuffer = io.BytesIO(audioFile)
    audioBuffer.name = f"audio_{random.randint(100000, 999999)}.wav"
    
    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=audioBuffer,
        response_format="text",
        language="en"
    )
    
    print(f"STT time: {time.time() - t} seconds")
    
    return transcription

async def generate_openai_response(system_prompt: str, user_prompt: str):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    return completion.choices[0].message.content

async def generate_openai_response_stream(system_prompt: str, user_prompt: str):
    stream = await client_openai.chat.completions.create(
        model="gpt-4o-2024-05-13",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        stream=True
    )
    
    async def content_generator():
        collected_content = ""
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                content_piece = chunk.choices[0].delta.content
                collected_content += content_piece
                yield content_piece
    
    return content_generator