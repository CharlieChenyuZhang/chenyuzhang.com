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

Conclusion: TBD

## Meeting with KB and Feedbacks

Being up front with all the functionalities and what to expect at each stage (input -- output) is helpful.

- i.e. how do you prepare someone to use it meaingfully

People find AI agent very off-putting if there's an misalignment with a person's goal and what's offering.

## feedback from Tom Thorsheim

The existing platform is recommendating the people who are similar to you. You would never understand how people think with different point of view.

Help people to be more unified.

Chenyu's thought. ChatGPT makes people think the same.

- next step for SMART journaling is to match you with people who are going through a similar things. Group formation tools.

Tom has down group therapy. Come up with a good group of people.

## feedback from Connie Cheng on Nov 19, 2024

Smart V4 is very GPT-ish. Encourage you to connect different ideas (try to make this a more cohesive experience). Trying to understand where the innovation is.

This one is you know what your problem is.(explicit stuff)

The other idea is you don't know what your problem is and you just do free form writing. (implicit stuff)

## v5. smart journaling idea

Highlight the journaling part. Right now, it's just a ChatGPT like chatbox. The focus is on the chat.

Move the chatbox on the right hand side.

Once the user finish journaling. AI could annotate and highlight certain parts in the journal for users to elaborate.

The inside out persona would be so fun!!!

## for the tangible interface idea

Connie's comment
List some key interactions in cs or machine learning
Figure out what would benefit from physical version
What the use case would be / what is the value exactly
From having a physical version and what process analogy is conveyed in the form
And then begin to consider what inputs / outputs / technical req
Look at relevant literature

Chenyu's self reflection.

outcome/future vs. problems to solve?
Persona?

## Top priority if building this as a startup.

1. traction
2. fundraising (continue building, make sure what you are building is venture appropriate) - pre-seed (a bit over 1M USD). You could use the money to prove the PMF. ==> be clear why you are raising this, how are you going to plan to spend it.
   1. You can raise the pre-seed / seed anytime you want.
   2. 1M ARR (now is 3M ARR) then you can raise the series A.
   3. IPO - when you reach the 1B evaluation.
3. timeline
4. core team
5. Persona
   1. are those people already jouranling or new to it?
6. business model. which one?
   1. B2B. --> employee benefits. corporate training.
   2. B2C.
7. What's the USP of this product?
   1. companionship
8. Tip
   1. when you build a good business, money finds you. If you have a good ARR, money will find you.
   2. !! know the market really really well and demonstrate it.
   3. next step --> try the weekly / monthly subscription fee and visit them often. observe the churn rate.
   4. hussel. Use your harvard.edu email to build the connection and schedule a call. Keep searching and you will find it.
   5. Don't do a free pilot.
9.

## Feedback from Paul

- What's new on the technical side? from ChatGPT? !!!
  --> Chenyu's thoughts. The co-editing feature could be interesting. multi-agent collaborations.

## Lisa's feedback on Nov 24, 2024

--> would be nice to organize them into a blog post. Private for yourself but a nice way to organize different journals.
Readings:

- https://scholar.google.com/scholar?hl=en&as_sdt=0%2C22&q=journaling%2C+AI%2C+editing+with+AI&btnG=
- https://scholar.google.com/scholar?hl=en&as_sdt=0%2C22&q=journaling%2C+assessment%2C+AI&btnG=
- self-directed learning
  - Exploring the Role of ChatGPT as a Facilitator for Motivating Self-Directed Learning Among Adult Learners
- MIT papers in Education and Generative AI
  - (must read) Generating Reflection Prompts in Self-Directed Learning Activities with Generative AI https://mit-genai.pubpub.org/pub/kju0447a/release/2?readingCollection=0e231e9c
  - (must read) Negotiation Coaching Bots: Using GenAI to Improve Human-to-Human Interactions in Multiparty Negotiation Instruction https://mit-genai.pubpub.org/pub/zbgw46m4/release/3?readingCollection=0e231e9c

Start with the above two must reads. The second must read could be worked with PP Liang in Social Intelligence.

The first must read is more in the self-directed learning.

## moving pins idea

https://chatgpt.com/share/6743fdde-f4b4-8012-9075-05ecceaa13e1
--> further idea. a hardware that analyze real time human conversation and based on the sentiment of it, it would change color automatically. A small model that can ran locally.
