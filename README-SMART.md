## Features to work on next

AI agent for knowing yourself.

Multiple iniput.
Sentiment analysis.
Reframe negative thoughts with others.

AI agent would generate your persona and you can see how AI view you as.

social feature.

## AI town

Real persona. You teach AI who you are. The more you provide to AI, the better. After the networking events, you come back with the information from the gathering.

## future

1. language part. They cannot express themselves using Mandarin the same level as English. NLP research mostly conducted using English. --> Feature. include multiple languages.
2.

# scope

1. completely self directed with Paul's input. Completely flexible on your side.

Connie's thoughts:

- ice breaking project.
  - you want to find the best match.
- Paul's feedback
  - the framing of the question needs to be better. Depending on the goal, the UI needs to be changed. you want to do it in real time.
  - The big problem is that you are just promopoting to the LLM. How do you take it to the next level.
- Connie's feedback
  - why emotional intelligence. you want to understand yourslef and other better.
  - Annotations. highlight things that's important. draw upon things you highlighted before and make contexts.

Paul's comment

- these are hackathon projects. For a research project, you need to think about a foundamental technical questions nobody else in the world have solved it. You are either the first one to identify it or to solve it. ---- intelligetral contribution (math, theory -- non-trivial architecture, or the data source or the new hardware or being more efficient, deploying the sensor on the phoen. reduce social biases. )

broad impact ----- this can be used by the community and can have a better outcome.

Social netowrk agents.
e.g. shopping agent. WebArena, WebShop, --> they are the first building the simulation effort and it's not trivial. It's the base line agent that can help you to do shopping.

Offline version of facebook/twitter.

It cannot be a bot. It's actually interacting with humans / negotiating with humans.

People actually build agents to negoatiate with sellers to get a better price.

The future is the AI agent.

Paul things those game like characters are useless.

The professioanl interactinos are more interesting.

Work environment.

Think of a case study in a professional interaction, understand tools.
Paul challenge us to build one thing that combines both.

Connie's interested in Tangible interface as well.

How would it change the world?
You don't

Paul is a fan of social intelligence but not networking. He's most interested in professioanl.

TODO ---- What are the 20 types of professional interactions. (networking is one of them)

Everything can be mapped in this 3-D dynamics.

1. first, map everything to this and then we can decide what to do with it.

Sparks-Auto-encoder.
When you press them, there might be only a few ones that are actually doing something.

# voice interface, tts and stt

Solution 1:
TTS: speak-tts

STT: react-speech-recognition

Pros:

1. free npm packages
2. For the STT, we are able to get the

Cons:

1. quality.
2. Doesn't work with React@18, this would need an older version of React@16.There
3. For the STT, we cannot access the original audio file.

Conclusion: not recommended unless you want to build a prototype.

Solution 2
TTS: OpenAI Audio API

STT: [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) (to record and generate .wav) + OpenAI Audio API - (Speech to Text)[https://platform.openai.com/docs/guides/speech-to-text] (convert .wav to text)

Pros:

1. quality is very good.
2. For the STT, we have the option to store the .wav file in the future.

Cons:

1. not free.
2. For the STT, file uploads are currently limited to 25 MB.
3. not able to get the words being transcribed as we speak.

Conclusion: recommended.

Solutino 3:
OpenAI Realtime API (a server-side WebSocket interface)

Pros:

1. faster to get the nuanced output becase it's skipping the intermediate text format.
   TBD

Cons:
TBD

COnclusion: TBD
