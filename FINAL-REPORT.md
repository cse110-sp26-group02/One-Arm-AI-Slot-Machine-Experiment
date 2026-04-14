# Final Report

## Experiment Overview

- **Project:** One-Arm-AI-Slot-Machine-Experiment
- **Assignment goal:** Create a slot machine app using vanilla HTML, CSS, JavaScript, and platform APIs that makes fun of AI by framing play as winning and spending tokens.
- **Model used:** gemini-3.1-flash-lite-preview
- **Harness used:** Gemini CLI
- **Prompts:** [prompts](prompts/)

## Process Summary


- We ran 50 baseline generations using the exact same prompt and the same model/harness settings each time.
- We recorded each run in its own folder and captured metrics and assessments in the corresponding observations file.
- For each refinement we started a fresh session, with no carry-over context, on the best candidates from the previous step (50 -> 5 -> 3 -> 2 -> 1).


## Refinement Runs


| Step |Description| Candidate Selection |
| --- | ---  | --- |
| 1   |  We found these candidates to be the strongest of the 50. The User Interfaces on all of them were especially interactive, making the game more fun to play compared to others. Furthermore some of these candidates also has separate JS and CSS files while most only had a single HTML file, making the code easier to read. We also found that the desired logic was implemented the best compared to others. |  Candidates: 1, 4, 37, 10, 45   |
| 2   | We bombarded the model with features to add, and found that these candidates were the only working products. We emphasized existence of a lever, sounds, paytable, minigames, etc. but only got some of these in our final products.   | Candidates: 1, 45, 37    |
| 3   | We removed unnecessary description of setting up the model (create 3 files, and basic machine slot behavior). We also wanted to emphasize AI satire more. We also included a minigame for the situation when there are no more tokens.      |Final  Candidate: 1 , 45   |


## Step Observations And Assessments


### Step 1: First Runs (50)

- **General observations:**
  - Website ran every time and code worked
  - Models were able to implement interesting art styles with visual effects.
  - A few in the end worked great and had interactive user interfaces that were fun and easy to use.
  - Used emojis for slots
  - How the slots spins and the models styles varied across models even though same prompt given
- **App assessment:**
  - No sound across all runs
  - Gemini liked clean corporate style or futuristic tech style
  - Spinning looked different across all runs
  - Humor was present usually after the spin in a text screen with jokes or through certain emojis (clown emojis for hallucinations)
- **Code assessment:**
  - Many models just a single HTML file, while others had a separate JS and CSS file. This made it harder to read since it was less compartmentalized
  - The runs that did use the 3 files were more readable and also were the strongest candidates (best UI and logic)

- **Overall takeaway:**
  - A lot of variation in code and app output.
  - No concrete pattern in the way Gemini produced the app
  - Better runs had more organized code and structure (HTML, JS, and CSS files)

### Step 2: First Refinement Round (5 -> 3)

- **General observations:**
  - Some candidates took completely new directions and were no longer working slot machines
  - The lack of context in the prompt (about the product as a whole) seemed to cause the model to produce varying products.
  - The working products had clear colour schemes/themes and included the amount of tokens remaining, paytable and a lever of sorts. Each candidate followed a different subset of the instructions.
- **App assessment:**
  - No sound across all runs (despite prompting them to have sound)
  - Only one candidate followed the instruction of introducing a spinning animation
  - All candidates had working levers, but implemented the physics of that animation differently
  - All candidates removed the element of humor that was present
- **Code assessment:**
  - All models followed the three file rule
  - In general, code was compartmentalized and easy to follow. The candidates that were not chosen were those with limited functionality (and therefore, code).
- **Overall takeaway:**
  - Providing context to the product is important to a model without memory
  - If context is not provided, expect models to have varying interpretations of what you want
  - The best runs were the ones that followed the most instructions.
  
### Step 3: Second Refinement Round (3 -> 2)

- **General observations:**
  - The extent to which the tool followed instructions was high in this round - this was because we provided more context in this round of refining.
  - Perhaps due to the fact that the prompt was more specific this time around, the results matched our instructions further
  - All products had clear colour schemes, and included important features like amount of tokens remaining, paytable, animation while spinning, humorous comments.
- **App assessment:**
  - One candidate included sound while spinning.
  - The two candidates that were chosen made better design choices (UI was more pleasing to the eye because of separation in colours for the slot machine 'screen')
- **Code assessment:**
  - For extremely specific parts of the prompt, the tool was able to gauge clear enough requirements to write functions for these features.
  - Code was well compartmentalized and easy to follow.
- **Overall takeaway:**
  - Specificity and context matter - even for already existing products.
  - Design choices tend to be final deciding factors.

### Step 4: Third Refinement Round (2 -> 1)

- **General observations:**
  - Better UI/ smooth
  - Had effects and color
  - Also had sound effects
- **App assessment:**
  - Logic was not flawed (was not one-sided)
  - Also minigame at the end if no more tokens
- **Code assessment:**
  - More organized and structured
  - More functional as well which was displayed by higher quality app
- **Overall takeaway:**
  - App had significant improvements from last run.
  - More AI satire through minigame and jokes
  - More interactive and entertaining

### Choosing Final Candidate (1)
- **Winner:** Candidate 1
- **Reasoning**
  - Minigame at the end was more functional compared to competitor
  - Had better overall effects (confetti/animations)
  - Better aesthetic (futuristic)



## Conclusion and Takeaways

- What worked well:
  - Code ran every single time.
  - Proper scoring system
  - Always had some sort of AI satire
- What did not work well:
  - UI was often lackluster
  - Lever was buggy (couldn't interact or press)
  - Sometimes something in the prompt weren't addressed
- Whether the final app met the assignment goals:
  - Yes the final app met all of the goals. Was a slot machine with the desired behavior the mocked AI.
- Whether the final code was easy to understand and refine:
  - Yes the final code is easy to understand and read. We think it is definitely possible to refine with the way it is structured and organized.
