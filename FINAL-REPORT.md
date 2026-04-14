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
| 2   |      |     |
| 3   |      |     |


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

### Step 2: First Refinement Round (5)

- **General observations:**
- **App assessment:**
- **Code assessment:**
- **Overall takeaway:**

### Step 3: Second Refinement Round (3)

- **General observations:**
- **App assessment:**
- **Code assessment:**
- **Overall takeaway:**

### Step 4: Third Refinement Round (2)

- **General observations:**
- **App assessment:**
- **Code assessment:**
- **Overall takeaway:**

### Final Candidate (1)

- **General observations:**
- **App assessment:**
- **Code assessment:**
- **Overall takeaway:**



## Conclusion and Takeaways

- What worked well:
- What did not work well:
- Whether the final app met the assignment goals:
- Whether the final code was easy to understand and refine:
